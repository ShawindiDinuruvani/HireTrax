using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using HireTax.API.Data; // මෙන්න මේක අනිවාර්යයෙන්ම තියෙන්න ඕනේ

namespace HireTax.API.Data
{
    public class DesignTimeDbContextFactory : IDesignTimeDbContextFactory<ApplicationDbContext>
    {
        public ApplicationDbContext CreateDbContext(string[] args)
        {
            Console.WriteLine("--- Factory එක වැඩ කරනවා ---");
            var optionsBuilder = new DbContextOptionsBuilder<ApplicationDbContext>();

            var connectionString = "Server=localhost;Database=HireTaxDb;User=root;Password=Franklin@12345;AllowPublicKeyRetrieval=True;SslMode=None;";

            optionsBuilder.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString));

            return new ApplicationDbContext(optionsBuilder.Options);
        }
    }
}