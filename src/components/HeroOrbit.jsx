import { useEffect, useState } from 'react';
import { ChipPattern } from './ChipGlyph';
import { BACKENDS } from '../lib/fabric';

const C = 300;
const R = 205;
const NODES = [
  { id: 'local', pattern: 'tpu', label: 'Local' },
  { id: 'gpuA', pattern: 'npu', label: 'GPU' },
  { id: 'tpu', pattern: 'tpu', label: 'TPU' },
  { id: 'qpu', pattern: 'qpu', label: 'QPU' },
  { id: 'mea', pattern: 'opu', label: 'MEA data' },
].map((n, i) => {
  const a = (-90 + i * 72) * (Math.PI / 180);
  return { ...n, x: C + R * Math.cos(a), y: C + R * Math.sin(a) };
});

// One illustrative research workflow, played across the systems it needs.
const SCRIPT = [
  { node: 'local', text: 'Validate model on your machine' },
  { node: 'gpuA', text: 'Benchmark inference on a GPU endpoint' },
  { node: 'tpu', text: 'Route the next requests to a TPU' },
  { node: 'qpu', text: 'Run 4,000 shots on a quantum processor' },
  { node: 'mea', text: 'Sort spikes in an organoid recording' },
];

export default function HeroOrbit() {
  const [i, setI] = useState(0);
  const [auto, setAuto] = useState(true);

  useEffect(() => {
    if (!auto) return undefined;
    const iv = setInterval(() => setI((x) => (x + 1) % SCRIPT.length), 2600);
    return () => clearInterval(iv);
  }, [auto]);

  const step = SCRIPT[i];
  const active = NODES.find((n) => n.id === step.node);
  const color = BACKENDS[step.node].color;
  const pick = (id) => { setAuto(false); setI(SCRIPT.findIndex((s) => s.node === id)); };

  return (
    <div className="orbit">
      <svg viewBox="0 0 600 600" role="img" aria-label={`Fabric routing a workflow step: ${step.text}`}>
        <defs>
          <radialGradient id="coreGlow">
            <stop offset="0%" stopColor="#E4572E" stopOpacity="0.55" />
            <stop offset="60%" stopColor="#F0A830" stopOpacity="0.12" />
            <stop offset="100%" stopColor="#F0A830" stopOpacity="0" />
          </radialGradient>
        </defs>

        <g className="ring-a">
          <circle cx={C} cy={C} r={R} fill="none" stroke="rgba(243,235,221,0.12)" strokeDasharray="2 8" />
        </g>
        <g className="ring-b">
          <circle cx={C} cy={C} r={R - 70} fill="none" stroke="rgba(243,235,221,0.07)" strokeDasharray="1 14" />
          <circle cx={C} cy={C - (R - 70)} r={3} fill="#F0A830" />
        </g>
        <circle cx={C} cy={C} r={R + 60} fill="none" stroke="rgba(243,235,221,0.04)" />

        {NODES.map((n) => (
          <line key={n.id} x1={C} y1={C} x2={n.x} y2={n.y} stroke="rgba(243,235,221,0.08)" />
        ))}
        <line className="beam" x1={C} y1={C} x2={active.x} y2={active.y} stroke={color} strokeWidth="2.2" style={{ filter: `drop-shadow(0 0 6px ${color})` }} />

        <circle className="core-glow" cx={C} cy={C} r={110} fill="url(#coreGlow)" />
        <circle cx={C} cy={C} r={58} fill="#14110F" stroke="rgba(243,235,221,0.22)" />
        <circle cx={C} cy={C} r={50} fill="none" stroke={color} strokeOpacity="0.5" style={{ transition: 'stroke 0.5s' }} />
        <text x={C} y={C - 4} textAnchor="middle" fill="#F3EBDD" fontFamily="Noto Serif Devanagari, serif" fontSize="22" fontWeight="700">वितर्क</text>
        <text x={C} y={C + 18} textAnchor="middle" fill="#807667" fontFamily="Geist Mono, monospace" fontSize="10" letterSpacing="1">FABRIC</text>

        {NODES.map((n) => {
          const b = BACKENDS[n.id];
          const on = n.id === step.node;
          return (
            <g
              key={n.id}
              className="orbit-node"
              role="button"
              tabIndex={0}
              aria-pressed={on}
              aria-label={`Show the ${n.label} step`}
              onClick={() => pick(n.id)}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); pick(n.id); } }}
            >
              <circle cx={n.x} cy={n.y} r={on ? 58 : 0} fill={b.color} opacity="0.12" style={{ transition: 'r 0.4s' }} />
              <rect className="die" x={n.x - 34} y={n.y - 34} width="68" height="68" rx="14" fill="#14110F" stroke={on ? b.color : 'rgba(243,235,221,0.16)'} strokeWidth={on ? 2 : 1} style={{ transition: 'stroke 0.4s', filter: on ? `drop-shadow(0 0 14px ${b.color})` : 'none' }} />
              <g transform={`translate(${n.x - 26} ${n.y - 26}) scale(0.65)`} opacity={on ? 1 : 0.45}>
                <ChipPattern id={n.pattern} color={b.color} />
              </g>
              <text x={n.x} y={n.y + 56} textAnchor="middle" fill={on ? '#F3EBDD' : '#807667'} fontFamily="Geist, sans-serif" fontSize="13" fontWeight="500">{n.label}</text>
            </g>
          );
        })}
      </svg>
      <div className="orbit-caption" style={{ '--c': color }} aria-live="polite">
        <i /> <span>Step {i + 1} of {SCRIPT.length}: {step.text}</span>
      </div>
    </div>
  );
}
