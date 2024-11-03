using api.Models;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion.Internal;

namespace api.DTO;


public class PostDto
{
    public string? Id { get; set; }
    public string PosterId { get; set; }
    public string? PosterFirstName { get; set; }
    public string? PosterLastName { get; set; }
    public string? AcceptedByUserId { get; set; }
    public string? AcceptedByUserFirstName {  get; set; }
    public string? AcceptedByUserLastName { get; set; }
    public School? School { get; set; }
    public SchoolType? SchoolType { get; set; }
    public string? PostDescription { get; set; }
    public bool? Private { get; set; }
    public DateTime PostDateTime { get; set; }
    public List<PrimarySchoolSubject>? PrimarySchoolSubjects { get; set; }
    public List<SecondarySchoolSubject>? SecondarySchoolSubjects { get; set; }
    public List<Grade>? Grades { get; set; }
    
    // Used to strip unnecessary User data that we don't want to send to client
    public static PostDto MapPostToPostDto(Post post)
    {
        return new PostDto()
        {
            Id = post.Id,
            PosterId = post.Poster.Id,
            PosterFirstName = post.Poster.FirstName,
            PosterLastName = post.Poster.LastName,
            AcceptedByUserId = post.AcceptedByUser?.Id,
            AcceptedByUserFirstName = post.AcceptedByUser?.FirstName,
            AcceptedByUserLastName = post.AcceptedByUser?.LastName,
            School = post.School,
            SchoolType = post.SchoolType,
            PostDescription = post.PostDescription,
            Private = post.Private,
            PostDateTime = post.PostDateTime,
            PrimarySchoolSubjects = post.PrimarySchoolSubjects,
            SecondarySchoolSubjects = post.SecondarySchoolSubjects,
            Grades = post.Grades
        };

    }
}
public class PostDtos
{
    public string? SchoolId { get; set; }
    public string? PostDescription { get; set; }
    public string? RequestedSub { get; set; }
    public bool? Private { get; set; }

    public List<PrimarySchoolSubject>? PrimarySchoolSubjects { get; set; }
    public List<SecondarySchoolSubject>? SecondarySchoolSubjects { get; set; }
    public List<Grade>? Grades { get; set; }
}

