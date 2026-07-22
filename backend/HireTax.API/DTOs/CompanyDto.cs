using System.ComponentModel.DataAnnotations;

namespace HireTax.API.DTOs
{
    public class CreateCompanyDto
    {
        [Required]
        public string Name { get; set; } = string.Empty;

        public string Industry { get; set; } = string.Empty;

        [EmailAddress]
        public string ContactEmail { get; set; } = string.Empty;
    }
}
