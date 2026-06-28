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

        // Navigation property එකේ nullability එක නිරාකරණය කිරීමට
        public Role? Role { get; set; }
    }
}