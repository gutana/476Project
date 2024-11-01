using api.Models;

namespace api.DTO
{
    public class PostDTO
    {
        public string? SchoolId { get; set; }
        public string? PostDescription { get; set; }
        public string? RequestedSub { get; set; }
        public bool? Private { get; set; }

        public List<PrimarySchoolSubject>? PrimarySchoolSubjects { get; set; }
        public List<SecondarySchoolSubject>? SecondarySchoolSubjects { get; set; }
        public List<Grade>? Grades { get; set; }
    }
}
