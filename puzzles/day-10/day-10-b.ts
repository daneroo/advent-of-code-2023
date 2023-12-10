import { assert } from 'console';
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

export async function day10b(dataPath?: string) {
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
  });
  console.log({ S });
  const seen = new Set<string>();
  const queue: { row: number; col: number }[] = [S];
  // the S symbol is actually a pipe, so we need to know if it was |,-,L,J,7, or F
  let actualS = new Set<string>(['|', '-', 'L', 'J', '7', 'F']);

  while (queue.length > 0) {
    // pop the first item off the queue
    const { row, col } = queue.shift();
    const ch = data[row][col];
    // console.log({ row, col, ch });
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
      if (ch === 'S') {
        // intersect actualS with the set of possible pipes "|JL"
        actualS = new Set<string>(
          [...actualS].filter((x) => '|JL'.includes(x))
        );
      }
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
      if (ch === 'S') {
        // intersect actualS with the set of possible pipes "|7F"
        actualS = new Set<string>(
          [...actualS].filter((x) => '|7F'.includes(x))
        );
      }
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
      if (ch === 'S') {
        // intersect actualS with the set of possible pipes "-J7"
        actualS = new Set<string>(
          [...actualS].filter((x) => '-J7'.includes(x))
        );
      }
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
      if (ch === 'S') {
        // intersect actualS with the set of possible pipes "-LF"
        actualS = new Set<string>(
          [...actualS].filter((x) => '-LF'.includes(x))
        );
      }
    }
    // console.log({ queue, seen });
  }
  // console.log({ queue, seen });
  console.log({ actualS });
  // error if actualS is not a single element
  if (actualS.size !== 1) {
    throw new Error('actualS is not a single element');
  }

  // replace the S with the actual pipe
  const actualPipe = [...actualS][0];
  // console.log(`S before: ${data[S.row][S.col]} actualPipe: ${actualPipe}`);
  // set data[S.row][S.col] = actualPipe
  data[S.row] =
    data[S.row].substring(0, S.col) +
    actualPipe +
    data[S.row].substring(S.col + 1);
  // console.log(`S after: ${data[S.row][S.col]} actualPipe: ${actualPipe}`);

  console.log('--data');
  console.log(data.join('\n'));

  // clean up all the garbage pipes w/'.' (not seen)
  const cleanGrid = data.map((line: string, row) => {
    let newLine = '';
    for (let col = 0; col < line.length; col++) {
      const ch = line[col];
      const pos = { row, col: col };
      // set newLine[col] = ch or '.' if not seen
      newLine = newLine + (seen.has(JSON.stringify(pos)) ? ch : '.');
    }
    return newLine;
  });

  console.log('++cleanGrid');
  console.log(cleanGrid.join('\n'));

  // Now we count crossings to determine inside/outside
  // we'll do this for east-west, and north/south
  // traverse each line, counting the number of crossings
  // east-west
  const outside = new Set<string>();
  cleanGrid.forEach((line: string, row) => {
    let within = false;
    let up: boolean | null = null;
    for (let col = 0; col < line.length; col++) {
      const ch = line[col];
      if (ch === '|') {
        assert(up === null, 'up should be null (|)');
        within = !within;
      } else if (ch === '-') {
        assert(up !== null, 'up should not be null (-)');
      } else if ('LF'.includes(ch)) {
        assert(up === null, `up should be null (LF) ${row} ${col} ${ch}`);
        up = ch === 'L';
      } else if ('J7'.includes(ch)) {
        assert(up !== null, 'up should not be null (J7)');
        if (ch !== (up ? 'J' : '7')) {
          within = !within;
        }
        up = null;
      } else if (ch === '.') {
        // do nothing
      } else {
        throw new Error(`unexpected ch: ${ch} (horizontal)`);
      }
      if (!within) {
        // console.log('outside',{ row, col, ch });
        outside.add(JSON.stringify({ row, col }));
      }
    }
  });

  // console.log({ outside });

  console.log('inside/outside');
  let inside = 0;
  cleanGrid.forEach((line: string, row) => {
    let show = '';
    for (let col = 0; col < line.length; col++) {
      const rcStr = JSON.stringify({ row, col });
      const ch = seen.has(rcStr) ? '#' : outside.has(rcStr) ? 'O' : 'I';
      show = show + ch;
      if (ch === 'I') {
        inside++;
      }
    }
    console.log(show);
  });
  // console.log({ data });
  // size of seen/2 is the furthest point
  // return seen.size / 2;
  return inside;
}

const answer = await day10b();
console.log(chalk.bgGreen('Your Answer:'), chalk.green(answer));
