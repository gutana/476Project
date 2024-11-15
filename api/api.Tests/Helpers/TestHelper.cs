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

    public static ApplicationDbContext CreateMockDbContext()
    {
        var options = new DbContextOptionsBuilder<ApplicationDbContext>()
            .UseInMemoryDatabase("TestDb");
        return new ApplicationDbContext(options.Options);
    }

    public static UserManager<User> CreateMockUserManagerWithUsers(List<User> users)
    {
        var mockUserStore = new Mock<IQueryableUserStore<User>>();
        var mockUsers = users.AsQueryable().BuildMockDbSet();
        mockUserStore.Setup(s => s.Users).Returns(mockUsers.Object);
        return new UserManager<User>(mockUserStore.Object, null, null, null, null, null, null, null, null);
    }

    public static Mock<DbSet<T>> CreateMockDbSet<T>(List<T> list) where T : class
    {
        var mockStore = new Mock<IQueryable<T>>();
        return list.AsQueryable().BuildMockDbSet();
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
