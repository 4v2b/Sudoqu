using Microsoft.AspNetCore.Mvc;
using SudoquMvc.Services;

namespace SudoquMvc.Controllers
{
    public class GameController : Controller
    {
        public IActionResult Index([FromServices] ISudokuMaker sudokuMaker)
        {
            string sudoku = sudokuMaker.Make();

            ViewData["Board"] = sudoku;

            return View();
        }
    }
}
