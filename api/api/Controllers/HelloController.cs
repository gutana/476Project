using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using System.Text.Json;

namespace api.Controllers
{
    [ApiController]
    [EnableCors("AllowAll")]
    [Route("[controller]")]
    public class HelloController : ControllerBase
    {
        private readonly ILogger<HelloController> _logger;

        public HelloController(ILogger<HelloController> logger)
        {
            _logger = logger;
        }

        [HttpGet("Hello")]
        public IActionResult Hello()
        {
            var response = new HelloResponse("Hello from the backend!");
            return Ok(JsonSerializer.Serialize(response));
        }
    }

    class HelloResponse
    {
        public HelloResponse(string res)
        {
            response = res;
        }
        public string response { get; set; }
    }

}
