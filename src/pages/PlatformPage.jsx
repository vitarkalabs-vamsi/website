import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { VERDICTS } from '../lib/fabric';

const layers = [
  { name: 'Python SDK · CLI · workbench · API', detail: 'Where you describe workflows, check them and read results.' },
  { name: 'Projects, workflows, datasets, costs', detail: 'Versioned definitions, immutable inputs, budgets and approvals.' },
  { name: 'Compatibility evaluator and scheduler', detail: 'Explains every accept and reject. Picks a backend by your weights, never just the lowest rate.', hot: true },
  { name: 'Durable workflow orchestrator', detail: 'Retries by failure class, idempotent submission, pause, resume and cancel.' },
  { name: 'Adapters', detail: 'AI job nodes, quantum nodes and research/MEA nodes, each with its own contract.', chips: true },
  { name: 'Artifact store and provenance', detail: 'Checksums, lineage, logs and metrics, in storage you control.' },
];

const switching = [
  { family: 'Inference', color: 'var(--haldi)', how: 'Routes requests or deployments between compatible endpoints.', keeps: 'Model revision, output contract, completed requests', checks: 'Health, warm state, latency, region, output equivalence within your tolerance' },
  { family: 'Batch and training', color: 'var(--neel)', how: 'Chooses at launch, or restarts from a compatible checkpoint as a planned transition.', keeps: 'Checkpoints the framework can load on the new backend', checks: 'Image rebuild, dependencies, data transfer, a fresh estimate' },
  { family: 'Quantum', color: 'var(--jamun)', how: 'Picks an eligible simulator or processor and re-runs remaining shot batches.', keeps: 'Circuit version, seed, shots, calibration data where available', checks: 'Gate set, qubit count, shot limits, provider-specific cost' },
  { family: 'Organoid and MEA', color: 'var(--mor)', how: 'Never moves a specimen. Schedules separate sessions or moves the analysis.', keeps: 'Sample identity, protocol, approvals, array geometry, session timing', checks: 'Lab permissions, safety limits, human approval for live actions' },
];

const levels = [
  ['Link-out', 'A catalogue entry with documentation and a link to the provider.'],
  ['Bring your own account', 'You connect your own credentials; jobs and billing stay with the provider.'],
  ['API-integrated', 'Live capability, availability and quote checks through official APIs.'],
  ['Partner-integrated', 'The provider confirms data, pricing semantics and support boundaries.'],
];

const maturity = [
  ['Design', 'Interface under discussion. Nothing to use yet.'],
  ['Experimental', 'Works in a known setup; APIs may change.'],
  ['Beta', 'Conformance tests pass against named versions.'],
  ['Verified', 'Tests pass and recent checks are recorded.'],
];

const ADAPTER = (
  <>
    <span className="k">class</span> <span className="f">ComputeAdapter</span>(Protocol):{'\n'}
    {'    '}<span className="k">def</span> <span className="f">discover</span>(self) -&gt; list[ResourceDescriptor]{'\n'}
    {'    '}<span className="k">def</span> <span className="f">get_capabilities</span>(self, resource_id) -&gt; CapabilitySpec{'\n'}
    {'    '}<span className="k">def</span> <span className="f">validate</span>(self, request) -&gt; ValidationReport{'\n'}
    {'    '}<span className="k">def</span> <span className="f">estimate</span>(self, request) -&gt; CostEstimate{'\n'}
    {'    '}<span className="k">def</span> <span className="f">submit</span>(self, request, idempotency_key) -&gt; JobHandle{'\n'}
    {'    '}<span className="k">def</span> <span className="f">get_status</span>(self, job) -&gt; JobStatus{'\n'}
    {'    '}<span className="k">def</span> <span className="f">cancel</span>(self, job) -&gt; CancelResult{'\n'}
    {'    '}<span className="k">def</span> <span className="f">collect_results</span>(self, job) -&gt; ResultManifest{'\n'}
    {'    '}<span className="k">def</span> <span className="f">health_check</span>(self) -&gt; AdapterHealth{'\n\n'}
    <span className="c"># Unsupported operations are declared, not faked.</span>
  </>
);

const CAPABILITY = (
  <>
    <span className="k">resource_id</span>: provider-a/gpu-80gb{'\n'}
    <span className="k">resource_type</span>: gpu{'\n'}
    <span className="k">availability</span>:{'\n'}
    {'  '}status: <span className="s">last_known</span>   <span className="c"># never shown as live</span>{'\n'}
    {'  '}checked_at: <span className="s">"2026-10-24T00:00:00Z"</span>{'\n'}
    {'  '}expires_after_seconds: 300{'\n'}
    <span className="k">runtime_support</span>:{'\n'}
    {'  '}- framework: pytorch{'\n'}
    {'    '}precisions: [fp16, bf16, fp32]{'\n'}
    <span className="k">pricing</span>:{'\n'}
    {'  '}unit: accelerator_second{'\n'}
    {'  '}currency: INR{'\n'}
    {'  '}amount: <span className="s">null</span>{'\n'}
    {'  '}source: <span className="s">provider_quote_required</span>{'\n'}
    <span className="k">provenance</span>:{'\n'}
    {'  '}adapter_version: <span className="s">"0.1.0"</span>{'\n'}
    {'  '}verification_state: <span className="s">experimental</span>
  </>
);

