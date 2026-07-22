using Microsoft.EntityFrameworkCore;
using HireTax.API.Models;

namespace HireTax.API.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { }

        // Tables
        public DbSet<Company> Companies { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<Role> Roles { get; set; }
        public DbSet<Job> Jobs { get; set; }
        public DbSet<CandidateProfile> CandidateProfiles { get; set; }
        public DbSet<Application> Applications { get; set; }
        public DbSet<Interview> Interviews { get; set; }
        public DbSet<Evaluation> Evaluations { get; set; }
        public DbSet<AuditLog> AuditLogs { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Seed the 4 fixed roles on first migration
            // NOTE: role names here must exactly match what you use in
            // [Authorize(Roles = "...")] attributes on your controllers.
            modelBuilder.Entity<Role>().HasData(
                new Role { Id = 1, Name = "candidate" },
                new Role { Id = 2, Name = "recruiter" },
                new Role { Id = 3, Name = "hiring_manager" },
                new Role { Id = 4, Name = "admin" },
                new Role { Id = 5, Name = "company_admin" }
            );

            // Seed a default admin user (password: Admin@123)
            // IMPORTANT: BCrypt.HashPassword() generates a new random salt every
            // time it's called. If it's called inside OnModelCreating, EF Core
            // sees a "changed" seed value on every model build and keeps wanting
            // to generate new migrations / can throw pending-model-changes errors.
            // So the hash below is PRE-COMPUTED ONCE and hardcoded as a literal.
            // (Generated for "Admin@123" — do not regenerate this at runtime.)
            modelBuilder.Entity<User>().HasData(
                new User
                {
                    Id = 1,
                    Email = "admin@gmail.com",
                    PasswordHash = "$2a$11$i/comMbNp61CtUqwcg7wluilhQUihggr44zT1cjb.3lUso1/Br1wu",
                    RoleId = 4
                }
            );

            // User → Company (optional FK — candidates have null CompanyId)
            modelBuilder.Entity<User>()
                .HasOne(u => u.Company)
                .WithMany(c => c.Users)
                .HasForeignKey(u => u.CompanyId)
                .OnDelete(DeleteBehavior.SetNull)
                .IsRequired(false);

            // Prevent cascade delete issues
            modelBuilder.Entity<Application>()
                .HasOne(a => a.Job)
                .WithMany()
                .HasForeignKey(a => a.JobId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Application>()
                .HasOne(a => a.Candidate)
                .WithMany()
                .HasForeignKey(a => a.CandidateId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Interview>()
                .HasOne(i => i.Application)
                .WithMany()
                .HasForeignKey(i => i.ApplicationId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Evaluation>()
                .HasOne(e => e.Application)
                .WithMany()
                .HasForeignKey(e => e.ApplicationId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}