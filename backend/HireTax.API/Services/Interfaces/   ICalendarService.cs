using System;
using System.Threading.Tasks;

namespace HireTax.API.Services.Interfaces
{
    public interface ICalendarService
    {
        Task CreateEventAsync(string title, DateTime start, DateTime end);
    }
}