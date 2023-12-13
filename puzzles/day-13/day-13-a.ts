import { readData } from '../../shared.ts';
import chalk from 'chalk';

// horizonetal symmetry around col 5|6
// #.##..##.
// ..#.##.#.
// ##......#
// ##......#
// ..#.##.#.
// ..##..##.
// #.#.##.#.
function isSymmetricalHorizontally(lines: string[]) {
  // decide if the left and right sides are symmetrical around a column
  // find the indices around which line[0] is symmetrical
  // the remove those that are not symmetrical for line[1],...

  //  candidates = [1, lines[0].length-2 ]
  let candidates = Array.from({ length: lines[0].length - 1 }, (_, i) => i + 1);
  // console.log({ l: lines[0].length, candidates });
  for (const line of lines) {
    // test each remaining candidate
    // if the left and right sides are not symmetrical around the candidate, remove it
    // if there is only one candidate left, return true
    // if there are no candidates left, return false
    // if there are more than one candidate left, continue to the next line
    const newCandidates = [];
    for (const candidate of candidates) {
      // split the line into left and right
      // 0..candidate, candidate+1..line.length-1
      // reverse the left side
      const length = Math.min(candidate, line.length - candidate);

      let left = line
        .slice(0, candidate)
        .split('')
        .reverse()
        .join('')
        .slice(0, length);
      let right = line.slice(candidate).slice(0, length);
      // console.log(
      //   `== c:${candidate} l:${length} ${left === right ? 'true' : 'false'}`
      // );
      // console.log(`   line: ${line}`);
      // console.log(`     ${line.slice(0, candidate)}|${line.slice(candidate)}`);
      // console.log(`   left: ${left}`);
      // console.log(`  right: ${right}`);

      if (left === right) {
        newCandidates.push(candidate);
      }
    }
    candidates = newCandidates;
  }
  console.log('symmetrical H', { candidates });
  if (candidates.length > 1) {
    throw new Error('too symmetrical H');
  }

  if (candidates.length != 1) {
    // throw new Error('not symmetrical');
    return 0;
  }
  return candidates[0];
}
// Vertical symmetry around row 4|5
// #...##..#
// #....#..#
// ..##..###
// #####.##.
// #####.##.
// ..##..###
// #....#..#

function isSymmetricalVertically(lines: string[]) {
  // decide if the top and bottom lines are symmetrical around a row
  // find the indices around which line[0] is symmetrical
  // the remove those that are not symmetrical for line[1],...

  //  candidates = [1, lines[0].length-2 ]
  let candidates = Array.from(
    { length: lines.length - 1 },
    (_, i) => i + 1
  ).filter((candidate) => {
    const length = Math.min(candidate, lines.length - candidate);
    // console.log(
    //   `-- checking candidate ${candidate} length ${length} #lines ${lines.length}`
    // );
    const equalLines = [];
    for (let r = 0; r < length; r++) {
      // compare row row candidate-r and candidate+
      // console.log(
      //   `-- checking r:${r} : ${candidate - r - 1} and ${candidate + r}`
      // );
      if (lines[candidate - r - 1] !== lines[candidate + r]) {
        return false;
      } else {
        equalLines.push([candidate - r - 1, candidate + r]);
      }
    }
    console.log({ candidate, length, equalLines });
    return true;
  });

  console.log('symmetrical V', { candidates });
  if (candidates.length > 1) {
    throw new Error('too symmetrical V');
  }
  if (candidates.length != 1) {
    return 0;
  }
  return candidates[0];
}

function isSymmetricalHorizontally2(lines: string[]) {
  // decide if the top and bottom lines are symmetrical around a row
  // find the indices around which line[0] is symmetrical
  // the remove those that are not symmetrical for line[1],...

  function equalCols(i, j) {
    console.log(`-- checking cols ${i} and ${j}`);
    for (let r = 0; r < lines.length; r++) {
      console.log(`r:${r} ${lines[r][i]} ${lines[r][j]}`);
    }
    for (let r = 0; r < lines.length; r++) {
      // compare cols i and j
      if (lines[r][i] !== lines[r][j]) {
        return false;
      } else {
        // equalLines.push([candidate - r - 1, candidate + r]);
      }
    }
    return true;
  }
  //  candidates = [1, lines[0].length-2 ]
  let candidates = Array.from(
    { length: lines[0].length - 1 },
    (_, i) => i + 1
  ).filter((candidate) => {
    const length = Math.min(candidate, lines[0].length - candidate);
    console.log(
      `-- checking candidate ${candidate} length ${length} #lines ${lines.length} cols ${lines[0].length}`
    );
    for (let r = 0; r < length; r++) {
      // compare cols candidate - r - 1 and candidate + r
      if (!equalCols(candidate - r - 1, candidate + r)) {
        return false;
      } else {
        // equalLines.push([candidate - r - 1, candidate + r]);
      }
    }
    console.log({ candidate, length });
    return true;
  });

  console.log('symmetrical H', { candidates });
  if (candidates.length > 1) {
    throw new Error('too symmetrical H');
  }
  if (candidates.length != 1) {
    return 0;
  }
  return candidates[0];
}

export async function day13a(dataPath?: string) {
  const data = await readData(dataPath);
  const puzzles = data.join('\n').split('\n\n');
  // console.log({ puzzles });

  return puzzles
    .map((puzzle: string, row) => {
      const lines = puzzle.split('\n');
      console.log({ row });
      console.log(lines.join('\n'));
      const horz = isSymmetricalHorizontally(lines);
      const vert = isSymmetricalVertically(lines);
      // if (horz === 0 && vert === 0) {
      //   throw new Error('not symmetrical enough');
      // }
      return horz + 100 * vert;
    })
    .reduce((acc, cur) => acc + cur, 0);
  // return 0;
}

const answer = await day13a();
console.log(chalk.bgGreen('Your Answer:'), chalk.green(answer));
