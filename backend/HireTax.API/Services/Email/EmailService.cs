using HireTax.API.Services.Interfaces;
using Microsoft.Extensions.Configuration;
using SendGrid;
using SendGrid.Helpers.Mail;

namespace HireTax.API.Services.Email;

public class EmailService : IEmailService
{
    private readonly IConfiguration _configuration;

    public EmailService(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    public async Task SendInterviewEmail(string toEmail, string subject, string body)
    {
        var apiKey = _configuration["SendGrid:ApiKey"];
        var fromEmail = _configuration["SendGrid:FromEmail"];

        if (string.IsNullOrEmpty(apiKey))
            throw new Exception("SendGrid ApiKey missing in appsettings.json");

        if (string.IsNullOrEmpty(fromEmail))
            throw new Exception("SendGrid FromEmail missing in appsettings.json");

        var client = new SendGridClient(apiKey);

        var from = new EmailAddress(fromEmail, "HireTax System");
        var to = new EmailAddress(toEmail);

        var msg = MailHelper.CreateSingleEmail(from, to, subject, body, body);

        var response = await client.SendEmailAsync(msg);

        Console.WriteLine($"Email Status: {response.StatusCode}");
    }
}