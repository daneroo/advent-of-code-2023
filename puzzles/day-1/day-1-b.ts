import { readData } from '../../shared.ts';
import chalk from 'chalk';

export async function day1b(dataPath?: string) {
  const data = await readData(dataPath);
  console.log({ data });
  const sum = data
    .map((line) => {
      const digits: number[] = []; // accumulated digits
      const dWords = [
        'zero',
        'one',
        'two',
        'three',
        'four',
        'five',
        'six',
        'seven',
        'eight',
        'nine',
      ];
      console.log('---', { line });
      let lineRemain = line;
      outer: while (lineRemain.length > 0) {
        // 1- if line starts with a digit
        if (lineRemain.match(/^\d/)) {
          const d = Number(lineRemain.slice(0, 1));
          digits.push(d);
          // console.log('d', { lineRemain, d });

          lineRemain = lineRemain.slice(1);
          continue;
        }
        // 2- if line starts with a digit word
        // we should only remove one letter in case there are nested letters
        for (const dWord of dWords) {
          const i = lineRemain.indexOf(dWord);
          if (i === 0) {
            const d = dWords.indexOf(dWord);
            // lineRemain = lineRemain.slice(dWord.length);
            lineRemain = lineRemain.slice(1);

            // console.log('w', { lineRemain, dWord, d });
            digits.push(d);
            continue outer;
          }
        }
        // else not a digit or digit word
        // remove the first char and try again
        lineRemain = lineRemain.slice(1);
        // console.log('...', { lineRemain });
      }
      if (digits.length > 0) {
        const n = digits[0] * 10 + digits[digits.length - 1];
        console.log('+++', { digits: digits.join(''), n });
        return n;
      }
      console.log('no digits found');
      process.exit(1);
      return 0;
    })
    .reduce((acc, n) => {
      return acc + n;
    }, 0);

  console.log({ sum });
  return sum;
}

const answer = await day1b();
console.log(chalk.bgGreen('Your Answer:'), chalk.green(answer));
