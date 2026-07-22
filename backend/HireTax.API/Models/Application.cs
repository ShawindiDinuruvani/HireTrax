using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HireTax.API.Models
{
    public class Application
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int JobId { get; set; }

        [ForeignKey("JobId")]
        public Job? Job { get; set; }

        [Required]
        public int CandidateId { get; set; }

        [ForeignKey("CandidateId")]
        public User? Candidate { get; set; }

        public DateTime AppliedDate { get; set; } = DateTime.UtcNow;

        public string Status { get; set; } = "Screening"; // Screening, Interviewing, Score Card, Offered, Rejected

        public int AiMatchScore { get; set; } = 0;

        public string AiKeywordsExtracted { get; set; } = string.Empty; // comma-separated

        public string AiFeedback { get; set; } = string.Empty;

        public string ScreeningNotes { get; set; } = string.Empty;

        public string ResumeFileName { get; set; } = string.Empty;

        [NotMapped]
        public string ResumeUrl { get; set; } = string.Empty;
    }
}
