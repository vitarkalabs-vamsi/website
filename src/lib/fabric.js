import { useCallback, useEffect, useRef, useState } from 'react';

/* ═══════════════════════════════════════════════════════════════════════════
   Vitarka Fabric — browser simulation of the research workbench.
   Providers, rates, timings and results are illustrative. No real system is
   contacted, and nothing here is live inventory or a real quote.

   Rules the simulation follows (from the product blueprint):
   - Interfaces are shared; hardware is not interchangeable.
   - Every compatibility verdict carries a reason. Unknown is never "compatible".
   - Unknown prices are never treated as zero; they need approval.
   - Switching means different things per family, and a living specimen never moves.
   ═══════════════════════════════════════════════════════════════════════════ */

export const FAMILIES = {
  local: { name: 'Your machine', color: 'var(--ink)' },
  accel: { name: 'AI accelerators', color: 'var(--haldi)' },
  quantum: { name: 'Quantum systems', color: 'var(--jamun)' },
  bio: { name: 'Organoids and MEAs', color: 'var(--mor)' },
};

export const BACKENDS = {
  local: { id: 'local', family: 'local', short: 'LOCAL', name: 'Local runner', provider: 'Your machine · container', color: '#F3EBDD', unit: 'free', rate: 0, speed: 0.7, connectMs: 300, integration: 'Built in' },
  gpuA: { id: 'gpuA', family: 'accel', short: 'GPU·A', name: 'GPU endpoint A', provider: 'Provider A · 80 GB GPUs', color: '#F0A830', unit: 'accelerator-hour', rate: 240, speed: 1.0, connectMs: 900, integration: 'Bring your own account' },
  gpuB: { id: 'gpuB', family: 'accel', short: 'GPU·B', name: 'GPU endpoint B', provider: 'Provider B · 48 GB GPUs', color: '#E4572E', unit: 'accelerator-hour', rate: 170, speed: 0.85, connectMs: 1000, integration: 'Bring your own account' },
  tpu: { id: 'tpu', family: 'accel', short: 'TPU', name: 'TPU slice', provider: 'Provider C · 8 chips', color: '#6E86FF', unit: 'chip-hour', rate: 280, speed: 1.15, connectMs: 1200, integration: 'Bring your own account' },
  npu: { id: 'npu', family: 'accel', short: 'NPU', name: 'Inference NPU', provider: 'Provider D · 16 GB', color: '#58C4F0', unit: 'per 1k requests', rate: 70, speed: 0.6, connectMs: 800, integration: 'Link-out' },
  qsim: { id: 'qsim', family: 'quantum', short: 'QSIM', name: 'Quantum simulator', provider: 'Runs locally · 30 qubits', color: '#DDB8FF', unit: 'free', rate: 0, speed: 1.0, connectMs: 500, integration: 'Built in' },
  qpu: { id: 'qpu', family: 'quantum', short: 'QPU', name: 'Quantum processor', provider: 'Provider E · 127 qubits', color: '#B67CE8', unit: 'per task + per shot', rate: null, speed: 0.75, connectMs: 2000, integration: 'Bring your own account' },
  mea: { id: 'mea', family: 'bio', short: 'MEA', name: 'Live MEA rig', provider: 'Partner lab only', color: '#2DBFA8', unit: 'per session', rate: null, speed: 0.5, connectMs: 0, integration: 'Design only', locked: 'Live biological hardware needs a lab partnership, approvals and safety controls. It is not part of the first release.' },
};

export const BACKEND_IDS = ['local', 'gpuA', 'gpuB', 'tpu', 'npu', 'qsim', 'qpu', 'mea'];

export const VERDICTS = {
  ok: { label: 'Compatible', mark: '✓', color: 'var(--mor)' },
  warn: { label: 'Compatible, with warnings', mark: '!', color: 'var(--haldi)' },
  cond: { label: 'Conditional', mark: '~', color: '#58C4F0' },
  no: { label: 'Incompatible', mark: '✕', color: 'var(--sindoor)' },
  unknown: { label: 'Unknown', mark: '?', color: 'var(--mute)' },
};

