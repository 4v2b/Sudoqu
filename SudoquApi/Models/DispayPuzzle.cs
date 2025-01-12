namespace SudoquApi.Models
{
    public record DispayPuzzle(int Seed, Dictionary<string, byte> Squares, List<string> Visible) : Puzzle(Seed, Squares);
}
