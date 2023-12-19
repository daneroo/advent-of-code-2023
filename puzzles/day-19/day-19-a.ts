import { readData } from '../../shared.ts';
import chalk from 'chalk';

export async function day19a(dataPath?: string) {
  const data = await readData(dataPath);
  // console.log({ data });
  const [rulesBlock, partsBlock] = data.join('\n').split('\n\n');
  // console.log({ rulesBlock, partsBlock });
  const rulesByName = rulesBlock
    .split('\n')
    .map((rule) => {
      // rules looks like this:
      // px{a<2006:qkq,m>2090:A,rfg}
      // pv{a>1716:R,A}
      // lnx{m>1548:A,A}
      // rfg{s<537:gd,x>2440:R,A}
      // qs{s>3448:A,lnx}
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
  const parts = partsBlock.split('\n').map((part) => {
    // {x=787,m=2655,a=1222,s=2876}
    // {x=1679,m=44,a=2067,s=496}
    // {x=2036,m=264,a=79,s=2244}
    // {x=2461,m=1339,a=466,s=291}
    // {x=2127,m=1623,a=2188,s=1013}
    const json = part
      .replaceAll('=', ':')
      .replaceAll('x', '"x"')
      .replaceAll('m', '"m"')
      .replaceAll('a', '"a"')
      .replaceAll('s', '"s"');
    return JSON.parse(json);
  });
  // console.log({ parts });

  // now we must trace each part through the rules
  // and decide if they are accepted or rejected
  // {x=787,m=2655,a=1222,s=2876}: in -> qqz -> qs -> lnx -> A
  // {x=1679,m=44,a=2067,s=496}: in -> px -> rfg -> gd -> R
  // {x=2036,m=264,a=79,s=2244}: in -> qqz -> hdj -> pv -> A
  // {x=2461,m=1339,a=466,s=291}: in -> px -> qkq -> crn -> R
  // {x=2127,m=1623,a=2188,s=1013}: in -> px -> rfg -> A
  function evaluate(part, rule) {
    const { key, op, value } = rule;
    if (op === true) {
      return true;
    }
    if (op === '<') {
      return part[key] < value;
    }
    if (op === '>') {
      return part[key] > value;
    }
    if (op === '=') {
      return part[key] === value;
    }
  }
  return parts
    .map((part) => {
      let accepted = null;
      const { x, m, a, s } = part;
      let rules = rulesByName['in'];
      console.log('-', part);

      nextRuleSet: while (accepted === null) {
        console.log(rules);
        // const { key, op, value, dest } = rules[0];
        for (const rule of rules) {
          if (evaluate(part, rule)) {
            if (rule.dest === 'A') {
              accepted = true;
              break nextRuleSet;
            }
            if (rule.dest === 'R') {
              accepted = false;
              break nextRuleSet;
            }
            console.log('->', rule.dest);
            rules = rulesByName[rule.dest];
            break;
          }
        }
      }
      console.log({ accepted });

      return accepted ? x + m + a + s : 0;
    })
    .reduce((acc, val) => acc + val, 0);
  return 0;
}

const answer = await day19a();
console.log(chalk.bgGreen('Your Answer:'), chalk.green(answer));
