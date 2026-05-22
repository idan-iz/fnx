using GithubSearch.Api.Services.Interfaces;
using GithubSearch.Api.Dtos.GitHub;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace GithubSearch.Api.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class GitHubController : ControllerBase
    {
        private readonly IGitHubService _gitHubService;

        public GitHubController(IGitHubService gitHubService)
        {
            _gitHubService = gitHubService;
        }

        [HttpPost("search")]
        public async Task<IActionResult> Search([FromBody] SearchRequestDto dto)
        {
            if (dto == null || string.IsNullOrWhiteSpace(dto.Query))
            {
                return BadRequest(new { Message = "Query parameter 'query' is required." });
            }

            try
            {
                var jsonResult = await _gitHubService.SearchRepositoriesAsync(dto.Query);
                // Return as raw application/json response directly to the client
                return Content(jsonResult, "application/json");
            }
            catch (HttpRequestException ex)
            {
                return StatusCode(502, new { Message = "Error calling GitHub API.", Details = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = "An unexpected error occurred.", Details = ex.Message });
            }
        }
    }
}
