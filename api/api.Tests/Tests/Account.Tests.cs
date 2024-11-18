using api.Controllers;
using api.DTO;
using api.Models;
using api.Tests.Helpers;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Logging;
using Moq;
using static api.Controllers.AccountController;

namespace api.Tests;

public class AccountTests
{
    private readonly Mock<ILogger<AccountController>> _logger;
    private readonly MemoryCache _cache;
    private readonly Mock<IPasswordHasher<User>> _hasher;

    public AccountTests()
    {
        _logger = new Mock<ILogger<AccountController>>();
        _cache = new MemoryCache(new MemoryCacheOptions());
        _hasher = new Mock<IPasswordHasher<User>>();
    }

    [Fact]
    public async Task Register_IsSuccessful()
    {
        // Arrange
        var mockDbContext = TestHelper.CreateMockDbContext("Register_IsSuccessful");
        var userManager = TestHelper.CreateMockUserManagerWithUsers([]);

        var signInManager = new Mock<SignInManager<User>>(userManager, 
            Mock.Of<IHttpContextAccessor>(), 
            Mock.Of<IUserClaimsPrincipalFactory<User>>(),
            null, null, null, null);

        var accountController = new AccountController(userManager, signInManager.Object, _logger.Object, _hasher.Object, mockDbContext, _cache);


        School school = new School()
        {
            Id = Guid.NewGuid().ToString(),
            SchoolName = "Test School",
            SchoolType = SchoolType.Secondary,
        };

        mockDbContext.Schools = MockDbSetFactory<List<School>>.CreateMockDbSet([school]).Object;

        RegistrationDto req = new()
        {
            FirstName = "Test",
            LastName = "User",
            Email = "Test",
            PhoneNumber = "123",
            Password = "password",
            Region = Region.Regina,
            SchoolId = school.Id,
            UserType = UserType.Teacher
        };

        var res = await accountController.Register(req);

        Assert.IsType<OkResult>(res);

    }

    [Fact]
    public async Task RegisterWithIncompleteData_ReturnsBadRequest()
    {
        // Arrange
        var mockDbContext = TestHelper.CreateMockDbContext("RegisterWithIncompleteData_ReturnsBadRequest");
        var userManager = TestHelper.CreateMockUserManagerWithUsers([]);

        var signInManager = new Mock<SignInManager<User>>(userManager, 
            Mock.Of<IHttpContextAccessor>(), 
            Mock.Of<IUserClaimsPrincipalFactory<User>>(),
            null, null, null, null);

        var accountController = new AccountController(userManager, signInManager.Object, _logger.Object, _hasher.Object, mockDbContext, _cache);


        School school = new School()
        {
            Id = Guid.NewGuid().ToString(),
            SchoolName = "Test School",
            SchoolType = SchoolType.Secondary,
        };

        mockDbContext.Schools = MockDbSetFactory<List<School>>.CreateMockDbSet([school]).Object;

        RegistrationDto req = new()
        {
            FirstName = "Test",
            LastName = "User",
            PhoneNumber = "123",
            Password = "password",
            SchoolId = school.Id,
            UserType = UserType.Teacher
        };

        var res = await accountController.Register(req);

        Assert.IsType<BadRequestResult>(res);

    }

    [Fact]
    public async Task GetUser_ReturnsUserDto()
    {
         // Arrange
        var mockDbContext = TestHelper.CreateMockDbContext("GetUser_ReturnsUserDto");
        var user = new User() { Id = Guid.NewGuid().ToString(), UserType = UserType.Administrator, Region = Region.Regina };
        var userManager = TestHelper.CreateMockUserManagerWithUsers([user]);

        var signInManager = new Mock<SignInManager<User>>(userManager, 
            Mock.Of<IHttpContextAccessor>(), 
            Mock.Of<IUserClaimsPrincipalFactory<User>>(),
            null, null, null, null);

        var accountController = new AccountController(userManager, signInManager.Object, _logger.Object, _hasher.Object, mockDbContext, _cache);
        accountController.ControllerContext = TestHelper.CreateControllerContextWithUser(user.Id);

        var res = await accountController.GetUser();

        Assert.IsType<OkObjectResult>(res);
        var result = (UserDto)((OkObjectResult)res).Value;

        Assert.Equal(user.Id, result.Id);
        Assert.Equal(user.Region, result.Region);
        Assert.Equal(user.UserType, result.UserType);
       
    }

