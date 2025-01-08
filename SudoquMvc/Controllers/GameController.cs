using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using SudoquMvc.Models;
using SudoquMvc.Services;

namespace SudoquMvc.Controllers
{
    [EnableCors("AllowAll")]
    public class GameController : Controller
    {
        public IActionResult Index([FromServices] ISudokuMaker sudokuMaker)
        {
            var (sudokuFull, sudokuPresentation) = sudokuMaker.Make(17);

            ViewData["Board"] = sudokuPresentation;
            ViewData["BoardFull"] = sudokuFull is null ? "" : sudokuFull;

            return View();
        }

        [HttpPost("api/validate")]
        public IActionResult Verify([FromBody] Sudoku sudoku, [FromServices] ISudokuMaker sudokuMaker)
        {
            if (sudoku?.Raw == null || sudoku.Raw.Length != 81 * 3)
            {
                return BadRequest(new { Success = false, Message = "Invalid Sudoku string." });
            }

            string result = sudokuMaker.Validate(sudoku.Raw);

            return Ok(new { Success = true, Result = result });
        }

        [HttpPost("api/solve")]
        public IActionResult Solve([FromBody] Sudoku sudoku, [FromServices] ISudokuMaker sudokuMaker)
        {
            string? result = sudokuMaker.Solve(sudoku.Raw);

            if (result is not null)
            {
                return Ok(new { Success = true, Result = result });
            }

            return Ok(new { Success = false, Message = "This puzzle doesn't have any solution" });

        }
    }
}