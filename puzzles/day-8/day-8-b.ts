import { readData } from '../../shared.ts';
import chalk from 'chalk';

export async function day8b(dataPath?: string) {
  const preData = await readData(dataPath);
  const rl = preData.slice(0, 1)[0];
  console.log({ rl });
  const data = preData.slice(2);
  // console.log({ data });
  // map from string to {r:string, l:string}
  const map: Record<string, { r: string; l: string }> = {};

  data.forEach((line: string) => {
    // console.log({ line });
    // AAA = (BBB, CCC)
    const [src, rest] = line.split(' = ');
    // console.log({ src, rest });
    const [lp, rp] = rest.split(', ');
    const l = lp.slice(1);
    const r = rp.slice(0, -1);
    // console.log({ src, l, r });
    map[src] = { l, r };
  });
  // let place = 'AAA';
  let t = 0;
  let places = Object.keys(map).filter((k) => k.endsWith('A'));
  const zzzs = places.map(() => 0);
  console.log({ places });
  // process.exit(0);
  // const seen = new Set<string>();
  while (true) {
    // const placesStr = places.join(',');
    // if (seen.has(placesStr)) {
    //   console.log({ t, places });
    //   throw new Error('Loop detected');
    // }
    // seen.add(placesStr);
    // console.log('-', { places });
    const dir = rl[t % rl.length];
    if (dir === 'R') {
      // place = map[place].r;
      const newPlaces = places.map((p) => map[p].r);
      places = newPlaces;
    } else if (dir === 'L') {
      const newPlaces = places.map((p) => map[p].l);
      places = newPlaces;
    } else {
      throw new Error('Invalid direction');
    }
    if (t % 1_000_000 === 0) {
      console.log('+', { t, places });
    }
    // exit if all places end in Z

    const zs = places.filter((p) => p.endsWith('Z')).length;
    // if (zs > 2) {
    //   console.log({ t, places, zs });
    // }
    const done = places.every((p) => p.endsWith('Z'));
    t++;
    if (done) {
      break;
    }
    // mark the places that places[i] ends in Z
    places.forEach((p, i) => {
      if (p.endsWith('Z')) {
        if (zzzs[i] > 0) {
          // throw new Error('Loop detected');
          console.log(`t:${t} should be multiple of ${zzzs[i]}`);
        } else {
          zzzs[i] = t;
        }
        console.log('z', { i, t, places });
        console.log({ zzzs });
      }
    });
    if (zzzs.every((z) => z > 0)) {
      break;
    }
  }
  if (zzzs.every((z) => z > 0)) {
    const lcm = lcmArray(zzzs);
    console.log('don;t wait for termination, just use lcm');
    console.log('********:', { lcm });
    return lcm;
  }

  console.log({ t });
  return t;
}

function gcd(a, b) {
  while (b != 0) {
    let t = b;
    b = a % b;
    a = t;
  }
  return a;
}

function lcm(a, b) {
  return Math.abs(a * b) / gcd(a, b);
}

function lcmArray(arr) {
  let currentLcm = arr[0];
  for (let i = 1; i < arr.length; i++) {
    currentLcm = lcm(currentLcm, arr[i]);
  }
  return currentLcm;
}
const answer = await day8b();
console.log(chalk.bgGreen('Your Answer:'), chalk.green(answer));
