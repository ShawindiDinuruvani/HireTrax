using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HireTax.API.Models
{
    public class Interview
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int ApplicationId { get; set; }

        [ForeignKey("ApplicationId")]
        public Application? Application { get; set; }

        public DateTime ScheduledAt { get; set; }

        public string Type { get; set; } = string.Empty; // Technical Interview, HR Interview, etc.

        public string InterviewerName { get; set; } = string.Empty;

        public string MeetingLink { get; set; } = string.Empty;

        public string Status { get; set; } = "Scheduled"; // Scheduled, Completed, Cancelled
    }
}
