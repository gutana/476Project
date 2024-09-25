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

public class AdminController : ControllerBase
{
    private readonly ILogger<AccountController> _logger;
    private readonly UserManager<User> _userManager;
    private readonly SignInManager<User> _signInManager;
    private readonly IPasswordHasher<User> _passwordHasher;
    private readonly ApplicationDbContext _context;

    public AdminController(UserManager<User> userManager, SignInManager<User> signInManager, ILogger<AccountController> logger, IPasswordHasher<User> passwordHasher, ApplicationDbContext context)
    {
        _logger = logger;
        _userManager = userManager;
        _signInManager = signInManager;
        _passwordHasher = passwordHasher;
        _context = context;
    }

    public class AdminApprovalResponse
    {
        public required bool Approved { get; set; }
        public required string Id { get; set; }
    }

    [HttpPost("approveUser")]
    [Authorize]
    public async Task<IActionResult> ApproveUser(AdminApprovalResponse resp)
    {
        User? user = await GetCurrentUser();
        if (user == null || user.UserType != UserType.Administrator)
            return Unauthorized();
        if (user.EmailConfirmed == false)
            return Problem("Account has to be verified by an administrator.", statusCode: 500);

        var accountAcceptance = _userManager.FindByIdAsync(resp.Id).Result;
        if (accountAcceptance == null)
            return Problem("Account with ID: " + resp.Id + " cannot be found.", statusCode: 500);

        if (resp.Approved == false)
        {
            var res = await _userManager.DeleteAsync(accountAcceptance);
            if (res.Succeeded)
                return Ok();
            
            return BadRequest(res.Errors);
        }
        
        accountAcceptance.EmailConfirmed = resp.Approved;
        var result = await _userManager.UpdateAsync(accountAcceptance);

        if (result.Succeeded)
            return Ok();

        return BadRequest(result.Errors);
    }

    [HttpGet("getUnapprovedUsers")]
    [Authorize]
    public async Task<IActionResult> GetUnapprovedUsers()
    {        
        User? user = await GetCurrentUser();
        if (user == null || user.UserType != UserType.Administrator) return Unauthorized();
        if (user.EmailConfirmed == false)
            return Problem("Account has to be verified by an administrator.", statusCode: 500);

        var unapprovedUsers = _context.Users.Where(u => u.EmailConfirmed == false && u.Region == user.Region).ToList()
                              .ConvertAll(u => UserDto.MapIdentityUserToUserDto(u));
        
        return Ok(unapprovedUsers);
    }

    private async Task<User?> GetCurrentUser()
    {
        var userId = HttpContext.User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value;

        if (userId == null)
            return null;

        return await _userManager.FindByIdAsync(userId);
    }
}
