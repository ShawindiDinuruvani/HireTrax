using HireTax.API.Services.Interfaces;

namespace HireTax.API.Services.Notifications
{
    public class NotificationService
    {
        private readonly ISmsService _smsService;
        private readonly IEmailService _emailService;
        private readonly ICalendarService _calendarService;

        public NotificationService(
            ISmsService smsService,
            IEmailService emailService,
            ICalendarService calendarService)
        {
            _smsService = smsService;
            _emailService = emailService;
            _calendarService = calendarService;
        }

        public Task SendSms(string to, string message)
        {
            return _smsService.SendSmsAsync(to, message);
        }

        public Task SendEmail(string to, string subject, string message)
        {
            return _emailService.SendEmailAsync(to, subject, message);
        }

        public Task CreateInterviewEvent(string title, DateTime start, DateTime end)
        {
            return _calendarService.CreateEventAsync(title, start, end);
        }
    }
}