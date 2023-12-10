import { readData } from '../../shared.ts';
import chalk from 'chalk';

// 0 3 6 9 12 15
// 1 3 6 10 15 21
// 10 13 16 21 30 45
export async function day9b(dataPath?: string) {
  const data = await readData(dataPath);
  // console.log({ data });
  return data
    .map((line: string) => {
      // console.log({ line });
      let lvl = [];
      lvl[0] = line.split(' ').map((n) => parseInt(n, 10));
      let l = 0;
      while (!lvl[l].every((n) => n === 0)) {
        const nudiff = [];
        for (let i = 0; i < lvl[l].length - 1; i++) {
          nudiff.push(lvl[l][i + 1] - lvl[l][i]);
        }
        // console.log({ nudiff });
        lvl[l + 1] = nudiff;
        // console.log({ lvl });
        l++;
      }
      console.log({ lvl });
      for (let i = lvl.length - 1; i >= 0; i--) {
        const val = i == lvl.length - 1 ? 0 : lvl[i][0] - lvl[i + 1][0];
        lvl[i] = [val, ...lvl[i]];
        lvl[i].push(val);
      }
      console.log('=', { lvl });
      return lvl[0][0];
    })
    .reduce((a, b) => a + b, 0);
}

const answer = await day9b();
console.log(chalk.bgGreen('Your Answer:'), chalk.green(answer));
