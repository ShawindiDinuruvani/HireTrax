using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace HireTax.API.Migrations
{
    /// <inheritdoc />
    public partial class UpdateAdminCredentials : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "Email", "PasswordHash" },
                values: new object[] { "admin@gmail.com", "$2a$11$i/comMbNp61CtUqwcg7wluilhQUihggr44zT1cjb.3lUso1/Br1wu" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "Email", "PasswordHash" },
                values: new object[] { "admin@hiretrax.io", "$2b$11$lxlyB6c.32/vNL/Yv6U0Eu1QoYlwmHwJIn1WAoQ66MY1g7kSSpQPW" });
        }
    }
}
