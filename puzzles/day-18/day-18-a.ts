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

type Vertex = { x: number; y: number };

// Shoelace formula
// https://en.wikipedia.org/wiki/Shoelace_formula
function calculateArea(vertices: Vertex[]): number {
  let area = 0;
  for (let i = 0; i < vertices.length; i++) {
    let j = (i + 1) % vertices.length;
    area += vertices[i].x * vertices[j].y;
    area -= vertices[j].x * vertices[i].y;
  }
  return Math.abs(area / 2);
}

function calculateTotalBoundaryLength(vertices: Vertex[]): number {
  let boundaryLength = 0;
  for (let i = 0; i < vertices.length - 1; i++) {
    boundaryLength +=
      Math.abs(vertices[i + 1].x - vertices[i].x) +
      Math.abs(vertices[i + 1].y - vertices[i].y);
  }
  return boundaryLength;
}
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
  const vertices: Vertex[] = [];
  vertices.push({ x: pos[0], y: pos[1] });
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
    vertices.push({ x: pos[0], y: pos[1] });
    console.log('-', { pos });
  }
  console.log('+', { pos });
  console.log(`vertices: ${vertices.length}`);
  console.log(vertices);

  const A = calculateArea(vertices);
  const b = calculateTotalBoundaryLength(vertices);
  // Pick's Theorem (I = A - B/2 + 1)
  const interiorPoints = A - b / 2 + 1;
  const totalPoints = interiorPoints + b;

  console.log({
    interiorPoints: Math.round(interiorPoints),
    totalPoints: Math.round(totalPoints),
  });

  return totalPoints;
}

const answer = await day18a();
console.log(chalk.bgGreen('Your Answer:'), chalk.green(answer));
