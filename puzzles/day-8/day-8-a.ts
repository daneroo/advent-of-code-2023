import { readData } from '../../shared.ts';
import chalk from 'chalk';

export async function day8a(dataPath?: string) {
  const preData = await readData(dataPath);
  const rl = preData.slice(0, 1)[0];
  console.log({ rl });
  const data = preData.slice(2);
  // console.log({ data });
  // map from string to {r:string, l:string}
  const map: Record<string, { r: string; l: string }> = {};

  data.forEach((line: string) => {
    console.log({ line });
    // AAA = (BBB, CCC)
    const [src, rest] = line.split(' = ');
    // console.log({ src, rest });
    const [lp, rp] = rest.split(', ');
    const l = lp.slice(1);
    const r = rp.slice(0, -1);
    console.log({ src, l, r });
    map[src] = { l, r };
  });
  let place = 'AAA';
  let t = 0;
  while (place !== 'ZZZ') {
    console.log('-', { place });
    const dir = rl[t % rl.length];
    if (dir === 'R') {
      place = map[place].r;
    } else if (dir === 'L') {
      place = map[place].l;
    } else {
      throw new Error('Invalid direction');
    }
    console.log('+', { place });
    t++;
  }
  console.log({ t });
  return t;
}

const answer = await day8a();
console.log(chalk.bgGreen('Your Answer:'), chalk.green(answer));
