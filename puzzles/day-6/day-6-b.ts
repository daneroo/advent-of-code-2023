import { readData } from '../../shared.ts';
import chalk from 'chalk';

export async function day6b(dataPath?: string) {
  const data = await readData(dataPath);
  // console.log({ data });
  const z = {};
  let dist: number[] = [];
  let time: number[] = [];
  data.forEach((line: string) => {
    // console.log({ line });
    let [name, ary] = line.split(':');
    ary = ary.trim().replace(/ /g, '');
    console.log({ name, ary });
    z[name] = ary
      .trim()
      .split(' ')
      .filter((x: string) => x !== '')
      // .join('');
      .map((x: string) => parseInt(x));
  });
  dist = z['Distance'];
  time = z['Time'];
  // console.log({ dist, time });
  // races[0] = {dist:dist[0] ,time: time[0]};
  // races[1] = {dist:dist[1] ,time: time[1]};
  const races = dist.map((x: number, i: number) => {
    return { maxDist: x, time: time[i] };
  });
  console.log({ races });
  // for each race, calculate the optimum speed
  const prod = races
    .map((r) => {
      // console.log({ r });
      const { maxDist, time } = r;
      // must chose powerTime <= time
      // dist = powerTime * (time - powerTime)
      let minTime = 9e9;
      let maxTime = -1;
      for (let powerTime = 0; powerTime <= time; powerTime++) {
        const dist = powerTime * (time - powerTime);
        // console.log('-', { powerTime, dist });
        if (dist > maxDist) {
          // valid powerTime
          // console.log('+', { powerTime, dist });
          minTime = Math.min(minTime, powerTime);
          maxTime = Math.max(maxTime, powerTime);
        }
      }
      const validTimes = maxTime - minTime + 1;
      console.log('=', { minTime, maxTime, validTimes });
      return validTimes;
    })
    .reduce((prod, n) => prod * n, 1);
  return prod;
  // return 0;
}

const answer = await day6b();
console.log(chalk.bgGreen('Your Answer:'), chalk.green(answer));
