using System.Text.Json.Serialization;

namespace GithubSearch.Api.Dtos.GitHub
{
    public class SearchRequestDto
    {
        [JsonPropertyName("query")]
        public string Query { get; set; }
    }
}
