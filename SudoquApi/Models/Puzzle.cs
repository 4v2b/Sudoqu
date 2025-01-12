namespace SudoquApi.Models
{
    public record Puzzle(int Seed, Dictionary<string, byte> Squares);
}
