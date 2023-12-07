import { readData } from '../../shared.ts';
import chalk from 'chalk';

const cardsValues = {
  A: 14,
  K: 13,
  Q: 12,
  J: 11,
  T: 10,
  '9': 9,
  '8': 8,
  '7': 7,
  '6': 6,
  '5': 5,
  '4': 4,
  '3': 3,
  '2': 2,
};
export async function day7a(dataPath?: string) {
  const data = await readData(dataPath);
  // console.log({ data });
  const handsBid = data.map((line: string) => {
    // console.log({ line });
    const [hand, bid] = line.split(' ');
    const hh = counts(hand);
    classify(hand);
    console.log({ hand, bid, hh });
    return { hand, bid };
  });
  handsBid.sort((a, b) => {
    const aClass = classify(a.hand);
    const bClass = classify(b.hand);
    if (aClass === bClass) {
      for (let i = 0; i < 5; i++) {
        const aV = cardsValues[a.hand[i]];
        const bV = cardsValues[b.hand[i]];
        if (aV > bV) {
          return 1;
        }
        if (aV < bV) {
          return -1;
        }
      }
      return 0;
    }
    return aClass > bClass ? 1 : -1;
  });
  console.log({ handsBid });
  return handsBid
    .map((hb, index) => {
      const rank = index + 1;
      const bid = Number(hb.bid);
      console.log(rank, hb.hand, bid);
      return rank * bid;
    })
    .reduce((a, b) => a + b, 0);

  // return 0;
}

function classify(hand: string) {
  const hh = counts(hand);
  const values = Object.values(hh).sort();
  console.log('v', { values });
  if (values.includes(5)) {
    return 7;
  }
  if (values.includes(4)) {
    return 6;
  }
  if (values.includes(3) && values.includes(2)) {
    return 5;
  }
  if (values.includes(3)) {
    return 4;
  }
  if (values.includes(2) && values.length === 3) {
    return 3;
  }
  if (values.includes(2)) {
    return 2;
  }
  return 1;
}
function counts(hand: string) {
  const handArray = hand.split('');
  const cards = {};
  handArray.forEach((card) => {
    cards[card] = cards[card] || 0;
    cards[card]++;
  });
  return cards;
}
const answer = await day7a();
console.log(chalk.bgGreen('Your Answer:'), chalk.green(answer));
