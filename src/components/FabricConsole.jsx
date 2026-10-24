import { useEffect, useRef, useState } from 'react';
import { Play, Square } from 'lucide-react';
import { BACKENDS, BACKEND_IDS, WORKLOADS, bestBackend, formatEnergy, useFabric } from '../lib/fabric';

function Meter({ data, color }) {
  const w = 120, h = 30;
  const pts = data.map((v, i) => `${(i / (data.length - 1)) * w},${h - (v / 100) * (h - 2) - 1}`).join(' ');
  return (
    <svg width="100%" height={h} viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" aria-hidden="true">
      <line x1="0" y1={h - 1} x2={w} y2={h - 1} stroke="var(--line-soft)" vectorEffect="non-scaling-stroke" />
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.75" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

function Module({ id, state, live, selected, onPower, onSelect }) {
  const spec = BACKENDS[id];
  const vital = spec.vital.idle + (spec.vital.busy - spec.vital.idle) * (state.util / 100);
  const online = state.status === 'online';
  return (
    <div className={`module ${live ? 'live' : ''} ${state.status === 'offline' ? 'off' : ''}`} style={{ '--c': spec.color }}>
      <div className="mod-head">
        <div>
          <div className="mod-name">{spec.short}</div>
          <div className="mod-full">{spec.name}</div>
        </div>
        <span className={`led ${online ? 'on' : state.status === 'connecting' ? 'wait' : ''}`} aria-hidden="true" />
      </div>

      <label className="power">
        <input
          type="checkbox"
          checked={online || state.status === 'connecting'}
          disabled={state.status === 'connecting'}
          onChange={() => onPower(id)}
        />
        <span className="track" />
        {state.status === 'connecting' ? 'Connecting…' : online ? 'Connected' : 'Disconnected'}
      </label>

      <div className="mod-meter">
        <Meter data={state.history} color={state.status === 'offline' ? 'var(--line)' : spec.color} />
        <div className="mod-read" style={{ marginTop: 6 }}>
          <span>Load <b>{state.status === 'offline' ? '–' : `${state.util.toFixed(0)}%`}</b></span>
          <span>{spec.vital.label} <b>{state.status === 'offline' ? '–' : `${vital.toFixed(0)} ${spec.vital.unit}`}</b></span>
        </div>
      </div>

      <button
        className="select-btn"
        role="radio"
        aria-checked={selected}
        disabled={!online}
        onClick={() => onSelect(id)}
        title={online ? spec.bestFor : `Connect the ${spec.short} first`}
      >
        {live ? 'Running here' : selected ? 'Selected' : 'Run here'} <span className="kbd">{spec.key}</span>
      </button>
    </div>
  );
}

function Snippet({ workload, target }) {
  return (
    <pre className="code">
      <span className="k">import</span> {'{ fabric }'} <span className="k">from</span> <span className="s">'@vitarka/fabric'</span>{'\n\n'}
      <span className="k">const</span> job = fabric.run(<span className="s">'{workload.fn}'</span>, input, {'{'} target: <span className="s">'{target}'</span> {'}'}){'\n\n'}
      <span className="c">// move it mid-run; progress carries over</span>{'\n'}
      <span className="k">await</span> job.migrate(<span className="s">'qpu'</span>){'\n'}
      <span className="k">const</span> result = <span className="k">await</span> job.done
    </pre>
  );
}

export default function FabricConsole() {
  const { backends, target, setTarget, workloadId, setWorkloadId, job, run, cancel, toggleBackend, log, switches } = useFabric();
  const workload = WORKLOADS.find((w) => w.id === workloadId);
  const running = job && !job.done;
  const rootRef = useRef(null);
  const logRef = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = logRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [log]);

  useEffect(() => {
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0.2 });
    if (rootRef.current) io.observe(rootRef.current);
    return () => io.disconnect();
  }, []);

  // 1–4 pick a chip, A = auto, R = run or cancel. Only while the panel is on screen.
  useEffect(() => {
    if (!visible) return undefined;
    const onKey = (e) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (/^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName) || e.target.isContentEditable) return;
      const k = e.key.toLowerCase();
      const id = BACKEND_IDS.find((b) => BACKENDS[b].key === k);
      if (id) setTarget(id);
      else if (k === 'a') setTarget('auto');
      else if (k === 'r') (running ? cancel : run)();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [visible, running, setTarget, run, cancel]);

  const autoPick = bestBackend(workload, backends);
  const liveOn = running && !job.migrating ? job.backend : null;
  const lastSwitch = switches[switches.length - 1];

  let statusLine = 'Pick a workload and press Run.';
  if (job?.migrating) statusLine = `Moving from ${BACKENDS[job.migrating.from].short} to ${BACKENDS[job.migrating.to].short}…`;
  else if (running) statusLine = `Running on the ${BACKENDS[job.backend].name}`;
  else if (job?.done) statusLine = `Finished in ${job.elapsed.toFixed(1)} s`;

  return (
    <div className="rack-shell" ref={rootRef}>
      <div className="rack-bar">
        <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span className="screw" /> <strong>Fabric console</strong> <span>simulated in your browser</span>
        </span>
        <span className="keys-hint" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span>Keys: <span className="kbd">1</span> to <span className="kbd">4</span> pick a chip, <span className="kbd">A</span> auto, <span className="kbd">R</span> run</span>
          <span className="screw" />
        </span>
      </div>

      <div className="rack" role="radiogroup" aria-label="Where the job runs">
        {BACKEND_IDS.map((id) => (
          <Module
            key={id}
            id={id}
            state={backends[id]}
            live={liveOn === id}
            selected={target === id}
            onPower={toggleBackend}
            onSelect={setTarget}
          />
        ))}
        <div className={`module ${target === 'auto' && liveOn ? 'live' : ''}`} style={{ '--c': 'var(--ink)' }}>
          <div className="mod-head">
            <div>
              <div className="mod-name">Auto</div>
              <div className="mod-full">Best connected chip</div>
            </div>
          </div>
          <p className="small" style={{ color: 'var(--ink-2)' }}>
            {autoPick
              ? <>For {workload.label.toLowerCase()}, the router picks the <b style={{ color: BACKENDS[autoPick].color }}>{BACKENDS[autoPick].short}</b>.</>
              : 'Connect a chip to route work.'}
          </p>
          <p className="small">If a chip disconnects mid-job, work moves to the next best one.</p>
          <button className="select-btn" role="radio" aria-checked={target === 'auto'} onClick={() => setTarget('auto')}>
            {target === 'auto' ? 'Auto on' : 'Use auto'} <span className="kbd">A</span>
          </button>
        </div>
      </div>

      <div className="job-row">
        <label className="field">
          Workload
          <select value={workloadId} onChange={(e) => setWorkloadId(e.target.value)} disabled={running}>
            {WORKLOADS.map((w) => <option key={w.id} value={w.id}>{w.label}</option>)}
          </select>
        </label>
        {running
          ? <button className="btn btn-line" onClick={cancel}><Square size={15} /> Cancel job</button>
          : <button className="btn" onClick={run}><Play size={15} /> {job?.done ? 'Run again' : 'Run job'}</button>}
      </div>

      <div style={{ padding: 20, borderBottom: '1px solid var(--line)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, marginBottom: 10, fontSize: 'var(--t-sm)' }}>
          <span aria-live="polite">{statusLine}</span>
          <b>{job ? `${(job.progress * 100).toFixed(0)}%` : ''}</b>
        </div>
        <div className="strip" role="progressbar" aria-label="Job progress" aria-valuemin={0} aria-valuemax={100} aria-valuenow={job ? Math.round(job.progress * 100) : 0}>
          {job?.segments.map((s, i) => {
            const last = i === job.segments.length - 1;
            const moving = last && job.migrating;
            return (
              <div
                key={i}
                className={`strip-fill ${moving ? 'moving' : ''}`}
                style={{ '--c': BACKENDS[s.backend].color, left: `${s.from * 100}%`, width: `${Math.max(moving ? 2 : 0, (s.to - s.from) * 100)}%` }}
              />
            );
          })}
        </div>
        <div className="legend">
          {job
            ? [...new Set(job.segments.map((s) => s.backend))].map((b) => (
              <span key={b} style={{ '--c': BACKENDS[b].color }}>
                <i />{BACKENDS[b].short} did {Math.round(job.segments.filter((s) => s.backend === b).reduce((a, s) => a + s.to - s.from, 0) * 100)}%
              </span>
            ))
            : <span className="small">Each colour shows which chip did that part of the job.</span>}
        </div>
        <div className="readouts">
          <div className="readout"><span>Time</span><b>{job ? `${job.elapsed.toFixed(1)} s` : '–'}</b></div>
          <div className="readout"><span>Energy</span><b>{job ? formatEnergy(job.energy) : '–'}</b></div>
          <div className="readout"><span>Switches this job</span><b>{job ? job.segments.length - 1 : '–'}</b></div>
          <div className="readout"><span>Last handoff</span><b>{lastSwitch ? `${lastSwitch.ms} ms` : '–'}</b></div>
        </div>
      </div>

      <div className="deck">
        <div>
          <div className="small" style={{ marginBottom: 8 }}>Event log</div>
          <div className="log" ref={logRef}>
            {log.map((l, i) => (
              <div key={i} className={l.level}>
                <span className="t">{l.t}</span>
                {l.backend && <span style={{ color: BACKENDS[l.backend].color, marginRight: 8 }}>{BACKENDS[l.backend].short}</span>}
                {l.msg}
              </div>
            ))}
          </div>
        </div>
        <div>
          <div className="small" style={{ marginBottom: 8 }}>The same job in code (SDK preview)</div>
          <Snippet workload={workload} target={target} />
        </div>
      </div>
    </div>
  );
}
