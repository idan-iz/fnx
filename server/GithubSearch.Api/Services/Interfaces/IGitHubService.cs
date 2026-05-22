namespace GithubSearch.Api.Services.Interfaces
{
    public interface IGitHubService
    {
        Task<string> SearchRepositoriesAsync(string query);
    }
}
