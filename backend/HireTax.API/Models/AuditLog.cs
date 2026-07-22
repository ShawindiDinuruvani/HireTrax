using System.ComponentModel.DataAnnotations;

namespace HireTax.API.Models
{
    public class AuditLog
    {
        [Key]
        public int Id { get; set; }

        // Who did it (User ID — 0 means system/anonymous)
        public int UserId { get; set; }

        // User's email for quick display (denormalized)
        public string UserEmail { get; set; } = string.Empty;

        // Their role at the time of the action
        public string UserRole { get; set; } = string.Empty;

        // What action was performed
        // e.g. "Job Created", "Application Status Updated", "User Login", "Evaluation Submitted"
        [Required]
        public string Action { get; set; } = string.Empty;

        // Entity type affected e.g. "Job", "Application", "Interview", "User"
        public string EntityType { get; set; } = string.Empty;

        // ID of the affected record (nullable for non-entity actions like Login)
        public int? EntityId { get; set; }

        // Human-readable detail of the action
        public string Details { get; set; } = string.Empty;

        // Timestamp (UTC)
        public DateTime Timestamp { get; set; } = DateTime.UtcNow;

        // HTTP method: GET, POST, PUT, DELETE
        public string HttpMethod { get; set; } = string.Empty;

        // Endpoint path
        public string Endpoint { get; set; } = string.Empty;

        // Response status code (200, 400, 401, etc.)
        public int StatusCode { get; set; }
    }
}
