import { readData } from '../../shared.ts';
import chalk from 'chalk';

// empty space (.), mirrors (/ and \), and splitters (| and -).

type Pos = { row: number; col: number };
type Dir = { row: number; col: number };
type State = { pos: Pos; dir: Dir };
function solve(grid: string[][], initialState: State) {
  // energized is a set of positions that are energized
  const energized: Set<String> = new Set();
  function getGrid(pos: Pos) {
    if (pos.row < 0 || pos.row >= grid.length) {
      throw new Error(`row out of bounds: ${pos.row}`);
    }
    if (pos.col < 0 || pos.col >= grid[0].length) {
      throw new Error(`col out of bounds: ${pos.col}`);
    }
    // console.log('getting grid:', { pos }, grid[pos.row][pos.col]);
    return grid[pos.row][pos.col];
  }
  function addEnergized(pos: Pos) {
    // console.log(`- addEnergized ${energized.size}`, { pos });
    energized.add(JSON.stringify(pos));
    // console.log(`  - addEnergized ${energized.size}`, { pos });
  }

  // we must traverse the grid until we reach the end
  // beams may split
  // we must record all tiles that are energized (beam going through)
  let activeStates: State[] = [initialState];

  const seen: Set<String> = new Set();

  function advance(state: { pos: Pos; dir: Dir }): void {
    if (seen.has(JSON.stringify(state))) {
      // console.log('skip seen state', { state });
      return;
    }
    seen.add(JSON.stringify(state));
    const { pos, dir } = state;
    // console.log('advancing', { pos, dir });
    const { row, col } = pos;
    const { row: dRow, col: dCol } = dir;
    const nextPos: Pos = { row: row + dRow, col: col + dCol };
    if (nextPos.row < 0 || nextPos.row >= grid.length) {
      // console.log('skip out of bounds row', { nextPos });
      return;
    }
    if (nextPos.col < 0 || nextPos.col >= grid[0].length) {
      // console.log('skip out of bounds col', { nextPos });
      return;
    }
    // the next dir depends on the tile we are on (nextPos)
    // empty space (.), mirrors (/ and \), and splitters (| and -).
    const ch = getGrid(nextPos);
    addEnergized(nextPos);
    // console.log(`advancing ${ch} row:${nextPos.row} col:${nextPos.col}`);
    if (ch === '.') {
      // console.log(` advancing .==${ch} row:${nextPos.row} col:${nextPos.col}`);
      // we continue in the same direction
      activeStates.push({ pos: nextPos, dir });
      return;
    } else if (ch === '|') {
      // console.log(` advancing |==${ch} row:${nextPos.row} col:${nextPos.col}`);
      if (dir.row === 0) {
        // If the beam encounters the pointy end of a splitter (| or -), the beam passes through the splitter as if the splitter were empty space. For instance, a rightward-moving beam that encounters a - splitter would continue in the same direction.
        // we are going horizontally and hit a | splitter
        activeStates.push({ pos: nextPos, dir: { row: -1, col: 0 } });
        activeStates.push({ pos: nextPos, dir: { row: 1, col: 0 } });
      } else if (dir.col === 0) {
        // If the beam encounters the flat side of a splitter (| or -), the beam is split into two beams going in each of the two directions the splitter's pointy ends are pointing. For instance, a rightward-moving beam that encounters a | splitter would split into two beams: one that continues upward from the splitter's column and one that continues downward from the splitter's column.
        // we are going vertically and hit a | splitter, just continue as if space
        activeStates.push({ pos: nextPos, dir });
      } else {
        throw new Error(`advance invalid state |: ${JSON.stringify(state)}`);
      }
      return;
    } else if (ch === '-') {
      // console.log(` advancing -==${ch} row:${nextPos.row} col:${nextPos.col}`);
      if (dir.col === 0) {
        // If the beam encounters the pointy end of a splitter (| or -), the beam passes through the splitter as if the splitter were empty space. For instance, a rightward-moving beam that encounters a - splitter would continue in the same direction.
        // we are going vertically and hit a - splitter
        activeStates.push({ pos: nextPos, dir: { row: 0, col: -1 } });
        activeStates.push({ pos: nextPos, dir: { row: 0, col: 1 } });
      } else if (dir.row === 0) {
        // If the beam encounters the flat side of a splitter (| or -), the beam is split into two beams going in each of the two directions the splitter's pointy ends are pointing. For instance, a rightward-moving beam that encounters a | splitter would split into two beams: one that continues upward from the splitter's column and one that continues downward from the splitter's column.
        // we are going horizontally and hit a - splitter, just continue as if space
        activeStates.push({ pos: nextPos, dir });
      } else {
        throw new Error(`advance invalid state -: ${JSON.stringify(state)}`);
      }
      return;
    } else if (ch === '/') {
      // console.log(` advancing /==${ch} row:${nextPos.row} col:${nextPos.col}`);

      let nextDir: Dir;
      if (dir.row === 0 && dir.col === 1) {
        // we are going horizontally and hit an / mirror
        nextDir = { row: -1, col: 0 };
      } else if (dir.row === 0 && dir.col === -1) {
        // we are going horizontally and hit an / mirror
        nextDir = { row: 1, col: 0 };
      } else if (dir.row === 1 && dir.col === 0) {
        // we are going vertically and hit an / mirror
        nextDir = { row: 0, col: -1 };
      } else if (dir.row === -1 && dir.col === 0) {
        // we are going vertically and hit an / mirror
        nextDir = { row: 0, col: 1 };
      } else {
        throw new Error(`advance invalid state /: ${JSON.stringify(state)}`);
      }
      activeStates.push({ pos: nextPos, dir: nextDir });
      return;
    } else if (ch === '\\') {
      // console.log(` advancing \\==${ch} row:${nextPos.row} col:${nextPos.col}`);

      let nextDir: Dir;
      if (dir.row === 0 && dir.col === 1) {
        // we are going horizontally and hit an \ mirror
        nextDir = { row: 1, col: 0 };
      } else if (dir.row === 0 && dir.col === -1) {
        // we are going horizontally and hit an \ mirror
        nextDir = { row: -1, col: 0 };
      } else if (dir.row === 1 && dir.col === 0) {
        // we are going vertically and hit an \ mirror
        nextDir = { row: 0, col: 1 };
      } else if (dir.row === -1 && dir.col === 0) {
        // we are going vertically and hit an \ mirror
        nextDir = { row: 0, col: -1 };
      } else {
        throw new Error(`advance invalid state \\: ${JSON.stringify(state)}`);
      }
      activeStates.push({ pos: nextPos, dir: nextDir });
      return;
    } else {
      throw new Error(`advance invalid ch: ${ch} ${JSON.stringify(state)}`);
    }
  }

  // process.exit(0);
  while (activeStates.length > 0) {
    // console.log(`activeStates: ${activeStates.length}`);
    // console.log(
    //   `-----\nactiveStates: n:${activeStates.length} en:${
    //     energized.size
    //   } ${JSON.stringify(activeStates)}`
    // );
    // get the head state
    const state = activeStates.shift();
    // advance the state
    advance(state);
  }
  return energized.size;
}
export async function day16b(dataPath?: string) {
  const data = await readData(dataPath);
  // console.log({ data });
  const grid: string[][] = [];
  data.forEach((line: string, rowIndex: number) => {
    // console.log({ rowIndex, line });
    grid[rowIndex] = line.split('');
  });

  let maxEnergized = 0;
  // solve the puzzle for initial states
  // row:0..grid.length-1 col:-1   dir:0,1
  for (let row = 0; row < grid.length; row++) {
    const initialStateLeft: State = {
      pos: { row: row, col: -1 },
      dir: { row: 0, col: 1 },
    };
    const energized = solve(grid, initialStateLeft);
    console.log(`left: ${energized} ${JSON.stringify(initialStateLeft)}`);
    maxEnergized = Math.max(maxEnergized, energized);
  }
  for (let row = 0; row < grid.length; row++) {
    const initialStateRight: State = {
      pos: { row: row, col: grid[0].length },
      dir: { row: 0, col: -1 },
    };
    const energized = solve(grid, initialStateRight);
    console.log(`right: ${energized} ${JSON.stringify(initialStateRight)}`);
    maxEnergized = Math.max(maxEnergized, energized);
  }
  for (let col = 0; col < grid[0].length; col++) {
    const initialStateTop: State = {
      pos: { row: 0, col: col },
      dir: { row: 1, col: 0 },
    };
    const energized = solve(grid, initialStateTop);
    console.log(`top: ${energized} ${JSON.stringify(initialStateTop)}`);
    maxEnergized = Math.max(maxEnergized, energized);
  }
  for (let col = 0; col < grid[0].length; col++) {
    const initialStateBottom: State = {
      pos: { row: grid.length, col: col },
      dir: { row: -1, col: 0 },
    };
    const energized = solve(grid, initialStateBottom);
    console.log(`bottom: ${energized} ${JSON.stringify(initialStateBottom)}`);
    maxEnergized = Math.max(maxEnergized, energized);
  }

  return maxEnergized;
}

const answer = await day16b();
console.log(chalk.bgGreen('Your Answer:'), chalk.green(answer));
