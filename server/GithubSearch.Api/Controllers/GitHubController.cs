using GithubSearch.Api.Services.Interfaces;
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

        [HttpGet("search")]
        public async Task<IActionResult> Search([FromQuery] string q)
        {
            if (string.IsNullOrWhiteSpace(q))
            {
                return BadRequest(new { Message = "Query parameter 'q' is required." });
            }

            try
            {
                var jsonResult = await _gitHubService.SearchRepositoriesAsync(q);
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
