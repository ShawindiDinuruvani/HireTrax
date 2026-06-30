namespace HireTax.API.Services.Interfaces;

public interface ICalendarService
{
    Task CreateInterviewEvent(string title, DateTime startTime, string description);
}