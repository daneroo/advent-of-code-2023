import { sign } from 'crypto';
import { readData } from '../../shared.ts';
import chalk from 'chalk';
import { count } from 'console';

function gcd(a: number, b: number) {
  if (b === 0) {
    return a;
  }
  return gcd(b, a % b);
}
function lcm(a: number, b: number) {
  return Math.abs(a * b) / gcd(a, b);
}

// broadcaster -> a, b, c
// %a -> b
// %b -> c
// %c -> inv
// &inv -> a
export async function day20b(dataPath?: string) {
  const data = await readData(dataPath);
  // console.log({ data });
  // a graph is a list of named nodes
  // - There is a single broadcast module (named broadcaster)
  // - flip-flop module (as indicated by the % prefix)
  // - a conjunction module (as indicated by the & prefix)
  //  each node has a type (broadcaster, and, or, inv, etc)
  // each nodes has a list of edges (successor nodes)
  type Node = {
    name: string;
    type: string;
    edges: string[];
    state?: {
      flip?: boolean;
      received?: { [key: string]: string }; // signal, value from receiver
    };
  };
  const graph: { [key: string]: Node } = {};
  data.forEach((line: string) => {
    // console.log({ line });
    const [lh, rh] = line.split(' -> ');
    // console.log({ lh, rh });
    if (lh === 'broadcaster') {
      const name = lh;
      const type = 'BRDC';
      graph[name] = { name, type, edges: rh.split(', ') };
      // console.log(name, graph[name]);
    } else if (lh.startsWith('%')) {
      const name = lh.slice(1);
      const type = 'FLIP';
      graph[name] = {
        name,
        type,
        edges: rh.split(', '),
        state: { flip: false },
      };
      // console.log(name, graph[name]);
    } else if (lh.startsWith('&')) {
      const name = lh.slice(1);
      const type = 'CONJ';
      graph[name] = {
        name,
        type,
        edges: rh.split(', '),
        state: { received: {} },
      };
      // console.log(name, graph[name]);
    } else {
      throw new Error(`Unknown node type: ${lh}`);
    }
  });
  // add missing edges
  // also set received state='lo' for conjunctions
  for (const node of Object.values(graph)) {
    // console.log(node);
    for (const edge of node.edges) {
      // console.log(edge);
      if (edge in graph) {
        if (graph[edge].type === 'CONJ') {
          graph[edge].state.received[node.name] = 'LO';
        }
        // console.log(edge, graph[edge]);
      } else {
        console.log(`Edge not found: ${edge} creating it.`);
        // throw new Error(`Edge not found: ${edge}`);
        graph[edge] = { name: edge, type: 'OUTPUT', edges: [] };
      }
    }
  }
  function showGraph(graph: { [key: string]: Node }) {
    for (const node of Object.values(graph)) {
      console.log(node);
    }
  }

  // Part 2:
  // - we are no longer interested in counting the signals (LO, HI)
  // - We now want to know:
  //  "what is the fewest number of button presses (iterations) required to deliver a single low pulse to the module named rx?"
  // - rx has a single predecessor, of type conjunction, so find that.
  //   - then find it's predecessors, and record them in seen
  // To get a single 'LO' pulse to rx, we need to send a 'HI' pulse to all predecessors of rx's predecessor
  // Let's count on being lucky!
  //  We are hoping that the 'HI' pulses to seen[] == pred(pred(rx)) will be periodic.
  // Then we can extrapolate the number of iterations required to get a 'LO' pulse to rx,
  //  as the LCM of the periods of the 'HI' pulses to seen[] == pred(pred(rx))
  const predecessors = Object.values(graph).filter((node) =>
    node.edges.includes('rx')
  );
  if (predecessors.length !== 1) {
    throw new Error(
      `Expected 1 predecessor of 'rx', got ${predecessors.length}`
    );
  }
  const predecessor = predecessors[0];
  if (predecessor.type !== 'CONJ') {
    throw new Error(`Expected predecessor of 'rx' to be a conjunction`);
  }
  console.log(
    `predecessor of rx is ${predecessor.name} of type ${predecessor.type}`
  );
  let iteration = 0;
  // Have we seen this state before? remember how many times
  // We actually only care about the predecessors of predecessor of rx
  const seen: { [key: string]: number } = {};
  const periods: { [key: string]: number } = {};
  // initialize seen[v]=0 for v in pred(pred(rx))
  for (const node of Object.values(graph)) {
    if (node.edges.includes(predecessor.name)) {
      seen[node.name] = 0;
    }
  }
  console.log('initialized seen for v in pred(pred(rx)', { seen });

  // ** Queue and Tick section **
  // queue is an array of node target and signal
  const queue: string[][] = [];

  function tick() {
    const ev = queue.shift();
    const [src, signal, target] = ev;
    // console.log(
    //   `processing event: ${src} -> ${signal} -> ${target} (${counts.LO},${counts.HI})`
    // );
    const node = graph[target];

    // Part 2:
    // Record when a src == predecessor of predecessor of rx receives a 'HI' pulse
    // as seen[src] +=1. period[src] = iteration (first time  we see it)
    // and confirm that the period is regular
    // i.e. iteration == seen[src] * period[src]
    if (node.name === predecessor.name && signal === 'HI') {
      if (src in seen) {
        seen[src] = seen[src] + 1;
        console.log(`seen ${src} ${seen[src]} times, iteration ${iteration}`);

        if (src in periods) {
          // assert that the period is regular
          if (iteration !== seen[src] * periods[src]) {
            throw new Error(
              `Periodicity assertion failed: ${iteration} != ${seen[src]} * ${periods[src]}`
            );
          }
        } else {
          periods[src] = iteration;
        }

        // Termination criteria: moved to outer loop below
      } else {
        // assert this for sanity, although this should never happen
        throw new Error(
          `Unexpected predecessor: ${src} of ${predecessor.name}`
        );
      }
    }

    if (node.type === 'BRDC') {
      // console.log(`Broadcasting signal: ${signal} to ${node.edges}`);
      for (const edge of node.edges) {
        queue.push([node.name, signal, edge]);
      }
    } else if (node.type === 'FLIP') {
      // Flip-flop modules (prefix %) are either on or off;
      // they are initially off.
      // If a flip-flop module receives a high pulse, it is ignored and nothing happens.
      //  However, if a flip-flop module receives a low pulse, it flips between on and off.
      // If it was off, it turns on and sends a high pulse. If it was on, it turns off and sends a low pulse.
      // console.log(`Flipping signal: ${signal}`);
      if (signal === 'LO') {
        const newSignal = node.state.flip ? 'LO' : 'HI';
        for (const edge of node.edges) {
          queue.push([node.name, newSignal, edge]);
        }
        node.state.flip = !node.state.flip;
      }
      // const newSignal = node.state.flip ? 'HI' : 'LO';
    } else if (node.type === 'CONJ') {
      // Conjunction modules (prefix &) remember the type of the most recent pulse received from each of their connected input modules;
      //  they initially default to remembering a low pulse for each input.
      //  When a pulse is received, the conjunction module first updates its memory for that input.
      // Then, if it remembers high pulses for all inputs, it sends a low pulse; otherwise, it sends a high pulse.
      node.state.received[src] = signal;
      // check if all received signals were high
      // console.log(`--- &${node.name}: ${JSON.stringify(node.state.received)}`);
      const newSignal = Object.keys(node.state.received).every(
        (key) => node.state.received[key] === 'HI'
      )
        ? 'LO'
        : 'HI';
      for (const edge of node.edges) {
        queue.push([node.name, newSignal, edge]);
      }
    }
  }

  // showGraph(graph);
  // console.log({graph});

  // while (iteration < 100_000) {
  while (true) {
    iteration++;
    // console.log(`${iteration} -------------------`);
    // start with broadcaster
    queue.push(['button', 'LO', 'broadcaster']);
    // while queue is not empty
    while (queue.length > 0) {
      tick();

      // Part 2: termination criteria
      // if we have seen all predecessors of predecessor of rx, we can calculate the answer
      // - seen and periods are updated in tick()
      const minObservations = 2;
      if (Object.values(seen).every((n) => n >= minObservations)) {
        // turns out lcm was not necessary as my specific input
        // had periods that were relatively prime
        const answer = Object.values(periods).reduce(
          (acc, p) => lcm(acc, p),
          1
        );
        console.log({ periods });
        console.log(`- All periods are known`);
        console.log(
          `- All periods have been observed at least >= ${minObservations} times, to confirm regularity`
        );
        console.log(`- LCM of periods is ${answer} (iteration ${iteration})`);
        return answer;
      }
    }
  }
}

const answer = await day20b();
console.log(chalk.bgGreen('Your Answer:'), chalk.green(answer));
