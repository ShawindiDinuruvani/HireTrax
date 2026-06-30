using System.Threading.Tasks;

namespace HireTax.API.Services.Interfaces
{
    public interface IEmailService
    {
        Task SendEmailAsync(string to, string subject, string message);
    }
}