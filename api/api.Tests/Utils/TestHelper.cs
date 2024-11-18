using api.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MockQueryable.Moq;
using Moq;
using System.Security.Claims;

namespace api.Tests.Helpers;

public static class TestHelper
{
    public static ControllerContext CreateControllerContextWithUser(string userId)
    {
        var controllerContext = new ControllerContext
        {
            HttpContext = new DefaultHttpContext
            {
                User = CreateClaimsPrincipal(userId)
            }
        };
        return controllerContext;
    }

    public static ApplicationDbContext CreateMockDbContext(string dbName)
    {
        var options = new DbContextOptionsBuilder<ApplicationDbContext>()
            .UseInMemoryDatabase(dbName);
        return new ApplicationDbContext(options.Options);
    }

    public static UserManager<User> CreateMockUserManagerWithUsers(List<User> users, User? userManagerFindByIdShouldReturn = null)
    {
        var mockUserStore = new Mock<IQueryableUserStore<User>>();
        var mockUsers = users.AsQueryable().BuildMockDbSet();
        mockUserStore.Setup(s => s.Users).Returns(mockUsers.Object);
        mockUserStore.Setup(s => s.UpdateAsync(It.IsAny<User?>(), It.IsAny<CancellationToken>())).ReturnsAsync(IdentityResult.Success);
        mockUserStore.Setup(s => s.CreateAsync(It.IsAny<User>(), It.IsAny<CancellationToken>())).ReturnsAsync(IdentityResult.Success);
        if (userManagerFindByIdShouldReturn != null)
            mockUserStore.Setup(s => s.FindByIdAsync(It.IsAny<string>(), It.IsAny<CancellationToken>())).ReturnsAsync(userManagerFindByIdShouldReturn);

        return new UserManager<User>(mockUserStore.Object, null, null, null, null, null, null, null, null);
    }

    private static ClaimsPrincipal CreateClaimsPrincipal(string userId)
    {
        var claims = new List<Claim>
        {
            new Claim(ClaimTypes.NameIdentifier, userId)
        };

        return new ClaimsPrincipal(new ClaimsIdentity(claims, "TestAuthType"));
    }
}

public static class MockDbSetFactory<T>
{
    public static Mock<DbSet<T>> CreateMockDbSet<T>(List<T> list) where T : class
    {
        var mockStore = new Mock<IQueryable<T>>();
        return list.AsQueryable().BuildMockDbSet();
    }
}
