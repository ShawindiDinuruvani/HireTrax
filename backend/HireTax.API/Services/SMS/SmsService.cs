using Twilio;
using Twilio.Rest.Api.V2010.Account;
using Twilio.Types;
using HireTax.API.Services.Interfaces;
using Microsoft.Extensions.Configuration;

namespace HireTax.API.Services.SMS;

public class SmsService : ISmsService
{
    private readonly IConfiguration _configuration;

    public SmsService(IConfiguration configuration)
    {
        _configuration = configuration;

        var accountSid = _configuration["Twilio:AccountSid"];
        var authToken = _configuration["Twilio:AuthToken"];

        TwilioClient.Init(accountSid, authToken);
    }

    public async Task SendSms(string toNumber, string message)
    {
        var fromNumber = _configuration["Twilio:FromNumber"];

        await MessageResource.CreateAsync(
            body: message,
            from: new PhoneNumber(fromNumber),
            to: new PhoneNumber(toNumber)
        );

        Console.WriteLine($"SMS sent to {toNumber}");
    }
}