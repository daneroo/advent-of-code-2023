import { readData } from '../../shared.ts';
import chalk from 'chalk';

export async function day14a(dataPath?: string) {
  const data = await readData(dataPath);
  return data
    .map((line: string, row) => {
      const lines = line.split('\n');
      console.log({ row, line });
      return 1;
    })
    .reduce((acc, cur) => acc + cur, 0);
  // return 0;
  return 0;
}

const answer = await day14a();
console.log(chalk.bgGreen('Your Answer:'), chalk.green(answer));
