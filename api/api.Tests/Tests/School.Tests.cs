using api.Controllers;
using api.DTO;
using api.Models;
using api.Tests.Helpers;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Logging;
using Moq;

namespace api.Tests;

public class SchoolTests
{
    private readonly Mock<ILogger<SchoolController>> _logger;
    private readonly MemoryCache _cache;

    public SchoolTests()
    {
        _logger = new Mock<ILogger<SchoolController>>();
        _cache = new MemoryCache(new MemoryCacheOptions());
    }

    [Fact]
    public async Task AddSchool_OnlySuccessful_ForAuthedUser()
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
            new User() { Id = uid1.ToString(), UserType = UserType.Teacher, EmailConfirmed = false  },
            new User() { Id = uid2.ToString(), UserType = UserType.Teacher, EmailConfirmed = true  },
            new User() { Id = uid3.ToString(), UserType = UserType.Substitute, EmailConfirmed = false  },
            new User() { Id = uid4.ToString(), UserType = UserType.Substitute, EmailConfirmed = true  },
            new User() { Id = uid5.ToString(), UserType = UserType.Administrator, EmailConfirmed = false  },
            new User() { Id = uid6.ToString(), UserType = UserType.Administrator, EmailConfirmed = true  },
        });

        var schoolController = new SchoolController(userManager, _logger.Object, mockDbContext, _cache);

        SchoolDto schoolDto = new()
        {
            SchoolName = "TestSchool",
            PhoneNumber = "1234567890",
            Address = "123TestSt",
            City = "Regina",
            PostalCode = "123456",
        };

        schoolController.ControllerContext = TestHelper.CreateControllerContextWithUser(uid1.ToString());
        var res1 = await schoolController.AddSchool(schoolDto);

        schoolController.ControllerContext = TestHelper.CreateControllerContextWithUser(uid2.ToString());
        var res2 = await schoolController.AddSchool(schoolDto);

        schoolController.ControllerContext = TestHelper.CreateControllerContextWithUser(uid3.ToString());
        var res3 = await schoolController.AddSchool(schoolDto);

        schoolController.ControllerContext = TestHelper.CreateControllerContextWithUser(uid4.ToString());
        var res4 = await schoolController.AddSchool(schoolDto);

        schoolController.ControllerContext = TestHelper.CreateControllerContextWithUser(uid5.ToString());
        var res5 = await schoolController.AddSchool(schoolDto);

        schoolController.ControllerContext = TestHelper.CreateControllerContextWithUser(uid6.ToString());
        var res6 = await schoolController.AddSchool(schoolDto);

        var schoolsResult = await schoolController.GetAllSchools();
        List<School> schools = (List<School>)((OkObjectResult)schoolsResult).Value;

        Assert.IsType<UnauthorizedResult>(res1);
        Assert.IsType<UnauthorizedResult>(res2);
        Assert.IsType<UnauthorizedResult>(res3);
        Assert.IsType<UnauthorizedResult>(res4);
        Assert.IsType<UnauthorizedObjectResult>(res5); // ObjResult because controller returns unverified email msg
        Assert.IsType<OkObjectResult>(res6);

        Assert.Equal("TestSchool", schools[0].SchoolName);
        Assert.Single(schools);
    }

    [Fact]
    public async Task GetByRegion_ReturnsAppropriateSchools()
    {
        var uid1 = Guid.NewGuid();

        var mockDbContext = TestHelper.CreateMockDbContext();
        var userManager = TestHelper.CreateMockUserManagerWithUsers(new List<User> 
            { new User() { Id = uid1.ToString(), UserType = UserType.Teacher, EmailConfirmed = false  }});

        List<School> mockSchools = [];
        mockSchools.Add(new School { Id = Guid.NewGuid().ToString(), Region = Region.Regina, SchoolName = "ReginaSchool" });
        mockSchools.Add(new School { Id = Guid.NewGuid().ToString(), Region = Region.Saskatoon, SchoolName = "SaskatoonSchool" });

        mockDbContext.Schools = TestHelper.CreateMockDbSet(mockSchools).Object;
        var schoolController = new SchoolController(userManager, _logger.Object, mockDbContext, _cache);

        schoolController.ControllerContext = TestHelper.CreateControllerContextWithUser(uid1.ToString());

        var rSchoolsRes = await schoolController.GetByRegion(Region.Regina);
        var sSchoolsRes = await schoolController.GetByRegion(Region.Saskatoon);

        List<School> reginaSchools = (List<School>)((OkObjectResult)rSchoolsRes).Value;
        List<School> saskatoonSchools = (List<School>)((OkObjectResult)sSchoolsRes).Value;

        Assert.Single(reginaSchools);
        Assert.Single(saskatoonSchools);

        Assert.Equal("ReginaSchool", reginaSchools[0].SchoolName);
        Assert.Equal("SaskatoonSchool", saskatoonSchools[0].SchoolName);

    }
    
    [Fact]
    public async Task GetAll_ReturnsAll()
    {
        var uid1 = Guid.NewGuid();

        var mockDbContext = TestHelper.CreateMockDbContext();
        var userManager = TestHelper.CreateMockUserManagerWithUsers(new List<User> 
            { new User() { Id = uid1.ToString(), UserType = UserType.Teacher, EmailConfirmed = false  }});

        List<School> mockSchools = [];
        mockSchools.Add(new School { Id = Guid.NewGuid().ToString(), Region = Region.Regina, SchoolName = "ReginaSchool" });
        mockSchools.Add(new School { Id = Guid.NewGuid().ToString(), Region = Region.Saskatoon, SchoolName = "SaskatoonSchool" });

        mockDbContext.Schools = TestHelper.CreateMockDbSet(mockSchools).Object;
        var schoolController = new SchoolController(userManager, _logger.Object, mockDbContext, _cache);

        schoolController.ControllerContext = TestHelper.CreateControllerContextWithUser(uid1.ToString());

        var res = await schoolController.GetAllSchools();

        List<School> allSchools = (List<School>)((OkObjectResult)res).Value;

        Assert.Equal(2, allSchools.Count);
        Assert.Equal("ReginaSchool", allSchools[0].SchoolName);
        Assert.Equal("SaskatoonSchool", allSchools[1].SchoolName);
    }
}
