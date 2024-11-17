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

public class AdminController : BaseController
{
    private readonly ILogger<AdminController> _logger;
    private readonly ApplicationDbContext _context;

    public AdminController(UserManager<User> userManager, ILogger<AdminController> logger, ApplicationDbContext context, IMemoryCache cache)
        : base(userManager, cache)
    {
        _logger = logger;
        _context = context;
    }

    public class ApproveAccountRequest
    {
        public required bool Approved { get; set; }
        public required string Id { get; set; }
    }

    [HttpPost("approveUser")]
    [Authorize]
    public async Task<IActionResult> ApproveUser(ApproveAccountRequest resp)
    {
        CacheInvalidate(resp.Id);

        User? user = await GetCurrentUserCached();
        if (user == null || user.UserType != UserType.Administrator)
            return Unauthorized();
        if (user.EmailConfirmed == false)
            return Unauthorized("Account has to be verified by an administrator.");

        var accountAcceptance = await _userManager.FindByIdAsync(resp.Id);
        if (accountAcceptance == null)
            return BadRequest("Account with ID: " + resp.Id + " cannot be found.");

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
        User? user = await GetCurrentUserCached();
        if (user == null || user.UserType != UserType.Administrator) 
            return Unauthorized();
        if (user.EmailConfirmed == false)
            return Unauthorized("Account has to be verified by an administrator.");

        var unapprovedUsers = _context.Users.Where(u => u.EmailConfirmed == false && u.Region == user.Region).ToList()
                              .ConvertAll(u => UserDto.MapIdentityUserToUserDto(u));

        return Ok(unapprovedUsers);
    }
}
