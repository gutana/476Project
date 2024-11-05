using api.DTO;
using Microsoft.AspNetCore.Identity;
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

    public async Task<User> FindUserById(string id)
    {
        return await Users
            .Include(user => user.School)
            .FirstAsync(user => user.Id == id);
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

    public bool CreateNewPosting(PostDtos dto, string userId)
    {
        try
        {
            Post post = new();
            
            var school = Schools.Where(s => s.Id == dto.SchoolId).FirstOrDefault();
            if (school == null || school == default)
                return false;
            
            post.Id = Guid.NewGuid().ToString();
            post.Poster = Users.First(poster => poster.Id == userId);
            post.School = school;
            post.SchoolType = school.SchoolType;
            post.PrimarySchoolSubjects = dto.PrimarySchoolSubjects;
            post.SecondarySchoolSubjects = dto.SecondarySchoolSubjects;
            post.Grades = dto.Grades;
            post.PostDescription = dto.PostDescription;
            if (post.RequestedSub != null)
                post.RequestedSub = Users.First(req => req.Id == dto.RequestedSub); 
            post.Private = dto.Private;
            post.PostDateTime = DateTime.UtcNow;    // need to change to accept date of absence rather than current date/time

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

    public async Task<List<School>> GetSchools(Region region)
    {
        return await Schools
            .Where(school => school.Region == region)
            .OrderBy(school => school.SchoolName)
            .ToListAsync();  
    }

    public async Task<List<School>> GetSchools()
    {
        return await Schools
            .ToListAsync();
    }

    public School? GetSchoolById(string schoolId)
    {
        return Schools
            .First(school => school.Id == schoolId);
    }

    public async Task<List<Post>> GetPostingsByUser(string userId)
    {
        return await Posts
            .Include(post => post.School)
            .Include(post => post.Poster)
            .Include(post => post.AcceptedByUser)
            .Where(post => post.Poster.Id == userId)
            .ToListAsync();
    }
    
    public async Task<List<Post>> GetAvailablePostings(User user)
    {
        return await Posts
            .Include(post => post.School)
            .Include(post => post.Poster)
            .Include(post => post.AcceptedByUser)
            .Where(post => 
                    post.AcceptedByUser == null &&
                    post.Poster.Id != user.Id &&
                    post.School.Region == user.Region &&
                    /* deal with dates whenever thats done */
                    (post.Private != true || (post.RequestedSub != null && post.RequestedSub.Id == user.Id) || post.PostDateTime < DateTime.UtcNow.AddMinutes(-5)))
            .OrderByDescending(post => post.PostDateTime)
            .ToListAsync();
    }
    
    public async Task<List<Post>> GetTakenPostings(User user)
    {
        return await Posts
            .Include(post => post.School)
            .Include(post => post.Poster)
            .Include (post => post.AcceptedByUser)
            .Where(post => (post.AcceptedByUser != null && post.AcceptedByUser.Id == user.Id))
            .OrderByDescending(post => post.PostDateTime)
            .ToListAsync();
    }

    public async Task<List<Post>> GetAllPostings()
    {
        return await Posts
            .Include(post => post.School)
            .Include(post => post.Poster)
            .Include(post => post.AcceptedByUser)
            .OrderByDescending(post => post.PostDateTime)
            .ToListAsync();
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
