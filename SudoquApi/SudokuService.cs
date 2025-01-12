using Microsoft.Extensions.Logging;
using SudoquApi.Models;
using SudoquApi.Services;

namespace SudoquApi
{
    public class SudokuService(ILogger<SudokuService> logger, IShuffleService shuffleService)
    {
        public DispayPuzzle Make(int seed, int n = 17)
        {
            var values = squares.ToDictionary(s => s, v => COLS);

            var rand = new Random(seed);

            List<string> shuffledSquares = shuffleService.Shuffle(new List<string>(squares), seed);

            foreach (var square in shuffledSquares)
            {
                if (!Assign(values, square, values[square][rand.Next(0, values[square].Length - 1)]))
                {
                    break;
                }
                var solvedSquares = squares.Where(s => values[s].Length == 1).Select(s => values[s]).ToList();

                if (solvedSquares.Count > n)
                {
                    var solvedPuzzle = Search(values);

                    if (solvedPuzzle is null)
                    {
                        logger.LogInformation("Failed to solve puzzle with seed {Seed}", seed);
                        break;
                    }

                    logger.LogInformation("Generated puzzle with seed {Seed}: ...{Puzzle}", seed, string.Concat(squares.TakeLast(10).Select(s => solvedPuzzle[s][0].ToString())));

                    return new DispayPuzzle(
                        Seed: seed,
                        Squares: solvedPuzzle.ToDictionary(s => s.Key, s => byte.Parse(s.Value)),
                        Visible: shuffledSquares[0..n]
                    );
                }
            }
            int newSeed = (seed + 1) % int.MaxValue;
            logger.LogInformation("Trying to solve puzzle with new seed {Seed}", seed);
            return Make(newSeed);
        }

        public IEnumerable<string> Validate(Puzzle puzzle)
        {
            var mismatched = puzzle.Squares
                .Where((s) => peers[s.Key].Any(i => puzzle.Squares[s.Key] != s.Value))
                .Select(e => e.Key)
                .ToList();

            logger.LogInformation("Validating puzzle... Mismatched squares: {Count}", mismatched.Count);

            return mismatched;
        }

        private readonly ILogger<SudokuService> logger = logger;

        private readonly IShuffleService shuffleService = shuffleService;

        private const string COLS = "123456789";
        private const string ROWS = "ABCDEFGHI";
        private static readonly List<string> sectionCols = ["123", "456", "789"];
        private static readonly List<string> sectionRows = ["ABC", "DEF", "GHI"];

        private static readonly List<string> squares = Cross([.. ROWS], [.. COLS]);

        private static readonly List<List<string>> unitList = [
            ..COLS.Select(c => Cross([.. ROWS], [c])),
            ..ROWS.Select(r => Cross([r], [.. COLS])),
            ..sectionCols.SelectMany(c => sectionRows.Select(r => Cross([..r], [.. c])))
        ];

        private static readonly Dictionary<string, List<List<string>>> units = squares.ToDictionary(
            s => s,
            s => unitList.Where(unit => unit.Contains(s)).ToList()
        );

        private static readonly Dictionary<string, List<string>> peers = squares.ToDictionary(
            s => s,
            s => units[s].SelectMany(unit => unit).Where(peer => peer != s).Distinct().ToList()
        );

        private static List<string> Cross(char[] A, char[] B) =>
            A.SelectMany(a => B.Select(b => $"{a}{b}")).ToList();

        private static bool Assign(Dictionary<string, string> values, string s, char d) =>
            values[s].Replace(d.ToString(), "").All(v => Eliminate(values, s, v));

        private static bool Eliminate(Dictionary<string, string> values, string square, char delete)
        {
            if (!values[square].ToList().Exists(v => v == delete))
            {
                return true;
            }

            values[square] = values[square].Replace(delete.ToString(), "");

            if (values[square].Length < 1)
            {
                return false;
            }
            else if (values[square].Length == 1)
            {
                char d2 = values[square][0];
                if (!peers[square].All(v => Eliminate(values, v, d2)))
                {
                    return false;
                }
            }

            foreach (var u in units[square])
            {
                var deletePlaces = u.Where(e => values[e].IndexOf(delete) > -1).ToList();
                if (deletePlaces.Count == 0)
                {
                    return false;
                }
                else if (deletePlaces.Count == 1 && !Assign(values, deletePlaces[0], delete))
                {
                    return false;
                }
            }

            return true;
        }

        private static Dictionary<string, string>? Search(Dictionary<string, string>? values)
        {
            if (values is null || values.Count == 0)
            {
                return null;
            }

            if (squares.All(s => values[s].Length == 1))
            {
                return values;
            }

            (string s, _) = squares.Where(s => values[s].Length > 1).Select(s => (s, values[s].Length)).MinBy(t => t.Length);

            var copy = new Dictionary<string, string>(values);

            return values[s]
                .Select(v => Search(Assign(copy, s, v) ? copy : null))
                .FirstOrDefault(s => s is not null);
        }
    }
}