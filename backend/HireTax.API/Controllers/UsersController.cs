using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using HireTax.API.Data;
using HireTax.API.Models;
using HireTax.API.DTOs;
using BCrypt.Net;

namespace HireTax.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UsersController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public UsersController(ApplicationDbContext context)
        {
            _context = context;
        }

        // --- Register Method ---
        [HttpPost("register")]
        public async Task<IActionResult> Register(UserRegistrationDto userDto)
        {
            var userExists = await _context.Users.AnyAsync(u => u.Email == userDto.Email);
            if (userExists)
            {
                return BadRequest("මේ ඊමේල් එකෙන් දැනටමත් කෙනෙක් රෙජිස්ටර් වෙලා තියෙන්නේ!");
            }

            string hashedPassword = BCrypt.Net.BCrypt.HashPassword(userDto.Password);

            var user = new User
            {
                Email = userDto.Email,
                PasswordHash = hashedPassword,
                RoleId = 1
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return Ok(new { message = "ලියාපදිංචිය සාර්ථකයි!" });
        }

        // --- Login Method ---
        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginDto loginDto)
        {
            // 1. Database එකෙන් User ව හොයන්න
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == loginDto.Email);

            if (user == null)
            {
                return Unauthorized("වැරදි ඊමේල් එකක් හෝ පාස්වර්ඩ් එකක්!");
            }

            // 2. Hash කරපු Password එක Verify කරන්න
            bool isPasswordValid = BCrypt.Net.BCrypt.Verify(loginDto.Password, user.PasswordHash);

            if (!isPasswordValid)
            {
                return Unauthorized("වැරදි ඊමේල් එකක් හෝ පාස්වර්ඩ් එකක්!");
            }

            return Ok(new { message = "Login සාර්ථකයි!", userId = user.Id });
        }
    }
}