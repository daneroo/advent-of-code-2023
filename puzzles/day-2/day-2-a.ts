import { parse } from 'path';
import { readData } from '../../shared.ts';
import chalk from 'chalk';

// global since this is constant
const inBagPerColor = { red: 12, green: 13, blue: 14 };

export async function day2a(dataPath?: string) {
  const data = await readData(dataPath);
  // bag has only 12 red cubes, 13 green cubes, and 14 blue cubes
  console.log({ data });
  const sum = data.map(isGamePossible).reduce((acc, n) => {
    return acc + n;
  }, 0);

  return sum;
}

function isGamePossible(line: string) {
  console.log({ line });
  // { line: 'Game 1: 3 blue, 4 red; 1 red, 2 green, 6 blue; 2 green' }
  const parts = line.split(':');
  const gameID = Number(parts[0].slice(5));
  const possible = parts[1]
    .split(';')
    .map((countForDraw) => {
      return countForDraw
        .trim()
        .split(',')
        .map((countForColor) => {
          const [n, color] = countForColor.trim().split(' ');
          return { n: Number(n), color };
        })
        .map(({ n, color }) => {
          // check if this count is possible (are there enough in the bag)
          const inBag = inBagPerColor[color];
          if (n > inBag) {
            console.log('not enough', { n, color, inBag });
          }
          return n <= inBag;
        })
        .every((x) => x);
    })
    .every((x) => x);

  console.log('G', gameID, possible);
  return possible ? gameID : 0;
}

const answer = await day2a();
console.log(chalk.bgGreen('Your Answer:'), chalk.green(answer));
