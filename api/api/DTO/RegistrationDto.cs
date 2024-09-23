using api.Models;

namespace api.DTO;

public class RegistrationDto
{
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public string Email { get; set; }
    public string PhoneNumber { get; set; }
    public string Password { get; set; }
    public Region Region { get; set; }
    public UserType UserType { get; set; }
}
