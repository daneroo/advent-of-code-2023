import { readData } from '../../shared.ts';
import chalk from 'chalk';

function transpose(lines: string[]) {
  return lines[0]
    .split('')
    .map((_, i) => lines.map((row) => row[i]))
    .map((row) => row.join(''));
}

//  example lines
// { row: 0, line: 'OO.O.O..##' }
// { row: 1, line: '...OO....O' }
// { row: 2, line: '.O...#O..O' }
// { row: 3, line: '.O.#......' }
// O can slide left, if there is a . to the left
// # cannot move
// .O -> O.
// ..O -> O..
// .OO -> OO.
// .O.O -> OO..

// only . and O
function slideLeft(line: string): string {
  // count the 'O's
  const countO = line.split('').filter((c) => c === 'O').length;
  return line
    .split('')
    .map((c, i) => (i < countO ? 'O' : '.'))
    .join('');
}

// only . and O
function slideRight(line: string): string {
  // count the 'O's
  const countD = line.split('').filter((c) => c === '.').length;
  return line
    .split('')
    .map((c, i) => (i < countD ? '.' : 'O'))
    .join('');
}

function tiltNorth(lines: string[]) {
  const transposed = transpose(lines);
  const slid = transposed.map((line: string, row) => {
    return line
      .split('#')
      .map((part) => slideLeft(part))
      .join('#');
  });
  return transpose(slid);
}

function tiltSouth(lines: string[]) {
  const transposed = transpose(lines);
  const slid = transposed.map((line: string, row) => {
    return line
      .split('#')
      .map((part) => slideRight(part))
      .join('#');
  });
  return transpose(slid);
}

function tiltEast(lines: string[]) {
  return lines.map((line: string, row) => {
    return line
      .split('#')
      .map((part) => slideRight(part))
      .join('#');
  });
}

function tiltWest(lines: string[]) {
  return lines.map((line: string, row) => {
    return line
      .split('#')
      .map((part) => slideLeft(part))
      .join('#');
  });
}

function calcLoad(lines: string[]) {
  const transposed = transpose(lines);
  return transposed
    .map((line: string, row) => {
      const load = line
        .split('')
        .map((c, i) => {
          return c === 'O' ? line.length - i : 0;
        })
        .reduce((acc, cur) => acc + cur, 0);
      return load;
    })
    .reduce((acc, cur) => acc + cur, 0);
}

export async function day14b(dataPath?: string) {
  let data = await readData(dataPath);
  // north, then west, then south, then east
  let cycles = 0;
  const lastCycleForLoad = {};
  const targetCycles = 1000000000;
  while (true) {
    const n = tiltNorth(data);
    const w = tiltWest(n);
    const s = tiltSouth(w);
    const e = tiltEast(s);
    data = e;
    cycles++;
    const load = calcLoad(data);
    const prevCycle = lastCycleForLoad[load] || 0;
    const period = cycles - prevCycle;
    lastCycleForLoad[load] = cycles;
    // console.log(`- load: ${load}  cycles: ${cycles} period: ${period}`);
    // if cycles + n*period === targetCycles
    // => (targetCycles - cycles) % period === 0
    if ((targetCycles - cycles) % period === 0) {
      console.log(
        `candidate load: ${load}  cycles: ${cycles} period: ${period}`
      );
      if (cycles > 10000) {
        break;
      }
    }
  }
  const load = calcLoad(data);
  return load;
}

const answer = await day14b();
console.log(chalk.bgGreen('Your Answer:'), chalk.green(answer));
