using Microsoft.Extensions.Configuration;
using Twilio;
using Twilio.Rest.Api.V2010.Account;
using Twilio.Types;

public class TwilioSmsService : ISmsService
{
    private readonly IConfiguration _config;

    public TwilioSmsService(IConfiguration config)
    {
        _config = config;
    }

    public async Task SendSmsAsync(string to, string message)
    {
        var accountSid = _config["Twilio:AccountSid"];
        var authToken = _config["Twilio:AuthToken"];
        var fromNumber = _config["Twilio:FromNumber"];

        TwilioClient.Init(accountSid, authToken);

        await MessageResource.CreateAsync(
            body: message,
            from: new PhoneNumber(fromNumber),
            to: new PhoneNumber(to)
        );
    }
}