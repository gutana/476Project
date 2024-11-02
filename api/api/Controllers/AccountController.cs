using api.DTO;
using api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace api.Controllers;

[ApiController]
[EnableCors("AllowAll")]
[Route("[controller]")]

public class AccountController : ControllerBase
{
    private readonly ILogger<AccountController> _logger;
    private readonly UserManager<User> _userManager;
    private readonly SignInManager<User> _signInManager;
    private readonly IPasswordHasher<User> _passwordHasher;
    private readonly ApplicationDbContext _context;

    public AccountController(UserManager<User> userManager, SignInManager<User> signInManager, ILogger<AccountController> logger, IPasswordHasher<User> passwordHasher, ApplicationDbContext context)
    {
        _logger = logger;
        _userManager = userManager;
        _signInManager = signInManager;
        _passwordHasher = passwordHasher;
        _context = context;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register(RegistrationDto registrationDto)
    {
        var user = new User();
        user.Email = registrationDto.Email;
        user.FirstName = registrationDto.FirstName;
        user.LastName = registrationDto.LastName;
        user.School = await _context.GetSchoolById(registrationDto.School);
        user.Region = registrationDto.Region;
        user.UserType = registrationDto.UserType;
        user.UserName = registrationDto.Email;
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
        User? user = await GetCurrentUser();
        if (user == null)
            return Unauthorized();

        UserDto userDto = UserDto.MapIdentityUserToUserDto(user);

        return Ok(userDto);
    }

    private async Task<User?> GetCurrentUser()
    {
        var userId = HttpContext.User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value;

        if (userId == null)
            return null;

        return await _userManager.FindByIdAsync(userId);
    }
}
