using api.DTO;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using System.Dynamic;

namespace api.Models;

public class ApplicationDbContext : IdentityDbContext<User>
{
    public DbSet<Post> Posts { get; set; }
    public DbSet<School> Schools { get; set; }

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

    public bool CreatePosting(CreatePostingDto dto, User user)
    {
        try
        {
            Post post = new();
            post.PosterId = user.Id;
            post.Id = Guid.NewGuid().ToString();
            post.PostTitle = dto.Title;
            post.PostDescription = dto.Description;
            Posts.Add(post);
            SaveChanges();
            return true;
        }
        catch
        {
            return false;
        }
    }

    public async Task<List<Post>> GetUserPosts(User user)
    {
        return await Posts
            .Where(post => post.PosterId == user.Id)
            .ToListAsync();
    }
}
