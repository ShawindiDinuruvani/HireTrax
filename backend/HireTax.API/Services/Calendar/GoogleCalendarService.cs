using Google.Apis.Calendar.v3;
using Google.Apis.Calendar.v3.Data;
using Google.Apis.Services;
using Google.Apis.Auth.OAuth2;
using Microsoft.Extensions.Configuration;
using HireTax.API.Services.Interfaces;

namespace HireTax.API.Services.Calendar;

public class GoogleCalendarService : ICalendarService
{
    private readonly CalendarService _calendar;

    public GoogleCalendarService(IConfiguration config)
    {
        var accessToken = config["GoogleCalendar:AccessToken"];

        _calendar = new CalendarService(new BaseClientService.Initializer()
        {
            HttpClientInitializer = !string.IsNullOrEmpty(accessToken)
                ? GoogleCredential.FromAccessToken(accessToken)
                : null,

            ApplicationName = "HireTrax"
        });
    }

    public async Task CreateInterviewEvent(string title, DateTime startTime, string description)
    {
        var ev = new Event
        {
            Summary = title,
            Description = description,
            Location = "Online Interview",

            Start = new EventDateTime
            {
                DateTimeDateTimeOffset = startTime,
                TimeZone = "Asia/Colombo"
            },

            End = new EventDateTime
            {
                DateTimeDateTimeOffset = startTime.AddHours(1),
                TimeZone = "Asia/Colombo"
            }
        };

        var request = _calendar.Events.Insert(ev, "primary");
        await request.ExecuteAsync();
    }
}