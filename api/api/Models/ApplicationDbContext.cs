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

    public bool CreateNewPosting(PostDTO dto, string userId)
    {
        try
        {
            Post post = new();
            DateTime now = DateTime.Now;
            
            var school = Schools.Where(s => s.Id == dto.SchoolId).FirstOrDefault();
            if (school == null || school == default)
                return false;
            
            post.Id = Guid.NewGuid().ToString();
            post.PosterId = userId;
            post.SchoolId = school.Id;
            post.SchoolType = school.SchoolType;
            post.PrimarySchoolSubjects = dto.PrimarySchoolSubjects;
            post.SecondarySchoolSubjects = dto.SecondarySchoolSubjects;
            post.Grades = dto.Grades;
            post.PostDescription = dto.PostDescription;
            post.RequestedSub = dto.RequestedSub;
            post.Private = dto.Private;
            post.PostDate = DateOnly.FromDateTime(now);
            post.PostTime = TimeOnly.FromDateTime(now);

            Posts.Add(post);
            SaveChanges();
            return true;
        } catch
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
    public async Task<List<Post>> GetPostings(string userId)
    {
        var currentPostings = await Posts.Where(post => post.Private == false).OrderByDescending(post => post.PostDate.Value.ToDateTime(post.PostTime.Value)).ToListAsync();
        var newPostings = await GetNewPostings();
        var privatePostings = await GetPrivatePostings(userId);
        var publicPostings = currentPostings.Union(newPostings).OrderByDescending(post => post.PostDate.Value.ToDateTime(post.PostTime.Value)).ToList();
        var postings = privatePostings.Concat(publicPostings).ToList() ?? [];
        return postings;
    }

    public async Task<List<Post>> GetPrivatePostings(string userId)
    {
        var privatePostings = await Posts.Where(post => post.Private == true && post.RequestedSub == userId).ToListAsync();
        return privatePostings.OrderByDescending(post => post.PostDate.Value.ToDateTime(post.PostTime.Value)).ToList() ?? [];
    }

    public async Task<List<Post>> GetNewPostings()
    {
        var privatePostings = await Posts.Where(post => post.Private == true).ToListAsync();
        var newPosts = new List<Post>();

        foreach (var posting in privatePostings)
        {
            if (posting.PostDate == null || posting.PostTime == null)
                continue;

            var timeOnly = posting.PostTime.Value;
            var cutoffTime = posting.PostDate.Value.ToDateTime(timeOnly).AddMinutes(5);
            if (DateTime.Now > cutoffTime)
            {
                posting.Private = false;
                posting.RequestedSub = null;
                newPosts.Add(posting);
                Posts.Update(posting);
            }
        }

        SaveChanges();
        return newPosts.OrderByDescending(post => post.PostDate.Value.ToDateTime(post.PostTime.Value)).ToList() ?? [];
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
