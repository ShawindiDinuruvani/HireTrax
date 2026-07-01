using Google.Apis.Calendar.v3;
using Google.Apis.Calendar.v3.Data;
using Google.Apis.Services;
using HireTax.API.Services.Interfaces;
using Microsoft.Extensions.Configuration;
using System;
using System.Threading.Tasks;

namespace HireTax.API.Services.Google
{
    public class GoogleCalendarService : ICalendarService
    {
        private readonly CalendarService _calendar;

        public GoogleCalendarService(IConfiguration config)
        {
            var apiKey = config["Google:ApiKey"];

            if (string.IsNullOrEmpty(apiKey))
            {
                throw new Exception("Google API Key is missing in configuration.");
            }

            _calendar = new CalendarService(new BaseClientService.Initializer()
            {
                ApiKey = apiKey,
                ApplicationName = "HireTax API"
            });
        }

        public async Task CreateEventAsync(string title, DateTime start, DateTime end)
        {
            var newEvent = new Event
            {
                Summary = title,
                Start = new EventDateTime
                {
                    DateTime = start,
                    TimeZone = "Asia/Colombo"
                },
                End = new EventDateTime
                {
                    DateTime = end,
                    TimeZone = "Asia/Colombo"
                }
            };

            await _calendar.Events.Insert(newEvent, "primary").ExecuteAsync();
        }
    }
}