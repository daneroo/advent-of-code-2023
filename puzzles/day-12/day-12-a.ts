import { readData } from '../../shared.ts';
import chalk from 'chalk';

// ???.### 1,1,3
// .??..??...?##. 1,1,3
// ?#?#?#?#?#?#?#? 1,3,1,6
// ????.#...#... 4,1,1
// ????.######..#####. 1,6,5
// ?###???????? 3,2,1
export async function day12a(dataPath?: string) {
  const data = await readData(dataPath);
  // console.log({ data });
  return data
    .map((line: string, row) => {
      // console.log({ line, row });
      const [condition, runsStr] = line.split(' ');
      const runs = runsStr.split(',').map((run) => parseInt(run, 10));
      // console.log({ condition, runs });
      const cond = condition.split('');
      // console.log('+', { cond, runs });
      // cons is an array of '.','.','#'
      // operational (.)
      // damaged (#)
      // unknown (?)
      // runs are counts of contiguous damaged springs (#)
      const numUnknowns = cond.filter((c) => c === '?').length;
      console.log(
        `Input: ${cond.join('')} ${runs.join(',')} #unknowns=${numUnknowns}`
      );
      function findJthOccurrence(arr, char, j) {
        let count = 0;
        for (let i = 0; i < arr.length; i++) {
          if (arr[i] === char) {
            count++;
            // console.log(`---- a_i:${arr[i]} ch:${char} j:${j} count:${count}`);
            if (count === j) {
              return i; // Return the index of the j'th occurrence
            }
          } else {
            // console.log(
            //   `---- a_i:${arr[i]} ch:${char} j:${j} count:${count} XXX`
            // );
          }
        }
        return -1; // Return -1 if the j'th occurrence is not found
      }
      // for each unknown condition, consider it to be either operational or damaged
      //  ? -> . or #
      let matches = 0;
      for (let i = 0; i < 1 << numUnknowns; i++) {
        // console.log({ i });
        const condCopy = [...cond];
        for (let j = 0; j < numUnknowns; j++) {
          const bit = (i >> j) & 1;
          // console.log({ bit });
          // find the jth unknown in cond
          // i.e. find the j'th occurence of '?' in cond
          let jthUnknownIndexInCond = findJthOccurrence(cond, '?', j + 1);
          // console.log(`--- bit=${bit} j=${j} jo=${jthUnknownIndexInCond}`);

          condCopy[jthUnknownIndexInCond] = bit ? '#' : '.';
        }
        // now count the runs in condCopy and check if they match
        const newRuns = [];
        let runCount = 0;
        for (let k = 0; k < condCopy.length; k++) {
          const c = condCopy[k];
          if (c === '#') {
            runCount++;
          } else {
            if (runCount > 0) {
              newRuns.push(runCount);
              runCount = 0;
            }
          }
        }
        if (runCount > 0) {
          newRuns.push(runCount);
        }
        // console.log(`Candi: ${condCopy.join('')} ${newRuns.join(',')}}`);

        // console.log('--', { condCopy, newRuns });
        if (newRuns.length === runs.length) {
          let match = true;
          for (let k = 0; k < newRuns.length; k++) {
            if (newRuns[k] !== runs[k]) {
              match = false;
              break;
            }
          }
          if (match) {
            // console.log(`Match: ${condCopy.join('')} ${newRuns.join(',')}}`);
            matches++;
          }
        }
      }

      // return 1 << numUnknowns;
      return matches;
    })
    .reduce((acc, curr) => acc + curr, 0);
}

const answer = await day12a();
console.log(chalk.bgGreen('Your Answer:'), chalk.green(answer));
