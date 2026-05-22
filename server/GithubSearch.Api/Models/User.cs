using System.Text.Json.Serialization;

namespace GithubSearch.Api.Models
{
    public class User
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public string Username { get; set; } = string.Empty;
        
        [JsonIgnore]
        public string PasswordHash { get; set; } = string.Empty;

        // Navigation property for EF Core
        [JsonIgnore]
        public ICollection<Bookmark> Bookmarks { get; set; } = new List<Bookmark>();
    }
}
