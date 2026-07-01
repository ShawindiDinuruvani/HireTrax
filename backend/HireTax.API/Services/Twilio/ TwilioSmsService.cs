using System;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using Twilio;
using Twilio.Rest.Api.V2010.Account;
using Twilio.Types;
using HireTax.API.Services.Interfaces;

namespace HireTax.API.Services.Twilio
{
    public class TwilioSmsService : ISmsService
    {
        private readonly IConfiguration _config;

        public TwilioSmsService(IConfiguration config)
        {
            _config = config;
        }

        public async Task SendSmsAsync(string to, string message)
        {
            var accountSid = _config.GetValue<string>("Twilio:AccountSid");
            var authToken = _config.GetValue<string>("Twilio:AuthToken");
            var fromNumber = _config.GetValue<string>("Twilio:FromNumber");

            if (string.IsNullOrWhiteSpace(accountSid) ||
                string.IsNullOrWhiteSpace(authToken) ||
                string.IsNullOrWhiteSpace(fromNumber))
            {
                throw new Exception("Twilio configuration missing in appsettings");
            }

            TwilioClient.Init(accountSid.Trim(), authToken.Trim());

            var result = await MessageResource.CreateAsync(
                body: message,
                from: new PhoneNumber(fromNumber),
                to: new PhoneNumber(to)
            );

            Console.WriteLine($"SMS Sent Successfully. SID: {result.Sid}");
        }
    }
}