import { listenerCount } from 'process';
import { readData } from '../../shared.ts';
import chalk from 'chalk';

/*
Card 1: 41 48 83 86 17 | 83 86  6 31 17  9 48 53
Card 2: 13 32 20 16 61 | 61 30 68 82 17 32 24 19
Card 3:  1 21 53 59 44 | 69 82 63 72 16 21 14  1
Card 4: 41 92 73 84 69 | 59 84 76 51 58  5 54 83
Card 5: 87 83 26 28 32 | 88 30 70 12 93 22 82 36
Card 6: 31 18 13 56 72 | 74 77 10 23 35 67 36 11
*/
export async function day4a(dataPath?: string) {
  const data = await readData(dataPath);
  // console.log({ data });
  return data
    .map((line: string) => {
      // console.log({ line });
      const [carName, winAndHave] = line.split(':');
      console.log({ cardNum: carName, winAndHav: winAndHave });
      const cardNum = carName.split(' ')[1];
      const [win, have] = winAndHave.split('|');
      console.log({ cardNum, win, have });
      const winSet = new Set(
        win
          .trim()
          .split(' ')
          .filter((num) => num !== '')
          .map((num) => parseInt(num))
      );
      const haveSet = new Set(
        have
          .trim()
          .split(' ')
          .filter((num) => num !== '')
          .map((num) => parseInt(num))
      );
      // number of elements in the have set that are in the win set
      const numWin = [...winSet].filter((num) => haveSet.has(num)).length;
      const points = numWin > 0 ? 1 << (numWin - 1) : 0;
      console.log({ cardNum, winSet, haveSet, numWin, points });
      return points;
    })
    .reduce((acc, numWin) => acc + numWin, 0);
}

const answer = await day4a();
console.log(chalk.bgGreen('Your Answer:'), chalk.green(answer));
