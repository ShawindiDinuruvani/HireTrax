using Microsoft.AspNetCore.Mvc;
using System.Net.Http;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace HireTax.Controllers
{
    [ApiController]
    [Route("api/google")]
    public class GoogleController : ControllerBase
    {
        private readonly IConfiguration _config;

        public GoogleController(IConfiguration config)
        {
            _config = config;
        }

        [HttpGet("login")]
        public IActionResult GoogleLogin()
        {
            var clientId = _config["GoogleCalendar:ClientId"];
            var redirectUri = _config["GoogleCalendar:RedirectUri"];

            var url =
                "https://accounts.google.com/o/oauth2/v2/auth" +
                "?client_id=" + clientId +
                "&redirect_uri=" + redirectUri +
                "&response_type=code" +
                "&scope=https://www.googleapis.com/auth/calendar" +
                "&access_type=offline" +
                "&prompt=consent";

            return Redirect(url);
        }

        [HttpGet("oauth/callback")]
        public async Task<IActionResult> GoogleCallback(string code)
        {
            var clientId = _config["GoogleCalendar:ClientId"];
            var clientSecret = _config["GoogleCalendar:ClientSecret"];
            var redirectUri = _config["GoogleCalendar:RedirectUri"];

            var tokenClient = new HttpClient();

            var tokenResponse = await tokenClient.PostAsync(
                "https://oauth2.googleapis.com/token",
                new FormUrlEncodedContent(new Dictionary<string, string>
                {
                    { "code", code },
                    { "client_id", clientId },
                    { "client_secret", clientSecret },
                    { "redirect_uri", redirectUri },
                    { "grant_type", "authorization_code" }
                })
            );

            var json = await tokenResponse.Content.ReadAsStringAsync();

            return Ok(json);
        }
    }
}