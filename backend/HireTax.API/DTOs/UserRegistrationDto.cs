using System.ComponentModel.DataAnnotations;

namespace HireTax.API.DTOs
{
    public class UserRegistrationDto
    {
        [Required]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;

        [Required]
        [StringLength(100, MinimumLength = 6)]
        public string Password { get; set; } = string.Empty;


        // Role-based Access සඳහා Malshi විසින් එකතු කරන ලදී
        [Required]
        public int RoleId { get; set; }
    }
}