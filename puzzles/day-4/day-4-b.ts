import { readData } from '../../shared.ts';
import chalk from 'chalk';

export async function day4b(dataPath?: string) {
  const copiesOfCard = [];
  const data = await readData(dataPath);
  // console.log({ data });
  const sumPoints = data
    .map((line: string) => {
      // console.log({ line });
      const [carName, winAndHave] = line.split(':');
      console.log({ carName, winAndHav: winAndHave });
      // const cardNum = parseInt(carName.split(' ')[1]);
      const cardNum = parseInt(
        carName.split(' ').filter((num) => num !== '')[1]
      );
      const [win, have] = winAndHave.split('|');
      // console.log({ cardNum, win, have });
      const winSet = new Set(
        win
          .trim()
          .split(' ')
          .filter((num) => num !== '')
          .map((num) => parseInt(num))
      );
      const haveSet = new Set(
        have
          .trim()
          .split(' ')
          .filter((num) => num !== '')
          .map((num) => parseInt(num))
      );
      // number of elements in the have set that are in the win set
      const numWin = [...winSet].filter((num) => haveSet.has(num)).length;
      const points = numWin > 0 ? 1 << (numWin - 1) : 0;
      console.log({ cardNum, winSet, haveSet, numWin, points });
      // increment the card count for current card
      copiesOfCard[cardNum] = copiesOfCard[cardNum] + 1 || 1;
      // add extra cards
      console.log(
        `I have card ${cardNum} ${copiesOfCard[cardNum]} times, with ${numWin} wins`
      );
      for (let extra = 1; extra <= numWin; extra++) {
        // copiesOfCard[cardNum + extra] = copiesOfCard[cardNum] + 1 || 1;
        const currentExtraCount = copiesOfCard[cardNum + extra] || 0;
        copiesOfCard[cardNum + extra] =
          currentExtraCount + copiesOfCard[cardNum];
      }
      console.log({ copiesOfCard });
      return points;
    })
    .reduce((acc, numWin) => acc + numWin, 0);
  const copiesOfCardClean = copiesOfCard.slice(1);
  const countCards = copiesOfCardClean.reduce((acc, num) => acc + num, 0);
  console.log({ copiesOfCardClean, len: copiesOfCardClean.length, countCards });
  return countCards;
}

const answer = await day4b();
console.log(chalk.bgGreen('Your Answer:'), chalk.green(answer));
