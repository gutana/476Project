using api.Models;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion.Internal;

namespace api.DTO;

public class CreatePostingDto
{
    public DateOnly DateOfAbsence { get; set; }
    public string SchoolName { get; set; }
    public string Subjects { get; set; }
}
