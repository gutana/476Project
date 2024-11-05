using api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Identity;
using api.DTO;
using Microsoft.Extensions.Caching.Memory;

namespace api.Controllers;

[ApiController]
[Route("[controller]")]
public class NewsController : BaseController
{
    private readonly ILogger<AccountController> _logger;
    private readonly ApplicationDbContext _context;

    private readonly string latestNewsCacheKey = "LatestNewsCacheKey";

    public NewsController(UserManager<User> userManager, ILogger<AccountController> logger, ApplicationDbContext context, IMemoryCache cache)
        : base(userManager, cache)
    {
        _logger = logger;
        _context = context;
    }
   

    [Authorize]
    [HttpPost("create")]
    public async Task<IActionResult> Create(CreateNewsPostDto dto)
    {
        var user = await GetCurrentUserCached();

        if (user == null || user.UserType != UserType.Administrator)
            return Unauthorized();
        if (user.EmailConfirmed == false)
            return Problem("Account has to be verified by an administrator.", statusCode: 500);

        if (_context.CreateNewsPost(dto))
        {
            _cache.Remove(latestNewsCacheKey);
            return Ok();
        }
        else 
            return Problem("Unexpected error occurred.", statusCode: 500);
    }

    [Authorize]
    [HttpGet("getLatest")]
    public async Task<IActionResult> GetLatest()
    {
        if (_cache.TryGetValue(latestNewsCacheKey, out List<NewsPost>? cachedNews))
        {
            return Ok(cachedNews);
        }
        else
        {
            var news = await _context.GetLatestNews(10);

            var cacheEntryOptions = new MemoryCacheEntryOptions()
                .SetSlidingExpiration(TimeSpan.FromSeconds(3600));
            
            _cache.Set(latestNewsCacheKey, news, cacheEntryOptions);
            return Ok(news);

        }
    }
}
