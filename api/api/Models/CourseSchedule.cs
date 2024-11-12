using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations.Schema;

namespace api.Models;

public class PrimarySchoolCourse
{
    public string Id { get; set; }
    [ForeignKey("AspNetUsers")]
    public User user {  get; set; } 

    public List<Grade> grades {  get; set; }
    public PrimarySchoolSubject subject;

    public DateTime startTime;
    public DateTime endTime;

    public string? location;
}

public class SecondarySchoolCourse
{
    public string Id { get; set; }
    [ForeignKey("AspNetUsers")]
    public User user { get; set; }

    public List<Grade> grades { get; set; }
    public SecondarySchoolSubject subject;

    public DateTime startTime;
    public DateTime endTime;

    public string? location;
}

