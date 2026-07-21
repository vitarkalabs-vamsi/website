import React from "react";
import { useCurrentFrame, interpolate, spring, useVideoConfig, Easing } from "remotion";
import { COLORS } from "../constants";
import { MONO, SANS, SERIF } from "../fonts";

const CARDS = [
  { num: "§ 01", title: "AI & Generative Systems",  desc: "Practical AI products, agentic workflows, and inference systems engineered for deployment." },
  { num: "§ 02", title: "Software Products",         desc: "Modern web platforms, internal tooling, and SaaS — built to ship, scale, and stay maintainable." },
  { num: "§ 03", title: "Embedded & Edge",           desc: "Firmware, on-device inference, and connected hardware at the silicon-to-cloud boundary." },
  { num: "§ 04", title: "IoT & Sensing",             desc: "Multi-modal sensor fusion, telemetry pipelines, and decision systems in physical signal." },
  { num: "§ 05", title: "Acoustic & RF Systems",     desc: "Signal-domain POCs — MFCC pipelines, GCC-PHAT bearing math, RF energy gating, edge classifiers." },
  { num: "§ 06", title: "Productivity Tooling",      desc: "Software that removes operational friction — internal dashboards, automation, decision aids." },
];

function Card({ card, delay }: { card: typeof CARDS[0]; delay: number }) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const y = spring({ frame: frame - delay, fps, config: { damping: 20, stiffness: 180 }, from: 40, to: 0 });
  const opacity = interpolate(frame - delay, [0, 15], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <div
      style={{
        opacity,
        transform: `translateY(${y}px)`,
        background: "#EFE9D8",
        border: `1px solid ${COLORS.rule}`,
        padding: "28px 24px",
      }}
    >
      <div style={{ fontFamily: MONO, fontSize: 11, letterSpacing: "0.2em", color: COLORS.muted, marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
        {card.num}
        <span style={{ flex: 1, height: 1, background: COLORS.rule }} />
      </div>
      <div style={{ fontFamily: SERIF, fontSize: 22, fontWeight: 500, color: COLORS.ink, marginBottom: 10, letterSpacing: "-0.01em", lineHeight: 1.2 }}>
        {card.title}
      </div>
      <div style={{ fontFamily: SANS, fontSize: 14, lineHeight: 1.65, color: COLORS.muted }}>
        {card.desc}
      </div>
    </div>
  );
}

export const Expertise: React.FC = () => {
  const frame = useCurrentFrame();

  const labelOpacity = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" });
  const headOpacity  = interpolate(frame, [10, 35], [0, 1], { extrapolateRight: "clamp" });
  const headY        = interpolate(frame, [10, 40], [20, 0], { extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        background: COLORS.paper,
        padding: "72px 100px",
        boxSizing: "border-box",
        fontFamily: SANS,
      }}
    >
      <div style={{ opacity: labelOpacity, fontFamily: MONO, fontSize: 13, letterSpacing: "0.22em", textTransform: "uppercase", color: COLORS.olive, display: "flex", alignItems: "center", gap: 14, marginBottom: 20 }}>
        <span style={{ width: 28, height: 1, background: COLORS.olive, display: "inline-block" }} />
        Practice Areas
      </div>

      <div style={{ opacity: headOpacity, transform: `translateY(${headY}px)`, fontFamily: SERIF, fontSize: 52, fontWeight: 400, color: COLORS.ink, letterSpacing: "-0.02em", lineHeight: 1.05, marginBottom: 48 }}>
        Six disciplines, <em style={{ fontStyle: "italic", fontWeight: 300, color: COLORS.olive }}>one execution standard.</em>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 1, background: COLORS.rule, border: `1px solid ${COLORS.rule}` }}>
        {CARDS.map((card, i) => (
          <Card key={card.num} card={card} delay={20 + i * 8} />
        ))}
      </div>
    </div>
  );
};
