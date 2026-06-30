using HireTax.API.Repositories.Interfaces;
using HireTax.API.Repositories.Implementations;
using HireTax.API.Data;
using Microsoft.EntityFrameworkCore;

// Services
using HireTax.API.Services.Interfaces;
using HireTax.API.Services.Email;
using HireTax.API.Services.SMS;
using HireTax.API.Services.Calendar;

var builder = WebApplication.CreateBuilder(args);

#region 🔹 Repository DI
builder.Services.AddScoped(typeof(IGenericRepository<>), typeof(GenericRepository<>));
#endregion

#region 🔹 Service DI (Email + SMS + Calendar Integration)
builder.Services.AddScoped<IEmailService, EmailService>();
builder.Services.AddScoped<ISmsService, SmsService>();
builder.Services.AddScoped<ICalendarService, GoogleCalendarService>();
#endregion

#region 🔹 Controllers
builder.Services.AddControllers();
#endregion

#region 🔹 Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
#endregion

#region 🔹 Database (MySQL)
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");

if (string.IsNullOrWhiteSpace(connectionString))
{
    throw new InvalidOperationException("Connection string 'DefaultConnection' not found.");
}

builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseMySql(
        connectionString,
        ServerVersion.AutoDetect(connectionString)
    )
);
#endregion

var app = builder.Build();

#region 🔹 Swagger UI (Dev only)
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
#endregion

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();