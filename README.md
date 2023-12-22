# Advent of Code - 2023

My first attempt at _Advent of Code_.

I checked out after day 20! I will try again next year.

For next year, I will try a new runtime, maybe Deno, or maybe Python, we'll see.

- The nx setup, although convenient was not optimal.
- I would rather direct the input from the command line with stdin redirection instead of a fixed pattern of file names.
- I have seen other repos also being able to get the puzzle input automatically.

I like the pattern (probably an alias) of `aot` forsample input and `aoc` for the real input.

## ts-aoc-starter

For 2023 I used the [Nx Starter](https://nx.dev/advent-of-code) to get started.

## Instruction (mine)

- <https://adventofcode.com/>
- [Nx Starter](https://nx.dev/advent-of-code)
  - https://github.com/nrwl/ts-aoc-starter#running-the-puzzles

```bash
npx create-ts-aoc-starter
```

## Personal Leaderboard Times / Rank

[Live](https://adventofcode.com/2023/leaderboard/self)

Day 4, my best time yet 48 minutes to sole both, but I did it at 15:10!
Day 10 - started 11:37 took 47m to solve part 1, then 2h34 to solve both
Day 12 - Ouch, complete re-implementation to solve part 2, needed some help!!!
Day 13 abandoned part 2 after 2.5 hours! - re-implement tomorrow

````txt
      --------Part 1---------   --------Part 2---------
Day       Time    Rank  Score       Time    Rank  Score
 20   01:42:02    3085      0   01:55:25    1457      0
 19   00:58:29    3916      0   02:31:23    3071      0
 18   01:26:58    4389      0   02:12:54    2805      0
 17   00:49:48    1266      0   00:52:17     953      0
 16   02:41:25    6859      0   03:57:43    7822      0
 15   00:10:07    3549      0   01:04:34    5304      0
 14   00:29:13    4521      0   01:08:49    2807      0
 13   02:22:58    7932      0   17:26:01   21556      0
 12   00:41:37    2912      0   02:45:08    2955      0
 11   00:26:25    3234      0   00:30:48    2253      0
 10   12:24:21   31102      0   14:11:30   19055      0
  9   00:24:37    4850      0   00:29:20    4381      0
  8   00:14:07    3916      0   01:07:28    5383      0
  7   00:25:08    1617      0   02:09:16    8865      0
  6   00:25:07    8100      0   00:34:07    8030      0
  5   00:54:54    7069      0   01:35:49    3226      0
  4   15:25:07   75622      0   15:58:37   64319      0
  3   01:30:24    9721      0   02:16:52    9833      0
  2   12:47:54   71605      0   13:24:20   69353      0
  1       >24h  150984      0       >24h  110303      0
```

## Getting Started

```terminal
npx create-ts-aoc-starter
````

This will create a new workspace in the current directory with the following structure:

```file-tree
ts-aoc-starter
├── puzzles
│   ├── day-1
│   │   ├── day-1-a.data.txt
│   │   ├── day-1-a.sample-data.txt
│   │   ├── day-1-a.ts
│   │   ├── day-1-b.data.txt
│   │   ├── day-1-b.sample-data.txt
│   │   └── day-1-b.ts
│   ├── day-2
│   ├── day-3
```

## Running the Puzzles

Copy and paste the sample data given in the problem into the `day-X-a.sample-data.txt` file.

Copy and paste your larger unique actual data set into the `day-X-a.data.txt` file.

Add your solution to the `day-X-a.ts` file.

To run your solution against your sample data set, run the following command:

```terminal
nx day-1-a --data=sample
```

or

```terminal
npm run day-1-a:sample
```

To run your solution against your actual data set, run the following command:

```terminal
nx day-1-a
```

or

```terminal
npm run day-1-a
```
