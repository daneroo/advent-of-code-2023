import { readData } from '../../shared.ts';
import chalk from 'chalk';

// restart implementation of part a, then part b
// a-sample: 405
// a: 28895
// b-sample: 400
// b: 31603

// switch between part a and part b
// which just means expected diffs in verticalSymmetry
// will be 0 for part a and 1 for part b
const partA = false;

function diffLines(la: string, lb: string) {
  let diff = 0;
  for (let i = 0; i < la.length; i++) {
    if (la[i] !== lb[i]) {
      diff++;
    }
  }
  return diff;
}

//return the index around which we have row symmetry
function verticalSymmetry(lines: string[]) {
  // console.log(`r in: [1,${lines.length})`);
  for (let r = 1; r < lines.length; r++) {
    // we should compare the rows around r
    // i.e. line 0..r-1 and r..lines.length-1
    // but limit the length to the shortest of the two
    // also the rows of th top should be reversed
    // that way comparing top[] with bottom[] is really comparing
    //   lines[r-1]==lines[r]
    //   lines[r-2]==lines[r+1], ...
    const length = Math.min(r, lines.length - r);
    const top = lines.slice(0, r).reverse().slice(0, length);
    const bottom = lines.slice(r).slice(0, length);
    // print(f"-r: {r} top: {len(above)} bottom: {len(below)}")
    // console.log(`+r: ${r}  top: ${top.length} bottom: ${bottom.length}`);

    // compare the two halves - both of length r
    // by summing the differences between the two halves/line by line
    // if they are equal, we have a candidate - return r
    const diffs = top
      .map((tLine, i) => {
        const bLine = bottom[i];
        return diffLines(tLine, bLine);
      })
      .reduce((acc, cur) => acc + cur, 0);

    const expectedDiffs = partA ? 0 : 1;
    if (diffs === expectedDiffs) {
      // console.log(`found r: ${r} with ${diffs} diffs`);
      return r;
    }
  }
  return 0;
}

function transpose(lines: string[]) {
  return lines[0]
    .split('')
    .map((_, i) => lines.map((row) => row[i]))
    .map((row) => row.join(''));
}
export async function day13b(dataPath?: string) {
  const data = await readData(dataPath);
  const puzzles = data.join('\n').split('\n\n');
  // console.log({ puzzles });

  return puzzles
    .map((puzzle: string, row) => {
      const lines = puzzle.split('\n');
      // console.log(
      //   `--- puzzle: ${row} cols: ${lines[0].length} rows: ${lines.length}`
      // );
      // console.log(lines.join('\n'));
      const vert = verticalSymmetry(lines);

      // console.log(`--- transposed`);
      const transposed = transpose(lines);
      // console.log(transposed.join('\n'));
      const horz = verticalSymmetry(transposed);

      return vert * 100 + horz;
    })
    .reduce((acc, cur) => acc + cur, 0);
  // return 0;
}

const answer = await day13b();
console.log(chalk.bgGreen('Your Answer is:'), chalk.green(answer));
