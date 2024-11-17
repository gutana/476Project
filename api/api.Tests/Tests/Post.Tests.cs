using api.Controllers;
using api.DTO;
using api.Models;
using api.Tests.Helpers;
using Microsoft.AspNetCore.Components;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Logging;
using Moq;
using System.Configuration;

namespace api.Tests;

public class PostTests
{
    private readonly Mock<ILogger<PostController>> _logger;
    private readonly MemoryCache _cache;

    public PostTests()
    {
        _logger = new Mock<ILogger<PostController>>();
        _cache = new MemoryCache(new MemoryCacheOptions());
    }


    [Fact]
    public async Task GetApprovedSubs_ReturnsApprovedSubsForUserRegion()
    {
        // Arrange
        var mockContext = TestHelper.CreateMockDbContext();

        var userId = Guid.NewGuid().ToString();
        var currentUser = new User
        {
            Id = userId,
            UserType = UserType.Administrator,
            EmailConfirmed = true,
            Region = Region.Regina
        };

        var approvedSub = new User
        {
            Id = Guid.NewGuid().ToString(),
            UserType = UserType.Substitute,
            EmailConfirmed = true,
            Region = Region.Saskatoon,
            FirstName = "John",
            LastName = "Doe"
        };

        var unapprovedSub = new User
        {
            Id = Guid.NewGuid().ToString(),
            FirstName = "Approved",
            LastName = "Sub",
            UserType = UserType.Substitute,
            EmailConfirmed = true,
            Region = Region.Regina
        };

        var otherRegionSub = new User
        {
            Id = Guid.NewGuid().ToString(),
            UserType = UserType.Substitute,
            EmailConfirmed = true,
            Region = Region.Saskatoon
        };

        mockContext.Users.AddRange(currentUser, approvedSub, unapprovedSub, otherRegionSub);
        mockContext.SaveChanges();

        var userManager = TestHelper.CreateMockUserManagerWithUsers([currentUser, approvedSub, unapprovedSub, otherRegionSub]);
        var postController = new PostController(userManager, _logger.Object, mockContext, _cache);
        postController.ControllerContext = TestHelper.CreateControllerContextWithUser(userId);

        // Act
        var result = await postController.GetApprovedSubs();

        // Assert
        Assert.IsType<OkObjectResult>(result);

        var value = (List<UserDto>)((OkObjectResult)result).Value;
        Assert.Single(value);
        Assert.Equal("Approved", value[0].FirstName);
        Assert.Equal("Sub", value[0].LastName);
    }

    [Fact]
    public async Task GetApprovedSubs_ReturnsUnauthorizedWhenUserIsNull()
    {
        // Arrange
        var mockContext = TestHelper.CreateMockDbContext();
        var userManager = TestHelper.CreateMockUserManagerWithUsers([]);

        var postController = new PostController(userManager, _logger.Object, mockContext, _cache);
        postController.ControllerContext = TestHelper.CreateControllerContextWithUser("1234");
        // Act
        var result = await postController.GetApprovedSubs();

        // Assert
        Assert.IsType<UnauthorizedResult>(result);
    }

    [Fact]
    public async Task GetApprovedSubs_ReturnsProblemWhenUserNotVerified()
    {
        // Arrange
        var mockContext = TestHelper.CreateMockDbContext();

        var userId = Guid.NewGuid().ToString();
        var unverifiedUser = new User
        {
            Id = userId,
            UserType = UserType.Administrator,
            EmailConfirmed = false
        };

        mockContext.Users.Add(unverifiedUser);
        mockContext.SaveChanges();

        var userManager = TestHelper.CreateMockUserManagerWithUsers([unverifiedUser]);

        var postController = new PostController(userManager, _logger.Object, mockContext, _cache);
        postController.ControllerContext = TestHelper.CreateControllerContextWithUser(userId);

        // Act
        var result = await postController.GetApprovedSubs();

        // Assert
        Assert.IsType<ObjectResult>(result);

        var problemResult = (ObjectResult)result;
        Assert.Equal(500, problemResult.StatusCode);
    }

    [Fact]
    public async Task GetByUser_ReturnsUnauthorized()
    {
        // Arrange
        var mockContext = TestHelper.CreateMockDbContext();

        var userId = Guid.NewGuid().ToString();
        var user = new User
        {
            Id = userId,
            UserType = UserType.Teacher,
            EmailConfirmed = false
        };

        mockContext.Users.Add(user);
        mockContext.SaveChanges();

        var userManager = TestHelper.CreateMockUserManagerWithUsers([user]);

        var postController = new PostController(userManager, _logger.Object, mockContext, _cache);
        postController.ControllerContext = TestHelper.CreateControllerContextWithUser(userId);

        // Act
        var result = await postController.GetByUser(null);

        // Assert
        Assert.IsType<UnauthorizedObjectResult>(result);
    }

