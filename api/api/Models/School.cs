namespace api.Models;

public class School 
{
    public string? Id { get; set; }
    public string? PosterId { get; set; }
    public SchoolType SchoolType { get; set; }
    public string? SchoolName { get; set; }
    public string? PhoneNumber { get; set; }
    public string? Address { get; set; }
    public string? City { get; set; }
    public string? PostalCode { get; set; }
    public Region Region { get; set; }
}

public enum SchoolType
{
    Primary,
    Secondary
}
