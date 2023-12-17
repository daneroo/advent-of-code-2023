import { readData } from '../../shared.ts';
import chalk from 'chalk';
import { PriorityQueue } from 'typescript-collections';

export async function day17b(dataPath?: string) {
  const data = await readData(dataPath);
  // console.log({ data });
  const grid: number[][] = [];
  data.forEach((line: string, rowIndex: number) => {
    // console.log({ rowIndex, line });
    // get the int values at every character
    grid[rowIndex] = line.split('').map((char) => parseInt(char));
  });
  // console.log({ grid });
  // console.log(grid.map((row) => row.join('')).join('\n'));

  type Pos = { row: number; col: number };
  const seen: Set<string> = new Set();
  // priority queue of [heatLoss, row, col, dRow, dCol, nSteps]
  // order/compare by heatLoss (descending)
  const pq: PriorityQueue<[number, number, number, number, number, number]> =
    new PriorityQueue<[number, number, number, number, number, number]>(
      (a, b) => b[0] - a[0]
    );
  pq.enqueue([0, 0, 0, 0, 0, 0]);

  while (!pq.isEmpty()) {
    const [heatLoss, row, col, dRow, dCol, nSteps] = pq.dequeue();
    // console.log({ heatLoss, row, col, dRow, dCol, nSteps });

    if (row === grid.length - 1 && col === grid[0].length - 1 && nSteps >= 4) {
      return heatLoss;
    }

    const key = `${row},${col},${dRow},${dCol},${nSteps}`;
    if (seen.has(key)) {
      continue;
    }

    seen.add(key);

    // extend path in same direction (<10  steps)
    if (nSteps < 10 && (dRow !== 0 || dCol !== 0)) {
      const newRow = row + dRow;
      const newCol = col + dCol;
      if (
        newRow >= 0 &&
        newRow < grid.length &&
        newCol >= 0 &&
        newCol < grid[0].length
      ) {
        pq.enqueue([
          heatLoss + grid[newRow][newCol],
          newRow,
          newCol,
          dRow,
          dCol,
          nSteps + 1,
        ]);
      }
    }

    // change directions (in each allowed direction) if we have already traveled at least 4 steps
    if (nSteps >= 4 || (dRow === 0 && dCol === 0)) {
      const directions: [number, number][] = [
        [0, 1],
        [1, 0],
        [0, -1],
        [-1, 0],
      ];
      for (const [newDRow, newDCol] of directions) {
        // can't just continue (that's above), and can't turn back
        if (
          (newDRow !== dRow || newDCol !== dCol) &&
          (newDRow !== -dRow || newDCol !== -dCol)
        ) {
          const nr = row + newDRow;
          const nc = col + newDCol;
          if (nr >= 0 && nr < grid.length && nc >= 0 && nc < grid[0].length) {
            pq.enqueue([heatLoss + grid[nr][nc], nr, nc, newDRow, newDCol, 1]);
          }
        }
      }
    }
  }
  // return 0;
}

const answer = await day17b();
console.log(chalk.bgGreen('Your Answer:'), chalk.green(answer));
