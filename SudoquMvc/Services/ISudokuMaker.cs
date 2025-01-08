namespace SudoquMvc.Services
{
    public interface ISudokuMaker
    {
        (string?, string) Make(int n = 17);

        string Validate(string rawValues);

        string? Solve(string rawValues);
    }
}
