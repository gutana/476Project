using api.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Memory;
using System.Security.Claims;

namespace api.Controllers;

public abstract class BaseController : Controller
{
    protected readonly UserManager<User> _userManager;
    protected readonly IMemoryCache _cache;

    public BaseController(UserManager<User> userManager, IMemoryCache cache)
    {
        _userManager = userManager;
        _cache = cache;
    }
    protected async Task<User?> GetCurrentUser()
    {
        var userId = HttpContext.User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value;

        if (userId == null)
            return null;

        return await _userManager.FindByIdAsync(userId);
    }

    protected async Task<User?> GetCurrentUserCached()
    {
        var userId = HttpContext.User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value;

        if (userId == null)
            return null;

        if (_cache.TryGetValue(userId, out User? cachedUser))
        {
            return cachedUser;
        }
        else
        {
            var cacheEntryOptions = new MemoryCacheEntryOptions()
                .SetSlidingExpiration(TimeSpan.FromSeconds(60));

            User? user = await _userManager.FindByIdAsync(userId);
            _cache.Set(userId, user, cacheEntryOptions);
            return user;
        }
    }
    
    protected void CacheInvalidate(object obj)
    {
        _cache.Remove(obj);
    }
}
