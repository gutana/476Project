using api.DTO;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Npgsql.PostgresTypes;
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
            post.PosterName = user.FirstName + " " + user.LastName;
            post.PostDateOfAbsence = dto.DateOfAbsence;
            post.PostSchoolName = dto.SchoolName;
            post.PostSubjects = dto.Subjects;
            Posts.Add(post);
            SaveChanges();
            return true;
        }
        catch
        {
            return false;
        }
    }

    public bool CreateSchool(CreateSchoolDto dto)
    {
        try
        {
            School school = new();
            school.Id = Guid.NewGuid().ToString();
            school.Name = dto.Name;
            school.SchoolType = dto.SchoolType;
            school.PhoneNumber = dto.PhoneNumber;
            school.Address = dto.Address;
            school.City = dto.City;
            school.PostalCode = dto.PostalCode;
            school.Region = dto.Region;
            Schools.Add(school);
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

    public async Task<List<Post>> GetAllPosts(User user)
    {
        return await Posts
            .ToListAsync();
    }

    public async Task<List<School>> GetSchools(Region region)
    {
        {
            return await Schools
                .Where(school => school.Region == region)
                .ToListAsync();
        }
    }

    public async Task<School> GetSchoolById(Guid id)
    {
        return await Schools
            .FirstAsync(school => school.Id == id.ToString());
    }
}
