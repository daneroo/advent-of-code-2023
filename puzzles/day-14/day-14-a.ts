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
function slideLeft(line: string): string {
  // count the 'O's
  const countO = line.split('').filter((c) => c === 'O').length;
  return line
    .split('')
    .map((c, i) => (i < countO ? 'O' : '.'))
    .join('');
}
export async function day14a(dataPath?: string) {
  const data = await readData(dataPath);
  const transposed = transpose(data);
  return transposed
    .map((line: string, row) => {
      console.log('-', { row, line });
      const sl = line
        .split('#')
        .map((part) => slideLeft(part))
        .join('#');
      console.log('+', { row, line: sl });
      const load = sl
        .split('')
        .map((c, i) => {
          return c === 'O' ? line.length - i : 0;
        })
        .reduce((acc, cur) => acc + cur, 0);
      return load;
    })
    .reduce((acc, cur) => acc + cur, 0);
  // return 0;
  return 0;
}

const answer = await day14a();
console.log(chalk.bgGreen('Your Answer:'), chalk.green(answer));
