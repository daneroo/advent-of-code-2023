import { readData } from '../../shared.ts';
import chalk from 'chalk';

const cardsValues = {
  A: 14,
  K: 13,
  Q: 12,
  J: 1, // now weakest
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
  const handsBids = data.map((line: string) => {
    // console.log({ line });
    const [hand, bid] = line.split(' ');
    const hh = counts(hand);
    // classify(hand);
    // console.log({ hand, bid, hh });
    return { hand, bid };
  });
  // console.log({ handsBids });
  const jHandsBids = handsBids;
  jHandsBids.sort((a, b) => {
    const aClass = classifyWithWildCard(a.hand);
    const bClass = classifyWithWildCard(b.hand);
    if (aClass === bClass) {
      for (let i = 0; i < 5; i++) {
        const aV = cardsValues[a.hand[i]];
        const bV = cardsValues[b.hand[i]];
        if (a.hand[i] === 'J' || b.hand[i] === 'J') {
          console.log('Lex Joker found', {
            i,
            a: a.hand[i],
            b: b.hand[i],
            aV,
            bV,
          });
        }
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
  console.log({ jHandsBids });
  return jHandsBids
    .map((hb, index) => {
      const rank = index + 1;
      const bid = Number(hb.bid);
      console.log({
        rank,
        hand: hb.hand,
        bid,
        c: classifyWithWildCard(hb.hand),
      });
      return rank * bid;
    })
    .reduce((a, b) => a + b, 0);

  // return 0;
}

function jokerify(handBid: { hand: string; bid: string }) {
  const { hand, bid } = handBid;
  if (hand.includes('J')) {
    // console.log('found Joker', hand);
    const cc = counts(hand);
    const values = Object.values(cc);
    // console.log('zzz', { values, cc });
    if (values.includes(4)) {
      // find the key with 4
      const key = Object.keys(cc).find((key) => cc[key] === 4);
      if (key === 'J') {
        console.log('Joker is the key');
        // use the other key
        const otherKey = Object.keys(cc).find((key) => cc[key] !== 4);
        // replace all J with the other key
        const newHand = hand.replaceAll('J', otherKey);
        console.log('4-newHand', { hand, newHand });
        return { hand: newHand, bid };
        // process.exit(1);
      }
      // replace all J with the key
      const newHand = hand.replaceAll('J', key);
      console.log('4-newHand', { hand, newHand });
      return { hand: newHand, bid };
    }
    if (values.includes(3) && values.includes(2)) {
      // find the key with 3
      const key = Object.keys(cc).find((key) => cc[key] === 3);
      if (key === 'J') {
        console.log('32-Joker is the key');
        // use the other key
        const otherKey = Object.keys(cc).find((key) => cc[key] !== 3);
        // replace all J with the other key
        const newHand = hand.replaceAll('J', otherKey);
        console.log('32-newHand', { hand, newHand });
        return { hand: newHand, bid };
      }
      // replace all J with the key
      const newHand = hand.replaceAll('J', key);
      console.log('32-newHand', { hand, newHand });
      return { hand: newHand, bid };
    }
    if (values.includes(3)) {
      // find the key with 3
      const key = Object.keys(cc).find((key) => cc[key] === 3);
      if (key === 'J') {
        console.log('311-Joker is the key');
        // cc has 2 keys with value 1, find the biggest, exclude 'J'
        const keysWithValue2 = Object.keys(cc)
          .filter((key) => cc[key] === 1)
          .filter((key) => key !== 'J');
        const key = keysWithValue2.sort().reverse()[0];
        console.log('311 keys', { keysWithValue2, key });
        // const key = Object.keys(cc).find((key) => cc[key] === 2);
        // replace all J with the key
        const newHand = hand.replaceAll('J', key);
        console.log('311-newHand', { hand, newHand });

        return { hand: newHand, bid };
      }
      // replace all J with the key
      const newHand = hand.replaceAll('J', key);
      console.log('311-newHand', { hand, newHand });
      return { hand: newHand, bid };
    }
    if (values.includes(2) && values.length === 3) {
      console.log('221-oldHand', hand);
      // cc has 2 keys with value 2, find the biggest, exclude 'J'
      const keysWithValue2 = Object.keys(cc)
        .filter((key) => cc[key] === 2)
        .filter((key) => key !== 'J');
      const key = keysWithValue2.sort().reverse()[0];
      console.log('221 keys', { keysWithValue2, key });
      // const key = Object.keys(cc).find((key) => cc[key] === 2);
      // replace all J with the key
      const newHand = hand.replaceAll('J', key);
      console.log('221-newHand', { hand, newHand });

      return { hand: newHand, bid };
    }
    if (values.includes(2)) {
      const key = Object.keys(cc).find((key) => cc[key] === 2);
      if (key === 'J') {
        console.log('2111-Joker is the key');
        const keysWithValue1 = Object.keys(cc)
          .filter((key) => cc[key] === 1)
          .filter((key) => key !== 'J');
        const key = keysWithValue1.sort().reverse()[0];
        console.log('2111 keys', { keysWithValue1, key });
        // const key = Object.keys(cc).find((key) => cc[key] === 2);
        // replace all J with the key
        const newHand = hand.replaceAll('J', key);
        console.log('2111-newHand', { hand, newHand });

        return { hand: newHand, bid };
      }
      // replace all J with the key
      const newHand = hand.replaceAll('J', key);
      console.log('2111-newHand', { hand, newHand });
      return { hand: newHand, bid };
    }

    // replace all J with A
    // const newHand = hand.replaceAll('J', 'A');
    // return { hand: newHand, bid };
  }
  return handBid;
}
function classifyWithWildCard(hand: string) {
  if (hand.includes('J')) {
    // console.log('found Joker', hand);
    const hh = counts(hand);
    const candidateKeys = Object.keys(hh).filter((key) => key !== 'J');
    if (candidateKeys.length === 0) {
      // all cards are J
      return classify(hand);
    }
    const classifications = candidateKeys.map((key) => {
      const newHand = hand.replaceAll('J', key);
      const classification = classify(newHand);
      return classification;
    });
    // console.log({ hh, candidateKeys, classifications });
    // now just return the highest classification
    return classifications.sort().reverse()[0];
    // return classify(hand);
  }
  return classify(hand);
}

function classify(hand: string) {
  const hh = counts(hand);
  const values = Object.values(hh).sort();
  // console.log('v', { values });
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
