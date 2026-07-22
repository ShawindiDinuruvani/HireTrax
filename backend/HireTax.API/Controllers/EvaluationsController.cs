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
    public class EvaluationsController : ControllerBase
    {
        private readonly IGenericRepository<Evaluation> _evaluationRepository;
        private readonly IGenericRepository<Application> _applicationRepository;

        public EvaluationsController(
            IGenericRepository<Evaluation> evaluationRepository,
            IGenericRepository<Application> applicationRepository)
        {
            _evaluationRepository = evaluationRepository;
            _applicationRepository = applicationRepository;
        }

        private int CurrentUserId => int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        private string? CurrentRole => User.FindFirstValue(ClaimTypes.Role);

        // HIRING_MANAGER/ADMIN — Submit candidate evaluation after interview
        [HttpPost]
        [Authorize(Roles = "hiring_manager,admin")]
        public async Task<IActionResult> Submit(CreateEvaluationDto dto)
        {
            var applications = await _applicationRepository.GetAllAsync();
            var application = applications.FirstOrDefault(a => a.Id == dto.ApplicationId);

            if (application == null)
                return NotFound(new { message = "Application not found." });

            // ⭐ OverallScore is computed here, server-side — never trust a
            // client-submitted overall score, since it must be consistent
            // with the individual component scores.
            double overall = Math.Round(
                (dto.SkillsScore + dto.CultureScore + dto.CommunicationScore) / 3.0, 2);

            var evaluation = new Evaluation
            {
                ApplicationId = dto.ApplicationId,
                InterviewerName = dto.InterviewerName,
                SkillsScore = dto.SkillsScore,
                CultureScore = dto.CultureScore,
                CommunicationScore = dto.CommunicationScore,
                OverallScore = overall,
                Recommendation = dto.Recommendation,
                Notes = dto.Notes,
                CreatedAt = DateTime.UtcNow
            };

            await _evaluationRepository.AddAsync(evaluation);
            await _evaluationRepository.SaveChangesAsync();

            // Move application to "Score Card" stage once evaluated
            application.Status = "Score Card";
            await _applicationRepository.SaveChangesAsync();

            return Ok(new { message = "Evaluation submitted.", evaluation });
        }

        // View evaluations for an application
        [HttpGet("application/{applicationId}")]
        [Authorize(Roles = "recruiter,admin,hiring_manager")]
        public async Task<IActionResult> GetForApplication(int applicationId)
        {
            var evaluations = await _evaluationRepository.GetAllAsync();
            var result = evaluations.Where(e => e.ApplicationId == applicationId).ToList();
            return Ok(result);
        }
    }
}