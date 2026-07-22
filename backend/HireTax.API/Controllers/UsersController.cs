using Microsoft.AspNetCore.Mvc;
using HireTax.API.Models;
using HireTax.API.DTOs;
using HireTax.API.Repositories.Interfaces;
using BCrypt.Net;
using System.Text;
using System.Security.Claims;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.IdentityModel.Tokens;
using Microsoft.AspNetCore.Authorization;

namespace HireTax.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UsersController : ControllerBase
    {
        private readonly IGenericRepository<User> _userRepository;
        private readonly IGenericRepository<Role> _roleRepository;
        private readonly IGenericRepository<CandidateProfile> _profileRepository;
        private readonly IGenericRepository<Company> _companyRepository;
        private readonly IConfiguration _configuration;

        public UsersController(
            IGenericRepository<User> userRepository,
            IGenericRepository<Role> roleRepository,
            IGenericRepository<CandidateProfile> profileRepository,
            IGenericRepository<Company> companyRepository,
            IConfiguration configuration)
        {
            _userRepository = userRepository;
            _roleRepository = roleRepository;
            _profileRepository = profileRepository;
            _companyRepository = companyRepository;
            _configuration = configuration;
        }

        // --- Register Method ---
        [HttpPost("register")]
        public async Task<IActionResult> Register(UserRegistrationDto userDto)
        {
            var users = await _userRepository.GetAllAsync();
            var userExists = users.Any(u => u.Email == userDto.Email);

            if (userExists)
            {
                return BadRequest("මේ ඊමේල් එකෙන් දැනටමත් කෙනෙක් රෙජිස්ටර් වෙලා තියෙන්නේ!");
            }

            // Public self-registration should only ever create "candidate" or "company_admin" accounts.
            var roles = await _roleRepository.GetAllAsync();
            var requestedRole = roles.FirstOrDefault(r => r.Id == userDto.RoleId);

            if (requestedRole == null || (requestedRole.Name != "candidate" && requestedRole.Name != "company_admin"))
            {
                return BadRequest("Public registration is only allowed for Candidates and Company Admins.");
            }

            string hashedPassword = BCrypt.Net.BCrypt.HashPassword(userDto.Password);

            int? resolvedCompanyId = null;

            if (requestedRole.Name == "company_admin")
            {
                if (string.IsNullOrWhiteSpace(userDto.CompanyName) || string.IsNullOrWhiteSpace(userDto.CompanyIndustry))
                {
                    return BadRequest("Company Name and Industry are required for Company Admin registration.");
                }

                // Create the company first
                var newCompany = new Company
                {
                    Name = userDto.CompanyName,
                    Industry = userDto.CompanyIndustry,
                    ContactEmail = userDto.Email
                };

                await _companyRepository.AddAsync(newCompany);
                await _companyRepository.SaveChangesAsync();

                resolvedCompanyId = newCompany.Id;
            }

            var user = new User
            {
                Email = userDto.Email,
                PasswordHash = hashedPassword,
                RoleId = userDto.RoleId,
                CompanyId = resolvedCompanyId
            };

            await _userRepository.AddAsync(user);
            await _userRepository.SaveChangesAsync();

            // Auto-create a CandidateProfile for every new user
            var profile = new CandidateProfile
            {
                UserId = user.Id,
                FullName = userDto.FullName,
                ProfessionalSummary = string.Empty,
                Skills = string.Empty,
                Experience = string.Empty,
                ResumePath = string.Empty,
                LastUpdated = DateTime.UtcNow
            };
            await _profileRepository.AddAsync(profile);
            await _profileRepository.SaveChangesAsync();

            return Ok(new { message = "ලියාපදිංචිය සාර්ථකයි!", userId = user.Id, role = requestedRole.Name });
        }

        // --- Login Method ---
        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginDto loginDto)
        {
            var users = await _userRepository.GetAllAsync();
            var user = users.FirstOrDefault(u => u.Email == loginDto.Email);

            if (user == null)
            {
                return Unauthorized("වැරදි ඊමේල් එකක් හෝ පාස්වර්ඩ් එකක්!");
            }

            bool isPasswordValid = BCrypt.Net.BCrypt.Verify(loginDto.Password, user.PasswordHash);

            if (!isPasswordValid)
            {
                return Unauthorized("වැරදි ඊමේල් එකක් හෝ පාස්වර්ඩ් එකක්!");
            }

            // සාර්ථකව Login වූ පසු JWT Token එක සාදා ගනී
            var token = await GenerateJwtToken(user); // ⭐ now awaited (async)

            // ටෝකන් එක සහ පරිශීලකයාගේ විස්තර Frontend එකට ආරක්ෂිතව ලබාදේ
            return Ok(new
            {
                message = "Login සාර්ථකයි!",
                token = token,
                userId = user.Id,
                roleId = user.RoleId
            });
        }

        // --- JWT Token එක සාදන රහස් ශ්‍රිතය (Helper Method) ---
        private async Task<string> GenerateJwtToken(User user) // ⭐ now async
        {
            // ⭐ Look up the role NAME, not just the numeric RoleId
            var roles = await _roleRepository.GetAllAsync();
            var role = roles.FirstOrDefault(r => r.Id == user.RoleId);
            var roleName = role?.Name ?? "candidate"; // safe fallback

            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]!);

            
            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(ClaimTypes.Role, roleName)
            };

            if (user.CompanyId.HasValue)
            {
                claims.Add(new Claim("CompanyId", user.CompanyId.Value.ToString()));
            }

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.UtcNow.AddHours(2), 
                Issuer = _configuration["Jwt:Issuer"],
                Audience = _configuration["Jwt:Audience"],
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }

        // --- Create Company Staff Method ---
        [HttpPost("company-staff")]
        [Authorize(Roles = "company_admin")]
        public async Task<IActionResult> CreateCompanyStaff(UserRegistrationDto userDto)
        {
            var adminIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(adminIdClaim)) return Unauthorized();

            var adminUser = await _userRepository.GetByIdAsync(int.Parse(adminIdClaim));
            if (adminUser == null || adminUser.CompanyId == null) return Unauthorized("Admin has no company.");

            var users = await _userRepository.GetAllAsync();
            var userExists = users.Any(u => u.Email == userDto.Email);

            if (userExists)
            {
                return BadRequest("User with this email already exists.");
            }

            var roles = await _roleRepository.GetAllAsync();
            var requestedRole = roles.FirstOrDefault(r => r.Id == userDto.RoleId);

            if (requestedRole == null || (requestedRole.Name != "recruiter" && requestedRole.Name != "hiring_manager"))
            {
                return BadRequest("Can only create Recruiter or Hiring Manager accounts.");
            }

            string hashedPassword = BCrypt.Net.BCrypt.HashPassword(userDto.Password);

            var user = new User
            {
                Email = userDto.Email,
                PasswordHash = hashedPassword,
                RoleId = userDto.RoleId,
                CompanyId = adminUser.CompanyId
            };

            await _userRepository.AddAsync(user);
            await _userRepository.SaveChangesAsync();

            var profile = new CandidateProfile
            {
                UserId = user.Id,
                FullName = userDto.FullName,
                ProfessionalSummary = string.Empty,
                Skills = string.Empty,
                Experience = string.Empty,
                ResumePath = string.Empty,
                LastUpdated = DateTime.UtcNow
            };
            await _profileRepository.AddAsync(profile);
            await _profileRepository.SaveChangesAsync();

            return Ok(new { message = "Staff member created successfully." });
        }
        // --- Get Company Staff ---
        [HttpGet("company-staff")]
        [Authorize(Roles = "company_admin")]
        public async Task<IActionResult> GetCompanyStaff()
        {
            var adminIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(adminIdClaim)) return Unauthorized();

            var adminUser = await _userRepository.GetByIdAsync(int.Parse(adminIdClaim));
            if (adminUser == null || adminUser.CompanyId == null) return Unauthorized("Admin has no company.");

            var allUsers = await _userRepository.GetAllAsync();
            var roles = await _roleRepository.GetAllAsync();

            var staff = allUsers
                .Where(u => u.CompanyId == adminUser.CompanyId && u.Id != adminUser.Id)
                .Select(u => new
                {
                    u.Id,
                    u.Email,
                    Role = roles.FirstOrDefault(r => r.Id == u.RoleId)?.Name
                })
                .ToList();

            return Ok(staff);
        }
    }
}