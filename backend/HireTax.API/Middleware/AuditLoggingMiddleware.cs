using System.Security.Claims;
using HireTax.API.Data;
using HireTax.API.Models;

namespace HireTax.API.Middleware
{
    /// <summary>
    /// Middleware that automatically records every mutating API request
    /// (POST, PUT, DELETE) to the AuditLogs table after the response is sent.
    /// GET requests are intentionally excluded to avoid log noise.
    /// </summary>
    public class AuditLoggingMiddleware
    {
        private readonly RequestDelegate _next;

        public AuditLoggingMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task InvokeAsync(HttpContext context, ApplicationDbContext db)
        {
            // Only log state-changing requests
            var method = context.Request.Method;
            bool shouldLog = method == "POST" || method == "PUT" || method == "DELETE";

            // Execute the request first
            await _next(context);

            if (!shouldLog) return;

            try
            {
                // Extract user info from JWT claims
                var userId = 0;
                var userEmail = "anonymous";
                var userRole = "none";

                if (context.User?.Identity?.IsAuthenticated == true)
                {
                    var idClaim = context.User.FindFirstValue(ClaimTypes.NameIdentifier);
                    var emailClaim = context.User.FindFirstValue(ClaimTypes.Email);
                    var roleClaim = context.User.FindFirstValue(ClaimTypes.Role);

                    if (idClaim != null) int.TryParse(idClaim, out userId);
                    if (emailClaim != null) userEmail = emailClaim;
                    if (roleClaim != null) userRole = roleClaim;
                }

                // Build a readable action label from method + path
                var path = context.Request.Path.Value ?? "/";
                var action = BuildActionLabel(method, path);

                var log = new AuditLog
                {
                    UserId = userId,
                    UserEmail = userEmail,
                    UserRole = userRole,
                    Action = action,
                    EntityType = ExtractEntityType(path),
                    Details = $"{method} {path}",
                    HttpMethod = method,
                    Endpoint = path,
                    StatusCode = context.Response.StatusCode,
                    Timestamp = DateTime.UtcNow
                };

                db.AuditLogs.Add(log);
                await db.SaveChangesAsync();
            }
            catch
            {
                // Never let logging failure crash the main request
            }
        }

        private static string BuildActionLabel(string method, string path)
        {
            var segments = path.Trim('/').Split('/');
            // e.g. api/jobs -> "Job Created"
            // e.g. api/applications/5/status -> "Application Status Updated"
            var entity = segments.Length >= 2 ? Capitalise(segments[1].TrimEnd('s')) : "Record";

            return method switch
            {
                "POST"   => path.Contains("login")    ? "User Login"
                          : path.Contains("register") ? "User Registered"
                          : $"{entity} Created",
                "PUT"    => path.Contains("status")   ? $"{entity} Status Updated"
                          : path.Contains("ai-score") ? "AI Score Computed"
                          : path.Contains("role")     ? "User Role Changed"
                          : $"{entity} Updated",
                "DELETE" => $"{entity} Deleted",
                _        => $"{entity} Action"
            };
        }

        private static string ExtractEntityType(string path)
        {
            var segments = path.Trim('/').Split('/');
            return segments.Length >= 2 ? Capitalise(segments[1].TrimEnd('s')) : "Unknown";
        }

        private static string Capitalise(string s)
            => string.IsNullOrEmpty(s) ? s : char.ToUpper(s[0]) + s[1..];
    }

    // Extension method for clean registration in Program.cs
    public static class AuditLoggingMiddlewareExtensions
    {
        public static IApplicationBuilder UseAuditLogging(this IApplicationBuilder app)
            => app.UseMiddleware<AuditLoggingMiddleware>();
    }
}
