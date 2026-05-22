using GithubSearch.Api.Services.Interfaces;

namespace GithubSearch.Api.Services
{
    public class GitHubService : IGitHubService
    {
        private readonly HttpClient _httpClient;

        public GitHubService(HttpClient httpClient)
        {
            _httpClient = httpClient;
        }

        public async Task<string> SearchRepositoriesAsync(string query)
        {
            if (string.IsNullOrWhiteSpace(query))
            {
                return "{\"total_count\":0,\"incomplete_results\":false,\"items\":[]}";
            }

            var requestUrl = $"https://api.github.com/search/repositories?q={Uri.EscapeDataString(query)}&per_page=100";

            var request = new HttpRequestMessage(HttpMethod.Get, requestUrl);
            
            // GitHub API strictly requires a User-Agent header
            request.Headers.Add("User-Agent", "GithubSearchProxy");

            var response = await _httpClient.SendAsync(request);
            response.EnsureSuccessStatusCode();

            return await response.Content.ReadAsStringAsync();
        }
    }
}
