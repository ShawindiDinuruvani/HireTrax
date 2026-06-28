using Microsoft.AspNetCore.Mvc;
using HireTax.API.Models;
using HireTax.API.DTOs;
using HireTax.API.Repositories.Interfaces;
using BCrypt.Net;

namespace HireTax.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UsersController : ControllerBase
    {
        private readonly IGenericRepository<User> _userRepository;

        // Repository එක හරහා Constructor එකට එනවා
        public UsersController(IGenericRepository<User> userRepository)
        {
            _userRepository = userRepository;
        }

        // --- Register Method ---
        [HttpPost("register")]
        public async Task<IActionResult> Register(UserRegistrationDto userDto)
        {
            // Repository එකේ GetAll පාවිච්චි කරලා check කරන්න (හෝ මීට වඩා හොඳ ක්‍රමයක් පසුව හදමු)
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
                RoleId = 1
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

            return Ok(new { message = "Login සාර්ථකයි!", userId = user.Id });
        }
    }
}