    [Fact]
    public async Task GetUser_ReturnsUnauthorized()
    {
         // Arrange
        var mockDbContext = TestHelper.CreateMockDbContext("GetUser_ReturnsUnauthorized");
        var user = new User() { Id = Guid.NewGuid().ToString(), UserType = UserType.Administrator, Region = Region.Regina };
        var userManager = TestHelper.CreateMockUserManagerWithUsers([]);

        var signInManager = new Mock<SignInManager<User>>(userManager, 
            Mock.Of<IHttpContextAccessor>(), 
            Mock.Of<IUserClaimsPrincipalFactory<User>>(),
            null, null, null, null);

        var accountController = new AccountController(userManager, signInManager.Object, _logger.Object, _hasher.Object, mockDbContext, _cache);
        accountController.ControllerContext = TestHelper.CreateControllerContextWithUser("123");

        var res = await accountController.GetUser();

        Assert.IsType<UnauthorizedResult>(res);
    }

    [Fact]
    public async Task EditInfo_IsSuccessful()
    {
         // Arrange
        var mockDbContext = TestHelper.CreateMockDbContext("EditInfo_IsSuccessful");
        var user = new User() { Id = Guid.NewGuid().ToString(), UserType = UserType.Administrator, Region = Region.Regina, EmailConfirmed = true };
        var userManager = TestHelper.CreateMockUserManagerWithUsers([user]);

        mockDbContext.Users = MockDbSetFactory<List<User>>.CreateMockDbSet(userManager.Users.ToList()).Object;

        var signInManager = new Mock<SignInManager<User>>(userManager, 
            Mock.Of<IHttpContextAccessor>(), 
            Mock.Of<IUserClaimsPrincipalFactory<User>>(),
            null, null, null, null);

        var accountController = new AccountController(userManager, signInManager.Object, _logger.Object, _hasher.Object, mockDbContext, _cache);
        accountController.ControllerContext = TestHelper.CreateControllerContextWithUser(user.Id);

        EditInfoDto dto = new EditInfoDto()
        {
            FirstName = "Test",
            LastName = "LastName",
            Email = "1@2.com",
            PhoneNumber = "333",
            Region = Region.Saskatoon,
            SchoolId = null
        };

        var res = await accountController.EditInfo(dto);

        Assert.IsType<OkObjectResult>(res);
    }

    [Fact]
    public async Task EditInfo_ReturnsUnauthorized()
    {
         // Arrange
        var mockDbContext = TestHelper.CreateMockDbContext("EditInfo_ReturnsUnauthorized");
        var user = new User() { Id = Guid.NewGuid().ToString(), UserType = UserType.Administrator, Region = Region.Regina, EmailConfirmed = false };
        var userManager = TestHelper.CreateMockUserManagerWithUsers([user]);

        mockDbContext.Users = MockDbSetFactory<List<User>>.CreateMockDbSet(userManager.Users.ToList()).Object;

        var signInManager = new Mock<SignInManager<User>>(userManager, 
            Mock.Of<IHttpContextAccessor>(), 
            Mock.Of<IUserClaimsPrincipalFactory<User>>(),
            null, null, null, null);

        var accountController = new AccountController(userManager, signInManager.Object, _logger.Object, _hasher.Object, mockDbContext, _cache);
        accountController.ControllerContext = TestHelper.CreateControllerContextWithUser(user.Id);

        EditInfoDto dto = new EditInfoDto()
        {
            FirstName = "Test",
            LastName = "LastName",
            Email = "1@2.com",
            PhoneNumber = "333",
            Region = Region.Saskatoon,
            SchoolId = null
        };

        var res = await accountController.EditInfo(dto);

        Assert.IsType<UnauthorizedObjectResult>(res);
    }

