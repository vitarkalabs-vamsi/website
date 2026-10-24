import FabricConsole from '../components/FabricConsole';

const tries = [
  { t: 'Connect a chip', d: 'Turn on the QPU or OPU and watch it join the fabric.' },
  { t: 'Let auto choose', d: 'With auto on, pick route optimisation. The router sends it to the quantum unit.' },
  { t: 'Switch mid-run', d: 'While a job runs, press 1 to 4. It pauses, moves and resumes without losing progress.' },
  { t: 'Pull the plug', d: 'Disconnect the chip a job is running on. Fabric moves the job to the next best chip.' },
];

export default function ConsolePage() {
  return (
    <section className="wrap" style={{ paddingTop: 56, paddingBottom: 96 }}>
      <div className="hero-foot" style={{ marginTop: 0, marginBottom: 32 }}>
        <h1 className="display" style={{ fontSize: 'clamp(34px, 5vw, 60px)' }}>Fabric console</h1>
        <p className="body" style={{ maxWidth: '30em' }}>
          A working model of the runtime. The chips are simulated in your browser; the routing, pause and handoff flow is the real design.
        </p>
      </div>
      <FabricConsole />
      <div className="limits" style={{ marginTop: 48 }}>
        {tries.map((t) => (
          <div key={t.t}>
            <h2 className="h3">{t.t}</h2>
            <p className="body" style={{ marginTop: 6 }}>{t.d}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
