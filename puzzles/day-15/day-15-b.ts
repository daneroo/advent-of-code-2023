import { readData } from '../../shared.ts';
import chalk from 'chalk';

function hash(line: string): number {
  // Determine the ASCII code for the current character of the string.
  // Increase the current value by the ASCII code you just determined.
  // Set the current value to itself multiplied by 17.
  // Set the current value to the remainder of dividing itself by 256.
  return line.split('').reduce((hash, char) => {
    const ascii = char.charCodeAt(0);
    hash += ascii;
    hash *= 17;
    hash %= 256;
    return hash;
  }, 0);
}

// input rn=1,cm-,qp=3,cm=2,qp-,pc=4,ot=9,ab=5,pc-,pc=6,ot=7
export async function day15b(dataPath?: string) {
  const data = await readData(dataPath);
  // return hash('HASH');
  // box[0],...box[255]
  // inside each box, there are several lens slots
  const boxes = [];
  for (let i = 0; i < 256; i++) {
    boxes.push([]);
  }
  return data
    .map((line: string, row) => {
      // console.log(line);
      const parts = line.split(',');
      // console.log(parts);
      const hashes = parts.map((part) => {
        if (part.endsWith('-')) {
          // ------
          const label = part.slice(0, -1);
          const h = hash(label);
          console.log('-', { part, label, h });
          // boxes[h] = boxes[h] || [];
          // delete boxes[h].push({ [label]: focal });
          boxes[h] = boxes[h].filter((mm) => {
            const key = Object.keys(mm)[0];
            if (key === label) {
              const focal = mm[label];
              console.log('removing', { key, label, focal });
            }
            return key !== label;
          });
        } else {
          // ======
          if (!part.includes('=')) {
            throw new Error('Expected equals');
          }
          const [label, focalStr] = part.split('=');
          const focal = parseInt(focalStr, 10);
          const h = hash(label);
          console.log('=', { part, label, focal, h });
          boxes[h] = boxes[h];
          let found = false;
          for (const slot of boxes[h]) {
            const key = Object.keys(slot)[0];
            if (key === label) {
              const oldFocal = slot[key];
              console.log('found/replacing', { key, label, focal, oldFocal });
              slot[key] = focal;
              found = true;
              break;
            }
          }
          if (!found) {
            console.log('adding', { label, focal });
            boxes[h].push({ [label]: focal });
          }
        }
        // console.log(boxes);
        return hash(part);
      });
      return boxes
        .map((box, boxIndex) => {
          // box is an array of single key maps
          console.log(boxIndex, box);
          return box
            .map((mm, slotIndex) => {
              const key = Object.keys(mm)[0];
              const focal = mm[key];
              const z = (boxIndex + 1) * (slotIndex + 1) * focal;
              console.log(
                `box ${boxIndex} slot ${slotIndex} ${key} ${mm[key]}==${focal} z:${z}`
              );
              return (boxIndex + 1) * (slotIndex + 1) * focal;
            })
            .reduce((acc, cur) => acc + cur, 0);
        })
        .reduce((acc, cur) => acc + cur, 0);
      // return hashes.reduce((acc, cur) => acc + cur, 0);
    })
    .reduce((acc, cur) => acc + cur, 0);
  // return 0;
}

const answer = await day15b();
console.log(chalk.bgGreen('Your Answer:'), chalk.green(answer));
