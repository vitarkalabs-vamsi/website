import { useState } from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import { ArrowRight, Search, GitBranch, ShieldCheck, Receipt, FileCheck2, Boxes, Cpu, Atom, Activity, Scale, Microscope, Repeat } from 'lucide-react';
import HeroOrbit from '../components/HeroOrbit';
import ChipGlyph from '../components/ChipGlyph';
import FabricConsole from '../components/FabricConsole';

const friction = [
  { row: 'SDKs and runtimes', accel: 'CUDA, XLA, vendor NPU toolchains', quantum: 'A different SDK and circuit language per provider', bio: 'Instrument software, many file formats' },
  { row: 'Getting access', accel: 'Separate accounts, quotas and regions', quantum: 'Queues and reservations', bio: 'Lab bookings, approvals, partnerships' },
  { row: 'How you pay', accel: 'Per GPU-hour or per chip-hour', quantum: 'Per task, per shot or reserved time', bio: 'Per session, often by agreement' },
  { row: 'What comes back', accel: 'Checkpoints, logs, metrics', quantum: 'Shot counts with hardware noise', bio: 'Spike trains and raw recordings' },
];

const families = [
  { id: 'accel', glyph: 'npu', color: 'var(--haldi)', soft: 'var(--npu-soft)', name: 'AI accelerators', pigment: 'Haldi', stage: 'First release', body: 'GPUs first, then TPUs, NPUs and inference chips through the stacks their providers support. Compare endpoints and route inference between compatible ones.', pills: ['Inference', 'Batch', 'Training', 'Benchmarks'] },
  { id: 'quantum', glyph: 'qpu', color: 'var(--jamun)', soft: 'var(--qpu-soft)', name: 'Quantum systems', pigment: 'Jamun', stage: 'Simulator first, then one provider', body: 'Submit circuit jobs to simulators and processors with shots, queues and reservations made visible. Results stay tagged with the device they came from.', pills: ['Circuits', 'Shots', 'Reservations', 'Hybrid'] },
  { id: 'bio', glyph: 'opu', color: 'var(--mor)', soft: 'var(--opu-soft)', name: 'Organoids and MEAs', pigment: 'Mor', stage: 'Research workbench', body: 'Start with public and your own recordings: quality checks, spike sorting and network activity, reproducibly. Live rigs only with a lab partner and approvals.', pills: ['MEA data', 'Spike sorting', 'QC', 'Provenance'] },
  { id: 'core', glyph: 'tpu', color: 'var(--neel)', soft: 'var(--tpu-soft)', name: 'Workflow runtime', pigment: 'Neel', stage: 'Shared core', body: 'One engine underneath: scheduling, data movement, retries, budgets, approvals and a provenance record for every run.', pills: ['Scheduling', 'Retries', 'Budgets', 'Lineage'] },
];

const rules = [
  { title: 'Moves when it can', body: 'An inference job can move between GPU providers, or from GPU to TPU, when the model, framework, precision and dependencies are supported. Fabric checks before it moves.' },
  { title: 'Has its own contract', body: 'A quantum processor runs quantum workloads. It is not a stand-in for LLM inference, and its results differ from a simulator’s. Fabric says so instead of hiding it.' },
  { title: 'Never moves a living sample', body: 'An organoid on an electrode array is one specimen. Fabric can move the analysis, compare separate samples and keep the protocol attached, but it never calls that a hardware switch.' },
];

