using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using HireTax.API.Services.Notifications;

namespace HireTax.API.Controllers
{
    [ApiController]
    [Route("api/notification")]
    [Authorize(Roles = "recruiter,admin,hiring_manager")] // candidates never trigger notifications directly
    public class NotificationController : ControllerBase
    {
        private readonly NotificationService _notificationService;

        public NotificationController(NotificationService notificationService)
        {
            _notificationService = notificationService;
        }

        // ================= SMS =================
        [HttpPost("sms")]
        public async Task<IActionResult> SendSms([FromBody] SmsRequest request)
        {
            await _notificationService.SendSms(request.To, request.Message);
            return Ok(new { message = "SMS sent successfully" });
        }

        // ================= EMAIL =================
        [HttpPost("email")]
        public async Task<IActionResult> SendEmail([FromBody] EmailRequest request)
        {
            await _notificationService.SendEmail(request.To, request.Subject, request.Message);
            return Ok(new { message = "Email sent successfully" });
        }

        // ================= CALENDAR =================
        [HttpPost("calendar")]
        public async Task<IActionResult> CreateEvent([FromBody] CalendarRequest request)
        {
            await _notificationService.CreateInterviewEvent(request.Title, request.Start, request.End);
            return Ok(new { message = "Calendar event created" });
        }
    }

    // ================= DTOs =================
    public class SmsRequest
    {
        public string To { get; set; } = string.Empty;
        public string Message { get; set; } = string.Empty;
    }

    public class EmailRequest
    {
        public string To { get; set; } = string.Empty;
        public string Subject { get; set; } = string.Empty;
        public string Message { get; set; } = string.Empty;
    }

    public class CalendarRequest
    {
        public string Title { get; set; } = string.Empty;
        public DateTime Start { get; set; }
        public DateTime End { get; set; }
    }
}