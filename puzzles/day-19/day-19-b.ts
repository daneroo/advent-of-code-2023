import { readData } from '../../shared.ts';
import chalk from 'chalk';

export async function day19b(dataPath?: string) {
  const data = await readData(dataPath);
  // console.log({ data });
  const [rulesBlock, partsBlock] = data.join('\n').split('\n\n');
  // console.log({ rulesBlock, partsBlock });
  // rules looks like this:
  //   px{a<2006:qkq,m>2090:A,rfg}
  //   pv{a>1716:R,A}
  //   lnx{m>1548:A,A}
  //   rfg{s<537:gd,x>2440:R,A}
  //   qs{s>3448:A,lnx}
  const rulesByName = rulesBlock
    .split('\n')
    .map((rule) => {
      // console.log('-', { rule });
      const [name, rulesExpr] = rule.slice(0, -1).split('{');
      const rules = rulesExpr.split(',').map((rulePart, idx, rulesExpr) => {
        // console.log({ rulePart });
        if (idx === rulesExpr.length - 1) {
          return { key: null, op: true, value: true, dest: rulePart };
        }
        const [condition, dest] = rulePart.split(':');
        const key = condition.slice(0, 1);
        const op = condition.slice(1, 2);
        const value = parseInt(condition.slice(2), 10);
        // console.log({ key, op, value, dest });
        return { key, op, value, dest };
      });
      return { name, rules };
    })
    .reduce((acc, rule) => {
      acc[rule.name] = rule.rules;
      return acc;
    }, {});
  console.log(rulesByName);
  console.log('-------------------');

  type Range = { min: number; max: number };
  type Ranges = {
    x: Range;
    m: Range;
    a: Range;
    s: Range;
  };

  function countRanges(ranges: Ranges, ruleName) {
    if (ruleName === 'R') {
      return 0;
    }
    if (ruleName === 'A') {
      // product of all ranges
      return Object.values(ranges).reduce(
        (acc, range) => acc * (range.max - range.min + 1),
        1
      );
    }

    let total = 0;
    const rules = rulesByName[ruleName];
    for (const rule of rules) {
      const { key, op, value, dest } = rule;
      if (op === true) {
        // default rule (which is always last)
        total += countRanges(ranges, dest);
        break;
      }
      const { min, max } = ranges[key];
      let passingRange: Range;
      let failingRange: Range;
      if (op === '<') {
        passingRange = { min, max: value - 1 };
        failingRange = { min: value, max };
      } else if (op === '>') {
        passingRange = { min: value + 1, max };
        failingRange = { min, max: value };
      } else {
        throw new Error(`This should never happen: ${op}`);
      }
      // calculate the passing branch on it's own ruleName/ruleSet
      const newRanges = { ...ranges, [key]: passingRange };
      total += countRanges(newRanges, dest);
      // propagate the failing branch to the next rule
      // this mutates ranges : for the remainder of the loop
      ranges = { ...ranges, [key]: failingRange };
    }
    return total;
  }
  // we will now analyze the rules to see if we can
  // determine the constraints on which parts can be accepted/rejected
  // each part has 4 keys (x, m, a, s) and each key has a range of values 1..4000 (inclusive)
  const ranges: Ranges = {
    x: { min: 1, max: 4000 },
    m: { min: 1, max: 4000 },
    a: { min: 1, max: 4000 },
    s: { min: 1, max: 4000 },
  };
  return countRanges(ranges, 'in');
}

const answer = await day19b();
console.log(chalk.bgGreen('Your Answer:'), chalk.green(answer));
