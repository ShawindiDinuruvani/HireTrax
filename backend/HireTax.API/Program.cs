using HireTax.API.Repositories.Interfaces;
using HireTax.API.Repositories.Implementations;
using Microsoft.EntityFrameworkCore;
using HireTax.API.Data;

using System;
var builder = WebApplication.CreateBuilder(args);


// --- JWT Authentication Configuration (Added by Malshi) ---
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

//Core Services Setup (Repository & Controllers)
builder.Services.AddScoped(typeof(IGenericRepository<>), typeof(GenericRepository<>));

// Add services to the container.


var builder = WebApplication.CreateBuilder(args);

builder.Services.AddScoped(typeof(IGenericRepository<>), typeof(GenericRepository<>));

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
if (string.IsNullOrEmpty(connectionString))
{
    throw new InvalidOperationException("Connection string 'DefaultConnection' not found.");
}

var serverVersion = new MySqlServerVersion(new Version(8, 0, 33)); 



builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseMySql(connectionString, serverVersion));

// 🔒 1. JWT Authentication Setup (Added by Malshi)

var jwtKey = builder.Configuration["Jwt:Key"] ?? "SuperSecretKeyThatIsVeryLongAndSecure12345!";
var Key = Encoding.UTF8.GetBytes(jwtKey);

builder.Services.AddAuthentication(options =>

if (app.Environment.IsDevelopment())

{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = builder.Configuration["Jwt:Issuer"],
        ValidAudience = builder.Configuration["Jwt:Audience"],
        IssuerSigningKey = new SymmetricSecurityKey(Key)
    };
});



    var app = builder.Build();

    // Configure the HTTP request pipeline.
    if (app.Environment.IsDevelopment())
    {
        app.UseSwagger();
        app.UseSwaggerUI();
    }

    app.UseHttpsRedirection();


    //  2. Authentication Middleware (Added by Malshi)

    app.UseAuthentication(); //WHO YOU ARE

   

    app.UseAuthorization(); //WHAT YOU CAN DO

app.MapControllers();

    app.Run();

app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();

app.Run();

