import { readData } from '../../shared.ts';
import chalk from 'chalk';

export async function day2b(dataPath?: string) {
  const data = await readData(dataPath);
  // bag has only 12 red cubes, 13 green cubes, and 14 blue cubes
  console.log({ data });
  const sum = data.map(parseLine).reduce((acc, n) => {
    return acc + n;
  }, 0);

  return sum;
}

function parseLine(line: string) {
  const minsForGame = { red: 0, green: 0, blue: 0 };
  console.log({ line });
  // { line: 'Game 1: 3 blue, 4 red; 1 red, 2 green, 6 blue; 2 green' }
  const parts = line.split(':');
  const gameID = Number(parts[0].slice(5));
  const countsPerDraw = parts[1].split(';').map((countForDraw) => {
    return countForDraw
      .trim()
      .split(',')
      .map((countForColor) => {
        const [nStr, color] = countForColor.trim().split(' ');
        const n = Number(nStr);
        if (minsForGame[color] < n) {
          // console.log('new min', { n, color });
          minsForGame[color] = n;
        }
        return { n, color };
      });
  });

  // console.log('G', gameID, countsPerDraw);
  const power = minsForGame.red * minsForGame.green * minsForGame.blue;
  console.log('Pow', gameID, power, minsForGame);
  return power;
}

const answer = await day2b();
console.log(chalk.bgGreen('Your Answer:'), chalk.green(answer));
