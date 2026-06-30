using System;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using SendGrid;
using SendGrid.Helpers.Mail;
using HireTax.API.Services.Interfaces;

namespace HireTax.API.Services.Email
{
    public class SendGridEmailService : IEmailService
    {
        private readonly IConfiguration _config;

        public SendGridEmailService(IConfiguration config)
        {
            _config = config;
        }

        public async Task SendEmailAsync(string to, string subject, string message)
        {
            var apiKey = _config["SendGrid:ApiKey"];

            if (string.IsNullOrWhiteSpace(apiKey))
            {
                throw new Exception("SendGrid API Key is missing in configuration.");
            }

            var fromEmail = _config["SendGrid:FromEmail"];

            if (string.IsNullOrWhiteSpace(fromEmail))
            {
                throw new Exception("SendGrid FromEmail is missing in configuration.");
            }

            var client = new SendGridClient(apiKey);

            var from = new EmailAddress(fromEmail, "HireTax");
            var toEmail = new EmailAddress(to);

            var msg = MailHelper.CreateSingleEmail(
                from,
                toEmail,
                subject,
                message,
                message
            );

            var response = await client.SendEmailAsync(msg);

            if (response == null || !response.IsSuccessStatusCode)
            {
                throw new Exception("SendGrid email sending failed.");
            }
        }
    }
}