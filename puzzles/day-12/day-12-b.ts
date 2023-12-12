import { readData } from '../../shared.ts';
import chalk from 'chalk';

// ???.### 1,1,3
// .??..??...?##. 1,1,3
// ?#?#?#?#?#?#?#? 1,3,1,6
// ????.#...#... 4,1,1
// ????.######..#####. 1,6,5
// ?###???????? 3,2,1

const cache = new Map();

function count(cond: string, runs: number[], running: boolean): number {
  function innerCount(cond: string, runs: number[], running: boolean): number {
    const sum = runs.reduce((acc, curr) => acc + curr, 0);
    // base cases empty cond string
    if (cond === '') {
      return sum === 0 ? 1 : 0;
    }
    // base case empty runs
    if (sum === 0) {
      return cond.includes('#') ? 0 : 1;
    }

    // head is '#' / damaged
    if (cond[0] === '#') {
      // still running, but no more counts, not a match
      if (running && runs[0] == 0) {
        return 0;
      }
      // still running, but more counts, continue
      return count(cond.slice(1), [runs[0] - 1, ...runs.slice(1)], true);
    }
    if (cond[0] === '.') {
      // still running, run terminated too early, not a match
      if (running && runs[0] > 0) {
        return 0;
      }
      // run terminated, continue (not running)
      return count(cond.slice(1), runs[0] === 0 ? runs.slice(1) : runs, false);
    }
    // cond[0] === '#'
    if (running) {
      if (runs[0] === 0) {
        // recurse, not running
        return count(cond.slice(1), runs.slice(1), false);
      }
      // recurse, still running
      return count(cond.slice(1), [runs[0] - 1, ...runs.slice(1)], true);
    }
    // we are not currently running
    // either we start a run or not - by recursion
    return (
      count(cond.slice(1), runs, false) + // not a new run
      count(cond.slice(1), [runs[0] - 1, ...runs.slice(1)], true) // new run
    );
  }

  // caching key
  const key = JSON.stringify([cond, runs, running]);
  if (cache.has(key)) {
    return cache.get(key);
  }
  const result = innerCount(cond, runs, running);
  cache.set(key, result);
  return result;
}

export async function day12b(dataPath?: string) {
  const data = await readData(dataPath);
  // console.log({ data });
  return data
    .map((line: string, row) => {
      // console.log({ line, row });
      const [condition1, runsStr] = line.split(' ');
      const run5Str = [runsStr, runsStr, runsStr, runsStr, runsStr].join(',');
      const runs = run5Str.split(',').map((run) => parseInt(run, 10));
      // repeat conditions 5 times, separated by '?'
      const condition5 = [
        condition1,
        condition1,
        condition1,
        condition1,
        condition1,
      ].join('?');

      const condition = condition5;
      console.log({ condition, runs: runs.join(',') });

      const matches = count(condition, runs, false);

      return matches;
    })
    .reduce((acc, curr) => acc + curr, 0);
}

const answer = await day12b();
console.log(chalk.bgGreen('Your Answer:'), chalk.green(answer));
