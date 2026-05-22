using System.Security.Claims;
using GithubSearch.Api.Data;
using GithubSearch.Api.Dtos.Bookmark;
using GithubSearch.Api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace GithubSearch.Api.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class BookmarksController : ControllerBase
    {
        private readonly AppDbContext _context;

        public BookmarksController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<BookmarkDto>>> GetBookmarks()
        {
            var userId = GetCurrentUserId();

            var bookmarks = await _context.Bookmarks
                .Where(b => b.UserId == userId)
                .Select(b => new BookmarkDto
                {
                    Id = b.RepoId,
                    Name = b.Name,
                    FullName = b.FullName,
                    Owner = new BookmarkOwnerDto { AvatarUrl = b.OwnerAvatarUrl },
                    HtmlUrl = b.HtmlUrl,
                    Description = b.Description,
                    StargazersCount = b.StargazersCount,
                    ForksCount = b.ForksCount
                })
                .ToListAsync();

            return Ok(bookmarks);
        }

        [HttpPost]
        public async Task<IActionResult> AddBookmark([FromBody] CreateBookmarkDto dto)
        {
            var userId = GetCurrentUserId();

            // Check if already bookmarked by the user
            var existingBookmark = await _context.Bookmarks
                .FirstOrDefaultAsync(b => b.UserId == userId && b.RepoId == dto.Id);

            if (existingBookmark != null)
            {
                return BadRequest(new { Message = "Repository is already bookmarked." });
            }

            var bookmark = new Bookmark
            {
                RepoId = dto.Id,
                Name = dto.Name,
                FullName = dto.FullName,
                OwnerAvatarUrl = dto.Owner.AvatarUrl,
                HtmlUrl = dto.HtmlUrl,
                Description = dto.Description,
                StargazersCount = dto.StargazersCount,
                ForksCount = dto.ForksCount,
                UserId = userId
            };

            _context.Bookmarks.Add(bookmark);
            await _context.SaveChangesAsync();

            var responseDto = new BookmarkDto
            {
                Id = bookmark.RepoId,
                Name = bookmark.Name,
                FullName = bookmark.FullName,
                Owner = new BookmarkOwnerDto { AvatarUrl = bookmark.OwnerAvatarUrl },
                HtmlUrl = bookmark.HtmlUrl,
                Description = bookmark.Description,
                StargazersCount = bookmark.StargazersCount,
                ForksCount = bookmark.ForksCount
            };

            return CreatedAtAction(nameof(GetBookmarks), responseDto);
        }

        [HttpDelete("{repoId}")]
        public async Task<IActionResult> RemoveBookmark(long repoId)
        {
            var userId = GetCurrentUserId();

            var bookmark = await _context.Bookmarks
                .FirstOrDefaultAsync(b => b.UserId == userId && b.RepoId == repoId);

            if (bookmark == null)
            {
                return NotFound(new { Message = "Bookmark not found." });
            }

            _context.Bookmarks.Remove(bookmark);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private Guid GetCurrentUserId()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null || !Guid.TryParse(userIdClaim.Value, out var userId))
            {
                throw new UnauthorizedAccessException("User is not authenticated.");
            }
            return userId;
        }
    }
}