const cases = [
  { icon: <Scale size={22} />, title: 'Compare inference providers', body: 'Run one model on two independent GPU endpoints with the same dataset. Compare quality, latency and cost before committing.', route: [['GPU·A', 'var(--npu-soft)', '#F0A830'], ['GPU·B', 'rgba(228,87,46,0.14)', '#E4572E']] },
  { icon: <Atom size={22} />, title: 'Hybrid quantum experiments', body: 'Develop on a simulator, then run the same circuit on a processor, with classical analysis in the same record.', route: [['QSIM', 'var(--qpu-soft)', '#DDB8FF'], ['QPU', 'var(--qpu-soft)', '#B67CE8'], ['LOCAL', 'var(--surface-2)', '#F3EBDD']] },
  { icon: <Activity size={22} />, title: 'Organoid spontaneous activity', body: 'Ingest a cortical organoid recording, check signal quality, sort spikes and measure bursts and synchrony.', route: [['LOCAL', 'var(--surface-2)', '#F3EBDD'], ['GPU', 'var(--npu-soft)', '#F0A830']] },
  { icon: <Microscope size={22} />, title: 'High-density MEA spike sorting', body: 'Offline first, then replay at acquisition speed. “Real-time” only after latency is measured under load.', route: [['REPLAY', 'var(--opu-soft)', '#2DBFA8'], ['GPU', 'var(--npu-soft)', '#F0A830']] },
  { icon: <Repeat size={22} />, title: 'Reproduce a paper', body: 'Every run keeps code version, input checksums, backend, settings and outputs, so a result can be re-run months later.', route: [['RECORD', 'var(--tpu-soft)', '#6E86FF']] },
  { icon: <Cpu size={22} />, title: 'Work within a budget', body: 'See the estimate, its billing units and anything that needs a quote before you spend. Set a cap and approve what crosses it.', route: [['₹ CAP', 'rgba(228,87,46,0.14)', '#E4572E']] },
];

const CODE = {
  Python: (
    <>
      <span className="k">from</span> vitarka <span className="k">import</span> fabric{'\n\n'}
      wf = fabric.<span className="f">workflow</span>(<span className="s">"compare-inference"</span>){'\n'}
      wf.<span className="f">node</span>(<span className="s">"benchmark"</span>, type=<span className="s">"inference.benchmark"</span>,{'\n'}
      {'        '}candidates=[<span className="s">"local"</span>, <span className="s">"provider-a/gpu"</span>, <span className="s">"provider-b/gpu"</span>],{'\n'}
      {'        '}objective=[<span className="s">"cost"</span>, <span className="s">"p95_latency"</span>]){'\n\n'}
      plan = wf.<span className="f">plan</span>(budget=<span className="s">"₹500"</span>){'\n'}
      <span className="k">print</span>(plan.compatibility)  <span className="c"># why each backend was accepted or rejected</span>{'\n'}
      <span className="k">print</span>(plan.estimate)       <span className="c"># units, assumptions, anything needing a quote</span>{'\n\n'}
      run = plan.<span className="f">approve</span>().<span className="f">run</span>(){'\n'}
      run.provenance.<span className="f">save</span>(<span className="s">"run.json"</span>)
    </>
  ),
  CLI: (
    <>
      <span className="c">$</span> fabric resources --type gpu --region ap-south{'\n'}
      <span className="c">$</span> fabric check workflow.yaml{'\n'}
      <span className="s">benchmark</span>  provider-a/gpu   compatible{'\n'}
      <span className="s">benchmark</span>  provider-b/gpu   warnings: 8-bit weights needed{'\n'}
      <span className="s">benchmark</span>  provider-d/npu   incompatible: needs 70 GB, has 16 GB{'\n\n'}
      <span className="c">$</span> fabric estimate workflow.yaml{'\n'}
      total ₹312 (estimate) · 1 item needs a quote · approval required{'\n\n'}
      <span className="c">$</span> fabric run workflow.yaml --approve{'\n'}
      run 7f3a2c started · record: runs/7f3a2c/provenance.json
    </>
  ),
  YAML: (
    <>
      <span className="k">apiVersion</span>: fabric/v1alpha1{'\n'}
      <span className="k">kind</span>: Workflow{'\n'}
      <span className="k">metadata</span>: {'{'} name: compare-inference-backends {'}'}{'\n'}
      <span className="k">spec</span>:{'\n'}
      {'  '}<span className="k">defaults</span>:{'\n'}
      {'    '}max_budget: {'{'} amount: 500, currency: INR {'}'}{'\n'}
      {'    '}on_unknown_compatibility: <span className="s">reject</span>{'\n'}
      {'  '}<span className="k">nodes</span>:{'\n'}
      {'    '}- id: validate{'\n'}
      {'      '}type: model.validate{'\n'}
      {'    '}- id: benchmark{'\n'}
      {'      '}type: inference.benchmark{'\n'}
      {'      '}depends_on: [validate]{'\n'}
      {'      '}selection:{'\n'}
      {'        '}candidates: [local, provider-a/gpu, provider-b/gpu]{'\n'}
      {'        '}require_output_quality_check: <span className="s">true</span>
    </>
  ),
};

