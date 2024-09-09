using api.DTO;
using api.Models;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

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

    public AccountController(UserManager<User> userManager, SignInManager<User> signInManager, ILogger<AccountController> logger, IPasswordHasher<User> passwordHasher)
    {
        _logger = logger;
        _userManager = userManager;
        _signInManager = signInManager;
        _passwordHasher = passwordHasher;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register(RegistrationDto registrationDto)
    {
        var user = new User();
        user.Email = registrationDto.Email;
        user.FirstName = registrationDto.FirstName;
        user.LastName = registrationDto.LastName;
        user.Region = registrationDto.Region;
        user.UserType = registrationDto.UserType;
        user.UserName = registrationDto.Email;
        user.PasswordHash = _passwordHasher.HashPassword(user, registrationDto.Password);

        var result = await _userManager.CreateAsync(user);
        
        if (result.Succeeded) 
            return Ok();

        return BadRequest(result.Errors);
    }
}
