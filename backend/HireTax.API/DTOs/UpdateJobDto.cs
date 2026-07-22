using System.ComponentModel.DataAnnotations;

namespace HireTax.API.DTOs
{
    public class UpdateJobDto
    {
        [Required]
        public string Title { get; set; } = string.Empty;

        [Required]
        public string Description { get; set; } = string.Empty;

        [Required]
        public string CompanyName { get; set; } = string.Empty;

        [Required]
        public string Location { get; set; } = string.Empty;

        public string Department { get; set; } = string.Empty;

        public string JobType { get; set; } = string.Empty;

        public string SalaryRange { get; set; } = string.Empty;

        public string Requirements { get; set; } = string.Empty;

        public string AiPreferredSkills { get; set; } = string.Empty;

        public string Status { get; set; } = "Active";
    }
}