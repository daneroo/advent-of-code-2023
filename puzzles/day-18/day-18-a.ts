import { readData } from '../../shared.ts';
import chalk from 'chalk';

// map
// R 6 (#70c710)
// D 5 (#0dc571)
// L 2 (#5713f0)
// D 2 (#d2c081)
// R 2 (#59c680)
// D 2 (#411b91)
// L 5 (#8ceee2)
// U 2 (#caa173)
// L 1 (#1b58a2)
// U 2 (#caa171)
// R 2 (#7807d2)
// U 3 (#a77fa3)
// L 2 (#015232)
// U 2 (#7a21e3)
export async function day18a(dataPath?: string) {
  const data = await readData(dataPath);
  // console.log({ data });
  const paths = [];
  data.forEach((line: string) => {
    // console.log({ line });
    const [dir, lenStr, colorStr] = line.split(' ');
    const len = parseInt(lenStr);
    const color = colorStr.replace('(', '').replace(')', '');
    console.log({ dir, len, color });
    paths.push({ dir, len, color });
  });
  let pos = [0, 0];
  const vertices = [];
  vertices.push({ x: pos[0], y: pos[1] });
  const max = [0, 0];
  const min = [0, 0];
  for (const path of paths) {
    const { dir, len, color } = path;
    // console.log({ dir, len, color });
    switch (dir) {
      case 'R':
        pos[0] += len;
        break;
      case 'L':
        pos[0] -= len;
        break;
      case 'U':
        pos[1] -= len;
        break;
      case 'D':
        pos[1] += len;
        break;
    }
    max[0] = Math.max(max[0], pos[0]);
    max[1] = Math.max(max[1], pos[1]);
    min[0] = Math.min(min[0], pos[0]);
    min[1] = Math.min(min[1], pos[1]);
    vertices.push({ x: pos[0], y: pos[1] });
    console.log('-', { pos, max });
  }
  console.log({ pos, min, max });
  max[0] -= min[0];
  max[1] -= min[1];
  console.log({ pos, min, max });

  // process.exit(0);
  // make a grid of max[0] x max[1]
  const grid: string[][] = [];
  for (let y = 0; y <= max[1]; y++) {
    grid[y] = [];
    for (let x = 0; x <= max[0]; x++) {
      grid[y].push('.');
      // grid[y][x] = '.';
    }
  }

  console.log('---');
  console.log(grid.map((row) => row.join('')).join('\n'));
  console.log('---');

  pos = [-min[0], -min[1]];

  for (const path of paths) {
    const { dir, len, color } = path;
    console.log({ dir, len, color });
    switch (dir) {
      case 'R':
        for (let i = 0; i < len; i++) {
          console.log({ x: pos[0] + i, y: pos[1] });
          grid[pos[1]][pos[0] + i] = '#'; // color;
        }
        pos[0] += len;
        break;
      case 'L':
        for (let i = 0; i < len; i++) {
          console.log({ x: pos[0] - i, y: pos[1] });
          grid[pos[1]][pos[0] - i] = '#'; // color;
        }
        pos[0] -= len;
        break;
      case 'U':
        for (let i = 0; i < len; i++) {
          grid[pos[1] - i][pos[0]] = '#'; // color;
        }
        pos[1] -= len;
        break;
      case 'D':
        for (let i = 0; i < len; i++) {
          grid[pos[1] + i][pos[0]] = '#'; // color;
        }
        pos[1] += len;
        break;
    }
  }
  console.log({ pos, min, max });

  console.log('---');
  console.log(grid.map((row) => row.join('')).join('\n'));
  console.log('---');
  // now for each line fill any . between '#'s
  //  so that #...#.. becomes #####..
  function floodFill(grid, startX, startY, fillChar, boundaryChar) {
    let queue = [{ x: startX, y: startY }];

    while (queue.length > 0) {
      let { x, y } = queue.shift();

      if (x < 0 || x >= grid[0].length || y < 0 || y >= grid.length) continue;
      if (grid[y][x] !== fillChar && grid[y][x] !== boundaryChar) {
        grid[y][x] = fillChar;

        // Add neighboring cells to the queue
        queue.push({ x: x + 1, y });
        queue.push({ x: x - 1, y });
        queue.push({ x, y: y + 1 });
        queue.push({ x, y: y - 1 });
      }
    }
  }
  function fillShapeInterior(
    grid,
    startX,
    startY,
    fillChar = '.',
    boundaryChar = '#'
  ) {
    floodFill(grid, startX, startY, fillChar, boundaryChar);
  }

  function findInteriorPoint(grid, boundaryChar = '#') {
    for (let y = 0; y < grid.length; y++) {
      for (let x = 0; x < grid[y].length; x++) {
        if (grid[y][x] === boundaryChar) {
          // Check adjacent cells
          const directions = [
            [1, 0],
            [-1, 0],
            [0, 1],
            [0, -1],
          ];
          for (let [dx, dy] of directions) {
            const newX = x + dx;
            const newY = y + dy;
            if (
              newX >= 0 &&
              newY >= 0 &&
              newX < grid[0].length &&
              newY < grid.length &&
              grid[newY][newX] === '.'
            ) {
              return { x: newX, y: newY }; // Found an interior point
            }
          }
        }
      }
    }
    return null; // No interior point found or single closed shape not detected
  }

  const interiorPoint = findInteriorPoint(grid);
  // const interiorPoint = { x: 141, y: 11 };

  if (!interiorPoint) {
    throw new Error('No interior point found or the shape is not closed.');
  }
  console.log({ interiorPoint });
  fillShapeInterior(grid, interiorPoint.x, interiorPoint.y, '*', '#');
  // now replace all * with #
  for (let y = 0; y <= max[1]; y++) {
    for (let x = 0; x <= max[0]; x++) {
      if (grid[y][x] === '*') {
        grid[y][x] = '#';
      }
    }
  }
  console.log(grid.map((row) => row.join('')).join('\n'));
  console.log('---');
  console.log(grid.map((row) => row.join('')).join('\n'));
  console.log('---');
  //  and also count the '#'s
  const count = grid.reduce((acc, row) => {
    return acc + row.filter((c) => c === '#').length;
  }, 0);
  console.log({ count });

  function shoelaceFormula(vertices) {
    let area = 0;

    for (let i = 0; i < vertices.length - 1; i++) {
      area +=
        vertices[i].x * vertices[i + 1].y - vertices[i + 1].x * vertices[i].y;
    }

    return Math.abs(area / 2);
  }
  const interiorPoints = shoelaceFormula(vertices);
  console.log({ interiorPoints });
  return interiorPoints;
}

const answer = await day18a();
console.log(chalk.bgGreen('Your Answer:'), chalk.green(answer));
