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

        public string Department { get; set; } = string.Empty;

        public string JobType { get; set; } = string.Empty; // e.g. "Full-Time", "Part-Time", "Contract"

        public string SalaryRange { get; set; } = string.Empty; // e.g. "LKR 100,000 - 150,000"

        public string Requirements { get; set; } = string.Empty;

        public string AiPreferredSkills { get; set; } = string.Empty; // comma-separated skills used for AI matching

        public int PostedByUserId { get; set; } // FK to User who created the job

        public string Status { get; set; } = "Active"; // Active, Closed, Draft

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}