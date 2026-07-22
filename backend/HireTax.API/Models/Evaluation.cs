using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HireTax.API.Models
{
    public class Evaluation
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int ApplicationId { get; set; }

        [ForeignKey("ApplicationId")]
        public Application? Application { get; set; }

        public string InterviewerName { get; set; } = string.Empty;

        [Range(1, 5)]
        public double SkillsScore { get; set; }

        [Range(1, 5)]
        public double CultureScore { get; set; }

        [Range(1, 5)]
        public double CommunicationScore { get; set; }

        public double OverallScore { get; set; }

        public string Recommendation { get; set; } = string.Empty; // Strong Hire, Hire, No Hire

        public string Notes { get; set; } = string.Empty;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
