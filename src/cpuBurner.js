// cpuBurner.js (ESM)
import * as os from 'node:os';
import { Worker } from 'node:worker_threads';

/** Burn CPU with jitter to simulate bottlenecks. */
export function burnCpu({ seconds = 30, cores = os.cpus().length, util = 0.8, jitter = 0.3 } = {}) {
  const sliceMs = 100;

  const workerCode = `
    const { parentPort, workerData } = require('node:worker_threads');
    const endAt = Date.now() + workerData.seconds * 1000;
    const slice = workerData.sliceMs;
    function cycle() {
      if (Date.now() >= endAt) return parentPort.postMessage('done');
      const jf = 1 + (Math.random()*2 - 1) * workerData.jitter;
      const eff = Math.max(0, Math.min(1, workerData.util * jf));
      const busy = Math.max(0, slice * eff);
      const idle = Math.max(0, slice - busy);
      const t0 = Date.now();
      while (Date.now() - t0 < busy) {}
      setTimeout(cycle, idle);
    }
    cycle();
  `;

  const n = Math.max(1, Math.min(cores, os.cpus().length));
  const workers = Array.from({ length: n }, () =>
    new Worker(workerCode, { eval: true, workerData: { seconds, util, jitter, sliceMs } })
  );

  return Promise.all(workers.map(w => new Promise(resolve => {
    w.on('message', () => w.terminate().then(resolve));
    w.on('exit', resolve);
  })));
}