export default function PlatformPage() {
  return (
    <>
      <section className="wrap" style={{ paddingTop: 72, paddingBottom: 40 }}>
        <div className="kicker">तर्क <span>reasoning before running</span></div>
        <h1 className="display" style={{ fontSize: 'clamp(42px, 6.4vw, 88px)', maxWidth: '11em' }}>Check first. Run second. Record everything.</h1>
        <p className="lede" style={{ marginTop: 28 }}>
          Fabric splits a control plane, which checks, plans and records, from an execution plane, which runs your jobs locally,
          on your own workers or through each provider’s official API.
        </p>
      </section>

      <section className="section" style={{ paddingTop: 64 }}>
        <div className="wrap dev">
          <ol className="stack" aria-label="Fabric architecture, top to bottom">
            {layers.map((l) => (
              <li key={l.name} className={`glass ${l.hot ? 'hot' : ''}`}>
                <h2 className="h3" style={{ fontSize: 'var(--t-md)' }}>{l.name}</h2>
                <div>
                  <p className="body" style={{ fontSize: 'var(--t-sm)' }}>{l.detail}</p>
                  {l.chips && (
                    <div className="stack-chips">
                      <span style={{ '--c': 'var(--haldi)', '--soft': 'var(--npu-soft)' }}>AI accelerators</span>
                      <span style={{ '--c': 'var(--jamun)', '--soft': 'var(--qpu-soft)' }}>Quantum</span>
                      <span style={{ '--c': 'var(--mor)', '--soft': 'var(--opu-soft)' }}>Organoid and MEA</span>
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ol>
          <div>
            <h2 className="h2">The adapter contract is the product.</h2>
            <p className="body" style={{ marginTop: 18 }}>
              Every provider, simulator, local runtime or instrument plugs in through one tested interface. Adapters declare their
              billing units, how fresh their availability data is, how cancellation works and which errors are safe to retry.
            </p>
            <p className="body" style={{ marginTop: 14 }}>
              Each adapter must pass a conformance suite covering schemas, secret redaction, idempotent submission, timeouts,
              cancellation, result checksums, quotes and stale inventory, run against recorded fixtures, never paid hardware.
            </p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap dev">
          <div className="glass code-card"><pre className="code-body" style={{ minHeight: 0 }}>{ADAPTER}</pre></div>
          <div className="glass code-card"><pre className="code-body" style={{ minHeight: 0 }}>{CAPABILITY}</pre></div>
        </div>
        <p className="wrap small" style={{ marginTop: 14 }}>Illustrative schemas from the design. Not a claim about any real provider.</p>
      </section>

      <section className="section">
        <div className="wrap">
          <div className="section-head">
            <h2 className="h2">Every verdict comes with a reason.</h2>
            <p className="body">Before anything costs money, each candidate backend for each step gets one of five verdicts. Unknown is never treated as compatible.</p>
          </div>
          <div className="verdicts">
            {[
              ['ok', 'Every required capability is established.'],
              ['warn', 'It can run, but there’s a trade-off you must acknowledge, such as 8-bit weights.'],
              ['cond', 'It needs a conversion, a rebuild, a data transfer or a reservation first.'],
              ['no', 'A requirement isn’t met: memory, operator, precision, region or a missing CUDA build.'],
              ['unknown', 'The adapter hasn’t published enough verified information. Rejected by default.'],
            ].map(([k, d]) => (
              <div key={k} className="glass verdict" style={{ '--v': VERDICTS[k].color }}>
                <span className="verdict-mark">{VERDICTS[k].mark}</span>
                <h3 className="h3">{VERDICTS[k].label}</h3>
                <p className="body">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <div className="section-head">
            <h2 className="h2">What “switching” means, family by family.</h2>
            <p className="body">Switching is a defined operation with rules, not hardware magic. Here is what moves, what stays and what gets checked.</p>
          </div>
          <div className="glass" style={{ overflowX: 'auto' }}>
            <table className="matrix friction">
              <thead><tr><th /><th>How it switches</th><th>What is kept</th><th>What is checked</th></tr></thead>
              <tbody>
                {switching.map((s) => (
                  <tr key={s.family}>
                    <th scope="row" style={{ color: s.color, fontFamily: 'var(--display)', fontSize: 'var(--t-md)' }}>{s.family}</th>
                    <td>{s.how}</td><td>{s.keeps}</td><td>{s.checks}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap dev" style={{ alignItems: 'start' }}>
          <div>
            <h2 className="h2">Labels that mean something.</h2>
            <p className="body" style={{ marginTop: 18 }}>
              Every provider shows how deeply it’s integrated and how mature its adapter is. A listing is not proof of API access or a partnership,
              and a green badge never comes from a mock test alone.
            </p>
            <Link className="btn btn-ember" style={{ marginTop: 32 }} to="/console">Open the workbench <ArrowRight size={16} /></Link>
          </div>
          <div style={{ display: 'grid', gap: 20 }}>
            <div className="glass ladder">
              <h3 className="h3">Integration level</h3>
              {levels.map(([k, d], i) => <div key={k}><span>{i + 1}</span><b>{k}</b><p>{d}</p></div>)}
            </div>
            <div className="glass ladder">
              <h3 className="h3">Adapter maturity</h3>
              {maturity.map(([k, d], i) => <div key={k}><span>{i + 1}</span><b>{k}</b><p>{d}</p></div>)}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
