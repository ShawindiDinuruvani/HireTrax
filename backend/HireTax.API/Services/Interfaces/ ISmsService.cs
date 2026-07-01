using System.Threading.Tasks;

namespace HireTax.API.Services.Interfaces
{
    public interface ISmsService
    {
        Task SendSmsAsync(string to, string message);
    }
}