// mode: how a mid-run switch behaves for this step.
//   route      next requests go to the new endpoint
//   checkpoint restart from the last compatible checkpoint
//   rerun      remaining circuit batches re-run on the new backend
//   fixed      cannot switch mid-run
export const WORKFLOWS = [
  {
    id: 'inference',
    label: 'Compare inference backends',
    summary: 'Benchmark one model across two independent GPU providers, with an output-quality check.',
    steps: [
      { label: 'Validate model artifact', mode: 'fixed', work: 0.4, verdicts: { local: ['ok', 'Checksum and format checks run locally.'] } },
      {
        label: 'Benchmark inference', mode: 'route', work: 1.6,
        verdicts: {
          gpuA: ['ok', 'PyTorch, bf16 and 80 GB memory all declared.'],
          gpuB: ['warn', 'Fits in 48 GB only with 8-bit weights. Output-quality check required.'],
          tpu: ['cond', 'Needs a TPU serving stack (vLLM or JAX) and an image rebuild before it can run.'],
          npu: ['no', 'Model needs about 70 GB; this NPU has 16 GB.'],
          local: ['no', 'No accelerator with enough memory on this machine.'],
        },
      },
      { label: 'Write report', mode: 'fixed', work: 0.4, verdicts: { local: ['ok', 'Report and metrics are produced locally.'] } },
    ],
  },
  {
    id: 'quantum',
    label: 'Quantum job with classical analysis',
    summary: 'Prepare a circuit, run it on a simulator or a processor, and analyse the counts classically.',
    steps: [
      { label: 'Build and compile circuit', mode: 'fixed', work: 0.4, verdicts: { local: ['ok', 'Compiles locally to the target gate set.'] } },
      {
        label: 'Run 4,000 shots', mode: 'rerun', work: 1.2,
        verdicts: {
          qsim: ['ok', 'Noise-free simulation. Results are reproducible with the same seed.'],
          qpu: ['warn', 'Hardware noise means counts will differ from the simulator. Price needs a provider quote.'],
          gpuA: ['no', 'A GPU does not run quantum circuits through this workload type.'],
          tpu: ['no', 'A TPU does not run quantum circuits through this workload type.'],
          npu: ['unknown', 'This adapter has not published capabilities for quantum workloads.'],
        },
      },
      { label: 'Analyse counts', mode: 'checkpoint', work: 0.5, verdicts: { local: ['ok', 'Runs locally.'], gpuA: ['ok', 'Runs on a GPU worker.'] } },
    ],
  },
  {
    id: 'mea',
    label: 'Organoid spontaneous activity',
    summary: 'Analyse a public MEA recording of a cortical organoid: QC, spike sorting and network activity.',
    steps: [
      { label: 'Ingest and checksum recording', mode: 'fixed', work: 0.4, verdicts: { local: ['ok', 'Raw file kept immutable; checksum and licence recorded.'], mea: ['no', 'This workflow analyses an existing recording. No live hardware is used.'] } },
      { label: 'Signal quality control', mode: 'fixed', work: 0.5, verdicts: { local: ['ok', 'Flags flat, clipped and noisy channels.'] } },
      {
        label: 'Spike sorting', mode: 'checkpoint', work: 1.4,
        verdicts: {
          gpuA: ['ok', 'Kilosort4 through SpikeInterface; CUDA available.'],
          gpuB: ['ok', 'Kilosort4 through SpikeInterface; CUDA available.'],
          local: ['warn', 'CPU-only sorter. Slower, and results differ from Kilosort4.'],
          tpu: ['no', 'Kilosort4 needs CUDA; there is no TPU build.'],
          npu: ['no', 'Spike sorting is not a supported workload on this NPU.'],
        },
      },
      { label: 'Network bursts and synchrony', mode: 'fixed', work: 0.6, verdicts: { local: ['ok', 'Versioned feature code runs locally.'] } },
    ],
  },
];

export function verdict(step, backendId) {
  return step.verdicts[backendId] || ['unknown', 'No capability data for this step.'];
}

export function candidates(step) {
  return BACKEND_IDS.filter((id) => step.verdicts[id]);
}

// Deterministic default: prefer fully compatible, then cheapest effective rate.
export function pickDefault(step, backends) {
  const usable = candidates(step).filter((id) => backends[id].status === 'online' && ['ok', 'warn'].includes(verdict(step, id)[0]));
  usable.sort((a, b) => {
    const va = verdict(step, a)[0] === 'ok' ? 0 : 1;
    const vb = verdict(step, b)[0] === 'ok' ? 0 : 1;
    if (va !== vb) return va - vb;
    return (BACKENDS[a].rate ?? 1e9) / BACKENDS[a].speed - (BACKENDS[b].rate ?? 1e9) / BACKENDS[b].speed;
  });
  return usable[0] || null;
}

