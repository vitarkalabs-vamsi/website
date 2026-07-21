import React from "react";
import { useCurrentFrame, interpolate, spring, useVideoConfig, Easing } from "remotion";
import { COLORS } from "../constants";
import { MONO, SANS, SERIF } from "../fonts";
import { VitarkaMark } from "../VitarkaMark";

export const CTA: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const bgOpacity   = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" });
  const logoScale   = spring({ frame: frame - 5, fps, config: { damping: 14, stiffness: 120 }, from: 0.5, to: 1 });
  const logoOpacity = interpolate(frame, [5, 25], [0, 1], { extrapolateRight: "clamp" });

  const headY    = interpolate(frame, [20, 50], [30, 0], { extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
  const headOpacity = interpolate(frame, [20, 45], [0, 1], { extrapolateRight: "clamp" });

  const subOpacity  = interpolate(frame, [40, 60], [0, 1], { extrapolateRight: "clamp" });
  const btnOpacity  = interpolate(frame, [55, 75], [0, 1], { extrapolateRight: "clamp" });
  const btnY        = interpolate(frame, [55, 75], [15, 0], { extrapolateRight: "clamp", easing: Easing.out(Easing.quad) });

  const lineWidth   = interpolate(frame, [30, 65], [0, 240], { extrapolateRight: "clamp", easing: Easing.out(Easing.quad) });

  const channels = [
    { label: "Email",   value: "hello@vitarkalabs.com" },
    { label: "Partner", value: "Strategic introductions welcome" },
    { label: "POC",     value: "Pilot collaboration · briefing available" },
  ];

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        background: COLORS.ink,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: SANS,
        position: "relative",
        overflow: "hidden",
        opacity: bgOpacity,
      }}
    >
      {/* decorative circles */}
      <div style={{ position: "absolute", right: -180, bottom: -180, width: 600, height: 600, border: `1px solid ${COLORS.olive}`, borderRadius: "50%", opacity: 0.25 }} />
      <div style={{ position: "absolute", right: -60, bottom: -60, width: 300, height: 300, border: `1px solid ${COLORS.signal}`, borderRadius: "50%", opacity: 0.2 }} />

      {/* grid */}
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: `linear-gradient(rgba(242,238,226,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(242,238,226,0.03) 1px, transparent 1px)`,
        backgroundSize: "60px 60px",
      }} />

      <div style={{ position: "relative", zIndex: 1, textAlign: "center", maxWidth: 900 }}>
        {/* logo */}
        <div style={{ opacity: logoOpacity, transform: `scale(${logoScale})`, marginBottom: 32, display: "flex", justifyContent: "center" }}>
          <VitarkaMark size={80} color={COLORS.paper} />
        </div>

        {/* rule */}
        <div style={{ width: lineWidth, height: 1, background: COLORS.paper, margin: "0 auto 28px", opacity: 0.4 }} />

        {/* headline */}
        <div
          style={{
            opacity: headOpacity,
            transform: `translateY(${headY}px)`,
            fontFamily: SERIF,
            fontSize: 64,
            fontWeight: 400,
            color: COLORS.paper,
            letterSpacing: "-0.025em",
            lineHeight: 1.05,
            marginBottom: 24,
          }}
        >
          Bring the idea, the challenge,
          <br />
          or the{" "}
          <em style={{ fontStyle: "italic", fontWeight: 300, color: COLORS.signalWarm }}>
            product direction.
          </em>
        </div>

        {/* sub */}
        <p style={{
          opacity: subOpacity,
          fontFamily: SANS,
          fontSize: 18,
          lineHeight: 1.65,
          color: "rgba(242,238,226,0.65)",
          maxWidth: 640,
          margin: "0 auto 40px",
        }}>
          Vitarka Labs is open to software work, AI initiatives, embedded solutions,
          IoT concepts, and strategic collaborations across industry and research.
        </p>

        {/* contact channels */}
        <div style={{ opacity: btnOpacity, transform: `translateY(${btnY}px)` }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 0, marginBottom: 40, border: `1px solid rgba(242,238,226,0.15)`, maxWidth: 560, margin: "0 auto 40px" }}>
            {channels.map((c, i) => (
              <div key={c.label} style={{ display: "flex", alignItems: "center", gap: 16, padding: "14px 24px", borderBottom: i < channels.length - 1 ? "1px solid rgba(242,238,226,0.1)" : "none", width: "100%", boxSizing: "border-box" }}>
                <div style={{ fontFamily: MONO, fontSize: 10, letterSpacing: "0.16em", textTransform: "uppercase", color: "rgba(242,238,226,0.4)", width: 70, flexShrink: 0 }}>{c.label}</div>
                <div style={{ fontFamily: SANS, fontSize: 14, color: "rgba(242,238,226,0.8)" }}>{c.value}</div>
              </div>
            ))}
          </div>

          {/* CTA buttons */}
          <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
            <div style={{ padding: "14px 28px", background: COLORS.paper, color: COLORS.ink, fontFamily: SANS, fontSize: 15, fontWeight: 500, letterSpacing: "0.01em", border: `1px solid ${COLORS.paper}` }}>
              Start a Conversation →
            </div>
            <div style={{ padding: "14px 28px", background: "transparent", color: COLORS.paper, fontFamily: SANS, fontSize: 15, fontWeight: 400, border: "1px solid rgba(242,238,226,0.35)" }}>
              Send a Brief
            </div>
          </div>
        </div>

        {/* footer */}
        <div style={{ position: "absolute", bottom: 36, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
          <div style={{ fontFamily: MONO, fontSize: 12, letterSpacing: "0.2em", color: "rgba(242,238,226,0.3)", textTransform: "uppercase", opacity: subOpacity }}>
            vitarkalabs.com · AI · SOFTWARE · EMBEDDED · IOT · PoC
          </div>
        </div>
      </div>
    </div>
  );
};
