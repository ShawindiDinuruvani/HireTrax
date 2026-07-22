namespace HireTax.API.DTOs
{
    // ── Application DTOs ──────────────────────────────────────────
    public class CreateApplicationDto
    {
        public int JobId { get; set; }
        public string ResumeFileName { get; set; } = string.Empty;
        public string Skills { get; set; } = string.Empty;
        public string Experience { get; set; } = string.Empty;
    }

    public class UpdateApplicationStatusDto
    {
        public string Status { get; set; } = string.Empty;
        public string ScreeningNotes { get; set; } = string.Empty;
        public string Notes { get; set; } = string.Empty; // Added to match frontend request
    }

    // ── Interview DTOs ────────────────────────────────────────────
    public class CreateInterviewDto
    {
        public int ApplicationId { get; set; }
        public DateTime ScheduledAt { get; set; }
        public string Type { get; set; } = string.Empty;
        public string InterviewerName { get; set; } = string.Empty;
        public string MeetingLink { get; set; } = string.Empty;
    }

    // ── Evaluation DTOs ───────────────────────────────────────────
    public class CreateEvaluationDto
    {
        public int ApplicationId { get; set; }
        public string InterviewerName { get; set; } = string.Empty;
        public double SkillsScore { get; set; }
        public double CultureScore { get; set; }
        public double CommunicationScore { get; set; }
        public string Recommendation { get; set; } = string.Empty;
        public string Notes { get; set; } = string.Empty;
    }
}