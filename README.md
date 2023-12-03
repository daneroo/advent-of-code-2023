# ts-aoc-starter

## Instruction (mine)

- <https://adventofcode.com/>
- [Nx Starter](https://nx.dev/advent-of-code)
  - https://github.com/nrwl/ts-aoc-starter#running-the-puzzles

```bash
npx create-ts-aoc-starter
```

## Log

- Day 3:
  - Part a: 01:30:00: 3 6930 2892 `**/*`: 6930-ish position
  - Part b: 02:15:00: 3 9915 3113 `***/*` 3113-ish position

## Getting Started

```terminal
npx create-ts-aoc-starter
```

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
