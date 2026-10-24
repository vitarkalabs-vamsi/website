import { useCallback, useEffect, useRef, useState } from 'react';

/* ═══════════════════════════════════════════════════════════════════════════
   Vitarka Fabric — client-side simulation of the heterogeneous compute runtime.
   Every number here is simulated; no real hardware is contacted.
   ═══════════════════════════════════════════════════════════════════════════ */

export const BACKENDS = {
  npu: {
    id: 'npu',
    key: '1',
    short: 'NPU',
    name: 'Neural Processing Unit',
    substrate: 'Silicon · edge inference',
    color: 'var(--npu)',
    soft: 'var(--npu-soft)',
    powerW: 12,
    connectMs: 900,
    handshake: ['PCIe link up · Gen4 x4', 'INT8 / FP16 kernels loaded', 'Capabilities: 45 TOPS, 16 GB LPDDR5'],
    vital: { label: 'Die temp', unit: '°C', idle: 38, busy: 71 },
    bestFor: 'Low-latency inference: vision, speech, small language models.',
  },
  tpu: {
    id: 'tpu',
    key: '2',
    short: 'TPU',
    name: 'Tensor Processing Unit',
    substrate: 'Silicon · systolic arrays',
    color: 'var(--tpu)',
    soft: 'var(--tpu-soft)',
    powerW: 200,
    connectMs: 1200,
    handshake: ['ICI mesh attached · 4 chips', 'XLA runtime ready', 'Capabilities: 918 TFLOPS bf16, 128 GB HBM'],
    vital: { label: 'HBM use', unit: '%', idle: 6, busy: 88 },
    bestFor: 'Large matrix workloads: training steps, batched inference.',
  },
  qpu: {
    id: 'qpu',
    key: '3',
    short: 'QPU',
    name: 'Quantum Processing Unit',
    substrate: 'Superconducting qubits',
    color: 'var(--qpu)',
    soft: 'var(--qpu-soft)',
    powerW: 15000,
    connectMs: 2000,
    handshake: ['Cloud queue joined · position 1', 'Calibration snapshot fetched', 'Capabilities: 127 qubits, T2 ≈ 110 µs'],
    vital: { label: 'Coherence T2', unit: 'µs', idle: 112, busy: 104 },
    bestFor: 'Optimisation, sampling and molecular simulation.',
  },
  opu: {
    id: 'opu',
    key: '4',
    short: 'OPU',
    name: 'Organoid Processing Unit',
    substrate: 'Cortical organoids on MEA',
    color: 'var(--opu)',
    soft: 'var(--opu-soft)',
    powerW: 0.5,
    connectMs: 1600,
    handshake: ['MEA stream open · 1,024 electrodes @ 25 kHz', 'Culture viability check passed', 'Capabilities: closed-loop stimulation, reservoir readout'],
    vital: { label: 'Spike rate', unit: 'Hz', idle: 4, busy: 19 },
    bestFor: 'Adaptive pattern recognition at ultra-low power.',
  },
};

export const BACKEND_IDS = ['npu', 'tpu', 'qpu', 'opu'];

// Affinity 0–1: how well each backend suits each workload. Drives speed and auto-routing.
export const WORKLOADS = [
  { id: 'vision', label: 'Image classification', fn: 'classify', affinity: { npu: 0.95, tpu: 0.8, qpu: 0.08, opu: 0.45 } },
  { id: 'llm', label: 'Language model tokens', fn: 'generate', affinity: { npu: 0.7, tpu: 0.92, qpu: 0.05, opu: 0.15 } },
  { id: 'train', label: 'Training step', fn: 'train', affinity: { npu: 0.35, tpu: 0.98, qpu: 0.05, opu: 0.2 } },
  { id: 'qubo', label: 'Route optimisation', fn: 'optimise', affinity: { npu: 0.3, tpu: 0.4, qpu: 0.93, opu: 0.25 } },
  { id: 'vqe', label: 'Molecular energy', fn: 'simulate', affinity: { npu: 0.15, tpu: 0.35, qpu: 0.96, opu: 0.05 } },
  { id: 'signal', label: 'Adaptive signal recognition', fn: 'recognise', affinity: { npu: 0.6, tpu: 0.5, qpu: 0.1, opu: 0.94 } },
];

const TICK_MS = 100;
const BASE_RATE = 0.11; // progress per second at affinity 1.0
const HISTORY = 40;

export function bestBackend(workload, backends, exclude) {
  return BACKEND_IDS
    .filter((id) => backends[id].status === 'online' && id !== exclude)
    .sort((a, b) => workload.affinity[b] - workload.affinity[a])[0] || null;
}

