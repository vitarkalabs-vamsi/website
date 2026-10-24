import { useEffect, useRef, useState } from 'react';
import { Play, Square, Lock } from 'lucide-react';
import {
  BACKENDS, BACKEND_IDS, FAMILIES, VERDICTS, WORKFLOWS,
  candidates, formatINR, useFabric, verdict,
} from '../lib/fabric';

const MODE_NOTE = {
  route: 'Can switch mid-run: next requests are routed to the new endpoint',
  checkpoint: 'Can switch mid-run: restarts from the last compatible checkpoint',
  rerun: 'Can switch between shot batches: results are tagged per backend',
  fixed: 'Runs where it starts',
};

function Registry({ backends, onToggle }) {
  const groups = ['local', 'accel', 'quantum', 'bio'];
  return (
    <div className="reg">
      {groups.map((g) => (
        <div key={g} className="reg-group">
          <div className="reg-head" style={{ color: FAMILIES[g].color }}>{FAMILIES[g].name}</div>
          {BACKEND_IDS.filter((id) => BACKENDS[id].family === g).map((id) => {
            const b = BACKENDS[id];
            const s = backends[id];
            return (
              <div key={id} className={`reg-row ${s.status}`} style={{ '--c': b.color }}>
                <span className={`led ${s.status === 'online' ? 'on' : s.status === 'connecting' ? 'wait' : ''}`} />
                <div className="reg-text">
                  <b>{b.name}</b>
                  <span>{b.provider}</span>
                  <span className="reg-meta">{b.integration} · {b.unit}</span>
                </div>
                {b.locked ? (
                  <button className="icon-btn reg-lock" onClick={() => onToggle(id)} aria-label={`${b.name}: not available`} title={b.locked}><Lock size={15} /></button>
                ) : (
                  <label className="power" title={s.status === 'online' ? 'Disconnect' : 'Connect'}>
                    <input type="checkbox" checked={s.status !== 'offline'} disabled={s.status === 'connecting'} onChange={() => onToggle(id)} aria-label={`Connect ${b.name}`} />
                    <span className="track" />
                  </label>
                )}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}

function Step({ i, step, chosen, runStep, live, backends, onChoose, inspect, setInspect }) {
  const shown = inspect ?? chosen;
  const [v, why] = shown ? verdict(step, shown) : ['no', 'No connected backend can run this step.'];
  return (
    <li className={`step ${runStep?.state || ''} ${live ? 'live' : ''}`}>
      <div className="step-top">
        <span className="step-i">{runStep?.state === 'done' ? '✓' : i + 1}</span>
        <div className="step-title">
          <b>{step.label}</b>
          <span>{MODE_NOTE[step.mode]}</span>
        </div>
        <span className="step-pct">{runStep ? `${Math.round(runStep.progress * 100)}%` : ''}</span>
      </div>

      <div className="opts" role="radiogroup" aria-label={`Backend for ${step.label}`}>
        {candidates(step).map((id) => {
          const [cv] = verdict(step, id);
          const usable = ['ok', 'warn'].includes(cv) && backends[id].status === 'online' && !BACKENDS[id].locked;
          return (
            <button
              key={id}
              role="radio"
              aria-checked={chosen === id}
              className={`opt v-${cv} ${chosen === id ? 'on' : ''} ${usable ? '' : 'dim'}`}
              style={{ '--c': BACKENDS[id].color, '--v': VERDICTS[cv].color }}
              onMouseEnter={() => setInspect(id)}
              onMouseLeave={() => setInspect(null)}
              onFocus={() => setInspect(id)}
              onBlur={() => setInspect(null)}
              onClick={() => onChoose(i, id)}
            >
              <i aria-hidden="true">{VERDICTS[cv].mark}</i>{BACKENDS[id].short}
              {backends[id].status !== 'online' && !BACKENDS[id].locked && <small>offline</small>}
            </button>
          );
        })}
      </div>
      <p className="why" style={{ '--v': VERDICTS[v].color }}>
        <b>{VERDICTS[v].label}{shown ? ` on ${BACKENDS[shown].short}` : ''}.</b> {why}
      </p>

      {runStep && (
        <div className="strip" aria-hidden="true">
          {runStep.segments.map((s, k) => (
            <div key={k} className={`strip-fill ${live && k === runStep.segments.length - 1 && runStep.migrating ? 'moving' : ''}`}
              style={{ '--c': BACKENDS[s.backend].color, left: `${s.from * 100}%`, width: `${(s.to - s.from) * 100}%` }} />
          ))}
        </div>
      )}
    </li>
  );
}

export default function FabricConsole() {
  const f = useFabric();
  const { backends, workflow, workflowId, setWorkflowId, resolved, estimates, needsQuote, warnings, needsApproval, blockedStep, approved, setApproved, run, start, cancel, choose, toggleBackend, log } = f;
  const [inspect, setInspect] = useState({});
  const logRef = useRef(null);
  const running = run && !run.done;

  useEffect(() => { if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight; }, [log]);

  const known = estimates.filter((e) => typeof e === 'number').reduce((a, b) => a + b, 0);
  const actual = run ? run.steps.reduce((a, s) => (s.cost == null ? a : a + s.cost), 0) : 0;
  const actualUnknown = run ? run.steps.some((s) => s.cost === null) : false;

  return (
    <div className="wb glass">
      <div className="rack-bar">
        <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span className="screw" /> <strong>Fabric workbench</strong>
        </span>
        <span>Simulation. Providers, prices and results are illustrative.</span>
      </div>

      <div className="wb-grid">
        <aside className="wb-side">
          <div className="small wb-label">Compute registry</div>
          <Registry backends={backends} onToggle={toggleBackend} />
        </aside>

        <div className="wb-main">
          <div className="wf-tabs" role="tablist" aria-label="Workflow">
            {WORKFLOWS.map((w) => (
              <button key={w.id} role="tab" aria-selected={workflowId === w.id} className="wf-tab" disabled={running && workflowId !== w.id} onClick={() => setWorkflowId(w.id)}>
                {w.label}
              </button>
            ))}
          </div>
          <p className="body wf-summary">{workflow.summary}</p>

          <ol className="steps-run">
            {workflow.steps.map((s, i) => (
              <Step
                key={`${workflowId}-${i}`}
                i={i}
                step={s}
                chosen={run ? run.steps[i].backend : resolved[i]}
                runStep={run && !run.cancelled ? { ...run.steps[i], migrating: run.migrating?.step === i } : null}
                live={running && run.stepIndex === i}
                backends={backends}
                onChoose={choose}
                inspect={inspect[i] ?? null}
                setInspect={(id) => setInspect((p) => ({ ...p, [i]: id }))}
              />
            ))}
          </ol>

          <div className="plan">
            <div className="plan-figs">
              <div>
                <span className="small">{run ? 'Charged so far' : 'Estimate'}</span>
                <b>{run ? `${formatINR(actual)}${actualUnknown ? ' + quote' : ''}` : `${formatINR(known)}${needsQuote ? ' + quote' : ''}`}</b>
              </div>
              <div>
                <span className="small">Warnings</span>
                <b>{warnings}</b>
              </div>
              <div>
                <span className="small">Time</span>
                <b>{run ? `${run.elapsed.toFixed(1)} s` : '–'}</b>
              </div>
            </div>
            <div className="plan-act">
              {!running && needsApproval && blockedStep < 0 && (
                <label className="approve">
                  <input type="checkbox" checked={approved} onChange={(e) => setApproved(e.target.checked)} />
                  <span>{needsQuote ? 'I accept that some prices need a provider quote' : 'I reviewed the warnings above'}</span>
                </label>
              )}
              {running
                ? <button className="btn btn-ghost" onClick={cancel}><Square size={15} /> Cancel run</button>
                : <button className="btn btn-ember" onClick={start} disabled={blockedStep >= 0 || (needsApproval && !approved)}><Play size={15} /> {run ? 'Run again' : 'Run workflow'}</button>}
            </div>
          </div>
        </div>
      </div>

      <div className="deck">
        <div>
          <div className="small wb-label">Run log</div>
          <div className="log" ref={logRef} aria-live="polite">
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
          <div className="small wb-label">Provenance record</div>
          <pre className="code prov">
            {run ? (
              <>
                <span className="c">{'# written for every run'}</span>{'\n'}
                run_id: <span className="s">{run.id}</span>{'\n'}
                workflow: <span className="s">{run.workflow}@v1</span>{'\n'}
                input_sha256: <span className="s">{run.input}…</span>{'\n'}
                status: <span className="s">{run.cancelled ? 'cancelled' : run.done ? 'succeeded' : 'running'}</span>{'\n'}
                nodes:{'\n'}
                {workflow.steps.map((s, i) => {
                  const st = run.steps[i];
                  const out = run.outputs.find((o) => o.step === i);
                  const used = [...new Set(st.segments.map((x) => BACKENDS[x.backend].short))].join(', ') || BACKENDS[st.backend].short;
                  return `  - ${s.label}\n    backend: ${used}\n    switches: ${st.switches}\n    cost: ${st.state === 'queued' ? '–' : formatINR(st.cost)}\n    output: ${out ? out.sha + '…' : st.state}\n`;
                }).join('')}
              </>
            ) : (
              <span className="c">{'# Run the workflow to see its record:\n# inputs and checksums, backend per step,\n# switches, cost, and output artifacts.'}</span>
            )}
          </pre>
        </div>
      </div>
    </div>
  );
}
