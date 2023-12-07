# ts-aoc-starter

## Instruction (mine)

- <https://adventofcode.com/>
- [Nx Starter](https://nx.dev/advent-of-code)
  - https://github.com/nrwl/ts-aoc-starter#running-the-puzzles

```bash
npx create-ts-aoc-starter
```

## Personal Leaderboard Times / Rank

[Live](https://adventofcode.com/2023/leaderboard/self)

Day 4, my best time yetL 48 minutes to sole both, but I did it a 15:10!

````txt
      --------Part 1---------   --------Part 2---------
Day       Time    Rank  Score       Time    Rank  Score
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
