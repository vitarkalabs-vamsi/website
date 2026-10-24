import { Link, useOutletContext } from 'react-router-dom';
import FabricConsole from '../components/FabricConsole';
import { BACKENDS, BACKEND_IDS } from '../lib/fabric';

const sheet = [
  { row: 'Made of', npu: 'Silicon, edge-class', tpu: 'Silicon, systolic arrays', qpu: 'Superconducting qubits', opu: 'Living cortical organoids on electrode arrays' },
  { row: 'Best at', npu: 'Fast inference for vision, speech and small language models', tpu: 'Training and large batched matrix work', qpu: 'Optimisation, sampling and molecular simulation', opu: 'Adaptive pattern recognition' },
  { row: 'Typical power', npu: '≈ 12 W', tpu: '≈ 200 W', qpu: '≈ 15 kW with the cryostat', opu: 'Under 1 W with electronics' },
  { row: 'What moves when you switch', npu: 'Tensors and weights', tpu: 'Tensors and weights', qpu: 'Circuit parameters and measured results', opu: 'The trained readout layer and data' },
  { row: 'Adapter status', npu: 'In development', tpu: 'In development', qpu: 'Planned, via quantum cloud services', opu: 'Research with academic partners' },
];

export default function HomePage() {
  const { openContact } = useOutletContext();

  return (
    <>
      <section className="wrap hero">
        <h1 className="display hero-title">
          Run anything on anything.<br />Switch while it runs.
        </h1>
        <div className="hero-foot">
          <p className="lede">
            Fabric connects neural, tensor, quantum and organoid processors into one runtime.
            Send a job to any of them, move it to another mid-run, and keep every bit of progress.
          </p>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <a className="btn" href="#console">Try the console</a>
            <Link className="btn btn-line" to="/platform">How it works</Link>
          </div>
        </div>
        <div id="console" style={{ scrollMarginTop: 88 }}>
          <FabricConsole />
        </div>
        <p className="small" style={{ marginTop: 14 }}>
          Try this: switch on the QPU, choose route optimisation and press Run. Halfway through, choose Run here on the NPU to move the job without losing progress.
        </p>
      </section>

      <section className="section">
        <div className="wrap">
          <div className="section-head">
            <h2 className="h2">Four kinds of processor, one way to use them.</h2>
            <p className="body">
              No single chip wins every workload. Each one is good at different work and costs a different amount to run.
              Fabric lets you pick per job, and change your mind halfway.
            </p>
          </div>
          <div className="sheet-wrap">
            <table className="sheet">
              <thead>
                <tr>
                  <th scope="col"><span className="sr">Property</span></th>
                  {BACKEND_IDS.map((id) => (
                    <th key={id} scope="col" style={{ borderTop: `4px solid ${BACKENDS[id].color}` }}>
                      <span className="sheet-chip" style={{ color: BACKENDS[id].color }}>{BACKENDS[id].short}</span>
                      <span style={{ display: 'block', color: 'var(--ink-2)', fontWeight: 500 }}>{BACKENDS[id].name}</span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sheet.map((r) => (
                  <tr key={r.row}>
                    <th scope="row">{r.row}</th>
                    {BACKEND_IDS.map((id) => <td key={id}>{r[id]}</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap split">
          <div>
            <h2 className="h2">Write it once. Run it on whichever chip is free.</h2>
          </div>
          <div>
            <p className="body">
              Your code calls Fabric, not a chip. Fabric compiles the job to one shared format, Vitarka IR, and an adapter for each
              chip translates that into native kernels, quantum circuits or stimulation patterns.
            </p>
            <p className="body" style={{ marginTop: 16 }}>
              Because every chip reads the same format, a running job can be paused, saved and picked up by a different chip.
              That is the whole idea, and the platform page shows how it works step by step.
            </p>
            <Link className="btn btn-line" style={{ marginTop: 28 }} to="/platform">Read how switching works</Link>
          </div>
        </div>
      </section>

      <section className="section cta">
        <div className="wrap split">
          <h2 className="h2">Bring a chip, a lab or a workload.</h2>
          <div>
            <p className="body">
              We're building Fabric with hardware makers, research labs and teams who want one runtime across every kind of processor.
              Tell us what you run and on what.
            </p>
            <button className="btn" style={{ marginTop: 28 }} onClick={openContact}>Talk to us</button>
          </div>
        </div>
      </section>
    </>
  );
}
