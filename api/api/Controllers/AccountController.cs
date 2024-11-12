using api.DTO;
using api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Memory;

namespace api.Controllers;

[ApiController]
[EnableCors("AllowAll")]
[Route("[controller]")]

public class AccountController : BaseController
{
    private readonly ILogger<AccountController> _logger;
    private readonly SignInManager<User> _signInManager;
    private readonly IPasswordHasher<User> _passwordHasher;
    private readonly ApplicationDbContext _context;

    public AccountController(UserManager<User> userManager, SignInManager<User> signInManager, ILogger<AccountController> logger, IPasswordHasher<User> passwordHasher, ApplicationDbContext context, IMemoryCache cache)
        :base(userManager, cache)
    {
        _logger = logger;
        _signInManager = signInManager;
        _passwordHasher = passwordHasher;
        _context = context;
    }

    public class EditInfoDto
    {
        public required string FirstName { get; set; }
        public required string LastName { get; set; }
        public required string Email { get; set; }
        public required string PhoneNumber { get; set; }
        public required Region Region { get; set; }
        public required string SchoolId { get; set; }
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register(RegistrationDto registrationDto)
    {
        var user = new User();
        user.Email = registrationDto.Email;
        user.FirstName = registrationDto.FirstName;
        user.LastName = registrationDto.LastName;
        user.Region = registrationDto.Region;
        if (registrationDto.UserType == UserType.Teacher)
            user.School = _context.GetSchoolById(registrationDto.SchoolId);
        user.UserType = registrationDto.UserType;
        user.UserName = registrationDto.Email;
        user.PhoneNumber = registrationDto.PhoneNumber;
        user.PasswordHash = _passwordHasher.HashPassword(user, registrationDto.Password);

        var result = await _userManager.CreateAsync(user);
        
        if (result.Succeeded) 
            return Ok();

        return BadRequest(result.Errors);
    }

    [HttpGet("getUser")]
    [Authorize]
    public async Task<IActionResult> GetUser()
    {
        User? user = await GetCurrentUserCached();
        if (user == null)
            return Unauthorized();

        UserDto userDto = UserDto.MapIdentityUserToUserDto(user);

        return Ok(userDto);
    }

    [HttpPost("editInfo")]
    [Authorize]
    public async Task<IActionResult> EditInfo(EditInfoDto data)
    {
        var user = await GetCurrentUser();

        if (user != null)
            CacheInvalidate(user.Id);

        if (user == null)
            return Unauthorized();
        if (user.EmailConfirmed == false)
            return Problem("Account has to be verified by an administrator.", statusCode: 500);

        user.FirstName = data.FirstName;
        user.LastName = data.LastName;
        user.Email = data.Email;
        user.PhoneNumber = data.PhoneNumber;
        user.Region = data.Region;
        user.School = data.SchoolId.Length != 0 ? _context.GetSchoolById(data.SchoolId) : null;

        var result = await _userManager.UpdateAsync(user);

        if (result.Succeeded)
            return Ok("User information has been updated!");

        return BadRequest(result.Errors);
    }

    [HttpPost("addCourseToProfile")]
    [Authorize]
    public async Task<IActionResult> AddCourseToProfile([FromBody] AddCourseToProfileRequest req)
    {
        var user = await GetCurrentUserCached();

        if (user == null || user.UserType != UserType.Teacher)
            return Unauthorized();

        bool success = await _context.AddCourseToProfile(user.Id, req);

        CacheInvalidate(user.Id);

        if (success)
            return Ok();
        else
            return BadRequest();
    }

    [HttpGet("deleteCourse")]
    [Authorize]
    public async Task<IActionResult> DeleteCourse(string courseId)
    {
        var user = await GetCurrentUserCached();

        if (user == null) 
            return Unauthorized();

        CacheInvalidate(user.Id);

        bool success = await _context.DeleteCourseFromProfile(courseId, user.Id);

        if (success)
            return Ok();

        return Problem();
    }
}
