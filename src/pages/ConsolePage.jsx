import FabricConsole from '../components/FabricConsole';

const tries = [
  { t: 'See a rejection', d: 'In “Compare inference backends”, hover NPU. It’s rejected with the reason: the model needs 70 GB.' },
  { t: 'Approve a trade-off', d: 'Pick GPU·B for the benchmark. It fits only with 8-bit weights, so the plan asks you to approve before running.' },
  { t: 'Switch mid-run', d: 'Connect GPU·B, start the run, then pick it during the benchmark. Requests re-route without repeating work.' },
  { t: 'Meet a hard limit', d: 'Try connecting the live MEA rig. It stays locked: live biology needs a lab partner and approvals.' },
];

export default function ConsolePage() {
  return (
    <section className="wrap" style={{ paddingTop: 64, paddingBottom: 32 }}>
      <div className="section-head" style={{ marginBottom: 40 }}>
        <div>
          <div className="kicker">प्रयोग <span>the experiment</span></div>
          <h1 className="display" style={{ fontSize: 'clamp(40px, 5.6vw, 76px)' }}>The workbench</h1>
        </div>
        <p className="body">
          A working model of Fabric’s planner and runtime. Providers and prices are placeholders, but the rules are the real design:
          explained compatibility, honest cost, approval gates and a record for every run.
        </p>
      </div>
      <FabricConsole />
      <div className="limits" style={{ marginTop: 40 }}>
        {tries.slice(0, 3).map((t) => (
          <div key={t.t} className="glass">
            <h2 className="h3">{t.t}</h2>
            <p className="body">{t.d}</p>
          </div>
        ))}
      </div>
      <p className="small" style={{ marginTop: 20 }}>{tries[3].t}: {tries[3].d}</p>
    </section>
  );
}
