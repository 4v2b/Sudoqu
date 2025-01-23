using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using SudoquApi.Models;
using SudoquApi.Services;

namespace SudoquApi
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class PuzzleController(ILogger<PuzzleController> logger) : ControllerBase
    {
        private readonly ILogger<PuzzleController> logger = logger;

        [HttpGet()]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(DispayPuzzle))]
        public IActionResult Make([FromQuery] int? seed, [FromQuery] int? number, [FromServices] SudokuService sudokuService)
        {
            return Ok(sudokuService.Make(seed.GetValueOrDefault(Random.Shared.Next()), number.GetValueOrDefault(Random.Shared.Next(17, 32))));
        }

        [HttpPost]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(IEnumerable<string>))]
        public IActionResult Validate([FromBody] Puzzle puzzle, [FromServices] SudokuService sudokuService)
        {
            return Ok(sudokuService.Validate(puzzle));
        }
    }
}
