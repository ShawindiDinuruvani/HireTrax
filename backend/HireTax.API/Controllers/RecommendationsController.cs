using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using HireTax.API.Models;
using HireTax.API.Repositories.Interfaces;

namespace HireTax.API.Controllers
{
    [ApiController]
    [Route("api/recommendations")]
    [Authorize(Roles = "candidate")]
    public class RecommendationsController : ControllerBase
    {
        private readonly IGenericRepository<Job> _jobRepository;
        private readonly IGenericRepository<CandidateProfile> _profileRepository;
        private readonly IGenericRepository<Application> _applicationRepository;

        public RecommendationsController(
            IGenericRepository<Job> jobRepository,
            IGenericRepository<CandidateProfile> profileRepository,
            IGenericRepository<Application> applicationRepository)
        {
            _jobRepository = jobRepository;
            _profileRepository = profileRepository;
            _applicationRepository = applicationRepository;
        }

        /// <summary>
        /// GET /api/recommendations
        /// Returns AI-powered job recommendations for the logged-in candidate,
        /// ranked by keyword match score between the candidate's skills/experience
        /// and each job's AiPreferredSkills list.
        /// </summary>
        [HttpGet]
        public async Task<IActionResult> GetRecommendations()
        {
            var currentUserId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

            // 1. Load candidate profile to get their skills
            var profiles = await _profileRepository.GetAllAsync();
            var profile = profiles.FirstOrDefault(p => p.UserId == currentUserId);

            if (profile == null || string.IsNullOrWhiteSpace(profile.Skills))
            {
                return Ok(new
                {
                    message = "Complete your profile with skills to get AI job recommendations.",
                    recommendations = Array.Empty<object>()
                });
            }

            // 2. Load all active jobs
            var jobs = await _jobRepository.GetAllAsync();
            var activeJobs = jobs.Where(j => j.Status == "Active").ToList();

            // 3. Load candidate's existing applications (to exclude already-applied jobs)
            var applications = await _applicationRepository.GetAllAsync();
            var appliedJobIds = applications
                .Where(a => a.CandidateId == currentUserId)
                .Select(a => a.JobId)
                .ToHashSet();

            // 4. Score each job
            var candidateSkillsLower = profile.Skills.ToLower();
            var candidateExperienceLower = (profile.Experience ?? string.Empty).ToLower();
            bool isSenior = candidateSkillsLower.Contains("senior") || candidateExperienceLower.Contains("senior");

            var recommendations = activeJobs
                .Where(j => !appliedJobIds.Contains(j.Id)) // exclude already applied
                .Select(job =>
                {
                    var preferredSkills = job.AiPreferredSkills
                        .Split(',', StringSplitOptions.RemoveEmptyEntries)
                        .Select(s => s.Trim().ToLower())
                        .Where(s => s.Length > 0)
                        .ToList();

                    var matchedSkills = preferredSkills
                        .Where(skill => candidateSkillsLower.Contains(skill))
                        .ToList();

                    int baseScore = 50;
                    int matchBonus = Math.Min(matchedSkills.Count * 10, 40);
                    int expBonus = isSenior ? 10 : 0;
                    int totalScore = Math.Min(baseScore + matchBonus + expBonus, 100);

                    string reason = matchedSkills.Count > 0
                        ? $"Your skills match: {string.Join(", ", matchedSkills)}"
                        : "Based on your general profile";

                    return new
                    {
                        job.Id,
                        job.Title,
                        job.CompanyName,
                        job.Location,
                        job.Department,
                        job.JobType,
                        job.SalaryRange,
                        job.Requirements,
                        job.CreatedAt,
                        AiMatchScore = totalScore,
                        MatchedSkills = matchedSkills,
                        RecommendationReason = reason
                    };
                })
                .Where(r => r.AiMatchScore >= 60) // Only show decent matches
                .OrderByDescending(r => r.AiMatchScore)
                .Take(10) // Top 10 recommendations
                .ToList();

            return Ok(new
            {
                message = $"Found {recommendations.Count} AI-powered job recommendations for you.",
                candidateName = profile.FullName,
                candidateSkills = profile.Skills,
                recommendations
            });
        }
    }
}
