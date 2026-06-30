using Microsoft.AspNetCore.Mvc;
using HireTax.API.Models;
using HireTax.API.DTOs;
using HireTax.API.Repositories.Interfaces;
using BCrypt.Net;
using System.Text;
using System.Security.Claims;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.IdentityModel.Tokens;

namespace HireTax.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UsersController : ControllerBase
    {
        private readonly IGenericRepository<User> _userRepository;
        private readonly IConfiguration _configuration;

        // Constructor එක හරහා Repository සහ Configuration නිවැරදිව ලබා ගැනීම
        public UsersController(IGenericRepository<User> userRepository, IConfiguration configuration)
        {
            _userRepository = userRepository;
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

            string hashedPassword = BCrypt.Net.BCrypt.HashPassword(userDto.Password);

            var user = new User
            {
                Email = userDto.Email,
                PasswordHash = hashedPassword,
                // Role-based Access සඳහා Frontend එකෙන් එන RoleId එක කෙලින්ම ලබාදෙන්න
                RoleId = userDto.RoleId
            };

            await _userRepository.AddAsync(user);
            await _userRepository.SaveChangesAsync();

            return Ok(new { message = "ලියාපදිංචිය සාර්ථකයි!" });
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
            var token = GenerateJwtToken(user);

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
        private string GenerateJwtToken(User user)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]!);

            // Token එක ඇතුලට දමන පරිශීලක විස්තර (Claims)
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[]
                {
                    new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                    new Claim(ClaimTypes.Email, user.Email),
                    new Claim(ClaimTypes.Role, user.RoleId.ToString()) // Role-based Access සඳහා මෙය අත්‍යවශ්‍ය වේ
                }),
                Expires = DateTime.UtcNow.AddHours(2), // පැය 2කින් Token එක කල් ඉකුත් වේ
                Issuer = _configuration["Jwt:Issuer"],
                Audience = _configuration["Jwt:Audience"],
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }
    }
}