export function formatINR(n) {
  if (n == null) return 'Quote required';
  if (n === 0) return '₹0';
  return `₹${n < 10 ? n.toFixed(2) : Math.round(n).toLocaleString('en-IN')}`;
}

const TICK_MS = 100;
const BASE_RATE = 0.24;
const BILL_SCALE = 60; // one simulated second bills as one minute

// Estimated cost of a step on a backend, or null if a quote is needed.
export function estimate(step, backendId) {
  const b = BACKENDS[backendId];
  if (b.rate == null) return null;
  const seconds = step.work / (BASE_RATE * b.speed);
  return (b.rate / 3600) * seconds * BILL_SCALE;
}

function stamp() {
  return new Date().toTimeString().slice(0, 8);
}

function initialBackends() {
  const out = {};
  BACKEND_IDS.forEach((id) => {
    const online = ['local', 'gpuA', 'qsim'].includes(id);
    out[id] = { status: online ? 'online' : 'offline', util: online ? 4 : 0, checked: Date.now() };
  });
  return out;
}

function checksum() {
  return Array.from({ length: 12 }, () => '0123456789abcdef'[Math.floor(Math.random() * 16)]).join('');
}

export function useFabric() {
  const [backends, setBackends] = useState(initialBackends);
  const [workflowId, setWorkflowIdState] = useState('inference');
  const [plan, setPlan] = useState({});
  const [approved, setApproved] = useState(false);
  const [run, setRun] = useState(null);
  const [log, setLog] = useState(() => [{ t: stamp(), level: 'info', msg: 'Registry loaded: local runner, GPU endpoint A and quantum simulator connected.' }]);

  const ref = useRef({});
  ref.current = { backends, workflowId, plan, run, approved };
  const timers = useRef([]);
  useEffect(() => () => timers.current.forEach(clearTimeout), []);
  const later = useCallback((fn, ms) => { timers.current.push(setTimeout(fn, ms)); }, []);
  const push = useCallback((msg, level = 'info', backend) => {
    setLog((l) => [...l.slice(-120), { t: stamp(), level, msg, backend }]);
  }, []);

  const workflow = WORKFLOWS.find((w) => w.id === workflowId);

  // Resolved backend per step: user's choice if still usable, else the default.
  const resolved = workflow.steps.map((s, i) => {
    const p = plan[i];
    if (p && backends[p].status === 'online' && ['ok', 'warn'].includes(verdict(s, p)[0])) return p;
    return pickDefault(s, backends);
  });
  const estimates = workflow.steps.map((s, i) => (resolved[i] ? estimate(s, resolved[i]) : undefined));
  const needsQuote = estimates.some((e) => e === null);
  const warnings = workflow.steps.filter((s, i) => resolved[i] && verdict(s, resolved[i])[0] === 'warn').length;
  const needsApproval = needsQuote || warnings > 0;
  const blockedStep = resolved.findIndex((r) => !r);

  const setWorkflowId = useCallback((id) => {
    if (ref.current.run && !ref.current.run.done) return;
    setWorkflowIdState(id);
    setPlan({});
    setApproved(false);
    setRun(null);
  }, []);

  const migrate = useCallback((i, to, why) => {
    const r = ref.current.run;
    const wf = WORKFLOWS.find((w) => w.id === r.workflow);
    const step = wf.steps[i];
    const st = r.steps[i];
    const from = st.backend;
    const ms = Math.round((step.mode === 'rerun' ? 700 : 200) + Math.random() * 400);
    push(`${why}: ${BACKENDS[from].short} → ${BACKENDS[to].short} for “${step.label}”`, 'switch');
    if (step.mode === 'route') push('Routing the next request batches to the new endpoint. Completed requests stay recorded.', 'info', to);
    if (step.mode === 'checkpoint') push(`Restarting from checkpoint at ${(st.progress * 100).toFixed(0)}%. Image and data checked for the new backend.`, 'info', to);
    if (step.mode === 'rerun') push('Finishing the current shot batch; remaining batches re-run on the new backend. Results are tagged per backend.', 'info', to);
    setRun((cur) => cur && { ...cur, migrating: { step: i, from, to } });
    later(() => {
      setRun((cur) => {
        if (!cur || cur.done) return cur;
        const steps = cur.steps.slice();
        steps[i] = { ...steps[i], backend: to, switches: steps[i].switches + 1 };
        return { ...cur, steps, migrating: null };
      });
      push(`Resumed on ${BACKENDS[to].short} after ${ms} ms`, 'ok', to);
    }, ms);
  }, [push, later]);

  const choose = useCallback((i, id) => {
    const { backends: b, workflowId: w, run: r } = ref.current;
    const step = WORKFLOWS.find((x) => x.id === w).steps[i];
    const [v, why] = verdict(step, id);
    if (BACKENDS[id].locked) { push(BACKENDS[id].locked, 'warn', id); return; }
    if (v === 'no' || v === 'unknown') { push(`Rejected ${BACKENDS[id].short} for “${step.label}”: ${why}`, 'warn', id); return; }
    if (v === 'cond') { push(`${BACKENDS[id].short} is conditional for “${step.label}”: ${why}`, 'warn', id); return; }
    if (b[id].status !== 'online') { push(`Connect ${BACKENDS[id].name} in the registry first.`, 'warn', id); return; }
    setPlan((p) => ({ ...p, [i]: id }));
    setApproved(false);
    if (!r || r.done) return;
    const st = r.steps[i];
    if (st.state === 'done' || st.backend === id) return;
    if (st.state === 'queued') {
      setRun((cur) => { const steps = cur.steps.slice(); steps[i] = { ...steps[i], backend: id }; return { ...cur, steps }; });
      push(`“${step.label}” will run on ${BACKENDS[id].short}`, 'info', id);
      return;
    }
    if (step.mode === 'fixed') { push(`“${step.label}” can't switch mid-run. Cancel and re-plan to change it.`, 'warn'); return; }
    if (r.migrating) return;
    migrate(i, id, 'Switch requested');
  }, [migrate, push]);

  const toggleBackend = useCallback((id) => {
    const spec = BACKENDS[id];
    if (spec.locked) { push(spec.locked, 'warn', id); return; }
    const { backends: b, run: r, workflowId: w } = ref.current;
    const st = b[id].status;
    if (st === 'connecting') return;
    if (st === 'online') {
      if (r && !r.done) {
        const wf = WORKFLOWS.find((x) => x.id === w);
        const i = r.stepIndex;
        const step = wf.steps[i];
        if (r.steps[i].backend === id && r.steps[i].state === 'running') {
          const others = { ...b, [id]: { ...b[id], status: 'offline' } };
          const fb = pickDefault(step, others);
          if (step.mode === 'fixed' || !fb) {
            push(`Can't disconnect ${spec.short}: “${step.label}” is running on it and has no compatible fallback.`, 'warn', id);
            return;
          }
          migrate(i, fb, 'Failover');
        }
      }
      setBackends((cur) => ({ ...cur, [id]: { ...cur[id], status: 'offline' } }));
      push(`${spec.name} disconnected`, 'info', id);
      return;
    }
    setBackends((cur) => ({ ...cur, [id]: { ...cur[id], status: 'connecting' } }));
    push(`Connecting ${spec.name} (${spec.integration.toLowerCase()})…`, 'info', id);
    later(() => {
      setBackends((cur) => ({ ...cur, [id]: { ...cur[id], status: 'online', util: 4, checked: Date.now() } }));
      push(`${spec.short} capabilities refreshed. Billing unit: ${spec.unit}.`, 'ok', id);
    }, spec.connectMs);
  }, [migrate, push, later]);

  const start = useCallback(() => {
    const { run: r, workflowId: w, approved: ok } = ref.current;
    if (r && !r.done) return;
    const wf = WORKFLOWS.find((x) => x.id === w);
    if (blockedStep >= 0) { push(`No connected backend can run “${wf.steps[blockedStep].label}”.`, 'warn'); return; }
    if (needsApproval && !ok) { push('This plan has warnings or unquoted prices. Approve it before running.', 'warn'); return; }
    const id = Math.random().toString(36).slice(2, 8);
    const steps = wf.steps.map((s, i) => ({
      backend: resolved[i], progress: 0, cost: 0, elapsed: 0, switches: 0,
      state: i === 0 ? 'running' : 'queued', segments: i === 0 ? [{ backend: resolved[i], from: 0, to: 0 }] : [],
    }));
    setRun({ id, workflow: w, stepIndex: 0, steps, migrating: null, done: false, elapsed: 0, input: checksum(), outputs: [] });
    push(`Run ${id} started: ${wf.label}`, 'ok');
    push(`Step 1 “${wf.steps[0].label}” on ${BACKENDS[resolved[0]].short}`, 'info', resolved[0]);
  }, [blockedStep, needsApproval, resolved, push]);

  const cancel = useCallback(() => {
    const r = ref.current.run;
    if (!r || r.done) return;
    setRun((cur) => ({ ...cur, done: true, cancelled: true }));
    push(`Run ${r.id} cancelled. Partial results and the record are kept.`, 'warn');
  }, [push]);

  useEffect(() => {
    const iv = setInterval(() => {
      const dt = TICK_MS / 1000;
      const { run: r, workflowId: w } = ref.current;
      const active = r && !r.done && !r.migrating ? r.steps[r.stepIndex].backend : null;
      setBackends((cur) => {
        const next = {};
        BACKEND_IDS.forEach((id) => {
          const c = cur[id];
          let goal = 0;
          if (c.status === 'online') goal = id === active ? 74 + Math.random() * 22 : 2 + Math.random() * 4;
          if (c.status === 'connecting') goal = 12;
          next[id] = { ...c, util: c.util + (goal - c.util) * 0.25 };
        });
        return next;
      });
      if (!r || r.done) return;
      const wf = WORKFLOWS.find((x) => x.id === w);
      setRun((cur) => {
        if (!cur || cur.done) return cur;
        if (cur.migrating) return { ...cur, elapsed: cur.elapsed + dt };
        const i = cur.stepIndex;
        const steps = cur.steps.slice();
        const st = { ...steps[i] };
        const b = BACKENDS[st.backend];
        st.progress = Math.min(1, st.progress + (BASE_RATE * b.speed * (0.85 + Math.random() * 0.3) * dt) / wf.steps[i].work);
        st.elapsed += dt;
        st.cost = b.rate == null ? null : (st.cost ?? 0) + (b.rate / 3600) * dt * BILL_SCALE;
        const segs = st.segments.slice();
        const last = segs[segs.length - 1];
        if (!last || last.backend !== st.backend) segs.push({ backend: st.backend, from: last ? last.to : 0, to: st.progress });
        else segs[segs.length - 1] = { ...last, to: st.progress };
        st.segments = segs;
        let next = { ...cur, elapsed: cur.elapsed + dt };
        if (st.progress >= 1) {
          st.state = 'done';
          next.outputs = [...cur.outputs, { step: i, sha: checksum() }];
          if (i + 1 < steps.length) {
            steps[i + 1] = { ...steps[i + 1], state: 'running', segments: [{ backend: steps[i + 1].backend, from: 0, to: 0 }] };
            next.stepIndex = i + 1;
          } else next.done = true;
        }
        steps[i] = st;
        next.steps = steps;
        return next;
      });
    }, TICK_MS);
    return () => clearInterval(iv);
  }, []);

  // Log step transitions once.
  const seen = useRef('');
  useEffect(() => {
    if (!run || run.cancelled) return;
    const key = `${run.id}:${run.stepIndex}:${run.done}`;
    if (seen.current === key) return;
    const wf = WORKFLOWS.find((x) => x.id === run.workflow);
    if (seen.current.startsWith(run.id)) {
      const prev = run.done ? run.steps.length - 1 : run.stepIndex - 1;
      const ps = run.steps[prev];
      push(`Step ${prev + 1} done in ${ps.elapsed.toFixed(1)} s · ${formatINR(ps.cost)} · output checksummed`, 'ok');
      if (!run.done) push(`Step ${run.stepIndex + 1} “${wf.steps[run.stepIndex].label}” on ${BACKENDS[run.steps[run.stepIndex].backend].short}`, 'info', run.steps[run.stepIndex].backend);
      else push(`Run ${run.id} complete in ${run.elapsed.toFixed(1)} s. Provenance record written.`, 'ok');
    }
    seen.current = key;
  }, [run, push]);

  return {
    backends, workflow, workflowId, setWorkflowId, resolved, estimates, needsQuote, warnings, needsApproval, blockedStep,
    approved, setApproved, run, start, cancel, choose, toggleBackend, log,
  };
}
