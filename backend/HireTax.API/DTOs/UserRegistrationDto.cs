using System.ComponentModel.DataAnnotations;

namespace HireTax.API.DTOs
{
    public class UserRegistrationDto
    {
        [Required]
        public string FullName { get; set; } = string.Empty;

        [Required]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;

        [Required]
        [StringLength(100, MinimumLength = 6)]
        public string Password { get; set; } = string.Empty;

        [Required]
        public int RoleId { get; set; }

        // Optional: Recruiters and HiringManagers must supply their company ID
        public int? CompanyId { get; set; }

        // Added for Company Registration
        public string? CompanyName { get; set; }
        public string? CompanyIndustry { get; set; }
    }
}