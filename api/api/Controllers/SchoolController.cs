using api.Models;
using api.DTO;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace api.Controllers;

[Route("[controller]")]
[ApiController]
public class SchoolController : ControllerBase
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

    [Authorize]
    [HttpPost("create")]
    public async Task<IActionResult> CreateSchool(CreateSchoolDto schoolDto)
    {
        User? user = await GetCurrentUser();
        if (user == null || user.UserType == UserType.Requestor) // change 
            return Unauthorized();

        bool result = _context.CreateSchool(schoolDto);

        if (result == true)
            return Ok();

        return Problem("Something went wrong with creating school", statusCode: 500);
    }

    [HttpGet("getSchools")]
    public async Task<IActionResult> GetSchools(Region region)
    {
        return Ok(await _context.GetSchools(region));
    }

    private async Task<User?> GetCurrentUser()
    {
        var userId = HttpContext.User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value;

        if (userId == null)
            return null;

        return await _userManager.FindByIdAsync(userId);
    }
}
