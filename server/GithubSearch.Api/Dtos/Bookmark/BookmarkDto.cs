using System.Text.Json.Serialization;

namespace GithubSearch.Api.Dtos.Bookmark
{
    public class BookmarkOwnerDto
    {
        [JsonPropertyName("avatar_url")]
        public string AvatarUrl { get; set; } = string.Empty;
    }

    public class BookmarkDto
    {
        [JsonPropertyName("id")]
        public long Id { get; set; }

        [JsonPropertyName("name")]
        public string Name { get; set; } = string.Empty;

        [JsonPropertyName("full_name")]
        public string FullName { get; set; } = string.Empty;

        [JsonPropertyName("owner")]
        public BookmarkOwnerDto Owner { get; set; } = new();

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
