using api.Models;
using System.ComponentModel;

namespace api.DTO;

public class UserDto
{
    public string? Id { get; set; }
    public string? FirstName { get; set; }
    public string? LastName { get; set; }
    public string? Email { get; set; }
    public Region Region { get; set; }
    public School? School { get; set; }
    public UserType UserType { get; set; }
    public string? PhoneNumber { get; set; }

    public static UserDto MapIdentityUserToUserDto(User user)
    {
        if (user.Region == null)
            throw new InvalidDataException("Could not map identity user to DTO; region was null");

        if (user.UserType == null)
            throw new InvalidDataException("Could not map identity use to DTO; UserType was null");

        return new UserDto()
        {
            Id = user.Id,
            FirstName = user.FirstName ?? "",
            LastName = user.LastName ?? "",
            Email = user.Email ?? "",
            Region = (Region)user.Region,
            School = user.School,
            UserType = (UserType)user.UserType,
            PhoneNumber = user.PhoneNumber ?? ""
        };
    }
}
