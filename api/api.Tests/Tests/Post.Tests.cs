using api.Controllers;
using api.DTO;
using api.Models;
using api.Utilities;
using api.Tests.Helpers;
using Microsoft.AspNetCore.Components;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Logging;
using Moq;
using System.Configuration;
using System.ComponentModel;
using System.Reflection;
using Microsoft.SqlServer.Server;

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
        var mockContext = TestHelper.CreateMockDbContext("GetApprovedSubs_ReturnsApprovedSubsForUserRegion");

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
        var mockContext = TestHelper.CreateMockDbContext("GetApprovedSubs_ReturnsUnauthorizedWhenUserIsNull");
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
        var mockContext = TestHelper.CreateMockDbContext("GetApprovedSubs_ReturnsProblemWhenUserNotVerified");

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
        var mockContext = TestHelper.CreateMockDbContext("GetByUser_ReturnsUnauthorized");

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
        var mockContext = TestHelper.CreateMockDbContext("GetByUser_ReturnsPostsByUser");

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
        var mockContext = TestHelper.CreateMockDbContext("GetByUser_AdminCanFetchByUserId");

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
        var mockContext = TestHelper.CreateMockDbContext("GetByUser_IgnoresUserIdParameterWhenUserNotAdmin");

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
        var mockContext = TestHelper.CreateMockDbContext("GetAvailable_ReturnsUnauthorized");

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

    [Fact]
    public async Task GetAvailable_ReturnsOnlyAvailablePosts()
    {
        // Arrange 
        var mockContext = TestHelper.CreateMockDbContext("GetAvailable_ReturnsOnlyAvailablePosts");

        var userId = Guid.NewGuid().ToString();
        var user = new User
        {
            Id = userId,
            FirstName = "GetOnlyAvailablePosts",
            UserType = UserType.Substitute, 
            Region = Region.Regina,
            EmailConfirmed = true
        };

        var school = new School()
        {
            Id = Guid.NewGuid().ToString(),
            Region = Region.Regina
        };

        var doa = Time.UtcToSaskTime(DateTime.UtcNow).AddDays(5).Date;

        var postId = Guid.NewGuid().ToString();
        var post1 = new Post
        {
            Id = postId,
            Poster = new User() { Id = Guid.NewGuid().ToString() },
            School = school,
            DateOfAbsence = doa,
            AcceptedByUser = null
        };

        var post2 = new Post
        {
            Id = Guid.NewGuid().ToString(),
            Poster = new User() { Id = Guid.NewGuid().ToString() },
            School = school,
            DateOfAbsence = doa,
            AcceptedByUser = new User() { Id = Guid.NewGuid().ToString() }
        };

        // Tests that it won't retrieve expired posts
        var post3 = new Post
        {
            Id = Guid.NewGuid().ToString(),
            Poster = new User() { Id = Guid.NewGuid().ToString() },
            School = school,
            DateOfAbsence = doa.AddDays(-6),
            AcceptedByUser = null
        };

        mockContext.Users.Add(user);
        mockContext.Posts.Add(post1);
        mockContext.Posts.Add(post2);
        mockContext.Posts.Add(post3);
        mockContext.SaveChanges();

        var userManager = TestHelper.CreateMockUserManagerWithUsers([user]);

        var postController = new PostController(userManager, _logger.Object, mockContext, _cache);
        postController.ControllerContext = TestHelper.CreateControllerContextWithUser(userId);

        // Act
        var result = await postController.GetAvailable();

        // Assert
        Assert.IsType<OkObjectResult>(result);
        List<PostDto> posts = (List<PostDto>)(((OkObjectResult)result).Value);
        Assert.Single(posts);
        Assert.Equal(postId, posts[0].Id);
    }

    [Fact]
    public async Task GetTakenByUser_ReturnUnauthorized()
    {
        // Arrange
        var mockContext = TestHelper.CreateMockDbContext("GetTakenByUser_ReturnUnauthorized");

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
        var result = await postController.GetTakenByUser();

        // Assert
        Assert.IsType<UnauthorizedObjectResult>(result);
    }

    [Fact]
    public async Task GetTakenByUser_OnlyReturnsPostsTakenByCurrentUser()
    {
        // Arrange 
        var mockContext = TestHelper.CreateMockDbContext("GetTakenByUser_OnlyReturnsPostsTakenByCurrentUser");

        var userId = Guid.NewGuid().ToString();
        var user = new User
        {
            Id = userId,
            UserType = UserType.Substitute, 
            Region = Region.Regina,
            EmailConfirmed = true
        };

        var school = new School()
        {
            Id = Guid.NewGuid().ToString(),
            Region = Region.Regina
        };

        var doa = Time.UtcToSaskTime(DateTime.UtcNow).AddDays(5).Date;

        var postId = Guid.NewGuid().ToString();
        var post1 = new Post
        {
            Id = postId,
            Poster = new User() { Id = Guid.NewGuid().ToString() },
            School = school,
            DateOfAbsence = doa,
            AcceptedByUser = user
        };

        var post2 = new Post
        {
            Id = Guid.NewGuid().ToString(),
            Poster = new User() { Id = Guid.NewGuid().ToString() },
            School = school,
            DateOfAbsence = doa,
            AcceptedByUser = null
        };

        mockContext.Users.Add(user);
        mockContext.Posts.Add(post1);
        mockContext.Posts.Add(post2);
        mockContext.SaveChanges();

        var userManager = TestHelper.CreateMockUserManagerWithUsers([user]);

        var postController = new PostController(userManager, _logger.Object, mockContext, _cache);
        postController.ControllerContext = TestHelper.CreateControllerContextWithUser(userId);

        // Act
        var result = await postController.GetTakenByUser();

        // Assert
        Assert.IsType<OkObjectResult>(result);
        List<PostDto> posts = (List<PostDto>)(((OkObjectResult)result).Value);
        Assert.Single(posts);
        Assert.Equal(postId, posts[0].Id);
    }

    [Fact]
    public async Task GetAll_OnlyAdminCanGetAllPosts()
    {
        // Arrange 
        var mockContext = TestHelper.CreateMockDbContext("GetAll_AdminCanGetAllPosts");

        var adminId = Guid.NewGuid().ToString();
        var admin = new User
        {
            Id = adminId,
            UserType = UserType.Administrator,
            EmailConfirmed = true
        };

        var teacherId = Guid.NewGuid().ToString();
        var teacher = new User
        {
            Id = teacherId,
            UserType = UserType.Teacher,
            EmailConfirmed = true
        };

        var subId = Guid.NewGuid().ToString();
        var sub = new User()
        {
            Id = subId,
            UserType = UserType.Substitute,
            EmailConfirmed = true
        };

        var postId = Guid.NewGuid().ToString();
        var post1 = new Post
        {
            Id = postId,
            Poster = new User() { Id = Guid.NewGuid().ToString() }
        };

        mockContext.Users.AddRange(admin, teacher, sub);
        mockContext.Posts.Add(post1);
        mockContext.SaveChanges();

        var userManager = TestHelper.CreateMockUserManagerWithUsers([admin, teacher, sub]);

        var postController = new PostController(userManager, _logger.Object, mockContext, _cache);

        postController.ControllerContext = TestHelper.CreateControllerContextWithUser(adminId);
        var adminResult = await postController.GetAll();

        postController.ControllerContext = TestHelper.CreateControllerContextWithUser(teacherId);
        var teacherResult = await postController.GetAll();

        postController.ControllerContext = TestHelper.CreateControllerContextWithUser(subId);
        var subResult = await postController.GetAll();

        // Assert
        Assert.IsType<OkObjectResult>(adminResult);
        List<PostDto> posts = (List<PostDto>)(((OkObjectResult)adminResult).Value);
        Assert.Single(posts);
        Assert.Equal(postId, posts[0].Id);

        Assert.IsType<UnauthorizedObjectResult>(teacherResult);
        Assert.IsType<UnauthorizedObjectResult>(subResult);
    }

    [Fact]
    public async Task Add_ReturnsUnathorized()
    {
        // Arrange 
        var mockContext = TestHelper.CreateMockDbContext("Add_ReturnsUnathorized");

        var userId = Guid.NewGuid().ToString();
        var user = new User
        {
            Id = userId,
            UserType = UserType.Teacher,
            EmailConfirmed = false
        };

        var schoolId = Guid.NewGuid().ToString();
        var school = new School()
        {
            Id = schoolId,
            SchoolType = SchoolType.Primary,
            Region = Region.Regina
        };

        mockContext.Users.Add(user);
        mockContext.Schools.Add(school);
        mockContext.SaveChanges();

        var doa = Time.UtcToSaskTime(DateTime.UtcNow).AddDays(5).Date;
        var dto = new CreatePostDto()
        {
            SchoolId = schoolId,
            Private = false,
            StartDateOfAbsence = doa,
            EndDateOfAbsence = doa,
            AbsenceType = AbsenceType.FullDay,
            PrimarySchoolSubjects = [PrimarySchoolSubject.General.ToString()],
            Grades = [Grade.Kindergarten]
        };

        var userManager = TestHelper.CreateMockUserManagerWithUsers([user]);

        var postController = new PostController(userManager, _logger.Object, mockContext, _cache);
        postController.ControllerContext = TestHelper.CreateControllerContextWithUser(userId);

        // Act
        var result = await postController.Add(dto);

        // Assert
        Assert.IsType<UnauthorizedObjectResult>(result);
    }

    [Fact]
    public async Task Add_OnlyTeachersCanAddPosts()
    {
        // Arrange 
        var mockContext = TestHelper.CreateMockDbContext("Add_TeachersCanAddPosts");

        var teacherId = Guid.NewGuid().ToString();
        var teacher = new User
        {
            Id = teacherId,
            UserType = UserType.Teacher,
            EmailConfirmed = true
        };

        var subId = Guid.NewGuid().ToString();
        var sub = new User()
        {
            Id = subId,
            UserType = UserType.Substitute,
            EmailConfirmed = true
        };

        var adminId = Guid.NewGuid().ToString();
        var admin = new User() 
        { 
            Id = adminId,
            UserType = UserType.Administrator,
            EmailConfirmed = true
        };

        var schoolId = Guid.NewGuid().ToString();
        var school = new School()
        {
            Id = schoolId,
            SchoolType = SchoolType.Primary,
            Region = Region.Regina
        };

        mockContext.Users.AddRange(teacher, sub, admin);
        mockContext.Schools.Add(school);
        mockContext.SaveChanges();

        var doa = Time.UtcToSaskTime(DateTime.UtcNow).AddDays(5).Date;
        var dto = new CreatePostDto()
        {
            SchoolId = schoolId,
            Private = false,
            StartDateOfAbsence = doa,
            EndDateOfAbsence = doa,
            AbsenceType = AbsenceType.FullDay,
            PrimarySchoolSubjects = [PrimarySchoolSubject.General.ToString()],
            Grades = [Grade.Kindergarten]
        };

        var userManager = TestHelper.CreateMockUserManagerWithUsers([teacher, sub, admin]);

        var postController = new PostController(userManager, _logger.Object, mockContext, _cache);
        
        postController.ControllerContext = TestHelper.CreateControllerContextWithUser(teacherId);
        var teacherResult = await postController.Add(dto);

        postController.ControllerContext = TestHelper.CreateControllerContextWithUser(subId);
        var subResult = await postController.Add(dto);

        postController.ControllerContext = TestHelper.CreateControllerContextWithUser(adminId);
        var adminResult = await postController.Add(dto);

        // Assert
        Assert.IsType<OkObjectResult>(teacherResult);
        Assert.IsType<UnauthorizedObjectResult>(subResult);
        Assert.IsType<UnauthorizedObjectResult>(adminResult);
    }
}
