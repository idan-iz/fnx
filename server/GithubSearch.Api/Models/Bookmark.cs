using System.Text.Json.Serialization;

namespace GithubSearch.Api.Models
{
    public class Bookmark
    {
        // Globally Unique Identifier
        public Guid Id { get; set; } = Guid.NewGuid();
        
        // The unique GitHub repo ID (number)
        public long RepoId { get; set; }
        
        public string Name { get; set; } = string.Empty;
        public string FullName { get; set; } = string.Empty;
        public string OwnerAvatarUrl { get; set; } = string.Empty;
        public string HtmlUrl { get; set; } = string.Empty;
        public string? Description { get; set; }
        public int StargazersCount { get; set; }
        public int ForksCount { get; set; }

        // Relationship mapping
        public Guid UserId { get; set; }
        
        [JsonIgnore]
        public User? User { get; set; }
    }
}
