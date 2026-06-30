using System.ComponentModel.DataAnnotations;

namespace HireTax.API.Models
{
    public class Job
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string Title { get; set; } = string.Empty;

        [Required]
        public string Description { get; set; } = string.Empty;

        [Required]
        public string CompanyName { get; set; } = string.Empty;

        [Required]
        public string Location { get; set; } = string.Empty;

        public decimal Salary { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}