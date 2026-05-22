using GithubSearch.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace GithubSearch.Api.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        public DbSet<User> Users => Set<User>();
        public DbSet<Bookmark> Bookmarks => Set<Bookmark>();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Configure User Username as unique
            modelBuilder.Entity<User>()
                .HasIndex(u => u.Username)
                .IsUnique();

            // Configure Bookmarks unique constraint per User per RepoId
            modelBuilder.Entity<Bookmark>()
                .HasIndex(b => new { b.UserId, b.RepoId })
                .IsUnique();

            // Configure User -> Bookmarks relationship
            modelBuilder.Entity<Bookmark>()
                .HasOne(b => b.User)
                .WithMany(u => u.Bookmarks)
                .HasForeignKey(b => b.UserId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
