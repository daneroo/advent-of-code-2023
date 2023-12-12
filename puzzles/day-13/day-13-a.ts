import { readData } from '../../shared.ts';
import chalk from 'chalk';

export async function day13a(dataPath?: string) {
  const data = await readData(dataPath);
  // console.log({ data });
  return data
    .map((line: string, row) => {
      // console.log({ line, row });
      return 1;
    })
    .reduce((acc, cur) => acc + cur, 0);
  // return 0;
}

const answer = await day13a();
console.log(chalk.bgGreen('Your Answer:'), chalk.green(answer));
