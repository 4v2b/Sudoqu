﻿using System.Linq;

namespace SudoquMvc.Services
{
    public class SudokuMaker : ISudokuMaker
    {
        private readonly string digits = "123456789";
        private readonly string rows = "ABCDEFGHI";
        private readonly List<string> sectionCols = ["123", "456", "789"];
        private readonly List<string> sectionRows = ["ABC", "DEF", "GHI"];
        private readonly List<string> squares;
        private readonly Dictionary<string, List<List<string>>> units;
        private readonly Dictionary<string, List<string>> peers;
        private readonly List<List<string>> unitList;

        private readonly ILogger<SudokuMaker> _logger;

        private static List<T> Shuffle<T>(List<T> set)
        {
            var r = new Random();

            for (int i = set.Count - 1; i > 0; i--)
            {
                int j = r.Next(0, i + 1);

                (set[j], set[i]) = (set[i], set[j]);
            }

            return set;
        }

        private static List<string> Cross(char[] A, char[] B) => A.SelectMany(a => B.Select(b => $"{a}{b}")).ToList();

        public SudokuMaker(ILogger<SudokuMaker> logger)
        {
            _logger = logger;
            var cols = digits;

            unitList = [
                ..cols.Select(c => Cross([.. rows], [c])).ToList(),
                ..rows.Select(r => Cross([r], [.. cols])).ToList(),
                ..sectionCols.SelectMany(c => sectionRows.Select(r => Cross([..r], [.. c]))).ToList()];

            squares = Cross([.. rows], [.. digits]);

            units = squares.ToDictionary(
                s => s,
                s => unitList.Where(unit => unit.Contains(s)).ToList()
                );

            peers = squares.ToDictionary(
                s => s,
                s => units[s]
                    .SelectMany(unit => unit)
                    .Where(peer => peer != s)
                    .Distinct().ToList()
                );
        }

        public string Make(int n = 17)
        {
            var rand = new Random();
            var values = squares.ToDictionary(s => s, v => digits);

            var sh = Shuffle(new List<string>(squares));
            foreach (var s in sh)
            {
                if (!Assign(values, s, values[s][rand.Next(0, values[s].Length - 1)]))
                {
                    break;
                }
                var ds = squares.Where(s => values[s].Length == 1).Select(s => values[s]).ToList();

                if (ds.Count > n && ds.Distinct().Count() >= 8)
                {
                    //var res = Search(values);

                    //if (res is null)
                    //{
                    //var fads = unitList[18..^0].SelectMany(l => l).ToList();
                    //return string.Concat(fads.Select(s => s));

                    return string.Concat(squares.Select(s => values[s].Length == 1 ? values[s] : "."));
                    //}
                    //else
                    //{
                    //    return string.Concat(squares.Select(s => res[s].Length == 1 ? res[s] : "."));
                    //}
                }
            }
            return Make();
        }

        private bool Assign(Dictionary<string, string> values, string s, char d) =>
            values[s].Replace(d.ToString(), "").All(v => Eliminate(values, s, v));


        private bool Eliminate(Dictionary<string, string> values, string s, char d)
        {
            if (!values[s].ToList().Exists(v => v == d))
            {
                return true;
            }

            values[s] = values[s].Replace(d.ToString(), "");

            if (values[s].Length < 1)
            {
                return false;
            }
            else if (values[s].Length == 1)
            {
                char d2 = values[s][0];
                if (!peers[s].All(v => Eliminate(values, v, d2)))
                {
                    return false;
                }
            }

            foreach (var u in units[s])
            {
                var dPlaces = u.Where(e => values[e].IndexOf(d) > -1).ToList();
                if (!dPlaces.Any())
                {
                    return false;
                }
                else if (dPlaces.Count == 1 && !Assign(values, dPlaces[0], d))
                {
                    return false;
                }
            }

            return true;
        }


        private Dictionary<string, string>? Search(Dictionary<string, string>? values)
        {
            if (values is null)
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
