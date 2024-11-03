using api.DTO;
using api.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

namespace api.Controllers;

[ApiController]
[Route("[controller]")]
public class SchoolController : Controller
{
    private readonly ILogger<SchoolController> _logger;
    private readonly UserManager<User> _userManager;
    private readonly ApplicationDbContext _context;

    public SchoolController(UserManager<User> userManager, ILogger<SchoolController> logger, ApplicationDbContext context)
    {
        _logger = logger;
        _userManager = userManager;
        _context = context;
    }

    [HttpPost("add")]
    [Authorize]
    public async Task<IActionResult> AddSchool(SchoolDto resp)
    {
        User? user = await GetCurrentUser();
        if (user == null || user.UserType != UserType.Administrator)
            return Unauthorized();
        if (user.EmailConfirmed == false)
            return Unauthorized("Account has to be verified by an administrator");

        if (_context.SchoolExists(resp))
            return Ok("This school already exists.");

        if (_context.CreateSchool(resp, user.Id))
            return Ok("School has been created!");
        else
            return Problem("Unexpected error occurred.", statusCode: 500);
    }

    [HttpGet("getByRegion")]
    public async Task<IActionResult> GetByRegion(Region region)
    {
        return Ok(await _context.GetSchools(region));
    }

    [HttpGet("getAll")]
    [Authorize]
    public async Task<IActionResult> GetAll()
    {
        User? user = await GetCurrentUser();
        if (user == null || user.UserType != UserType.Administrator)
            return Unauthorized();
        if (user.EmailConfirmed == false)
            return Unauthorized("Account has to be verified by an administrator");

        return Ok(await _context.GetSchools());
    }

    private async Task<User?> GetCurrentUser()
    {
        var userId = HttpContext.User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value;

        if (userId == null)
            return null;

        return await _userManager.FindByIdAsync(userId);
    }

}

