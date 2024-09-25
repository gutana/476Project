using api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using Microsoft.AspNetCore.Identity;
using api.DTO;
using System.Web.Http.Results;

namespace api.Controllers;


[ApiController]
[Route("[controller]")]
public class NewsController : Controller
{

    private readonly ILogger<AccountController> _logger;
    private readonly UserManager<User> _userManager;
    private readonly SignInManager<User> _signInManager;
    private readonly IPasswordHasher<User> _passwordHasher;
    private readonly ApplicationDbContext _context;

    public NewsController(UserManager<User> userManager, SignInManager<User> signInManager, ILogger<AccountController> logger, IPasswordHasher<User> passwordHasher, ApplicationDbContext context)
    {
        _logger = logger;
        _userManager = userManager;
        _signInManager = signInManager;
        _passwordHasher = passwordHasher;
        _context = context;
    }
   

    [Authorize]
    [HttpPost("create")]
    public async Task<IActionResult> Create(CreateNewsPostDto dto)
    {
        var user = await GetCurrentUser();

        if (user == null || user.UserType != UserType.Administrator)
            return Unauthorized();
        if (user.EmailConfirmed == false)
            return Problem("Account has to be verified by an administrator.", statusCode: 500);

        if (_context.CreateNewsPost(dto))
            return Ok();
        else 
            return Problem("Unexpected error occurred.", statusCode: 500);
    }

    [Authorize]
    [HttpGet("getLatest")]
    public async Task<IActionResult> GetLatest()
    {
        return Ok(await _context.GetLatestNews(10));
    }

    private async Task<User?> GetCurrentUser()
    {
        var userId = HttpContext.User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value;

        if (userId == null)
            return null;

        return await _userManager.FindByIdAsync(userId);
    }

}
