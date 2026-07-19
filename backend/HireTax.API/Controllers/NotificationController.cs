using Microsoft.AspNetCore.Mvc;
using HireTax.API.Services.Notifications;

namespace HireTax.API.Controllers
{
    [ApiController]
    [Route("api/notification")]
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
            return Ok("SMS sent successfully");
        }

        // ================= EMAIL =================
        [HttpPost("email")]
        public async Task<IActionResult> SendEmail([FromBody] EmailRequest request)
        {
            await _notificationService.SendEmail(request.To, request.Subject, request.Message);
            return Ok("Email sent successfully");
        }

        // ================= CALENDAR =================
        [HttpPost("calendar")]
        public async Task<IActionResult> CreateEvent([FromBody] CalendarRequest request)
        {
            await _notificationService.CreateInterviewEvent(request.Title, request.Start, request.End);
            return Ok("Calendar event created");
        }
    }

    // ================= DTOs =================
    public class SmsRequest
    {
        public string To { get; set; }
        public string Message { get; set; }
    }

    public class EmailRequest
    
}