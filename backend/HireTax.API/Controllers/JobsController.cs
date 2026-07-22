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
    public class JobsController : ControllerBase
    {
        private readonly IGenericRepository<Job> _jobRepository;
        private readonly IGenericRepository<User> _userRepository;

        public JobsController(
            IGenericRepository<Job> jobRepository,
            IGenericRepository<User> userRepository)
        {
            _jobRepository = jobRepository;
            _userRepository = userRepository;
        }

        // 1. CREATE — Post a New Job (Recruiter/Admin only)
        [HttpPost]
        [Authorize(Roles = "recruiter,admin")]
        public async Task<IActionResult> CreateJob(CreateJobDto jobDto)
        {
            var job = new Job
            {
                Title = jobDto.Title,
                Description = jobDto.Description,
                CompanyName = jobDto.CompanyName,
                Location = jobDto.Location,
                Department = jobDto.Department,
                JobType = jobDto.JobType,
                SalaryRange = jobDto.SalaryRange,
                Requirements = jobDto.Requirements,
                AiPreferredSkills = jobDto.AiPreferredSkills,
                PostedByUserId = jobDto.PostedByUserId,
                Status = "Active",
                CreatedAt = DateTime.UtcNow
            };

            await _jobRepository.AddAsync(job);
            await _jobRepository.SaveChangesAsync();

            return Ok(new { message = "Job posted successfully!", job });
        }

        // 2. READ ALL — Get All Jobs
        // Public: returns all active jobs (for candidates to browse)
        // Recruiters: filtered to their own company's jobs
        [HttpGet]
        [AllowAnonymous]
        public async Task<IActionResult> GetAllJobs()
        {
            var jobs = await _jobRepository.GetAllAsync();

            // If caller is staff (recruiter, hm, company_admin), filter to their company's jobs only
            var role = User.FindFirstValue(ClaimTypes.Role);
            if (role == "recruiter" || role == "hiring_manager" || role == "company_admin")
            {
                var currentUserId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
                var users = await _userRepository.GetAllAsync();
                var currentUser = users.FirstOrDefault(u => u.Id == currentUserId);

                if (currentUser?.CompanyId != null)
                {
                    // Get all user IDs belonging to this company
                    var companyUserIds = users
                        .Where(u => u.CompanyId == currentUser.CompanyId)
                        .Select(u => u.Id)
                        .ToHashSet();

                    jobs = jobs.Where(j => companyUserIds.Contains(j.PostedByUserId)).ToList();
                }
            }

            return Ok(jobs);
        }

        // 3. READ ONE — Get Job by ID (Public)
        [HttpGet("{id}")]
        [AllowAnonymous]
        public async Task<IActionResult> GetJobById(int id)
        {
            var jobs = await _jobRepository.GetAllAsync();
            var job = jobs.FirstOrDefault(j => j.Id == id);

            if (job == null)
                return NotFound(new { message = "Job not found." });

            return Ok(job);
        }

        // 4. UPDATE — Modify Job (Recruiter who owns it, or Admin)
        [HttpPut("{id}")]
        [Authorize(Roles = "recruiter,admin")]
        public async Task<IActionResult> UpdateJob(int id, UpdateJobDto jobDto)
        {
            var jobs = await _jobRepository.GetAllAsync();
            var existingJob = jobs.FirstOrDefault(j => j.Id == id);

            if (existingJob == null)
                return NotFound(new { message = "Job not found." });

            // Ownership check: recruiters can only edit their own postings.
            // Admins can edit any job.
            var currentUserId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var currentUserRole = User.FindFirstValue(ClaimTypes.Role);

            if (currentUserRole == "recruiter" && existingJob.PostedByUserId != currentUserId)
            {
                return Forbid();
            }

            existingJob.Title = jobDto.Title;
            existingJob.Description = jobDto.Description;
            existingJob.CompanyName = jobDto.CompanyName;
            existingJob.Location = jobDto.Location;
            existingJob.Department = jobDto.Department;
            existingJob.JobType = jobDto.JobType;
            existingJob.SalaryRange = jobDto.SalaryRange;
            existingJob.Requirements = jobDto.Requirements;
            existingJob.AiPreferredSkills = jobDto.AiPreferredSkills;
            existingJob.Status = jobDto.Status;

            await _jobRepository.SaveChangesAsync();
            return Ok(new { message = "Job updated successfully!" });
        }

        // 5. DELETE — Remove Job (Admin only)
        [HttpDelete("{id}")]
        [Authorize(Roles = "admin")]
        public async Task<IActionResult> DeleteJob(int id)
        {
            var jobs = await _jobRepository.GetAllAsync();
            var job = jobs.FirstOrDefault(j => j.Id == id);

            if (job == null)
                return NotFound(new { message = "Job not found." });

            _jobRepository.Delete(job);
            await _jobRepository.SaveChangesAsync();

            return Ok(new { message = "Job deleted successfully!" });
        }
    }
}