import { readData } from '../../shared.ts';
import chalk from 'chalk';

export async function day3a(dataPath?: string) {
  const data = await readData(dataPath);
  // bag has only 12 red cubes, 13 green cubes, and 14 blue cubes
  console.log({ data });
  const numbers: { y: number; x0: number; x1: number; s: string }[] = [];
  const symbols: { y: number; x0: number; x1: number; s: string }[] = [];
  data.map(parseLine).forEach((ns) => {
    numbers.push(...ns.numbers);
    symbols.push(...ns.symbols);
  });
  console.log('------------------');
  console.log({ numbers, symbols });
  const adjacentNumbers = numbersAdjacentToASymbol(numbers, symbols);
  console.log({ adjacentNumbers });
  const sum = adjacentNumbers.reduce((acc, num) => {
    return acc + parseInt(num.s);
  }, 0);
  return sum;
}

/*
  numbers: [
    { y: 0, x0: 0, x1: 3, s: '467' },
    { y: 0, x0: 5, x1: 8, s: '114' },
    { y: 2, x0: 2, x1: 4, s: '35' },
    { y: 2, x0: 6, x1: 9, s: '633' },
    { y: 4, x0: 0, x1: 3, s: '617' },
    { y: 5, x0: 7, x1: 9, s: '58' },
    { y: 6, x0: 2, x1: 5, s: '592' },
    { y: 7, x0: 6, x1: 9, s: '755' },
    { y: 9, x0: 1, x1: 4, s: '664' },
    { y: 9, x0: 5, x1: 8, s: '598' }
  ],
  symbols: [
    { y: 1, x0: 3, x1: 4, s: '*' },
    { y: 3, x0: 6, x1: 7, s: '#' },
    { y: 4, x0: 3, x1: 4, s: '*' },
    { y: 5, x0: 5, x1: 6, s: '+' },
    { y: 8, x0: 3, x1: 4, s: '$' },
    { y: 8, x0: 5, x1: 6, s: '*' }
  ]

*/
function numbersAdjacentToASymbol(
  numbers: { y: number; x0: number; x1: number; s: string }[],
  symbols: { y: number; x0: number; x1: number; s: string }[]
) {
  const adjacentNumbers = [];
  for (const num of numbers) {
    const { y, x0, x1 } = num;
    const adjacent = symbols.filter((sym) => {
      // actually sym.x0 and sym.x1 are always equal
      if (sym.x0 !== sym.x1) {
        console.error('x0 and x1 are not equal', sym);
        throw new Error('x0 and x1 are not equal');
      }
      const sx = sym.x0;
      // if on same line
      if (sym.y === y) {
        if (sx === x1 + 1 || sx === x0 - 1) {
          // console.log('adjacent-x', num, sym);
          return true;
        }
      }
      // if on line above or below
      if (sym.y === y - 1 || sym.y === y + 1) {
        // if symbol is between x0-1 and x1+1
        if (sx >= x0 - 1 && sx <= x1 + 1) {
          // console.log('adjacent-y', num, sym);
          return true;
        }
      }
      return false;
    });
    if (adjacent.length === 0) {
      console.log('remove', num);
    } else {
      adjacentNumbers.push(num);
      // console.log('keep', num);
    }
  }
  return adjacentNumbers;
}

/*
467..114..
...*......
..35..633.
......#...
617*......
.....+.58.
..592.....
......755.
...$.*....
.664.598..
*/
function parseLine(line: string, y: number) {
  console.log({ y, line });
  // find all numbers in the line, and their indexOf's
  const nRE = /\d+/g;
  const numbers = findAllRE(line, nRE, y);
  // find all symbols in the line, and their indexes
  // RE which matches these symbols = # $ % & * + - / = @
  // NOTE: - must be at end!!!!!
  const sRE = /[#$%&*@+=/-]/g;
  const symbols = findAllRE(line, sRE, y);
  console.log({ numbers, symbols });
  return { numbers, symbols };
}

// return array of {y, x0, x1, s}
function findAllRE(
  line: string,
  re: RegExp,
  y: number
): { y: number; x0: number; x1: number; s: string }[] {
  const matches = [];
  let match = re.exec(line);
  while (match !== null) {
    // [ '467', index: 0, input: '467..114..', groups: undefined ],
    // [ '*', index: 3, input: '...*......', groups: undefined ],
    const ss = {
      y,
      x0: match.index,
      x1: match.index + match[0].length - 1,
      s: match[0],
    };
    matches.push(ss);
    match = re.exec(line);
  }
  return matches;
}
const answer = await day3a();
console.log(chalk.bgGreen('Your Answer:'), chalk.green(answer));
