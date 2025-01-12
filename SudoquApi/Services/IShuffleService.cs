namespace SudoquApi.Services
{
    public interface IShuffleService
    {
        List<T> Shuffle<T>(List<T> set, int seed);
    }
}
