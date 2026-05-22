using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using GithubSearch.Api.Data;
using GithubSearch.Api.Dtos.Auth;
using GithubSearch.Api.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

namespace GithubSearch.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IConfiguration _configuration;
        private readonly PasswordHasher<User> _passwordHasher;

        public AuthController(AppDbContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
            _passwordHasher = new PasswordHasher<User>();
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterDto dto)
        {
            if (await _context.Users.AnyAsync(u => u.Username.ToLower() == dto.Username.ToLower()))
            {
                return BadRequest(new { Message = "Username is already taken." });
            }

            var user = new User
            {
                Username = dto.Username
            };

            // Secure PBKDF2 salted hash using ASP.NET Core identity standards
            user.PasswordHash = _passwordHasher.HashPassword(user, dto.Password);

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return Ok(new { Message = "Registration successful!" });
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto dto)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Username.ToLower() == dto.Username.ToLower());
            if (user == null)
            {
                return Unauthorized(new { Message = "Invalid username or password." });
            }

            var verificationResult = _passwordHasher.VerifyHashedPassword(user, user.PasswordHash, dto.Password);
            if (verificationResult == PasswordVerificationResult.Failed)
            {
                return Unauthorized(new { Message = "Invalid username or password." });
            }

            var token = GenerateJwtToken(user);

            return Ok(new AuthResponseDto
            {
                Token = token,
                Username = user.Username
            });
        }

        private string GenerateJwtToken(User user)
        {
            var jwtSettings = _configuration.GetSection("Jwt");
            var secretKey = jwtSettings["Secret"] ?? "SuperSecureGithubSearchSecretKey1234567890!!!";
            var issuer = jwtSettings["Issuer"] ?? "GithubSearchBackend";
            var audience = jwtSettings["Audience"] ?? "GithubSearchFrontend";
            var expiryMinutes = double.Parse(jwtSettings["ExpiryInMinutes"] ?? "180");

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Name, user.Username),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
            };

            var token = new JwtSecurityToken(
                issuer: issuer,
                audience: audience,
                claims: claims,
                expires: DateTime.UtcNow.AddMinutes(expiryMinutes),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
