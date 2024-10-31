using api.Models;

namespace api.DTO
{
    public class SchoolDto
    {
        public SchoolType SchoolType { get; set; }
        public required string SchoolName { get; set; }
        public required string PhoneNumber { get; set; }
        public required string Address { get; set; }
        public required string City { get; set; }
        public required string PostalCode { get; set; }
        public Region Region { get; set; }
    }
}
