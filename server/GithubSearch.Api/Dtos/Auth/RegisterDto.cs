using System.ComponentModel.DataAnnotations;

namespace GithubSearch.Api.Dtos.Auth
{
    public class RegisterDto
    {
        [Required]
        [MinLength(3), MaxLength(20)]
        public string Username { get; set; } = string.Empty;

        [Required]
        [MinLength(3), MaxLength(20)]
        public string Password { get; set; } = string.Empty;
    }
}
