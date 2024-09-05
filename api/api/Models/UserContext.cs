using Microsoft.EntityFrameworkCore;

namespace api.Models;
public class UserContext : DbContext
{
    private readonly IConfiguration _configuration;
    public DbSet<User> Users { get; set; }

    public UserContext(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        var connectionString = _configuration.GetConnectionString("dbConnectionString");
        optionsBuilder.UseNpgsql(connectionString);
    }
}

public class User
{
    public string UserId { get; set; }
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public string Email { get; set; }
    public string PasswordHashed { get; set; }
    public Region Region { get; set; }
}

public enum Region 
{
    Regina,
    Saskatoon
}
