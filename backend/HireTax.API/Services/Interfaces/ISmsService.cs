namespace HireTax.API.Services.Interfaces;

public interface ISmsService
{
    Task SendSms(string toNumber, string message);
}