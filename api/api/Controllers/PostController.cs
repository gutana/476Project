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
public class PostController: ControllerBase
{
    private readonly ILogger<AccountController> _logger;
    private readonly UserManager<User> _userManager;
    private readonly SignInManager<User> _signInManager;
    private readonly IPasswordHasher<User> _passwordHasher;
    private readonly ApplicationDbContext _context;

    public PostController(UserManager<User> userManager, SignInManager<User> signInManager, ILogger<AccountController> logger, IPasswordHasher<User> passwordHasher, ApplicationDbContext context)
    {
        _logger = logger;
        _userManager = userManager;
        _signInManager = signInManager;
        _passwordHasher = passwordHasher;
        _context = context;
    }

    [HttpGet("getApprovedSubs")]
    [Authorize]
    public async Task<IActionResult> GetApprovedSubs()
    {
        User? user = await GetCurrentUser();
        if (user == null)
            return Unauthorized();
        if (user.EmailConfirmed == false)
            return Problem("Account has to be verified by an administrator.", statusCode: 500);

        var subs = _context.Users.Where(u => u.EmailConfirmed == true && u.UserType == UserType.Teacher && u.Region == user.Region).ToList()
                              .ConvertAll(u => UserDto.MapIdentityUserToUserDto(u));

        return Ok(subs);
    }

    [HttpGet("getPostings")]
    [Authorize]
    public async Task<IActionResult> GetPositings()
    {
        User? user = await GetCurrentUser();
        if (user == null)
            return Unauthorized();
        if (user.EmailConfirmed == false)
            return Problem("Account has to be verified by an administrator.", statusCode: 500);

        var postings = await _context.GetPostings(user.Id);
        return Ok(postings);
    }

    [HttpGet("getSchools")]
    [Authorize]
    public async Task<IActionResult> GetSchools()
    {
        User? user = await GetCurrentUser();
        if (user == null)
            return Unauthorized();
        if (user.EmailConfirmed == false)
            return Problem("Account has to be verified by an administrator.", statusCode: 500);

        var schools = _context.Schools.ToList();
        return Ok(schools);
    }

    [HttpPost("addPosting")]
    [Authorize]
    public async Task<IActionResult> AddPosting(PostDTO resp)
    {
        User? user = await GetCurrentUser();
        if (user == null)
            return Unauthorized();
        if (user.EmailConfirmed == false)
            return Problem("Account has to be verified by an administrator.", statusCode: 500);

        if (_context.CreateNewPosting(resp, user.Id))
            return Ok("Post has been created!");
        else
            return Problem("Unexpected error occurred.", statusCode: 500);
    }

    private async Task<User?> GetCurrentUser()
    {
        var userId = HttpContext.User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value;

        if (userId == null)
            return null;

        return await _userManager.FindByIdAsync(userId);
    }
}
