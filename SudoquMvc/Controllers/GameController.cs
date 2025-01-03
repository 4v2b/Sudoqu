using Microsoft.AspNetCore.Mvc;
using SudoquMvc.Services;

namespace SudoquMvc.Controllers
{
    public class GameController : Controller
    {
        public IActionResult Index([FromServices] ISudokuMaker sudokuMaker)
        {
            string sudoku = sudokuMaker.Make(17);

            ViewData["Board"] = sudoku;

            return View();
        }
    }
}