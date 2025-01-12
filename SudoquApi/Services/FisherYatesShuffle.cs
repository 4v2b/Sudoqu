
namespace SudoquApi.Services
{
    public class FisherYatesShuffle(ILogger<FisherYatesShuffle> logger) : IShuffleService
    {
        private readonly ILogger<FisherYatesShuffle> logger = logger;

        public List<T> Shuffle<T>(List<T> set, int seed)
        {
            logger.LogInformation("Initiate Fisher-Yates shuffle with seed {Seed}", seed);

            var rand = new Random(seed);

            for (int i = set.Count - 1; i > 0; i--)
            {
                int j = rand.Next(0, i + 1);

                (set[j], set[i]) = (set[i], set[j]);
            }

            return set;
        }
    }
}
