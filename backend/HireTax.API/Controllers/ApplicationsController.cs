using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using HireTax.API.Models;
using HireTax.API.DTOs;
using HireTax.API.Repositories.Interfaces;

namespace HireTax.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class ApplicationsController : ControllerBase
    {
        private readonly IGenericRepository<Application> _applicationRepository;
        private readonly IGenericRepository<Job> _jobRepository;
        private readonly IGenericRepository<CandidateProfile> _profileRepository;

        public ApplicationsController(
            IGenericRepository<Application> applicationRepository,
            IGenericRepository<Job> jobRepository,
            IGenericRepository<CandidateProfile> profileRepository)
        {
            _applicationRepository = applicationRepository;
            _jobRepository = jobRepository;
            _profileRepository = profileRepository;
        }

        private int CurrentUserId => int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        private string? CurrentRole => User.FindFirstValue(ClaimTypes.Role);

        // 1. CANDIDATE — Apply to a job
        [HttpPost]
        [Authorize(Roles = "candidate")]
        public async Task<IActionResult> Apply(CreateApplicationDto dto)
        {
            var jobs = await _jobRepository.GetAllAsync();
            var job = jobs.FirstOrDefault(j => j.Id == dto.JobId);

            if (job == null || job.Status != "Active")
                return BadRequest(new { message = "This job is not available for applications." });

            var existing = await _applicationRepository.GetAllAsync();
            bool alreadyApplied = existing.Any(a => a.JobId == dto.JobId && a.CandidateId == CurrentUserId);

            if (alreadyApplied)
                return BadRequest(new { message = "You have already applied to this job." });

            var application = new Application
            {
                JobId = dto.JobId,
                CandidateId = CurrentUserId,
                ResumeFileName = dto.ResumeFileName,
                Status = "Screening",
                AppliedDate = DateTime.UtcNow
            };

            await _applicationRepository.AddAsync(application);
            await _applicationRepository.SaveChangesAsync();

            return Ok(new { message = "Application submitted successfully!", application });
        }

        // 2. CANDIDATE — View my own applications (tracking dashboard)
        [HttpGet("my")]
        [Authorize(Roles = "candidate")]
        public async Task<IActionResult> GetMyApplications()
        {
            var applications = await _applicationRepository.GetAllAsync();
            var mine = applications.Where(a => a.CandidateId == CurrentUserId).ToList();

            var profiles = await _profileRepository.GetAllAsync();
            foreach(var app in mine)
            {
                var p = profiles.FirstOrDefault(x => x.UserId == app.CandidateId);
                app.ResumeUrl = p?.ResumePath ?? string.Empty;
            }

            return Ok(mine);
        }

        // 3. RECRUITER/ADMIN — View applications for a specific job (for shortlisting)
        [HttpGet("job/{jobId}")]
        [Authorize(Roles = "recruiter,admin,hiring_manager,company_admin")]
        public async Task<IActionResult> GetApplicationsForJob(int jobId)
        {
            var jobs = await _jobRepository.GetAllAsync();
            var job = jobs.FirstOrDefault(j => j.Id == jobId);

            if (job == null)
                return NotFound(new { message = "Job not found." });

            // Recruiters can only view applicants for jobs THEY posted
            if (CurrentRole == "recruiter" && job.PostedByUserId != CurrentUserId)
                return Forbid();

            var applications = await _applicationRepository.GetAllAsync();
            var forJob = applications.Where(a => a.JobId == jobId).ToList();

            var profiles = await _profileRepository.GetAllAsync();
            foreach(var app in forJob)
            {
                var p = profiles.FirstOrDefault(x => x.UserId == app.CandidateId);
                app.ResumeUrl = p?.ResumePath ?? string.Empty;
            }

            return Ok(forJob);
        }

        // 5. ADMIN/RECRUITER — View ALL applications (for analytics/reporting)
        [HttpGet]
        [Authorize(Roles = "recruiter,admin,hiring_manager,company_admin")]
        public async Task<IActionResult> GetAllApplications()
        {
            var applications = await _applicationRepository.GetAllAsync();
            var profiles = await _profileRepository.GetAllAsync();
            
            foreach(var app in applications)
            {
                var p = profiles.FirstOrDefault(x => x.UserId == app.CandidateId);
                app.ResumeUrl = p?.ResumePath ?? string.Empty;
            }

            return Ok(applications);
        }

        // 6. AI Scoring — Compute keyword match score for an application
        [HttpPut("{id}/ai-score")]
        [Authorize(Roles = "recruiter,admin")]
        public async Task<IActionResult> ComputeAiScore(int id)
        {
            var applications = await _applicationRepository.GetAllAsync();
            var application = applications.FirstOrDefault(a => a.Id == id);

            if (application == null)
                return NotFound(new { message = "Application not found." });

            var jobs = await _jobRepository.GetAllAsync();
            var job = jobs.FirstOrDefault(j => j.Id == application.JobId);

            if (job == null)
                return NotFound(new { message = "Job not found." });

            // Get candidate profile for skills
            var profiles = await _profileRepository.GetAllAsync();
            var profile = profiles.FirstOrDefault(p => p.UserId == application.CandidateId);

            string candidateSkills = profile?.Skills?.ToLower() ?? string.Empty;
            var preferredSkills = job.AiPreferredSkills
                .Split(',', StringSplitOptions.RemoveEmptyEntries)
                .Select(s => s.Trim().ToLower())
                .Where(s => s.Length > 0)
                .ToList();

            // Compute match
            var matchedSkills = preferredSkills
                .Where(skill => candidateSkills.Contains(skill))
                .ToList();

            int baseScore = 50;
            int matchBonus = Math.Min(matchedSkills.Count * 10, 40);
            bool isSenior = candidateSkills.Contains("senior") || (profile?.Experience?.Contains("senior") ?? false);
            int expBonus = isSenior ? 10 : 0;
            int finalScore = Math.Min(baseScore + matchBonus + expBonus, 100);

            string feedback = matchedSkills.Count > 0
                ? $"AI identified matching skills: {string.Join(", ", matchedSkills)}. Strong alignment with job requirements."
                : "Minimal direct skill alignment detected. Candidate shows general aptitude but limited specific keyword match.";

            string keywords = matchedSkills.Count > 0
                ? string.Join(",", matchedSkills)
                : "general_aptitude";

            application.AiMatchScore = finalScore;
            application.AiKeywordsExtracted = keywords;
            application.AiFeedback = feedback;

            await _applicationRepository.SaveChangesAsync();

            return Ok(new
            {
                message = "AI scoring completed.",
                applicationId = id,
                aiMatchScore = finalScore,
                aiKeywordsExtracted = keywords,
                aiFeedback = feedback
            });
        }

        // 7. RECRUITER/ADMIN — Update application status
        [HttpPut("{id}/status")]
        [Authorize(Roles = "recruiter,admin,hiring_manager,company_admin")]
        public async Task<IActionResult> UpdateApplicationStatus(int id, [FromBody] UpdateApplicationStatusDto dto)
        {
            var applications = await _applicationRepository.GetAllAsync();
            var application = applications.FirstOrDefault(a => a.Id == id);

            if (application == null)
                return NotFound(new { message = "Application not found." });

            application.Status = dto.Status;
            
            // Map either from ScreeningNotes or use Notes if sent from frontend
            if (!string.IsNullOrEmpty(dto.ScreeningNotes))
            {
                application.ScreeningNotes = dto.ScreeningNotes;
            }
            else if (!string.IsNullOrEmpty(dto.Notes))
            {
                application.ScreeningNotes = dto.Notes;
            }

            await _applicationRepository.SaveChangesAsync();

            return Ok(new { message = "Application status updated successfully", application });
        }
    }
}
