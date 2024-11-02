using api.Models;

namespace api.DTO;

public class CreateSchoolDto
{
    public string? Name { get; set; }
    public SchoolType SchoolType { get; set; }
    public string? PhoneNumber { get; set; }
    public string? Address { get; set; }
    public string? City { get; set; }
    public string? PostalCode { get; set; }
    public Region Region { get; set; }
}
