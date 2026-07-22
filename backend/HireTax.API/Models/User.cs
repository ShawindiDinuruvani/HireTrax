using System.ComponentModel.DataAnnotations;

namespace HireTax.API.Models
{
    public class User
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;

        [Required]
        public string PasswordHash { get; set; } = string.Empty;

        public int RoleId { get; set; }

        // Optional: Recruiters & HiringManagers belong to a Company
        // Candidates leave this null
        public int? CompanyId { get; set; }

        // Navigation properties
        public Role? Role { get; set; }
        public Company? Company { get; set; }
    }
}