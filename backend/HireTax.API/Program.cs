using HireTax.API.Repositories.Interfaces;
using HireTax.API.Repositories.Implementations;
using Microsoft.EntityFrameworkCore;
using HireTax.API.Data;
<<<<<<< HEAD
using System;
var builder = WebApplication.CreateBuilder(args);
=======
>>>>>>> main

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

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();

app.Run();