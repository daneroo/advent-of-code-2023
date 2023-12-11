import { type } from 'os';
import { readData } from '../../shared.ts';
import chalk from 'chalk';

export async function day11b(dataPath?: string) {
  const data = await readData(dataPath);
  // console.log({ data });
  type Point = { row: number; col: number };
  const S: Point[] = [];
  const occupiedRows = new Set<number>();
  const occupiedCols = new Set<number>();
  data.forEach((line: string, row) => {
    // console.log({ line, index: row });
    // find the S in the line
    const col = line.indexOf('S');
    for (let col = 0; col < line.length; col++) {
      const c = line[col];
      if (c === '#') {
        const star = { row, col };
        S.push(star);
        occupiedRows.add(row);
        occupiedCols.add(col);
      }
    }

    // find the two pipes it connects to
    // const S = [x,y]
  });
  console.log({ S });
  let totalSteps = 0;
  for (let s1 = 0; s1 < S.length; s1++) {
    for (let s2 = s1 + 1; s2 < S.length; s2++) {
      // if (s2 > s1) continue;
      const star1 = S[s1];
      const star2 = S[s2];
      // const rowDiff = Math.abs(star1.row - star2.row);
      // const colDiff = Math.abs(star1.col - star2.col);
      // const diff = rowDiff + colDiff;
      let steps = 0;
      // horizontal steps
      for (
        let col = Math.min(star1.col, star2.col);
        col < Math.max(star1.col, star2.col);
        col++
      ) {
        if (!occupiedCols.has(col)) {
          console.log('|||');

          steps += 1000000;
        } else {
          steps++;
        }
      }
      // vertical steps
      for (
        let row = Math.min(star1.row, star2.row);
        row < Math.max(star1.row, star2.row);
        row++
      ) {
        if (!occupiedRows.has(row)) {
          console.log('---');
          steps += 1000000;
        } else {
          steps++;
        }
      }
      // console.log({ s1, star1, s2, star2, steps });
      console.log({ s1, s2, steps });
      totalSteps += steps;
    }
  }

  return totalSteps;
}

const answer = await day11b();
console.log(chalk.bgGreen('Your Answer:'), chalk.green(answer));
