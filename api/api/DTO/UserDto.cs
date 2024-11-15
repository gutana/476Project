using api.Models;

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

    public List<PrimarySchoolCourseDto>? primarySchoolCourses { get; set; } 
    public List<SecondarySchoolCourseDto>? secondarySchoolCourses { get; set; } 

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
            PhoneNumber = user.PhoneNumber ?? "",
            primarySchoolCourses = ConvertPrimaryCourseListToDto(user.primarySchoolCourses),
            secondarySchoolCourses = ConvertSecondaryCourseListToDto(user.secondarySchoolCourses)
        };
    }

    public static List<PrimarySchoolCourseDto> ConvertPrimaryCourseListToDto(List<PrimarySchoolCourse> courses)
    {
        List<PrimarySchoolCourseDto> output = new();
        foreach(PrimarySchoolCourse course in courses)
        {
            output.Add(PrimarySchoolCourseDto.MapToDto(course));
        }
        return output;
    }

    public static List<SecondarySchoolCourseDto> ConvertSecondaryCourseListToDto(List<SecondarySchoolCourse> courses)
    {
        List<SecondarySchoolCourseDto> output = new();
        foreach(SecondarySchoolCourse course in courses)
        {
            output.Add(SecondarySchoolCourseDto.MapToDto(course));
        }
        return output;
    }

}

public class PrimarySchoolCourseDto
{
    public string Id { get; set; }

    public List<Grade> grades { get; set; }
    public PrimarySchoolSubject subject { get; set; }

    public DateTime startTime { get; set; }
    public DateTime endTime { get; set; }
    public string? location { get; set; }
    public static PrimarySchoolCourseDto MapToDto(PrimarySchoolCourse course)
    {
        return new PrimarySchoolCourseDto{
            Id = course.Id,
            grades = course.grades,
            subject = course.subject,
            startTime = course.startTime,
            endTime = course.endTime,
            location = course.location,
        };
    }
}
public class SecondarySchoolCourseDto
{
    public string Id { get; set; }

    public List<Grade> grades { get; set; }
    public SecondarySchoolSubject subject { get; set; }

    public DateTime startTime { get; set; }
    public DateTime endTime { get; set; }
    public string? location { get; set; }
    public static SecondarySchoolCourseDto MapToDto(SecondarySchoolCourse course)
    {
        return new SecondarySchoolCourseDto{
            Id = course.Id,
            grades = course.grades,
            subject = course.subject,
            startTime = course.startTime,
            endTime = course.endTime,
            location = course.location,
        };
    }

}


public class AddCourseToProfileRequest
{
    public List<Grade> grades {  get; set; }   
    public PrimarySchoolSubject? primarySchoolSubject { get; set; }
    public SecondarySchoolSubject? secondarySchoolSubject { get; set; }
    public string startTime { get; set; }
    public string endTime { get; set; }
    public string information { get; set; }
}
