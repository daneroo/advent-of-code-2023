import { readData } from '../../shared.ts';
import chalk from 'chalk';

function hash(line: string): number {
  // Determine the ASCII code for the current character of the string.
  // Increase the current value by the ASCII code you just determined.
  // Set the current value to itself multiplied by 17.
  // Set the current value to the remainder of dividing itself by 256.
  return line.split('').reduce((hash, char) => {
    const ascii = char.charCodeAt(0);
    hash += ascii;
    hash *= 17;
    hash %= 256;
    return hash;
  }, 0);
}

// input rn=1,cm-,qp=3,cm=2,qp-,pc=4,ot=9,ab=5,pc-,pc=6,ot=7
export async function day15a(dataPath?: string) {
  const data = await readData(dataPath);
  // return hash('HASH');
  return data.map((line: string, row) => {
    console.log(line);
    const parts = line.split(',');
    console.log(parts);
    const hashes = parts.map((part) => hash(part));
    return hashes.reduce((acc, cur) => acc + cur, 0);
    console.log(hashes);
  });
  // return 0;
}

const answer = await day15a();
console.log(chalk.bgGreen('Your Answer:'), chalk.green(answer));
