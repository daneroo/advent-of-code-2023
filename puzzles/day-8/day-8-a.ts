import { readData } from '../../shared.ts';
import chalk from 'chalk';

export async function day8a(dataPath?: string) {
  const data = await readData(dataPath);
  // console.log({ data });
  const handsBid = data.map((line: string) => {
    // console.log({ line });
  });
  return 0;
}

const answer = await day8a();
console.log(chalk.bgGreen('Your Answer:'), chalk.green(answer));
