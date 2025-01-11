namespace SudoquApi
{
    public class SudokuService
    {
        private readonly ILogger<SudokuService> _logger;

        public SudokuService(ILogger<SudokuService> logger)
        {
            _logger = logger;
        }
    }
}
