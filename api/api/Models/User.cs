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

public static class Mapper
{
    public static Region MapStringToRegion(string str)
    {
        switch(str)
        {
            case "Regina":
                return Region.Regina;
            case "Saskatoon":
                return Region.Saskatoon;
        }
        throw new InvalidDataException("Could not convert string to region: " + str);
    }
}

public enum UserType
{
    Teacher,
    Requestor,
    Administrator
}
