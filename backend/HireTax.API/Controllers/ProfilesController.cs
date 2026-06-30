using Microsoft.AspNetCore.Mvc;
using HireTax.API.Models;
using HireTax.API.DTOs;
using HireTax.API.Repositories.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Hosting;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using System;

namespace HireTax.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProfilesController : ControllerBase
    {
        private readonly IGenericRepository<CandidateProfile> _profileRepository;
        private readonly IWebHostEnvironment _environment;

        public ProfilesController(IGenericRepository<CandidateProfile> profileRepository, IWebHostEnvironment environment)
        {
            _profileRepository = profileRepository;
            _environment = environment;
        }

        [HttpGet("{userId}")]
        public async Task<IActionResult> GetProfile(int userId)
        {
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