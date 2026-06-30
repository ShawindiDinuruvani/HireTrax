using System.ComponentModel.DataAnnotations;

namespace HireTax.API.Models
{
    public class Role
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string Name { get; set; } = string.Empty; 
    }
}