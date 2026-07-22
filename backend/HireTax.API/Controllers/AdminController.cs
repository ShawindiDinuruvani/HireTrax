using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using HireTax.API.Models;
using HireTax.API.Repositories.Interfaces;

namespace HireTax.API.Controllers
{
    [ApiController]
    [Route("api/admin")]
    [Authorize(Roles = "admin")]
    public class AdminController : ControllerBase
    {
        private readonly IGenericRepository<User> _userRepository;
        private readonly IGenericRepository<Role> _roleRepository;
        private readonly IGenericRepository<Job> _jobRepository;
        private readonly IGenericRepository<Application> _applicationRepository;
        private readonly IGenericRepository<CandidateProfile> _profileRepository;

        public AdminController(
            IGenericRepository<User> userRepository,
            IGenericRepository<Role> roleRepository,
            IGenericRepository<Job> jobRepository,
            IGenericRepository<Application> applicationRepository,
            IGenericRepository<CandidateProfile> profileRepository)
        {
            _userRepository = userRepository;
            _roleRepository = roleRepository;
            _jobRepository = jobRepository;
            _applicationRepository = applicationRepository;
            _profileRepository = profileRepository;
        }

        // ── 1. GET all users (with role name) ─────────────────────────────
        [HttpGet("users")]
        public async Task<IActionResult> GetAllUsers()
        {
            var users = await _userRepository.GetAllAsync();
            var roles = await _roleRepository.GetAllAsync();
            var profiles = await _profileRepository.GetAllAsync();

            var result = users.Select(u =>
            {
                var role = roles.FirstOrDefault(r => r.Id == u.RoleId);
                var profile = profiles.FirstOrDefault(p => p.UserId == u.Id);
                return new
                {
                    u.Id,
                    u.Email,
                    RoleName = role?.Name ?? "unknown",
                    u.RoleId,
                    FullName = profile?.FullName ?? string.Empty
                };
            }).ToList();

            return Ok(result);
        }

        // ── 2. UPDATE user role ────────────────────────────────────────────
        [HttpPut("users/{userId}/role")]
        public async Task<IActionResult> UpdateUserRole(int userId, [FromBody] UpdateRoleDto dto)
        {
            var users = await _userRepository.GetAllAsync();
            var user = users.FirstOrDefault(u => u.Id == userId);

            if (user == null)
                return NotFound(new { message = "User not found." });

            var roles = await _roleRepository.GetAllAsync();
            var role = roles.FirstOrDefault(r => r.Id == dto.RoleId);

            if (role == null)
                return BadRequest(new { message = "Invalid role." });

            // Prevent admin from revoking their own admin role
            var currentUserId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            if (user.Id == currentUserId)
                return BadRequest(new { message = "Cannot change your own role." });

            user.RoleId = dto.RoleId;
            await _userRepository.SaveChangesAsync();

            return Ok(new { message = $"User role updated to '{role.Name}'.", userId, roleName = role.Name });
        }

        // ── 3. DELETE user ─────────────────────────────────────────────────
        [HttpDelete("users/{userId}")]
        public async Task<IActionResult> DeleteUser(int userId)
        {
            var currentUserId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            if (userId == currentUserId)
                return BadRequest(new { message = "Cannot delete your own account." });

            var users = await _userRepository.GetAllAsync();
            var user = users.FirstOrDefault(u => u.Id == userId);

            if (user == null)
                return NotFound(new { message = "User not found." });

            _userRepository.Delete(user);
            await _userRepository.SaveChangesAsync();

            return Ok(new { message = "User deleted successfully." });
        }

        // ── 4. GET roles list ──────────────────────────────────────────────
        [HttpGet("roles")]
        public async Task<IActionResult> GetRoles()
        {
            var roles = await _roleRepository.GetAllAsync();
            return Ok(roles);
        }

        // ── 5. ANALYTICS — Dashboard summary stats ─────────────────────────
        [HttpGet("analytics")]
        public async Task<IActionResult> GetAnalytics()
        {
            var users = await _userRepository.GetAllAsync();
            var roles = await _roleRepository.GetAllAsync();
            var jobs = await _jobRepository.GetAllAsync();
            var applications = await _applicationRepository.GetAllAsync();

            // User breakdown by role
            var usersByRole = roles.Select(r => new
            {
                RoleName = r.Name,
                Count = users.Count(u => u.RoleId == r.Id)
            }).ToList();

            // Applications breakdown by status
            var applicationsByStatus = new[]
            {
                "Screening", "Interviewing", "Score Card", "Offered", "Rejected"
            }.Select(status => new
            {
                Status = status,
                Count = applications.Count(a => a.Status == status)
            }).ToList();

            // Jobs breakdown by status
            var jobsByStatus = new[]
            {
                "Active", "Closed", "Draft"
            }.Select(status => new
            {
                Status = status,
                Count = jobs.Count(j => j.Status == status)
            }).ToList();

            // AI score average
            var aiScored = applications.Where(a => a.AiMatchScore > 0).ToList();
            double averageAiScore = aiScored.Any()
                ? Math.Round(aiScored.Average(a => a.AiMatchScore), 1)
                : 0;

            return Ok(new
            {
                TotalUsers = users.Count(),
                TotalJobs = jobs.Count(),
                TotalApplications = applications.Count(),
                ActiveJobs = jobs.Count(j => j.Status == "Active"),
                AverageAiMatchScore = averageAiScore,
                UsersByRole = usersByRole,
                ApplicationsByStatus = applicationsByStatus,
                JobsByStatus = jobsByStatus
            });
        }
    }

    // DTO for role update
    public class UpdateRoleDto
    {
        public int RoleId { get; set; }
    }
}