    [Fact]
    public async Task AddCourseToProfile_DoesntAllowAdmins()
    {
         // Arrange
        var mockDbContext = TestHelper.CreateMockDbContext("AddCourseToProfile_DoesntAllowAdmins");
        var user = new User() { Id = Guid.NewGuid().ToString(), UserType = UserType.Administrator, Region = Region.Regina, EmailConfirmed = true };
        var userManager = TestHelper.CreateMockUserManagerWithUsers([user]);

        mockDbContext.Users = MockDbSetFactory<List<User>>.CreateMockDbSet(userManager.Users.ToList()).Object;
        var signInManager = new Mock<SignInManager<User>>(userManager, 
            Mock.Of<IHttpContextAccessor>(), 
            Mock.Of<IUserClaimsPrincipalFactory<User>>(),
            null, null, null, null);

        var accountController = new AccountController(userManager, signInManager.Object, _logger.Object, _hasher.Object, mockDbContext, _cache);
        accountController.ControllerContext = TestHelper.CreateControllerContextWithUser(user.Id);

        AddCourseToProfileRequest dto = new AddCourseToProfileRequest()
        {
            grades = new() {  },
            primarySchoolSubject = new() { },
            secondarySchoolSubject = new() { },
            startTime = "2024",
            endTime = "2025",
            information = "1234"
        };

        var res = await accountController.AddCourseToProfile(dto);

        Assert.IsType<UnauthorizedResult>(res);
    }

    [Fact]
    public async Task AddCourseToProfile_ReturnsBadRequestWhenInvalidTimes()
    {
         // Arrange
        var mockDbContext = TestHelper.CreateMockDbContext("AddCourseToProfile_ReturnsBadRequestWhenInvalidTimes");
        var user = new User() { Id = Guid.NewGuid().ToString(), UserType = UserType.Teacher, Region = Region.Regina, EmailConfirmed = true };
        var userManager = TestHelper.CreateMockUserManagerWithUsers([user]);


        mockDbContext.Users = MockDbSetFactory<List<User>>.CreateMockDbSet(userManager.Users.ToList()).Object;

        var signInManager = new Mock<SignInManager<User>>(userManager, 
            Mock.Of<IHttpContextAccessor>(), 
            Mock.Of<IUserClaimsPrincipalFactory<User>>(),
            null, null, null, null);

        var accountController = new AccountController(userManager, signInManager.Object, _logger.Object, _hasher.Object, mockDbContext, _cache);
        accountController.ControllerContext = TestHelper.CreateControllerContextWithUser(user.Id);

        AddCourseToProfileRequest dto = new AddCourseToProfileRequest()
        {
            grades = new() {  },
            primarySchoolSubject = new() { },
            secondarySchoolSubject = new() { },
            startTime = "2024",
            endTime = "2025",
            information = "1234"
        };

        var res = await accountController.AddCourseToProfile(dto);

        Assert.IsType<BadRequestResult>(res);
    }

    [Fact]
    public async Task AddCourseToProfile_ReturnsOk()
    {
         // Arrange
        var mockDbContext = TestHelper.CreateMockDbContext("AddCourseToProfile_ReturnsOk");
        var user = new User() { Id = Guid.NewGuid().ToString(), UserType = UserType.Teacher, Region = Region.Regina, EmailConfirmed = true };
        var userManager = TestHelper.CreateMockUserManagerWithUsers([user]);


        mockDbContext.Users = MockDbSetFactory<List<User>>.CreateMockDbSet(userManager.Users.ToList()).Object;

        var signInManager = new Mock<SignInManager<User>>(userManager, 
            Mock.Of<IHttpContextAccessor>(), 
            Mock.Of<IUserClaimsPrincipalFactory<User>>(),
            null, null, null, null);

        var accountController = new AccountController(userManager, signInManager.Object, _logger.Object, _hasher.Object, mockDbContext, _cache);
        accountController.ControllerContext = TestHelper.CreateControllerContextWithUser(user.Id);

        AddCourseToProfileRequest dto = new AddCourseToProfileRequest()
        {
            grades = new() {  },
            primarySchoolSubject = new() { },
            secondarySchoolSubject = SecondarySchoolSubject.Math,
            startTime = "20:24",
            endTime = "20:25",
            information = "1234"
        };

        var res = await accountController.AddCourseToProfile(dto);

        var usr = await accountController.GetUser();

        Assert.IsType<OkResult>(res);
        Assert.Equal(SecondarySchoolSubject.Math, ((UserDto)(((OkObjectResult)usr).Value)).secondarySchoolCourses[0].subject);
        Assert.Equal(20, ((UserDto)((OkObjectResult)usr).Value).secondarySchoolCourses[0].startTime.Hour);
        Assert.Equal(24, ((UserDto)((OkObjectResult)usr).Value).secondarySchoolCourses[0].startTime.Minute); 
        Assert.Equal(20, ((UserDto)((OkObjectResult)usr).Value).secondarySchoolCourses[0].endTime.Hour);
        Assert.Equal(25, ((UserDto)((OkObjectResult)usr).Value).secondarySchoolCourses[0].endTime.Minute);
    }

