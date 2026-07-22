using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using HireTax.API.Models;
using HireTax.API.Repositories.Interfaces;

namespace HireTax.API.Controllers
{
    [ApiController]
    [Route("api/admin/audit-logs")]
    [Authorize(Roles = "admin")]
    public class AuditLogsController : ControllerBase
    {
        private readonly IGenericRepository<AuditLog> _auditLogRepository;

        public AuditLogsController(IGenericRepository<AuditLog> auditLogRepository)
        {
            _auditLogRepository = auditLogRepository;
        }

        // GET all audit logs (latest first, max 200)
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var logs = await _auditLogRepository.GetAllAsync();
            var result = logs
                .OrderByDescending(l => l.Timestamp)
                .Take(200)
                .Select(l => new
                {
                    l.Id,
                    l.Timestamp,
                    l.UserEmail,
                    l.UserRole,
                    l.Action,
                    l.EntityType,
                    l.EntityId,
                    l.Details,
                    l.HttpMethod,
                    l.Endpoint,
                    l.StatusCode
                })
                .ToList();

            return Ok(result);
        }

        // GET logs filtered by userId
        [HttpGet("user/{userId}")]
        public async Task<IActionResult> GetByUser(int userId)
        {
            var logs = await _auditLogRepository.GetAllAsync();
            var result = logs
                .Where(l => l.UserId == userId)
                .OrderByDescending(l => l.Timestamp)
                .Take(100)
                .ToList();

            return Ok(result);
        }

        // GET logs filtered by action type
        [HttpGet("action/{action}")]
        public async Task<IActionResult> GetByAction(string action)
        {
            var logs = await _auditLogRepository.GetAllAsync();
            var result = logs
                .Where(l => l.Action.ToLower().Contains(action.ToLower()))
                .OrderByDescending(l => l.Timestamp)
                .Take(100)
                .ToList();

            return Ok(result);
        }
    }
}
