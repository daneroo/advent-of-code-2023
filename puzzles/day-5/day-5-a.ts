import { readData } from '../../shared.ts';
import chalk from 'chalk';

const sample = {
  seeds: [79, 14, 55, 13],
  seedToSoil: [
    [50, 98, 2],
    [52, 50, 48],
  ],
  soilToFertilizer: [
    [0, 15, 37],
    [37, 52, 2],
    [39, 0, 15],
  ],
  fertilizerToWater: [
    [49, 53, 8],
    [0, 11, 42],
    [42, 0, 7],
    [57, 7, 4],
  ],
  waterToLight: [
    [88, 18, 7],
    [18, 25, 70],
  ],
  lightToTemperature: [
    [45, 77, 23],
    [81, 45, 19],
    [68, 64, 13],
  ],
  temperatureToHumidity: [
    [0, 69, 1],
    [1, 0, 69],
  ],
  humidityToLocation: [
    [60, 56, 37],
    [56, 93, 4],
  ],
};

export async function day5a(dataPath?: string) {
  // const data = await readData(dataPath);
  // console.log({ data });
  // the maps describe entire ranges of numbers that can be converted. Each line within a map contains three numbers: the destination range start, the source range start, and the range length.
  // -soil 98,..,98+2-1 maps to seed 50,..,50+2-1
  // -soil 50,..,50+48-1 maps to seed 52,..,52+48-1
  // else maps with identity
  const {
    seeds,
    seedToSoil,
    soilToFertilizer,
    fertilizerToWater,
    waterToLight,
    lightToTemperature,
    temperatureToHumidity,
    humidityToLocation,
  } = sample;

  console.log({ seeds });
  return seeds
    .map((seed) => {
      const soil = lookup(seedToSoil, seed);
      const fertilizer = lookup(soilToFertilizer, soil);
      const water = lookup(fertilizerToWater, fertilizer);
      const light = lookup(waterToLight, water);
      const temperature = lookup(lightToTemperature, light);
      const humidity = lookup(temperatureToHumidity, temperature);
      const location = lookup(humidityToLocation, humidity);
      console.log({
        seed,
        soil,
        fertilizer,
        water,
        light,
        temperature,
        humidity,
        location,
      });
      return location;
    })
    .reduce((min, location) => {
      // find minimum number of location
      return Math.min(min, location);
    }, 9e9);
}

function lookup(map: number[][], num: number) {
  for (let i = 0; i < map.length; i++) {
    const [destStart, srcStart, len] = map[i];
    if (num >= srcStart && num < srcStart + len) {
      return destStart + (num - srcStart);
    }
  }
  return num;
}
// function invertMap(map: number[][]) {
//   const invertedMap = [];
//   for (let i = 0; i < map.length; i++) {
//     const [destStart, srcStart, len] = map[i];
//     invertedMap.push([srcStart, destStart, len]);
//   }
//   return invertedMap;
// }

const answer = await day5a();
console.log(chalk.bgGreen('Your Answer:'), chalk.green(answer));
