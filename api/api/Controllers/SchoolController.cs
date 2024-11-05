using api.DTO;
using api.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.Caching.Memory;

namespace api.Controllers;

[ApiController]
[Route("[controller]")]
public class SchoolController : BaseController
{
    private readonly ILogger<SchoolController> _logger;
    private readonly ApplicationDbContext _context;

    private readonly string allSchoolsCacheKey = "AllSchoolsCacheKey";

    public SchoolController(UserManager<User> userManager, ILogger<SchoolController> logger, ApplicationDbContext context, IMemoryCache cache)
        : base(userManager, cache)
    {
        _logger = logger;
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
            return BadRequest("This school already exists.");

        if (_context.CreateSchool(resp, user.Id))
        {
            _cache.Remove(allSchoolsCacheKey);
            return Ok("School has been created!");
        }
        else
        {
            return Problem("Unexpected error occurred.", statusCode: 500);
        }
    }

    [HttpGet("getByRegion")]
    public async Task<IActionResult> GetByRegion(Region region)
    {
        return Ok(await _context.GetSchools(region));
    }

    [HttpGet("getAllSchools")]
    public async Task<IActionResult> GetAllSchools()
    {
        if (_cache.TryGetValue(allSchoolsCacheKey, out List<School>? cachedSchools))
        {
            return Ok(cachedSchools);
        }
        else
        {
            List<School> schools = await _context.GetSchools();

            var cacheEntryOptions = new MemoryCacheEntryOptions()
                .SetSlidingExpiration(TimeSpan.FromSeconds(3600));
            
            _cache.Set(allSchoolsCacheKey, schools, cacheEntryOptions);
            return Ok(schools);
        }
    }
}

