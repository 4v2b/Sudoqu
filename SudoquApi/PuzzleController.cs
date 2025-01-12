using Microsoft.AspNetCore.Mvc;
using SudoquApi.Models;

namespace SudoquApi
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class PuzzleController(ILogger<PuzzleController> logger) : ControllerBase
    {
        private readonly ILogger<PuzzleController> logger = logger;

        [HttpGet()]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(DispayPuzzle))]
        public IActionResult Make([FromQuery] int? seed, [FromServices] SudokuService sudokuService)
        {
            return Ok(sudokuService.Make(seed.GetValueOrDefault(Random.Shared.Next())));
        }

        [HttpPost]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(IEnumerable<string>))]
        public IActionResult Validate([FromBody] Puzzle puzzle, [FromServices] SudokuService sudokuService)
        {
            return Ok(sudokuService.Validate(puzzle));
        }
    }
}