function initialBackends() {
  const out = {};
  BACKEND_IDS.forEach((id) => {
    const online = id === 'npu' || id === 'tpu';
    out[id] = {
      status: online ? 'online' : 'offline',
      util: online ? 4 : 0,
      history: Array(HISTORY).fill(online ? 4 : 0),
    };
  });
  return out;
}

function stamp() {
  const d = new Date();
  return d.toTimeString().slice(0, 8) + '.' + String(d.getMilliseconds()).padStart(3, '0').slice(0, 2);
}

export function formatEnergy(joules) {
  if (joules >= 3.6e6) return `${(joules / 3.6e6).toFixed(2)} kWh`;
  if (joules >= 1000) return `${(joules / 1000).toFixed(1)} kJ`;
  if (joules >= 1) return `${joules.toFixed(1)} J`;
  return `${(joules * 1000).toFixed(0)} mJ`;
}

export function useFabric() {
  const [backends, setBackends] = useState(initialBackends);
  const [target, setTargetState] = useState('auto');
  const [workloadId, setWorkloadId] = useState('vision');
  const [job, setJob] = useState(null);
  const [log, setLog] = useState(() => [
    { t: stamp(), level: 'info', msg: 'Fabric runtime ready. NPU and TPU attached.' },
  ]);
  const [switches, setSwitches] = useState([]);

  // Refs mirror state so the interval and async callbacks always read fresh values.
  const ref = useRef({});
  ref.current = { backends, target, workloadId, job };
  const timers = useRef([]);

  const push = useCallback((msg, level = 'info', backend) => {
    setLog((l) => [...l.slice(-80), { t: stamp(), level, msg, backend }]);
  }, []);

  const later = useCallback((fn, ms) => {
    const id = setTimeout(fn, ms);
    timers.current.push(id);
  }, []);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  // Move the running job to another backend: checkpoint → transfer → resume.
  const migrate = useCallback((to, reason) => {
    const { job: j } = ref.current;
    if (!j || j.done || j.migrating || j.backend === to) return;
    const from = j.backend;
    const stateMb = (4 + Math.random() * 28).toFixed(1);
    const handoffMs = Math.round(180 + Math.random() * 420);
    push(`${reason || 'Switch requested'}: ${BACKENDS[from].short} → ${BACKENDS[to].short}`, 'switch');
    push(`Checkpoint ${stateMb} MB at ${(j.progress * 100).toFixed(0)}% · lowered to Vitarka IR`, 'info', from);
    setJob((cur) => cur && { ...cur, migrating: { from, to } });
    later(() => {
      setJob((cur) => {
        if (!cur || cur.done) return cur;
        return {
          ...cur,
          backend: to,
          migrating: null,
          segments: [...cur.segments, { backend: to, from: cur.progress, to: cur.progress }],
        };
      });
      setSwitches((s) => [...s.slice(-19), { from, to, ms: handoffMs }]);
      push(`Resumed on ${BACKENDS[to].short} in ${handoffMs} ms · no work lost`, 'ok', to);
    }, handoffMs);
  }, [push, later]);

  const setTarget = useCallback((next) => {
    const { backends: b, job: j, workloadId: w } = ref.current;
    if (next !== 'auto' && b[next].status !== 'online') {
      push(`${BACKENDS[next].short} is not connected. Connect it first.`, 'warn', next);
      return;
    }
    setTargetState(next);
    if (j && !j.done) {
      const wl = WORKLOADS.find((x) => x.id === w);
      const to = next === 'auto' ? bestBackend(wl, b) : next;
      if (to && to !== j.backend) migrate(to, next === 'auto' ? 'Auto-route' : 'Manual switch');
    } else {
      push(next === 'auto' ? 'Target set to Auto-route' : `Target pinned to ${BACKENDS[next].short}`, 'info', next === 'auto' ? undefined : next);
    }
  }, [migrate, push]);

  const toggleBackend = useCallback((id) => {
    const { backends: b, job: j, target: t, workloadId: w } = ref.current;
    const st = b[id].status;
    if (st === 'connecting') return;

    if (st === 'online') {
      const wl = WORKLOADS.find((x) => x.id === w);
      const fallback = bestBackend(wl, b, id);
      if (j && !j.done && j.backend === id) {
        if (!fallback) {
          push(`Can't detach ${BACKENDS[id].short}: it is the only backend running this job.`, 'warn', id);
          return;
        }
        migrate(fallback, 'Failover');
      }
      if (t === id) setTargetState('auto');
      setBackends((cur) => ({ ...cur, [id]: { ...cur[id], status: 'offline' } }));
      push(`${BACKENDS[id].short} detached`, 'info', id);
      return;
    }

    const spec = BACKENDS[id];
    setBackends((cur) => ({ ...cur, [id]: { ...cur[id], status: 'connecting' } }));
    push(`Connecting ${spec.name}…`, 'info', id);
    spec.handshake.forEach((line, i) => {
      later(() => push(line, 'info', id), ((i + 1) * spec.connectMs) / (spec.handshake.length + 1));
    });
    later(() => {
      setBackends((cur) => ({ ...cur, [id]: { ...cur[id], status: 'online', util: 4 } }));
      push(`${spec.short} online and joined the fabric`, 'ok', id);
      // In auto mode a better-suited backend coming online takes over the running job.
      const { job: jj, target: tt, workloadId: ww } = ref.current;
      if (jj && !jj.done && tt === 'auto') {
        const wl = WORKLOADS.find((x) => x.id === ww);
        if (wl.affinity[id] > wl.affinity[jj.backend] + 0.05) {
          migrate(id, 'Auto-route found a better fit');
        }
      }
    }, spec.connectMs);
  }, [migrate, push, later]);

  const run = useCallback(() => {
    const { backends: b, target: t, workloadId: w, job: j } = ref.current;
    if (j && !j.done) return;
    const wl = WORKLOADS.find((x) => x.id === w);
    const backend = t === 'auto' ? bestBackend(wl, b) : t;
    if (!backend) {
      push('No backends online. Connect at least one chip.', 'warn');
      return;
    }
    const id = Math.random().toString(36).slice(2, 8);
    setJob({
      id, workload: w, backend, progress: 0, energy: 0, elapsed: 0,
      segments: [{ backend, from: 0, to: 0 }], migrating: null, done: false,
    });
    push(`Job ${id} · ${wl.label} → ${BACKENDS[backend].short}${t === 'auto' ? ' (auto-routed)' : ''}`, 'ok', backend);
  }, [push]);

  const cancel = useCallback(() => {
    const { job: j } = ref.current;
    if (!j || j.done) return;
    setJob(null);
    push(`Job ${j.id} cancelled at ${(j.progress * 100).toFixed(0)}%`, 'warn');
  }, [push]);

  // Simulation clock.
  useEffect(() => {
    const iv = setInterval(() => {
      const dt = TICK_MS / 1000;
      const { job: j, workloadId: w } = ref.current;
      const wl = WORKLOADS.find((x) => x.id === w);
      const active = j && !j.done && !j.migrating ? j.backend : null;

      setBackends((cur) => {
        const next = {};
        BACKEND_IDS.forEach((id) => {
          const c = cur[id];
          let goal = 0;
          if (c.status === 'online') goal = id === active ? 78 + Math.random() * 18 : 2 + Math.random() * 5;
          if (c.status === 'connecting') goal = 10 + Math.random() * 10;
          const util = c.util + (goal - c.util) * 0.25;
          next[id] = { ...c, util, history: [...c.history.slice(1), util] };
        });
        return next;
      });

      if (!j || j.done) return;
      setJob((cur) => {
        if (!cur || cur.done) return cur;
        if (cur.migrating) return { ...cur, elapsed: cur.elapsed + dt };
        const rate = BASE_RATE * wl.affinity[cur.backend] * (0.85 + Math.random() * 0.3);
        const progress = Math.min(1, cur.progress + rate * dt);
        const segments = cur.segments.slice();
        segments[segments.length - 1] = { ...segments[segments.length - 1], to: progress };
        const energy = cur.energy + BACKENDS[cur.backend].powerW * dt;
        return { ...cur, progress, segments, energy, elapsed: cur.elapsed + dt, done: progress >= 1 };
      });
    }, TICK_MS);
    return () => clearInterval(iv);
  }, []);

  // Announce completion once.
  const announced = useRef(null);
  useEffect(() => {
    if (job?.done && announced.current !== job.id) {
      announced.current = job.id;
      const used = [...new Set(job.segments.map((s) => BACKENDS[s.backend].short))].join(' + ');
      push(`Job ${job.id} complete in ${job.elapsed.toFixed(1)} s on ${used} · ${formatEnergy(job.energy)}`, 'ok');
    }
  }, [job, push]);

  return {
    backends, target, setTarget, workloadId, setWorkloadId,
    job, run, cancel, toggleBackend, log, switches,
  };
}
