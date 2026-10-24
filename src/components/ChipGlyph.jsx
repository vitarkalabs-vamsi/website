// A drawn die for each processor type. The pattern inside says what the chip is made of:
// a core grid (NPU), a systolic mesh (TPU), a coupled qubit lattice (QPU), a neuron cluster (OPU).

function Pins({ size, color }) {
  const pins = [];
  const n = 5, step = size / (n + 1);
  for (let i = 1; i <= n; i++) {
    const p = i * step;
    pins.push(<rect key={`t${i}`} x={p - 1.5} y={-6} width={3} height={6} rx={1} fill={color} />);
    pins.push(<rect key={`b${i}`} x={p - 1.5} y={size} width={3} height={6} rx={1} fill={color} />);
    pins.push(<rect key={`l${i}`} x={-6} y={p - 1.5} width={6} height={3} rx={1} fill={color} />);
    pins.push(<rect key={`r${i}`} x={size} y={p - 1.5} width={6} height={3} rx={1} fill={color} />);
  }
  return <g opacity="0.7">{pins}</g>;
}

function Pattern({ id, color }) {
  if (id === 'npu') {
    const cells = [];
    for (let r = 0; r < 4; r++) for (let c = 0; c < 4; c++) {
      cells.push(<rect key={`${r}${c}`} x={14 + c * 13} y={14 + r * 13} width={10} height={10} rx={2} fill={color} opacity={(r + c) % 3 === 0 ? 0.95 : 0.35} />);
    }
    return <g>{cells}</g>;
  }
  if (id === 'tpu') {
    const lines = [];
    for (let i = 0; i < 5; i++) {
      lines.push(<line key={`h${i}`} x1={14} y1={16 + i * 12} x2={66} y2={16 + i * 12} stroke={color} strokeWidth={1.2} opacity={0.5} />);
      lines.push(<line key={`v${i}`} x1={16 + i * 12} y1={14} x2={16 + i * 12} y2={66} stroke={color} strokeWidth={1.2} opacity={0.5} />);
    }
    const dots = [];
    for (let r = 0; r < 5; r++) for (let c = 0; c < 5; c++) dots.push(<circle key={`${r}${c}`} cx={16 + c * 12} cy={16 + r * 12} r={2.2} fill={color} />);
    return <g>{lines}{dots}</g>;
  }
  if (id === 'qpu') {
    const pts = [[40, 18], [60, 30], [60, 52], [40, 64], [20, 52], [20, 30], [40, 41]];
    const edges = [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 0], [6, 0], [6, 2], [6, 4]];
    return (
      <g>
        {edges.map(([a, b]) => <line key={`${a}${b}`} x1={pts[a][0]} y1={pts[a][1]} x2={pts[b][0]} y2={pts[b][1]} stroke={color} strokeWidth={1.4} opacity={0.55} />)}
        {pts.map(([x, y], i) => <g key={i}><circle cx={x} cy={y} r={6} fill="none" stroke={color} strokeWidth={1.4} /><circle cx={x} cy={y} r={2.2} fill={color} /></g>)}
      </g>
    );
  }
  const n = [[28, 26], [52, 22], [58, 46], [36, 56], [22, 44], [44, 38]];
  return (
    <g>
      <path d="M28 26 C38 20,46 30,52 22 M52 22 C60 30,54 40,58 46 M58 46 C48 50,44 60,36 56 M36 56 C30 50,24 52,22 44 M22 44 C26 36,22 32,28 26 M44 38 C40 30,32 34,28 26 M44 38 C50 40,54 44,58 46 M44 38 C40 46,38 50,36 56" fill="none" stroke={color} strokeWidth={1.4} opacity={0.6} />
      {n.map(([x, y], i) => <circle key={i} cx={x} cy={y} r={i === 5 ? 5 : 3.6} fill={color} opacity={i === 5 ? 1 : 0.8} />)}
    </g>
  );
}

export default function ChipGlyph({ id, color, size = 80 }) {
  return (
    <svg width={size} height={size} viewBox="-8 -8 96 96" aria-hidden="true" style={{ filter: `drop-shadow(0 0 18px ${color})`, overflow: 'visible' }}>
      <Pins size={80} color={color} />
      <rect className="die" x={0} y={0} width={80} height={80} rx={12} fill="#14110F" stroke={color} strokeWidth={1.4} />
      <rect x={6} y={6} width={68} height={68} rx={8} fill="none" stroke={color} strokeOpacity={0.2} />
      <Pattern id={id} color={color} />
    </svg>
  );
}

export { Pattern as ChipPattern };
