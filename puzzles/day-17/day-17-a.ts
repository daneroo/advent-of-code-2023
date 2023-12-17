import { readData } from '../../shared.ts';
import chalk from 'chalk';
import { PriorityQueue } from 'typescript-collections';

export async function day17a(dataPath?: string) {
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

  //                    [heatLoss, row, col, dRow, dCol, nSteps]
  type HeatLossRecord = [number, number, number, number, number, number];

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

    // if (row === grid.length - 1 && col === grid[0].length - 1 && nSteps >= 4) {
    if (row === grid.length - 1 && col === grid[0].length - 1) {
      return heatLoss;
    }

    const key = `${row},${col},${dRow},${dCol},${nSteps}`;
    if (seen.has(key)) {
      continue;
    }

    seen.add(key);

    // extend path in same direction (<3  steps)
    if (nSteps < 3 && (dRow !== 0 || dCol !== 0)) {
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

    // change directions (in each allowed direction)
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
        const newRow = row + newDRow;
        const newCol = col + newDCol;
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
            newDRow,
            newDCol,
            1,
          ]);
        }
      }
    }
  }
}

const answer = await day17a();
console.log(chalk.bgGreen('Your Answer:'), chalk.green(answer));
