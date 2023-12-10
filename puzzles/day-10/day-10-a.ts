import { readData } from '../../shared.ts';
import chalk from 'chalk';

// | is a vertical pipe connecting north and south.
// - is a horizontal pipe connecting east and west.
// L is a 90-degree bend connecting north and east.
// J is a 90-degree bend connecting north and west.
// 7 is a 90-degree bend connecting south and west.
// F is a 90-degree bend connecting south and east.
// . is ground; there is no pipe in this tile.
// S is the starting position of the animal; there is a pipe on this tile, but your sketch doesn't show what shape the pipe has.

export async function day10a(dataPath?: string) {
  const data = await readData(dataPath);
  // console.log({ data });

  // S will only connect to two pipes
  const S: { row: number; col: number } = { row: -1, col: -1 };
  data.forEach((line: string, row) => {
    // console.log({ line, index: row });
    // find the S in the line
    const col = line.indexOf('S');
    for (let col = 0; col < line.length; col++) {
      const c = line[col];
      if (c === 'S') {
        S.row = row;
        S.col = col;
      }
    }

    // find the two pipes it connects to
    // const S = [x,y]
  });
  console.log({ S });
  const seen = new Set<string>();
  const queue: { row: number; col: number }[] = [S];

  while (queue.length > 0) {
    // pop the first item off the queue
    const { row, col } = queue.shift();
    const ch = data[row][col];
    console.log({ row, col, ch });
    // can we go north?
    const north = { row: row - 1, col };
    if (
      row > 0 &&
      'S|JL'.includes(ch) &&
      'S|7F'.includes(data[row - 1][col]) &&
      !seen.has(JSON.stringify(north))
    ) {
      queue.push(north);
      seen.add(JSON.stringify(north));
    }
    // can we go south?
    const south = { row: row + 1, col };
    if (
      row < data.length - 1 &&
      'S|7F'.includes(ch) &&
      'S|JL'.includes(data[row + 1][col]) &&
      !seen.has(JSON.stringify(south))
    ) {
      queue.push(south);
      seen.add(JSON.stringify(south));
    }
    // can we go west?
    const west = { row, col: col - 1 };
    if (
      col > 0 &&
      'S-J7'.includes(ch) &&
      'S-LF'.includes(data[row][col - 1]) &&
      !seen.has(JSON.stringify(west))
    ) {
      queue.push(west);
      seen.add(JSON.stringify(west));
    }
    // can we go east?
    const east = { row, col: col + 1 };
    if (
      col < data[row].length - 1 &&
      'S-LF'.includes(ch) &&
      'S-J7'.includes(data[row][col + 1]) &&
      !seen.has(JSON.stringify(east))
    ) {
      queue.push(east);
      seen.add(JSON.stringify(east));
    }
    // console.log({ queue, seen });
  }
  console.log({ queue, seen });
  // size of seen/2 is the furthest point
  return seen.size / 2;
}

const answer = await day10a();
console.log(chalk.bgGreen('Your Answer:'), chalk.green(answer));
