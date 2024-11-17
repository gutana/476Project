using api.Controllers;
using api.Models;
using api.Tests.Helpers;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Logging;
using Moq;
using static api.Controllers.AdminController;

namespace api.Tests;

public class AdminTests
{
    private readonly Mock<ILogger<AdminController>> _logger;
    private readonly MemoryCache _cache;

    public AdminTests()
    {
        _logger = new Mock<ILogger<AdminController>>();
        _cache = new MemoryCache(new MemoryCacheOptions());
    }

    [Fact]
    public async Task ApproveUser_OnlyAdminCanApprove()
    {
        var uid1 = Guid.NewGuid();
        var uid2 = Guid.NewGuid();
        var uid3 = Guid.NewGuid();
        var uid4 = Guid.NewGuid();
        var uid5 = Guid.NewGuid();
        var uid6 = Guid.NewGuid();
        var unapprovedUserId = Guid.NewGuid();

        var unapprovedUser = new User() { Id = unapprovedUserId.ToString(), UserType = UserType.Substitute, EmailConfirmed = false };

        var mockDbContext = TestHelper.CreateMockDbContext();
        var userManager = TestHelper.CreateMockUserManagerWithUsers(new List<User>
        {
            new User() { Id = uid1.ToString(), UserType = UserType.Teacher, EmailConfirmed = false  },
            new User() { Id = uid2.ToString(), UserType = UserType.Teacher, EmailConfirmed = true  },
            new User() { Id = uid3.ToString(), UserType = UserType.Substitute, EmailConfirmed = false  },
            new User() { Id = uid4.ToString(), UserType = UserType.Substitute, EmailConfirmed = true  },
            new User() { Id = uid5.ToString(), UserType = UserType.Administrator, EmailConfirmed = false  },
            new User() { Id = uid6.ToString(), UserType = UserType.Administrator, EmailConfirmed = true  },
            unapprovedUser
        }, unapprovedUser);

        var adminController = new AdminController(userManager, _logger.Object, mockDbContext, _cache);

        ApproveAccountRequest req = new()
        {
            Id = unapprovedUserId.ToString(),
            Approved = true
        };

        adminController.ControllerContext = TestHelper.CreateControllerContextWithUser(uid1.ToString());
        var res1 = await adminController.ApproveUser(req);

        adminController.ControllerContext = TestHelper.CreateControllerContextWithUser(uid2.ToString());
        var res2 = await adminController.ApproveUser(req);

        adminController.ControllerContext = TestHelper.CreateControllerContextWithUser(uid3.ToString());
        var res3 = await adminController.ApproveUser(req);

        adminController.ControllerContext = TestHelper.CreateControllerContextWithUser(uid4.ToString());
        var res4 = await adminController.ApproveUser(req);

        adminController.ControllerContext = TestHelper.CreateControllerContextWithUser(uid5.ToString());
        var res5 = await adminController.ApproveUser(req);

        adminController.ControllerContext = TestHelper.CreateControllerContextWithUser(uid6.ToString());
        var res6 = await adminController.ApproveUser(req);

        Assert.IsType<UnauthorizedResult>(res1);
        Assert.IsType<UnauthorizedResult>(res2);
        Assert.IsType<UnauthorizedResult>(res3);
        Assert.IsType<UnauthorizedResult>(res4);
        Assert.IsType<UnauthorizedObjectResult>(res5); // ObjResult because controller returns unverified email msg
        Assert.IsType<OkResult>(res6);
    }

    [Fact]
    public async Task ApproveUser_OnlyAdminCanFetchUnapprovedUsers()
    {
        var uid1 = Guid.NewGuid();
        var uid2 = Guid.NewGuid();
        var uid3 = Guid.NewGuid();
        var uid4 = Guid.NewGuid();
        var uid5 = Guid.NewGuid();
        var uid6 = Guid.NewGuid();

        var mockDbContext = TestHelper.CreateMockDbContext();
        var userManager = TestHelper.CreateMockUserManagerWithUsers(new List<User>
        {
            new User() { Region = Region.Saskatoon, Id = uid1.ToString(), UserType = UserType.Teacher, EmailConfirmed = false  },
            new User() { Region = Region.Saskatoon, Id = uid2.ToString(), UserType = UserType.Teacher, EmailConfirmed = true  },
            new User() { Region = Region.Saskatoon, Id = uid3.ToString(), UserType = UserType.Substitute, EmailConfirmed = false  },
            new User() { Region = Region.Saskatoon, Id = uid4.ToString(), UserType = UserType.Substitute, EmailConfirmed = true  },
            new User() { Region = Region.Saskatoon, Id = uid5.ToString(), UserType = UserType.Administrator, EmailConfirmed = false  },
            new User() { Region = Region.Saskatoon, Id = uid6.ToString(), UserType = UserType.Administrator, EmailConfirmed = true  },
        });

        var adminController = new AdminController(userManager, _logger.Object, mockDbContext, _cache);

        adminController.ControllerContext = TestHelper.CreateControllerContextWithUser(uid1.ToString());
        var res1 = await adminController.GetUnapprovedUsers();

        adminController.ControllerContext = TestHelper.CreateControllerContextWithUser(uid2.ToString());
        var res2 = await adminController.GetUnapprovedUsers();

        adminController.ControllerContext = TestHelper.CreateControllerContextWithUser(uid3.ToString());
        var res3 = await adminController.GetUnapprovedUsers();

        adminController.ControllerContext = TestHelper.CreateControllerContextWithUser(uid4.ToString());
        var res4 = await adminController.GetUnapprovedUsers();

        adminController.ControllerContext = TestHelper.CreateControllerContextWithUser(uid5.ToString());
        var res5 = await adminController.GetUnapprovedUsers();

        adminController.ControllerContext = TestHelper.CreateControllerContextWithUser(uid6.ToString());
        var res6 = await adminController.GetUnapprovedUsers();

        Assert.IsType<UnauthorizedResult>(res1);
        Assert.IsType<UnauthorizedResult>(res2);
        Assert.IsType<UnauthorizedResult>(res3);
        Assert.IsType<UnauthorizedResult>(res4);
        Assert.IsType<UnauthorizedObjectResult>(res5); // ObjResult because controller returns unverified email msg
        Assert.IsType<OkObjectResult>(res6);
    }
}
