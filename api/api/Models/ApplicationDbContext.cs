using api.DTO;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace api.Models;

public class ApplicationDbContext : IdentityDbContext<User>
{
    public DbSet<Post> Posts { get; set; }
    public DbSet<School> Schools { get; set; }
    public DbSet<NewsPost> NewsPosts { get; set; }

    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
       
    }

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        builder.Entity<User>().Property(u => u.FirstName).HasMaxLength(32);
        builder.Entity<User>().Property(u => u.LastName).HasMaxLength(32);

        builder.HasDefaultSchema("identity");
    }

    public bool CreateNewsPost(CreateNewsPostDto dto)
    {
        try
        {
            NewsPost post = new();
            post.Id = Guid.NewGuid().ToString();
            post.PostDate = DateOnly.FromDateTime(DateTime.Now);
            post.Title = dto.Title;
            post.Content = dto.Content;
            NewsPosts?.Add(post);
            SaveChanges();
            return true; 
        }
        catch
        { 
            return false;
        }
    }

    public async Task<List<NewsPost>> GetLatestNews(int take)
    {
        return await NewsPosts
            .OrderByDescending(post => post.PostDate)
            .Take(take)
            .ToListAsync();
    }
}