const features = [
  { icon: <Search size={18} />, title: 'Capability registry', body: 'Find compute by model size, framework, precision, region, queue and price, with when each fact was last checked.' },
  { icon: <GitBranch size={18} />, title: 'Workflows across families', body: 'Compose AI, quantum and neuroscience steps in one graph, each with its own typed contract.' },
  { icon: <ShieldCheck size={18} />, title: 'Explained compatibility', body: 'Compatible, with warnings, conditional, incompatible or unknown, always with the reason. Unknown is never treated as yes.' },
  { icon: <Receipt size={18} />, title: 'Honest cost', body: 'Provider billing units, quotes and estimates kept apart. An unknown price is never shown as zero.' },
  { icon: <FileCheck2 size={18} />, title: 'Provenance by default', body: 'Checksums, versions, backend and job IDs, costs and outputs recorded for every run.' },
  { icon: <Boxes size={18} />, title: 'Your accounts, your data', body: 'Bring your own provider accounts and storage. Billing stays with the provider.' },
];

const roadmap = [
  { when: 'Now', c: 'var(--sindoor)', now: true, title: 'Validation', body: 'Interviews with researchers and providers, a dated competitor review, and this public prototype.' },
  { when: 'Next', c: 'var(--haldi)', title: 'Open-source core', body: 'Python SDK, CLI, schemas, local runner, compatibility checks, estimates and provenance. One GPU provider end to end.' },
  { when: 'Then', c: 'var(--jamun)', title: 'Quantum and a second provider', body: 'Simulator, then one quantum provider adapter, and a second independent AI endpoint.' },
  { when: 'Research', c: 'var(--mor)', title: 'Neuroscience workbench', body: 'Offline MEA analysis on licensed datasets, then replay. Live hardware only with a lab partner.' },
];

const faq = [
  { q: 'Is the workbench on this site real?', a: 'It is a simulation that follows the product’s rules. The providers are placeholders, prices are illustrative and no real system is contacted. The open-source SDK is the next milestone.' },
  { q: 'Can I run any program on any chip?', a: 'No, and we won’t claim it. Fabric unifies discovery, workflows, cost and records. Each family keeps its own execution contract, and every compatibility decision comes with a reason.' },
  { q: 'Is nobody else doing this in India?', a: 'There are GPU clouds and marketplaces in India and quantum platforms here and abroad. What we’re testing is narrower: an open, vendor-neutral layer that connects them into one research workflow without locking you in.' },
  { q: 'Do you resell compute?', a: 'Not in the first release. You connect your own provider accounts and pay providers directly. Fabric shows estimates, billing units and actual charges where providers report them.' },
  { q: 'How do you handle organoid experiments?', a: 'We start with public and user-provided recordings and offline analysis. Live experiments need a lab partner, institutional approvals, device-specific safety limits and human sign-off. Fabric never issues unbounded stimulation commands.' },
  { q: 'Will it be open source?', a: 'Yes. The SDK, adapter interface and schemas are planned as open source, likely under Apache-2.0, after a dependency and licence review.' },
];

