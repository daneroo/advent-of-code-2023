import { sign } from 'crypto';
import { readData } from '../../shared.ts';
import chalk from 'chalk';
import { count } from 'console';

// broadcaster -> a, b, c
// %a -> b
// %b -> c
// %c -> inv
// &inv -> a
export async function day20a(dataPath?: string) {
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
  // queue is an array of node target and signal
  const queue: string[][] = [];
  const counts: { [key: string]: number } = { LO: 0, HI: 0 };
  function tick() {
    const ev = queue.shift();
    const [src, signal, target] = ev;
    counts[signal]++;
    // console.log(
    //   `processing event: ${src} -> ${signal} -> ${target} (${counts.LO},${counts.HI})`
    // );
    const node = graph[target];
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
  // start with broadcaster
  for (let iteration = 0; iteration < 1000; iteration++) {
    // console.log(`${iteration} -------------------`);
    queue.push(['button', 'LO', 'broadcaster']);
    // while queue is not empty
    while (queue.length > 0) {
      tick();
    }
    // console.log('-', counts);
  }
  // showGraph(graph);
  // console.log({graph});
  return counts.HI * counts.LO;
}

const answer = await day20a();
console.log(chalk.bgGreen('Your Answer:'), chalk.green(answer));