    [Fact]
    public async Task DeleteCourseFromProfile_ReturnsOk()
    {
         // Arrange
        var mockDbContext = TestHelper.CreateMockDbContext("DeleteCourseFromProfile_ReturnsOk");
        string courseId = Guid.NewGuid().ToString();
        var user = new User()
        {
            Id = Guid.NewGuid().ToString(),
            UserType = UserType.Teacher,
            Region = Region.Regina,
            EmailConfirmed = true,
            primarySchoolCourses = new List<PrimarySchoolCourse> { new PrimarySchoolCourse
            {
                Id = courseId,
                subject = PrimarySchoolSubject.CoreFrench
            }}
        };

        var userManager = TestHelper.CreateMockUserManagerWithUsers([user]);

        mockDbContext.Users = MockDbSetFactory<List<User>>.CreateMockDbSet(userManager.Users.ToList()).Object;


        var mockCoursesDbSet = MockDbSetFactory<List<PrimarySchoolCourse>>.CreateMockDbSet( new List<PrimarySchoolCourse> { new PrimarySchoolCourse
            {
                Id = Guid.NewGuid().ToString(),
                subject = PrimarySchoolSubject.CoreFrench
            }});

        mockDbContext.PrimarySchoolCourses = mockCoursesDbSet.Object;

        var signInManager = new Mock<SignInManager<User>>(userManager, 
            Mock.Of<IHttpContextAccessor>(), 
            Mock.Of<IUserClaimsPrincipalFactory<User>>(),
            null, null, null, null);

        var accountController = new AccountController(userManager, signInManager.Object, _logger.Object, _hasher.Object, mockDbContext, _cache);
        accountController.ControllerContext = TestHelper.CreateControllerContextWithUser(user.Id);

        var res = await accountController.DeleteCourse(courseId);
        var usr = await accountController.GetUser();

        Assert.IsType<OkResult>(res);
        Assert.Equal(0, ((UserDto)((OkObjectResult)usr).Value).primarySchoolCourses.Count);
    }

    [Fact]
    public async Task DeleteAnotherUsersCourse_ReturnsBadRequest()
    {
         // Arrange
        var mockDbContext = TestHelper.CreateMockDbContext("DeleteAnotherUsersCourse_ReturnsBadRequest");
        string courseId = Guid.NewGuid().ToString();
        string courseId2 = Guid.NewGuid().ToString();
        var user = new User()
        {
            Id = Guid.NewGuid().ToString(),
            UserType = UserType.Teacher,
            Region = Region.Regina,
            EmailConfirmed = true,
            primarySchoolCourses = new List<PrimarySchoolCourse> { new PrimarySchoolCourse
            {
                Id = courseId,
                subject = PrimarySchoolSubject.CoreFrench
            }}
        };
        var user2 = new User()
        {
            Id = Guid.NewGuid().ToString(),
            UserType = UserType.Teacher,
            Region = Region.Regina,
            EmailConfirmed = true,
            primarySchoolCourses = new List<PrimarySchoolCourse> { new PrimarySchoolCourse
            {
                Id = courseId2,
                subject = PrimarySchoolSubject.CoreFrench
            }}
        };


        var userManager = TestHelper.CreateMockUserManagerWithUsers([user, user2]);

        mockDbContext.Users = MockDbSetFactory<List<User>>.CreateMockDbSet(userManager.Users.ToList()).Object;

        var mockCoursesDbSet = MockDbSetFactory<List<PrimarySchoolCourse>>.CreateMockDbSet( new List<PrimarySchoolCourse> { new PrimarySchoolCourse
            {
                Id = Guid.NewGuid().ToString(),
                subject = PrimarySchoolSubject.CoreFrench
            }});

        mockDbContext.PrimarySchoolCourses = mockCoursesDbSet.Object;

        var signInManager = new Mock<SignInManager<User>>(userManager, 
            Mock.Of<IHttpContextAccessor>(), 
            Mock.Of<IUserClaimsPrincipalFactory<User>>(),
            null, null, null, null);

        var accountController = new AccountController(userManager, signInManager.Object, _logger.Object, _hasher.Object, mockDbContext, _cache);
        accountController.ControllerContext = TestHelper.CreateControllerContextWithUser(user.Id);

        var res = await accountController.DeleteCourse(courseId2);

        Assert.IsType<BadRequestResult>(res);
    }
}
