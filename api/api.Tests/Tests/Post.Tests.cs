using api.Controllers;
using api.DTO;
using api.Models;
using api.Tests.Helpers;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Logging;
using Moq;

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
        var subsController = new PostController(userManager, _logger.Object, mockContext, _cache);
        subsController.ControllerContext = TestHelper.CreateControllerContextWithUser(userId);

        // Act
        var result = await subsController.GetApprovedSubs();

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

        var subsController = new PostController(userManager, _logger.Object, mockContext, _cache);
            subsController.ControllerContext = TestHelper.CreateControllerContextWithUser("1234");
        // Act
        var result = await subsController.GetApprovedSubs();

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

        var subsController = new PostController(userManager, _logger.Object, mockContext, _cache);
        subsController.ControllerContext = TestHelper.CreateControllerContextWithUser(userId);

        // Act
        var result = await subsController.GetApprovedSubs();

        // Assert
        Assert.IsType<ObjectResult>(result);

        var problemResult = (ObjectResult)result;
        Assert.Equal(500, problemResult.StatusCode);
        Assert.Equal("Account has to be verified by an administrator.", problemResult.Value);
    }

}
