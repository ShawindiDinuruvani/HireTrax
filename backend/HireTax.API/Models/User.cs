using System.ComponentModel.DataAnnotations;

namespace HireTax.API.Models
{
    public class User
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [EmailAddress]
        public string Email { get; set; }

        [Required]
        public string PasswordHash { get; set; }

        // Role එකට link කරන Foreign Key එක
        public int RoleId { get; set; }
        public Role Role { get; set; }
    }
}