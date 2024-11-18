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
public class PostController: BaseController
{
    private readonly ILogger<PostController> _logger;
    private readonly ApplicationDbContext _context;

    public PostController(UserManager<User> userManager, ILogger<PostController> logger, ApplicationDbContext context, IMemoryCache cache)
        : base(userManager, cache)
    {
        _logger = logger;
        _context = context;
    }

    [HttpGet("getApprovedSubs")]
    [Authorize]
    public async Task<IActionResult> GetApprovedSubs()
    {
        User? user = await GetCurrentUserCached();
        if (user == null)
            return Unauthorized();
        if (user.EmailConfirmed == false)
            return Problem("Account has to be verified by an administrator.", statusCode: 500);

        var subs = _context.Users.Where(u => u.EmailConfirmed == true && u.UserType == UserType.Substitute && u.Region == user.Region).ToList()
                              .ConvertAll(u => UserDto.MapIdentityUserToUserDto(u));

        return Ok(subs);
    }

    [HttpGet("getByUser")]
    [Authorize]
    public async Task<IActionResult> GetByUser(string? userId)
    {
        List<PostDto> postings;
        User? user = await GetCurrentUserCached();
        if (user == null)
            return Unauthorized();
        if (user.EmailConfirmed == false)
            return Unauthorized("Account has to be verified by an administrator.");

        if (userId != null && user.UserType == UserType.Administrator)
            postings = await _context.GetPostingsByUser(userId);
        else
            postings = await _context.GetPostingsByUser(user.Id);

        return Ok(postings);
    }

    [HttpGet("getAvailable")]
    [Authorize]
    public async Task<IActionResult> GetAvailable()
    {
        User? user = await GetCurrentUserCached();
        if (user == null)
            return Unauthorized();
        if (user.EmailConfirmed == false)
            return Unauthorized("Account has to be verified by an administrator.");

        var postings = await _context.GetAvailablePostings(user);
        return Ok(postings);
    }

    [HttpGet("getTakenByUser")]
    [Authorize]
    public async Task<IActionResult> GetTakenByUser()
    {
        User? user = await GetCurrentUserCached();
        if (user == null)
            return Unauthorized();
        if (user.EmailConfirmed == false)
            return Unauthorized("Account has to be verified by an administrator.");

        var postings = await _context.GetTakenPostings(user);
        return Ok(postings);
    }

    [HttpGet("getMyPostings")]
    [Authorize]
    public async Task<IActionResult> GetMyPostings()
    {
        User? user = await GetCurrentUserCached();
        if (user == null)
            return Unauthorized();
        if (user.EmailConfirmed == false)
            return Unauthorized("Account has to be verified by an administrator.");

        var takenPostings = await _context.GetTakenPostings(user);
        var createdPostings = user.UserType == UserType.Teacher ? await _context.GetPostingsByUser(user.Id) : [];
        var totalPostings = createdPostings.Union(takenPostings).ToList();

        return Ok(totalPostings);
    }

    [HttpGet("getAll")]
    [Authorize]
    public async Task<IActionResult> GetAll()
    {
        User? user = await GetCurrentUserCached();
        if (user == null || user.UserType != UserType.Administrator)
            return Unauthorized();
        if (user.EmailConfirmed == false)
            return Unauthorized("Account has to be verified by an administrator.");

        var postings = await _context.GetAllPostings();
        return Ok(postings);
    }

    [HttpPost("add")]
    [Authorize]
    public async Task<IActionResult> Add(CreatePostDto resp)
    {
        User? user = await GetCurrentUserCached();
        if (user == null || user.UserType != UserType.Teacher)
            return Unauthorized();
        if (user.EmailConfirmed == false)
            return Unauthorized("Account has to be verified by an administrator");

        if (await _context.CreateNewPosting(resp, user.Id))
            return Ok("Post has been created!");
        else
            return Problem("Unexpected error occurred.", statusCode: 500);
    }

    [HttpPost("accept")]
    [Authorize]
    public async Task<IActionResult> Accept(string postId)
    {
        User? user = await GetCurrentUserCached();
        if (user == null || user.UserType == UserType.Administrator)
            return Unauthorized();
        if (user.EmailConfirmed == false)
            return Unauthorized("Account has to be verified by an administrator");

        try
        {
            if (_context.AcceptPosting(postId, user.Id))
                return Ok();
            else
                return Problem("Unexpected error occurred.", statusCode: 500);
        }
        catch (PostingTakenException e)
        {
            return Problem(e.getMessage(), statusCode: 420);
        }
    }

    [HttpPost("cancel")]
    [Authorize]
    public async Task<IActionResult> Cancel(string postId)
    {
        User? user = await GetCurrentUserCached();

        if (user == null)
            return Unauthorized();
        if (user.EmailConfirmed == false)
            return Unauthorized("Account has to be verified by an administrator.");

        if (_context.CancelPosting(postId, user.Id))
            return Ok();
        else
            return Problem("Unexpected error occured.", statusCode: 500);
    }

    private List<PostDto> ConvertToPostDtoList(List<Post> posts)
    {
        List<PostDto> postDtos = new List<PostDto>();
        foreach (var post in posts)
            postDtos.Add(PostDto.MapPostToPostDto(post));

        return postDtos;
    }
}
