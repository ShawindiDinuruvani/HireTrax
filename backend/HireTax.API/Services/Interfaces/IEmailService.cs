namespace HireTax.API.Services.Interfaces;

public interface IEmailService
{
    Task SendInterviewEmail(string toEmail, string subject, string body);
}