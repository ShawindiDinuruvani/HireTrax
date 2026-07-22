using System.ComponentModel.DataAnnotations;

namespace HireTax.API.Models
{
    public class Company
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string Name { get; set; } = string.Empty;

        public string Industry { get; set; } = string.Empty;

        [EmailAddress]
        public string ContactEmail { get; set; } = string.Empty;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Navigation: users belonging to this company
        public ICollection<User> Users { get; set; } = new List<User>();
    }
}
