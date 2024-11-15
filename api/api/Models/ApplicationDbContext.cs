using api.DTO;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace api.Models;

class PostingTakenException : Exception { public string getMessage() { return "Post has been taken."; } }

public class ApplicationDbContext : IdentityDbContext<User>
{
    public DbSet<Post> Posts { get; set; }
    public DbSet<School> Schools { get; set; }
    public DbSet<NewsPost> NewsPosts { get; set; }
    public DbSet<PrimarySchoolCourse> PrimarySchoolCourses { get; set; }
    public DbSet<SecondarySchoolCourse> SecondarySchoolCourses { get; set; }

    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
       
    }

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        builder.Entity<User>().Property(u => u.FirstName).HasMaxLength(32);
        builder.Entity<User>().Property(u => u.LastName).HasMaxLength(32);

        builder.Entity<PrimarySchoolCourse>(entity =>
        {
            entity.Property(e => e.startTime).IsRequired();
            entity.Property(e => e.endTime).IsRequired();
            entity.Property(e => e.grades).IsRequired();
            entity.Property(e => e.subject).IsRequired();
            entity.Property(e => e.location).IsRequired();
        }); 
        builder.Entity<SecondarySchoolCourse>(entity =>
        {
            entity.Property(e => e.startTime).IsRequired();
            entity.Property(e => e.endTime).IsRequired();
            entity.Property(e => e.grades).IsRequired();
            entity.Property(e => e.subject).IsRequired();
            entity.Property(e => e.location).IsRequired();
        });


        builder.Entity<PrimarySchoolCourse>()
            .HasOne(schedule => schedule.user)
            .WithMany(p => p.primarySchoolCourses);

        builder.Entity<SecondarySchoolCourse>()
            .HasOne(schedule => schedule.user)
            .WithMany(s => s.secondarySchoolCourses);

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

   
    public bool AcceptPosting(string postId, string userId)
    {

        Post? post = Posts
            .Where(p => p.Id == postId)
            .Include(p => p.AcceptedByUser)
            .FirstOrDefault();
        
        if (post == null) 
            return false;
        if (post.AcceptedByUser != null) 
            throw new PostingTakenException();
        
        User? user = Users
            .Where(u => u.Id == userId)
            .FirstOrDefault();

        post.AcceptedByUser = user;
        SaveChanges();

        return true;
    }
    
    public bool CancelPosting(string postId, string userId)
    {
        Post? post = Posts
            .Where(p => p.Id == postId)
            .Include(p => p.AcceptedByUser) // not sure if this is needed
            .FirstOrDefault();

        if (post == null)
            return false; // potentially want detailed error handling here

        User? user = Users
            .Where(u => u.Id == userId)
            .FirstOrDefault();

        if (user == null)
            return false; // potentially want detailed error handling here

        if (user.UserType == UserType.Teacher && user.Id == post.Poster.Id)
            Remove(post);
        else if (post.AcceptedByUser != null) {
            if ((user.UserType == UserType.Substitute && post.AcceptedByUser.Id == user.Id) || user.UserType == UserType.Administrator)
                post.AcceptedByUser = null; 
        }
        else
            return false;

        SaveChanges();
        return true;
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
    public async Task<bool> AddCourseToProfile(string userId, AddCourseToProfileRequest req)
    {
        try
        {
            var user = await Users
                .Include(user => user.primarySchoolCourses)
                .Include(user => user.secondarySchoolCourses)
                .FirstAsync(user => user.Id == userId);

            if (user == null) return false;

            if (req.secondarySchoolSubject != null)
            {
                user.secondarySchoolCourses ??= new List<SecondarySchoolCourse>();
                user.secondarySchoolCourses.Add(new SecondarySchoolCourse
                {
                    Id = Guid.NewGuid().ToString(),
                    grades = req.grades,
                    subject = (SecondarySchoolSubject)req.secondarySchoolSubject,
                    startTime = ParseTime(req.startTime),
                    endTime = ParseTime(req.endTime),
                    location = req.information ?? ""
                });
            }
            else
            {
                if (req.primarySchoolSubject == null) throw new Exception("Expected primary school subject.");

                user.primarySchoolCourses ??= new List<PrimarySchoolCourse>();
                user.primarySchoolCourses.Add(new PrimarySchoolCourse
                {
                    Id = Guid.NewGuid().ToString(),
                    grades = req.grades,
                    subject = (PrimarySchoolSubject)req.primarySchoolSubject,
                    startTime = ParseTime(req.startTime),
                    endTime = ParseTime(req.endTime),
                    location = req.information ?? ""
                });
            }

            SaveChanges();
            return true;
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.Message);
            return false;
        }
    }

    public async Task<bool> DeleteCourseFromProfile(string courseId, string userId)
    {
        var user = await Users
            .Include(user => user.primarySchoolCourses)
            .Include(user => user.secondarySchoolCourses)
            .FirstAsync(user => user.Id == userId);

        var course = user.primarySchoolCourses.FirstOrDefault(c => c.Id == courseId);
        if (course != null)
        {
            user.primarySchoolCourses.Remove(course);
            PrimarySchoolCourses.Remove(course);
            SaveChanges();
            return true;
        }

        var course2 = user.secondarySchoolCourses.FirstOrDefault(c => c.Id == courseId);
        if (course2 != null)
        {
            user.secondarySchoolCourses.Remove(course2);
            SecondarySchoolCourses.Remove(course2);
            SaveChanges();
            return true;
        }
        return false;
    }


    public async Task<List<NewsPost>> GetLatestNews(int take)
    {
        return await NewsPosts
            .OrderByDescending(post => post.PostDate)
            .Take(take)
            .ToListAsync();
    }

    // Expects a string formatted "HH:MM" in 24 hour format.
    private DateTime ParseTime(string timeString)
    {
        var split = timeString.Split(":");

        if (split.Length != 2)
            throw new Exception("Improper time format receieved. Expected HH:MM.");

        int hour = int.Parse(split[0]);
        int min = int.Parse(split[1]);

        if (hour < 0 || hour > 23 || min < 0 || min > 59) 
            throw new Exception("Improper time format receieved. Expected HH:MM.");

        return new DateTime(1, 1, 1, hour, min, 0, DateTimeKind.Utc);
    }
}
