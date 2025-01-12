namespace SudoquApi.Models
{
    public record ValidatedPuzzle(int Seed, Dictionary<string, byte> Squares, List<string> Mismatched) : Puzzle(Seed, Squares);
}
