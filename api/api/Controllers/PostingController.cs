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

public class PostingController : ControllerBase
{
    private readonly ILogger<PostingController> _logger;
    private readonly UserManager<User> _userManager;
    private readonly ApplicationDbContext _context;

    public PostingController(UserManager<User> userManager, ILogger<PostingController> logger, ApplicationDbContext context)
    {
        _logger = logger;
        _userManager = userManager;
        _context = context;
    }

    [Authorize]
    [HttpPost("create")]
    public async Task<IActionResult> Create(CreatePostingDto postingDto)
    {
        User? user = await GetCurrentUser();
        if (user == null || user.UserType != UserType.Teacher) 
            return Unauthorized();

        bool result = _context.CreatePosting(postingDto, user);

        if (result == true)
            return Ok();

        return Problem("Something went wrong with posting", statusCode: 500);
    }

    [Authorize]
    [HttpGet("getUserPostings")]
    public async Task<IActionResult> GetUserPostings()
    {
        User? user = await GetCurrentUser();
        if (user == null || user.UserType != UserType.Teacher)
            return Unauthorized();

        return Ok(await _context.GetUserPosts(user));
    }

    private async Task<User?> GetCurrentUser()
    {
        var userId = HttpContext.User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value;

        if (userId == null)
            return null;

        return await _userManager.FindByIdAsync(userId);
    }
}
