using Microsoft.EntityFrameworkCore;
using HireTax.API.Models;
namespace HireTax.API.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { }

        // මේවා තමයි Database එකේ හැදෙන Tables
        public DbSet<User> Users { get; set; }
        public DbSet<Role> Roles { get; set; }
    }
}