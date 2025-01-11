using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace SudoquApi
{
    [Route("api/[controller]")]
    [ApiController]
    public class PuzzleController : ControllerBase
    {
        private readonly ILogger<PuzzleController> _logger;

        public PuzzleController(ILogger<PuzzleController> logger)
        {
            _logger = logger;
        }
    }
}
