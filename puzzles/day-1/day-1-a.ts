import { readData } from '../../shared.ts';
import chalk from 'chalk';

export async function day1a(dataPath?: string) {
  const data = await readData(dataPath);
  console.log({ data });
  const sum = data
    .map((line) => {
      // convert line:string to array of chars
      // then filter for only digits
      // then convert back to string
      const digits = line
        .split('')
        .filter((char) => char.match(/\d/) !== null)
        .join('');
      // first and last chars
      const n = Number(digits.slice(0, 1) + digits.slice(-1));
      console.log({ digits, n });
      return n;
    })
    .reduce((acc, n) => {
      return acc + n;
    }, 0);

  console.log({ sum });
  return sum;
}

const answer = await day1a();
console.log(chalk.bgGreen('Your Answer:'), chalk.green(answer));
