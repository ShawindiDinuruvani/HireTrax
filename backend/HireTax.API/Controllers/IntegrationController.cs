using Microsoft.AspNetCore.Mvc;
using HireTax.API.Services.Interfaces;

namespace HireTax.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class IntegrationController : ControllerBase
    {
        private readonly IEmailService _emailService;
        private readonly ISmsService _smsService;
        private readonly ICalendarService _calendarService;

        public IntegrationController(
            IEmailService emailService,
            ISmsService smsService,
            ICalendarService calendarService)
        {
            _emailService = emailService;
            _smsService = smsService;
            _calendarService = calendarService;
        }

        // =========================
        // FULL INTERVIEW FLOW
        // =========================
        [HttpPost("schedule-interview")]
        public async Task<IActionResult> ScheduleInterview()
        {
            string email = "candidate@test.com";
            string phone = "+94771234567";
            DateTime interviewTime = DateTime.Now.AddDays(1);

            await _emailService.SendInterviewEmail(
                email,
                "Interview Scheduled",
                "Your interview is scheduled tomorrow."
            );

            await _smsService.SendSms(
                phone,
                "Interview scheduled tomorrow. Check email for details."
            );

            await _calendarService.CreateInterviewEvent(
                "Job Interview",
                interviewTime,
                "HireTax Interview Session"
            );

            return Ok("Interview Scheduled Successfully");
        }

        // =========================
        // EMAIL TEST ENDPOINT
        // =========================
        [HttpGet("test-email")]
        public async Task<IActionResult> TestEmail()
        {
            await _emailService.SendInterviewEmail(
                "your_test_email@gmail.com",
                "HireTax Test Email",
                "🎉 Email system is working successfully!"
            );

            return Ok("Test email sent successfully");
        }
    }
}