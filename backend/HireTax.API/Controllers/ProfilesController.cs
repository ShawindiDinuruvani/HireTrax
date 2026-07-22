using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using HireTax.API.Models;
using HireTax.API.DTOs;
using HireTax.API.Repositories.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Hosting;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using System;
using System.Security.Claims;

namespace HireTax.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize] // every action in this controller requires a valid token
    public class ProfilesController : ControllerBase
    {
        private readonly IGenericRepository<CandidateProfile> _profileRepository;
        private readonly IWebHostEnvironment _environment;

        public ProfilesController(IGenericRepository<CandidateProfile> profileRepository, IWebHostEnvironment environment)
        {
            _profileRepository = profileRepository;
            _environment = environment;
        }

        // Helper: does the logged-in user own this profile, or are they staff?
        private bool CanAccess(int targetUserId)
        {
            var currentUserId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var role = User.FindFirstValue(ClaimTypes.Role);

            bool isOwner = currentUserId == targetUserId;
            bool isStaff = role == "recruiter" || role == "hiring_manager" || role == "admin";

            return isOwner || isStaff;
        }

        [HttpGet("{userId}")]
        public async Task<IActionResult> GetProfile(int userId)
        {
            if (!CanAccess(userId))
                return Forbid();

            var profiles = await _profileRepository.GetAllAsync();
            var profile = profiles.FirstOrDefault(p => p.UserId == userId);

            if (profile == null)
            {
                return NotFound(new { message = "Profile not found." });
            }

            return Ok(profile);
        }

        [HttpPost("manage")]
        public async Task<IActionResult> SaveProfile(UpdateProfileDto profileDto)
        {
            // Only the candidate themselves (or an admin) can edit — not even
            // recruiters/hiring managers should be able to overwrite a
            // candidate's own profile data.
            var currentUserId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var role = User.FindFirstValue(ClaimTypes.Role);

            if (currentUserId != profileDto.UserId && role != "admin")
                return Forbid();

            var profiles = await _profileRepository.GetAllAsync();
            var existingProfile = profiles.FirstOrDefault(p => p.UserId == profileDto.UserId);

            if (existingProfile == null)
            {
                var newProfile = new CandidateProfile
                {
                    UserId = profileDto.UserId,
                    FullName = profileDto.FullName,
                    ProfessionalSummary = profileDto.ProfessionalSummary,
                    Skills = profileDto.Skills,
                    Experience = profileDto.Experience,
                    ResumePath = string.Empty
                };
                await _profileRepository.AddAsync(newProfile);
            }
            else
            {
                existingProfile.FullName = profileDto.FullName;
                existingProfile.ProfessionalSummary = profileDto.ProfessionalSummary;
                existingProfile.Skills = profileDto.Skills;
                existingProfile.Experience = profileDto.Experience;
                existingProfile.LastUpdated = DateTime.UtcNow;
            }

            await _profileRepository.SaveChangesAsync();
            return Ok(new { message = "Profile records successfully updated!" });
        }

        [HttpPost("upload-resume/{userId}")]
        public async Task<IActionResult> UploadResume(int userId, IFormFile file)
        {
            var currentUserId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var role = User.FindFirstValue(ClaimTypes.Role);

            if (currentUserId != userId && role != "admin")
                return Forbid();

            if (file == null || file.Length == 0)
            {
                return BadRequest(new { message = "Invalid document submission. No file data detected." });
            }

            var allowedExtensions = new[] { ".pdf", ".docx", ".doc" };
            var extension = Path.GetExtension(file.FileName).ToLower();
            if (!allowedExtensions.Contains(extension))
            {
                return BadRequest(new { message = "Unsupported format. Only PDF and Word documents are permitted." });
            }

            string uploadFolder = Path.Combine(_environment.ContentRootPath, "wwwroot", "uploads", "resumes");
            if (!Directory.Exists(uploadFolder))
            {
                Directory.CreateDirectory(uploadFolder);
            }

            string uniqueFileName = $"Resume_User_{userId}_{DateTime.UtcNow.Ticks}{extension}";
            string physicalFilePath = Path.Combine(uploadFolder, uniqueFileName);

            using (var stream = new FileStream(physicalFilePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            var profiles = await _profileRepository.GetAllAsync();
            var profile = profiles.FirstOrDefault(p => p.UserId == userId);

            if (profile == null)
            {
                return BadRequest(new { message = "Profile instance missing. Save profile details text before uploading resume documents." });
            }

            profile.ResumePath = $"/uploads/resumes/{uniqueFileName}";
            profile.LastUpdated = DateTime.UtcNow;

            await _profileRepository.SaveChangesAsync();

            return Ok(new { message = "Resume uploaded and linked successfully!", path = profile.ResumePath });
        }
    }
}