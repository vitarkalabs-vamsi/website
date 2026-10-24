import { Link } from 'react-router-dom';
import { BACKENDS, BACKEND_IDS, WORKLOADS } from '../lib/fabric';

const stack = [
  { name: 'Your application', detail: 'Calls fabric.run(task, input, { target }) from Python or JavaScript.' },
  { name: 'Router', detail: 'Chooses a chip from what each one can do, how busy it is and what it costs. Handles pinning, auto and failover.' },
  { name: 'Vitarka IR', detail: 'One shared format for tensors, quantum circuits and stimulation protocols. Checkpoints are written in it.' },
  { name: 'Adapters', detail: 'One per chip type. Each translates Vitarka IR into native kernels, circuits or electrode patterns.', chips: true },
  { name: 'Hardware', detail: 'Edge accelerators, tensor pods, quantum cloud services and organoid cultures on electrode arrays.' },
];

const handoff = [
  { t: 'Pause', d: 'The current chip stops at the next safe point and saves the job’s state.' },
  { t: 'Translate', d: 'The state is written in Vitarka IR, so it no longer depends on the chip that produced it.' },
  { t: 'Send', d: 'The router warms up the next chip and transfers the checkpoint to it.' },
  { t: 'Resume', d: 'The new chip rebuilds the state in its own format and carries on from the same point.' },
];

const limits = [
  { t: 'Quantum state can’t be copied.', d: 'Physics forbids saving a live superposition. On a QPU, Fabric switches between circuit runs and carries over the parameters and results instead.' },
  { t: 'Organoids don’t repeat exactly.', d: 'Living neurons adapt and drift. When a job leaves an OPU, Fabric moves the trained readout layer and the data, not the biology.' },
  { t: 'Some switches take time.', d: 'Quantum services queue jobs and large models are slow to move. The router weighs the cost of switching against the time it saves.' },
];

function shade(v) {
  if (v >= 0.9) return { background: 'var(--ink)', color: 'var(--white)' };
  if (v >= 0.6) return { background: '#6E7781', color: 'var(--white)' };
  if (v >= 0.3) return { background: 'var(--line)', color: 'var(--ink)' };
  return { background: 'var(--alu)', color: 'var(--mute)' };
}

export default function PlatformPage() {
  return (
    <>
      <section className="wrap hero">
        <h1 className="display" style={{ fontSize: 'clamp(38px, 6vw, 76px)', maxWidth: '12em' }}>
          From your code to the chip, in five layers.
        </h1>
        <p className="lede" style={{ marginTop: 28 }}>
          Every chip in Fabric reads the same format. That single decision is what lets one call run a job anywhere
          and move it while it runs.
        </p>

        <ol className="stack" aria-label="Fabric architecture, top to bottom">
          {stack.map((l) => (
            <li key={l.name}>
              <h2 className="h3">{l.name}</h2>
              <p className="body">{l.detail}</p>
              {l.chips && (
                <div className="stack-chips">
                  {BACKEND_IDS.map((id) => (
                    <span key={id} style={{ background: BACKENDS[id].soft, color: BACKENDS[id].color }}>{BACKENDS[id].short}</span>
                  ))}
                </div>
              )}
            </li>
          ))}
        </ol>
      </section>

      <section className="section">
        <div className="wrap">
          <div className="section-head">
            <h2 className="h2">What happens when you switch.</h2>
            <p className="body">Four steps, usually a few hundred milliseconds between silicon chips. The job never starts over.</p>
          </div>
          <ol className="steps">
            {handoff.map((h, i) => (
              <li key={h.t}>
                <span className="step-n">{i + 1}</span>
                <h3 className="h3">{h.t}</h3>
                <p className="body">{h.d}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <div className="section-head">
            <h2 className="h2">How auto picks a chip.</h2>
            <p className="body">
              Darker means a better fit. On auto, each job goes to the best-suited chip that's connected.
              These are the starting weights in the console; the live router also weighs load, queue time and energy.
            </p>
          </div>
          <div className="sheet-wrap">
            <table className="sheet" style={{ minWidth: 600 }}>
              <thead>
                <tr>
                  <th scope="col">Workload</th>
                  {BACKEND_IDS.map((id) => <th key={id} scope="col" style={{ textAlign: 'center', color: BACKENDS[id].color, fontWeight: 800, fontSize: 'var(--t-sm)' }}>{BACKENDS[id].short}</th>)}
                </tr>
              </thead>
              <tbody>
                {WORKLOADS.map((w) => (
                  <tr key={w.id}>
                    <th scope="row">{w.label}</th>
                    {BACKEND_IDS.map((id) => (
                      <td key={id} style={{ padding: 6 }}>
                        <span className="cell" style={shade(w.affinity[id])}>{w.affinity[id].toFixed(2)}</span>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <div className="section-head">
            <h2 className="h2">What switching can’t do.</h2>
            <p className="body">Each kind of processor has limits that no runtime can hide. Here's how Fabric handles them.</p>
          </div>
          <div className="limits">
            {limits.map((l) => (
              <div key={l.t}>
                <h3 className="h3">{l.t}</h3>
                <p className="body" style={{ marginTop: 8 }}>{l.d}</p>
              </div>
            ))}
          </div>
          <Link className="btn" style={{ marginTop: 56 }} to="/console">Try switching in the console</Link>
        </div>
      </section>
    </>
  );
}
