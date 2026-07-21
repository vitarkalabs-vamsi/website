import React from "react";
import { useCurrentFrame, interpolate, spring, useVideoConfig, Easing } from "remotion";
import { COLORS } from "../constants";
import { MONO, SANS, SERIF } from "../fonts";

const METRICS = [
  { name: "FPR",     value: "< 5%",    label: "False positive rate in dynamic ambient" },
  { name: "RECALL",  value: "> 90%",   label: "Detection probability up to 150 m" },
  { name: "BEARING", value: "± 10°",   label: "Sector resolution via 4-mic GCC-PHAT" },
  { name: "LATENCY", value: "< 1.5s",  label: "Acoustic breach to dashboard visualisation" },
  { name: "POWER",   value: "< 500mW", label: "Average draw with Tier 0 sleep gating" },
];

const LAYERS = [
  { id: "A", name: "Node Layer",     chips: ["4× INMP441", "ESP32-S3", "AD8317", "SX1276 LoRa"] },
  { id: "B", name: "Compute Layer",  chips: ["Tier 0 — Spectral Baseline", "Tier 1 — MFCC + 1D-CNN", "Tier 2 — GCC-PHAT"] },
  { id: "C", name: "Network Layer",  chips: ["AES-128-CTR", "HMAC-SHA256", "18-byte Payload", "Replay Window"] },
  { id: "D", name: "Dashboard",      chips: ["LoRa → MQTT", "Next.js / SOLR", "Confidence Map", "Health Monitor"] },
];

function MetricCell({ metric, delay }: { metric: typeof METRICS[0]; delay: number }) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const opacity = interpolate(frame - delay, [0, 15], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const y = spring({ frame: frame - delay, fps, config: { damping: 18, stiffness: 200 }, from: 20, to: 0 });

  return (
    <div style={{ opacity, transform: `translateY(${y}px)`, background: COLORS.carbon2, padding: "22px 18px" }}>
      <div style={{ fontFamily: MONO, fontSize: 11, letterSpacing: "0.2em", color: COLORS.textDim, marginBottom: 12 }}>{metric.name}</div>
      <div style={{ fontFamily: SERIF, fontSize: 36, fontWeight: 500, color: COLORS.phosphor, letterSpacing: "-0.015em", lineHeight: 1, marginBottom: 10 }}>{metric.value}</div>
      <div style={{ fontFamily: SANS, fontSize: 13, color: COLORS.textD, lineHeight: 1.55 }}>{metric.label}</div>
    </div>
  );
}

function LayerRow({ layer, delay }: { layer: typeof LAYERS[0]; delay: number }) {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame - delay, [0, 18], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const x = interpolate(frame - delay, [0, 20], [-30, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.quad) });

  return (
    <div style={{ opacity, transform: `translateX(${x}px)`, display: "flex", borderBottom: `1px solid ${COLORS.ruleD}` }}>
      <div style={{ width: 140, minWidth: 140, padding: "18px 16px", borderRight: `1px solid ${COLORS.ruleD}`, background: "rgba(111,176,136,0.025)" }}>
        <div style={{ fontFamily: MONO, fontSize: 10, letterSpacing: "0.18em", color: COLORS.phosphor, marginBottom: 6 }}>LAYER {layer.id}</div>
        <div style={{ fontFamily: SERIF, fontSize: 17, fontWeight: 500, color: "#F2EEE2", lineHeight: 1.15 }}>{layer.name}</div>
      </div>
      <div style={{ display: "flex", gap: 8, padding: "14px 16px", flexWrap: "wrap", alignItems: "center", flex: 1 }}>
        {layer.chips.map((chip) => (
          <div key={chip} style={{ padding: "5px 11px", border: `1px solid ${COLORS.ruleD}`, fontFamily: MONO, fontSize: 11, color: COLORS.textD, background: COLORS.carbon }}>
            {chip}
          </div>
        ))}
      </div>
    </div>
  );
}

export const ARCNode: React.FC = () => {
  const frame = useCurrentFrame();

  const labelOpacity = interpolate(frame, [0, 18], [0, 1], { extrapolateRight: "clamp" });
  const headOpacity  = interpolate(frame, [8, 30], [0, 1], { extrapolateRight: "clamp" });
  const headY        = interpolate(frame, [8, 35], [16, 0], { extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });

  const statusDotOpacity = Math.sin(frame * 0.15) * 0.5 + 0.5;

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        background: COLORS.carbon,
        padding: "60px 100px",
        boxSizing: "border-box",
        fontFamily: SANS,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* phosphor top rule */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1, background: `linear-gradient(90deg, transparent, ${COLORS.phosphor}, transparent)`, opacity: 0.4 }} />

      {/* grid bg */}
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: `linear-gradient(${COLORS.ruleD} 1px, transparent 1px), linear-gradient(90deg, ${COLORS.ruleD} 1px, transparent 1px)`,
        backgroundSize: "48px 48px",
        opacity: 0.4,
      }} />

      <div style={{ position: "relative", zIndex: 1 }}>
        {/* header row */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 28 }}>
          <div>
            <div style={{ opacity: labelOpacity, fontFamily: MONO, fontSize: 13, letterSpacing: "0.22em", textTransform: "uppercase", color: COLORS.phosphor, display: "flex", alignItems: "center", gap: 14, marginBottom: 14 }}>
              <span style={{ width: 28, height: 1, background: COLORS.phosphor, display: "inline-block" }} />
              ARC-Node / PoC 1
            </div>
            <div style={{ opacity: headOpacity, transform: `translateY(${headY}px)`, fontFamily: SERIF, fontSize: 50, fontWeight: 400, color: "#F2EEE2", letterSpacing: "-0.025em", lineHeight: 1 }}>
              Acoustic · RF · <em style={{ fontStyle: "italic", fontWeight: 300, color: COLORS.phosphor }}>Edge-AI</em>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "7px 14px", border: `1px solid rgba(111,176,136,0.3)`, background: "rgba(111,176,136,0.06)", fontFamily: MONO, fontSize: 11, letterSpacing: "0.16em", color: COLORS.phosphor, textTransform: "uppercase" }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: COLORS.phosphor, boxShadow: `0 0 8px ${COLORS.phosphor}`, opacity: statusDotOpacity }} />
            System Active
          </div>
        </div>

        {/* metrics */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 1, background: COLORS.ruleD, border: `1px solid ${COLORS.ruleD}`, marginBottom: 20 }}>
          {METRICS.map((m, i) => <MetricCell key={m.name} metric={m} delay={25 + i * 6} />)}
        </div>

        {/* architecture */}
        <div style={{ border: `1px solid ${COLORS.ruleD}`, background: COLORS.carbon2 }}>
          <div style={{ padding: "12px 16px", background: "rgba(111,176,136,0.04)", borderBottom: `1px solid ${COLORS.ruleD}`, fontFamily: MONO, fontSize: 11, letterSpacing: "0.18em", color: COLORS.phosphor }}>
            SYSTEM ARCHITECTURE
          </div>
          {LAYERS.map((layer, i) => (
            <LayerRow key={layer.id} layer={layer} delay={55 + i * 10} />
          ))}
        </div>
      </div>
    </div>
  );
};