    [Fact]
    public async Task GetByUser_ReturnsPostsByUser()
    {
        // Arrange
        var mockContext = TestHelper.CreateMockDbContext();

        var userId = Guid.NewGuid().ToString();
        var user = new User
        {
            Id = userId,
            UserType = UserType.Teacher,
            EmailConfirmed = true
        };

        var postId = Guid.NewGuid().ToString();
        var post1 = new Post
        {
            Id = postId,
            Poster = user
        };

        var post2 = new Post
        {
            Id = Guid.NewGuid().ToString(),
            Poster = new User() { Id = Guid.NewGuid().ToString() }
        };

        mockContext.Users.Add(user);
        mockContext.Posts.Add(post1);
        mockContext.Posts.Add(post2);
        mockContext.SaveChanges();

        var userManager = TestHelper.CreateMockUserManagerWithUsers([user]);

        var postController = new PostController(userManager, _logger.Object, mockContext, _cache);
        postController.ControllerContext = TestHelper.CreateControllerContextWithUser(userId);



        // Act
        var result = await postController.GetByUser(null);

        // Assert
        Assert.IsType<OkObjectResult>(result);
        List<PostDto> posts = (List<PostDto>)(((OkObjectResult)result).Value);
        Assert.Single(posts);
        Assert.Equal(postId, posts[0].Id);
    }

    [Fact]
    public async Task GetByUser_AdminCanFetchByUserId()
    {
        // Arrange
        var mockContext = TestHelper.CreateMockDbContext();

        var userId = Guid.NewGuid().ToString();
        var user = new User
        {
            Id = userId,
            UserType = UserType.Administrator,
            EmailConfirmed = true
        };

        var searchUserId = Guid.NewGuid().ToString();
        var searchUser = new User
        {
            Id = searchUserId
        };

        var postId = Guid.NewGuid().ToString();
        var post1 = new Post
        {
            Id = postId,
            Poster = searchUser
        };

        var post2 = new Post
        {
            Id = Guid.NewGuid().ToString(),
            Poster = new User() { Id = Guid.NewGuid().ToString() }
        };

        mockContext.Users.Add(user);
        mockContext.Users.Add(searchUser);
        mockContext.Posts.Add(post1);
        mockContext.Posts.Add(post2);
        mockContext.SaveChanges();

        var userManager = TestHelper.CreateMockUserManagerWithUsers([user]);

        var postController = new PostController(userManager, _logger.Object, mockContext, _cache);
        postController.ControllerContext = TestHelper.CreateControllerContextWithUser(userId);

        // Act
        var result = await postController.GetByUser(searchUserId);

        // Assert
        Assert.IsType<OkObjectResult>(result);
        List<PostDto> posts = (List<PostDto>)(((OkObjectResult)result).Value);
        Assert.Single(posts);
        Assert.Equal(postId, posts[0].Id);
    }

    [Fact]
    public async Task GetByUser_IgnoresUserIdParameterWhenUserNotAdmin()
    {
        // Arrange
        var mockContext = TestHelper.CreateMockDbContext();

        var userId = Guid.NewGuid().ToString();
        var user = new User
        {
            Id = userId,
            UserType = UserType.Teacher,
            EmailConfirmed = true
        };

        var searchUserId = Guid.NewGuid().ToString();
        var searchUser = new User
        {
            Id = searchUserId
        };

        var postId = Guid.NewGuid().ToString();
        var post1 = new Post
        {
            Id = postId,
            Poster = searchUser
        };

        var post2 = new Post
        {
            Id = Guid.NewGuid().ToString(),
            Poster = new User() { Id = Guid.NewGuid().ToString() }
        };

        mockContext.Users.Add(user);
        mockContext.Users.Add(searchUser);
        mockContext.Posts.Add(post1);
        mockContext.Posts.Add(post2);
        mockContext.SaveChanges();

        var userManager = TestHelper.CreateMockUserManagerWithUsers([user]);

        var postController = new PostController(userManager, _logger.Object, mockContext, _cache);
        postController.ControllerContext = TestHelper.CreateControllerContextWithUser(userId);

        // Act
        var result = await postController.GetByUser(searchUserId);

        // Assert
        Assert.IsType<OkObjectResult>(result);
        List<PostDto> posts = (List<PostDto>)(((OkObjectResult)result).Value);
        Assert.Empty(posts);
    }

    [Fact]
    public async Task GetAvailable_ReturnsUnauthorized()
    {
        // Arrange
        var mockContext = TestHelper.CreateMockDbContext();

        var userId = Guid.NewGuid().ToString();
        var user = new User
        {
            Id = userId,
            UserType = UserType.Teacher,
            EmailConfirmed = false
        };

        mockContext.Users.Add(user);
        mockContext.SaveChanges();

        var userManager = TestHelper.CreateMockUserManagerWithUsers([user]);

        var postController = new PostController(userManager, _logger.Object, mockContext, _cache);
        postController.ControllerContext = TestHelper.CreateControllerContextWithUser(userId);

        // Act
        var result = await postController.GetAvailable();

        // Assert
        Assert.IsType<UnauthorizedObjectResult>(result);
    }
}
