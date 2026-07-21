import React from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Easing,
} from "remotion";
import { COLORS, FONTS } from "../constants";
import { VitarkaMark } from "../VitarkaMark";
import { MONO, SANS, SERIF } from "../fonts";

export const LogoReveal: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const boxScale = spring({ frame, fps, config: { damping: 14, stiffness: 120 }, from: 0, to: 1 });

  const logoOpacity = interpolate(frame, [15, 35], [0, 1], { extrapolateRight: "clamp" });
  const logoY       = interpolate(frame, [15, 45], [30, 0], { extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });

  const nameOpacity = interpolate(frame, [30, 55], [0, 1], { extrapolateRight: "clamp" });
  const tagOpacity  = interpolate(frame, [45, 65], [0, 1], { extrapolateRight: "clamp" });

  const lineWidth   = interpolate(frame, [50, 80], [0, 480], { extrapolateRight: "clamp", easing: Easing.out(Easing.quad) });
  const gridOpacity = interpolate(frame, [0, 30], [0, 0.06], { extrapolateRight: "clamp" });

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        background: COLORS.paper,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
        fontFamily: SANS,
      }}
    >
      {/* subtle grid */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: gridOpacity,
          backgroundImage: `linear-gradient(${COLORS.ink} 1px, transparent 1px), linear-gradient(90deg, ${COLORS.ink} 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />

      {/* corner labels */}
      {[
        { t: 40, l: 48, text: "VITARKA LABS / EST. 2025" },
        { t: 40, r: 48, text: "PRECISION · PERMANENCE" },
        { b: 40, l: 48, text: "AI · SOFTWARE · EMBEDDED · IOT" },
        { b: 40, r: 48, text: `© ${new Date().getFullYear()} · PUNE · IN` },
      ].map(({ t, l, r, b, text }, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            top: t,
            left: l,
            right: r,
            bottom: b,
            fontFamily: MONO,
            fontSize: 13,
            letterSpacing: "0.22em",
            color: COLORS.muted,
            opacity: tagOpacity * 0.7,
          }}
        >
          {text}
        </div>
      ))}

      {/* centre lockup */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 0 }}>
        <div style={{ opacity: logoOpacity, transform: `translateY(${logoY}px)`, marginBottom: 32 }}>
          <VitarkaMark size={120} color={COLORS.ink} />
        </div>

        <div
          style={{
            opacity: nameOpacity,
            fontFamily: SERIF,
            fontSize: 72,
            fontWeight: 400,
            letterSpacing: "-0.025em",
            color: COLORS.ink,
            lineHeight: 1,
          }}
        >
          Vitarka Labs
        </div>

        {/* rule line */}
        <div
          style={{
            width: lineWidth,
            height: 1,
            background: COLORS.ink,
            marginTop: 24,
            marginBottom: 20,
          }}
        />

        <div
          style={{
            opacity: tagOpacity,
            fontFamily: MONO,
            fontSize: 16,
            letterSpacing: "0.26em",
            color: COLORS.olive,
            textTransform: "uppercase",
          }}
        >
          Engineering Practice
        </div>
      </div>
    </div>
  );
};