export default function HomePage() {
  const { openContact } = useOutletContext();
  const [tab, setTab] = useState('Python');

  return (
    <>
      {/* ── Hero ── */}
      <section className="wrap hero">
        <div>
          <div className="kicker">वितर्क <span>vitarka, Sanskrit for applied reasoning</span></div>
          <h1 className="display">One line of thought, across every kind of compute.</h1>
          <p className="lede">
            Vitarka Fabric is an open research layer for AI accelerators, quantum systems and neuroscience labs.
            Describe a workflow once, see what can run each step and what it costs, then run it with a record you can reproduce.
          </p>
          <div className="hero-ctas">
            <a className="btn btn-ember" href="#workbench">Try the workbench <ArrowRight size={16} /></a>
            <Link className="btn btn-ghost" to="/platform">How it works</Link>
          </div>
        </div>
        <HeroOrbit />
      </section>

      <div className="wrap">
        <div className="facts">
          <div><b>1</b><span>research interface</span></div>
          <div><b>3</b><span>compute families</span></div>
          <div><b>5</b><span>compatibility verdicts, each explained</span></div>
          <div><b>0</b><span>prices assumed when unknown</span></div>
        </div>
      </div>

      {/* ── Problem ── */}
      <section className="section">
        <div className="wrap">
          <div className="section-head">
            <h2 className="h2">Every system speaks its own language.</h2>
            <p className="body">
              A single research project can touch a GPU cloud, a quantum queue and a lab’s recording rig.
              Each has its own SDK, account, pricing and data format, and the glue between them is usually a folder of scripts.
            </p>
          </div>
          <div className="glass" style={{ overflowX: 'auto' }}>
            <table className="matrix friction">
              <thead>
                <tr>
                  <th />
                  <th style={{ color: 'var(--haldi)' }}>AI accelerators</th>
                  <th style={{ color: 'var(--jamun)' }}>Quantum systems</th>
                  <th style={{ color: 'var(--mor)' }}>Organoids and MEAs</th>
                </tr>
              </thead>
              <tbody>
                {friction.map((r) => (
                  <tr key={r.row}>
                    <th scope="row">{r.row}</th>
                    <td>{r.accel}</td><td>{r.quantum}</td><td>{r.bio}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ── Families ── */}
      <section className="section">
        <div className="wrap">
          <div className="section-head">
            <h2 className="h2">Three families of compute. One shared core.</h2>
            <p className="body">
              Each family gets its own adapter and workload contract, released in stages.
              The colours follow Indian pigments: haldi, jamun, mor and neel.
            </p>
          </div>
          <div className="chips">
            {families.map((f) => (
              <article key={f.id} className="glass chip-card" style={{ '--c': f.color, '--soft': f.soft }}>
                <div className="chip-card-top">
                  <div>
                    <div className="chip-short">{f.stage}</div>
                    <h3>{f.name}</h3>
                    <div className="pigment">{f.pigment}</div>
                  </div>
                  <ChipGlyph id={f.glyph} color={f.color} size={76} />
                </div>
                <p className="body">{f.body}</p>
                <div className="pills">{f.pills.map((p) => <span className="pill" key={p}>{p}</span>)}</div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── Principle ── */}
      <section className="section">
        <div className="wrap">
          <div className="section-head solo">
            <h2 className="h2">Shared interfaces. Different physics.</h2>
            <p className="body">
              You can switch providers and compose workflows across families. What Fabric won’t do is pretend all hardware is interchangeable.
            </p>
          </div>
          <div className="limits">
            {rules.map((r, i) => (
              <div key={r.title} className="glass" style={{ borderTop: `2px solid ${['var(--haldi)', 'var(--jamun)', 'var(--mor)'][i]}` }}>
                <h3 className="h3">{r.title}</h3>
                <p className="body">{r.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Workbench ── */}
      <section className="section" id="workbench" style={{ scrollMarginTop: 72 }}>
        <div className="wrap">
          <div className="section-head">
            <h2 className="h2">Plan it, check it, run it.</h2>
            <p className="body">
              Pick a workflow. Hover a backend to see its verdict and why. Approve the plan, run it, and switch backends mid-run where the step allows it.
            </p>
          </div>
          <FabricConsole />
        </div>
      </section>

      {/* ── Use cases ── */}
      <section className="section">
        <div className="wrap">
          <div className="section-head">
            <h2 className="h2">Built for real research workflows.</h2>
            <p className="body">These are the first workflows we are validating with researchers. Each one crosses at least one boundary that costs teams time today.</p>
          </div>
          <div className="cases">
            {cases.map((c) => (
              <div key={c.title} className="case">
                <span className="case-icon">{c.icon}</span>
                <h3 className="h3">{c.title}</h3>
                <p>{c.body}</p>
                <div className="route">
                  {c.route.map(([label, soft, color], i) => (
                    <span key={label} style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                      {i > 0 && '→'}
                      <b style={{ '--c': color, '--soft': soft }}>{label}</b>
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Developers ── */}
      <section className="section">
        <div className="wrap dev">
          <div className="glass code-card">
            <div className="code-tabs" role="tablist" aria-label="Example">
              {Object.keys(CODE).map((k) => (
                <button key={k} role="tab" aria-selected={tab === k} className="code-tab" onClick={() => setTab(k)}>{k}</button>
              ))}
              <span className="small" style={{ marginLeft: 'auto', alignSelf: 'center' }}>Design sketch; API may change</span>
            </div>
            <pre className="code-body">{CODE[tab]}</pre>
          </div>
          <div>
            <h2 className="h2">Open source, from the SDK down.</h2>
            <p className="body" style={{ marginTop: 18 }}>
              The SDK, adapter interface and schemas will be open. Providers plug in through a tested adapter contract; researchers keep their own accounts and data.
            </p>
            <ul className="feature-list">
              {features.map((f) => (
                <li key={f.title}>{f.icon}<div><b>{f.title}</b><p>{f.body}</p></div></li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ── Built on ── */}
      <section className="section">
        <div className="wrap">
          <div className="section-head">
            <h2 className="h2">Built on tools that already work.</h2>
            <p className="body">We connect proven open tools rather than rewrite them. Fabric adds the shared registry, workflow, cost view and record around them.</p>
          </div>
          <div className="built-on">
            {[
              ['vLLM · SGLang', 'Serving models on GPUs and TPUs'],
              ['PyTorch · JAX', 'Training and inference frameworks'],
              ['Qiskit', 'Building and compiling circuits'],
              ['SpikeInterface', 'Standard MEA formats and sorters'],
              ['Kilosort4', 'Established spike sorting'],
              ['MEA-NAP', 'Organoid network analysis'],
              ['NWB', 'Neurophysiology data standard'],
              ['OpenTelemetry', 'Traces, metrics and logs'],
            ].map(([n, d]) => (
              <div key={n}><b>{n}</b><span>{d}</span></div>
            ))}
          </div>
          <p className="small" style={{ marginTop: 16 }}>Named as integration candidates. No endorsement or partnership is implied.</p>
        </div>
      </section>

      {/* ── Roadmap ── */}
      <section className="section">
        <div className="wrap">
          <div className="section-head">
            <h2 className="h2">Where we are, honestly.</h2>
            <p className="body">We are validating before we scale. Each stage ships only when the one before it works end to end.</p>
          </div>
          <div className="roadmap">
            {roadmap.map((m) => (
              <div key={m.title} className={`milestone ${m.now ? 'now' : ''}`} style={{ '--c': m.c }}>
                <div className="when">{m.when}</div>
                <h3 className="h3" style={{ marginTop: 6 }}>{m.title}</h3>
                <p>{m.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="section">
        <div className="wrap" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 0.8fr) minmax(0, 1.2fr)', gap: 48 }} >
          <h2 className="h2 faq-title">Questions we get asked.</h2>
          <div className="faq">
            {faq.map((f) => (
              <details key={f.q}>
                <summary>{f.q}</summary>
                <p>{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="wrap">
        <div className="cta-panel">
          <div className="cta-deva">तर्क से प्रयोग तक</div>
          <h2 className="h2">Bring us a workflow that hurts.</h2>
          <p className="body">
            We’re looking for researchers, developers and compute providers to shape the first release.
            Tell us about a real job: which systems, where it broke, what it cost.
          </p>
          <button className="btn btn-ember" onClick={openContact}>Become a design partner</button>
        </div>
      </section>
    </>
  );
}
