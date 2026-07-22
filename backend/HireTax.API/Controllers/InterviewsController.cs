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
    [Authorize(Roles = "recruiter,admin,hiring_manager,candidate")]
    public class InterviewsController : ControllerBase
    {
        private readonly IGenericRepository<Interview> _interviewRepository;
        private readonly IGenericRepository<Application> _applicationRepository;

        public InterviewsController(
            IGenericRepository<Interview> interviewRepository,
            IGenericRepository<Application> applicationRepository)
        {
            _interviewRepository = interviewRepository;
            _applicationRepository = applicationRepository;
        }

        private int CurrentUserId => int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        private string? CurrentRole => User.FindFirstValue(ClaimTypes.Role);

        // RECRUITER/ADMIN/HIRING_MANAGER — Schedule an interview
        [HttpPost]
        [Authorize(Roles = "recruiter,admin,hiring_manager")]
        public async Task<IActionResult> Schedule(CreateInterviewDto dto)
        {
            var applications = await _applicationRepository.GetAllAsync();
            var application = applications.FirstOrDefault(a => a.Id == dto.ApplicationId);

            if (application == null)
                return NotFound(new { message = "Application not found." });

            var interview = new Interview
            {
                ApplicationId = dto.ApplicationId,
                ScheduledAt = dto.ScheduledAt,
                Type = dto.Type,
                InterviewerName = dto.InterviewerName,
                MeetingLink = dto.MeetingLink,
                Status = "Scheduled"
            };

            await _interviewRepository.AddAsync(interview);
            await _interviewRepository.SaveChangesAsync();

            // Move the application into the interviewing stage automatically
            application.Status = "Interviewing";
            await _applicationRepository.SaveChangesAsync();

            // NOTE: Wire this up to NotificationController's email/SMS/calendar
            // methods here (or call NotificationService directly) so the
            // candidate actually gets notified — currently just persists the row.

            return Ok(new { message = "Interview scheduled successfully!", interview });
        }

        // View interviews for one application (candidate sees their own, staff sees any)
        [HttpGet("application/{applicationId}")]
        public async Task<IActionResult> GetForApplication(int applicationId)
        {
            var applications = await _applicationRepository.GetAllAsync();
            var application = applications.FirstOrDefault(a => a.Id == applicationId);

            if (application == null)
                return NotFound(new { message = "Application not found." });

            if (CurrentRole == "candidate" && application.CandidateId != CurrentUserId)
                return Forbid();

            var interviews = await _interviewRepository.GetAllAsync();
            var result = interviews.Where(i => i.ApplicationId == applicationId).ToList();
            return Ok(result);
        }

        // RECRUITER/ADMIN/HIRING_MANAGER — Update interview status (Completed/Cancelled)
        [HttpPut("{id}/status")]
        [Authorize(Roles = "recruiter,admin,hiring_manager")]
        public async Task<IActionResult> UpdateStatus(int id, [FromBody] string status)
        {
            var validStatuses = new[] { "Scheduled", "Completed", "Cancelled" };
            if (!validStatuses.Contains(status))
                return BadRequest(new { message = "Invalid status." });

            var interviews = await _interviewRepository.GetAllAsync();
            var interview = interviews.FirstOrDefault(i => i.Id == id);

            if (interview == null)
                return NotFound(new { message = "Interview not found." });

            interview.Status = status;
            await _interviewRepository.SaveChangesAsync();

            return Ok(new { message = "Interview status updated.", interview });
        }
    }
}
