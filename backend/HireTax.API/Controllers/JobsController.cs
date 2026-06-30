using Microsoft.AspNetCore.Mvc;
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

        // Constructor automatically injects the shared Generic Repository
        public JobsController(IGenericRepository<Job> jobRepository)
        {
            _jobRepository = jobRepository;
        }

        // 1. CREATE: Post a New Job Listing
        [HttpPost]
        public async Task<IActionResult> CreateJob(CreateJobDto jobDto)
        {
            var job = new Job
            {
                Title = jobDto.Title,
                Description = jobDto.Description,
                CompanyName = jobDto.CompanyName,
                Location = jobDto.Location,
                Salary = jobDto.Salary
            };

            await _jobRepository.AddAsync(job);
            await _jobRepository.SaveChangesAsync();

            return Ok(new { message = "Job listing posted successfully!", jobId = job.Id });
        }

        // 2. READ ALL: Get All Job Postings
        [HttpGet]
        public async Task<IActionResult> GetAllJobs()
        {
            var jobs = await _jobRepository.GetAllAsync();
            return Ok(jobs);
        }

        // 3. READ ONE: Get Specific Job Details by ID
        [HttpGet("{id}")]
        public async Task<IActionResult> GetJobById(int id)
        {
            var jobs = await _jobRepository.GetAllAsync();
            var job = jobs.FirstOrDefault(j => j.Id == id);

            if (job == null)
            {
                return NotFound(new { message = "The requested job posting was not found." });
            }

            return Ok(job);
        }

        // 4. UPDATE: Modify an Existing Job Posting
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateJob(int id, UpdateJobDto jobDto)
        {
            var jobs = await _jobRepository.GetAllAsync();
            var existingJob = jobs.FirstOrDefault(j => j.Id == id);

            if (existingJob == null)
            {
                return NotFound(new { message = "The specified job listing does not exist." });
            }

            existingJob.Title = jobDto.Title;
            existingJob.Description = jobDto.Description;
            existingJob.CompanyName = jobDto.CompanyName;
            existingJob.Location = jobDto.Location;
            existingJob.Salary = jobDto.Salary;

            await _jobRepository.SaveChangesAsync();

            return Ok(new { message = "Job posting updated successfully!" });
        }
    }
}