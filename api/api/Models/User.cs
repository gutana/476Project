using Microsoft.AspNetCore.Identity;

namespace api.Models;

// Don't need properties like email; they come with IdentityUser
public class User : IdentityUser
{
    public string? FirstName { get; set; }
    public string? LastName { get; set; }
    public Region? Region { get; set; }
    public UserType? UserType { get; set; }
}

public enum Region 
{
    Regina,
    Saskatoon
}

public enum UserType
{
    Teacher,
    Requestor,
    Administrator
}
