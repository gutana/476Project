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

    public bool SchoolExists(SchoolDto resp)
    {
        var school = Schools.FirstOrDefault(u => u.SchoolName == resp.SchoolName
        && u.Region == resp.Region && u.SchoolType == resp.SchoolType);
        return school != default;
    }

    public bool CreateSchool(SchoolDto resp, string posterId)
    {
        try
        {
            School school = new();
            school.Id = Guid.NewGuid().ToString();
            school.SchoolName = resp.SchoolName;
            school.Address = resp.Address;
            school.City = resp.City;
            school.Region = resp.Region;
            school.PhoneNumber = resp.PhoneNumber;
            school.SchoolType = resp.SchoolType;
            school.PostalCode = resp.PostalCode;
            school.PosterId = posterId;
            Schools.Add(school);
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
