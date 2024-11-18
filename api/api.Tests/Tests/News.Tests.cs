using api.Controllers;
using api.DTO;
using api.Models;
using api.Tests.Helpers;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Logging;

using Moq;

namespace api.Tests;

public class NewsTests
{
    private readonly Mock<ILogger<NewsController>> _logger;
    private readonly MemoryCache _cache;

    public NewsTests()
    {
        _logger = new Mock<ILogger<NewsController>>();
        _cache = new MemoryCache(new MemoryCacheOptions());
    }

    [Fact]
    public async Task CreateNews_NonexistentUser_ReturnsUnauthorized()
    {
        // Arrange
        var mockDbContext = TestHelper.CreateMockDbContext("CreateNews_NonexistentUser_ReturnsUnauthorized");
        var userManager = TestHelper.CreateMockUserManagerWithUsers([]);
        var newsController = new NewsController(userManager, _logger.Object, mockDbContext, _cache);
        newsController.ControllerContext = TestHelper.CreateControllerContextWithUser(Guid.NewGuid().ToString());

        var dto = new CreateNewsPostDto();

        // Act
        var result = await newsController.Create(dto);

        // Assert
        Assert.IsType<UnauthorizedResult>(result);
    }

    [Fact]
    public async Task CreateNews_UnauthorizedUsers_ReturnsUnauthorized()
    {
        // Arrange
        var subId = Guid.NewGuid().ToString();
        var teachId = Guid.NewGuid().ToString();
        var adminId = Guid.NewGuid().ToString();

        var mockDbContext = TestHelper.CreateMockDbContext("CreateNews_UnauthorizedUsers_ReturnsUnauthorized");
        var userManager = TestHelper.CreateMockUserManagerWithUsers(new List<User>
        {
            new User() { Id = subId, UserType = UserType.Substitute },
            new User() { Id = teachId, UserType = UserType.Teacher, EmailConfirmed = true },
            new User() { Id = adminId, UserType = UserType.Administrator, EmailConfirmed = true }
        });

        var newsController = new NewsController(userManager, _logger.Object, mockDbContext, _cache);
        var dto = new CreateNewsPostDto();

        // Act for substitute
        newsController.ControllerContext = TestHelper.CreateControllerContextWithUser(subId);
        var subResult = await newsController.Create(dto);

        // Act for teacher
        newsController.ControllerContext = TestHelper.CreateControllerContextWithUser(teachId);
        var teachResult = await newsController.Create(dto);

        // Assert
        Assert.IsType<UnauthorizedResult>(subResult);
        Assert.IsType<UnauthorizedResult>(teachResult);
    }

    [Fact]
    public async Task CreateNews_SuccessfullyCreates()
    {
        // Arrange
        var mockContext = TestHelper.CreateMockDbContext("CreateNews_SuccessfullyCreates");

        var userId = Guid.NewGuid().ToString();
        var user = new User { Id = userId, UserType = UserType.Administrator, EmailConfirmed = true };

        var userManager = TestHelper.CreateMockUserManagerWithUsers([user]);

        var dto = new CreateNewsPostDto() { Title = "Title", Content = "Content" };

        var newsController = new NewsController(userManager, _logger.Object, mockContext, _cache);
        newsController.ControllerContext = TestHelper.CreateControllerContextWithUser(userId);

        // Act
        var result = await newsController.Create(dto);
        var newsPosts = await newsController.GetLatest();

        // Assert
        Assert.IsType<OkResult>(result);
        Assert.IsType<OkObjectResult>(newsPosts);

        List<NewsPost> value = (List<NewsPost>)((OkObjectResult)newsPosts).Value;

        Assert.Equal("Title", value[0].Title);
        Assert.Equal("Content", value[0].Content);
        Assert.Single(value);
    }

    [Fact]
    public async Task GetLatest_ReturnsLatestNews()
    {
        // Arrange
        var existingPost = new NewsPost() { Title = "ABC", Content = "DEF" };

        var mockContext = TestHelper.CreateMockDbContext("GetLatest_ReturnsLatestNews");

        mockContext.NewsPosts = MockDbSetFactory<List<NewsPost>>.CreateMockDbSet([existingPost]).Object;

        var userId = Guid.NewGuid().ToString();
        var user = new User { Id = userId, UserType = UserType.Administrator, EmailConfirmed = true };
        var userManager = TestHelper.CreateMockUserManagerWithUsers([user]);

        var newsController = new NewsController(userManager, _logger.Object, mockContext, _cache);
        newsController.ControllerContext = TestHelper.CreateControllerContextWithUser(userId);

        // Act
        var newsPosts = await newsController.GetLatest();
        List<NewsPost> value = (List<NewsPost>)((OkObjectResult)newsPosts).Value;

        // Assert
        Assert.IsType<OkObjectResult>(newsPosts);

        Assert.Equal("ABC", value[0].Title);
        Assert.Equal("DEF", value[0].Content);
    }
}

