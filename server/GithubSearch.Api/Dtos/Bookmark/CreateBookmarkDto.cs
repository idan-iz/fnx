using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace GithubSearch.Api.Dtos.Bookmark
{
    public class CreateBookmarkOwnerDto
    {
        [Required]
        [JsonPropertyName("avatar_url")]
        public string AvatarUrl { get; set; } = string.Empty;
    }

    public class CreateBookmarkDto
    {
        [Required]
        [JsonPropertyName("id")]
        public long Id { get; set; } // Repository ID
        
        [Required]
        [JsonPropertyName("name")]
        public string Name { get; set; } = string.Empty;

        [Required]
        [JsonPropertyName("full_name")]
        public string FullName { get; set; } = string.Empty;

        [Required]
        [JsonPropertyName("owner")]
        public CreateBookmarkOwnerDto Owner { get; set; } = new();

        [Required]
        [JsonPropertyName("html_url")]
        public string HtmlUrl { get; set; } = string.Empty;

        [JsonPropertyName("description")]
        public string? Description { get; set; }

        [JsonPropertyName("stargazers_count")]
        public int StargazersCount { get; set; }

        [JsonPropertyName("forks_count")]
        public int ForksCount { get; set; }
    }
}
