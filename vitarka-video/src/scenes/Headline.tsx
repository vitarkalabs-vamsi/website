import React from "react";
import { useCurrentFrame, useVideoConfig, interpolate, spring, Easing } from "remotion";
import { COLORS } from "../constants";
import { MONO, SANS, SERIF } from "../fonts";

const WORDS_LINE1 = ["A", "modern", "firm", "for"];
const WORDS_LINE2 = ["software,", "AI,", "embedded"];
const WORDS_LINE3 = ["systems", "&", "product", "innovation."];

function AnimatedWord({
  word,
  delay,
  italic = false,
  accent = false,
}: {
  word: string;
  delay: number;
  italic?: boolean;
  accent?: boolean;
}) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const y = spring({
    frame: frame - delay,
    fps,
    config: { damping: 18, stiffness: 200 },
    from: 60,
    to: 0,
  });
  const opacity = interpolate(frame - delay, [0, 12], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <span
      style={{
        display: "inline-block",
        transform: `translateY(${y}px)`,
        opacity,
        fontStyle: italic ? "italic" : "normal",
        fontWeight: italic ? 300 : 400,
        color: accent ? COLORS.olive : COLORS.ink,
        marginRight: "0.22em",
      }}
    >
      {word}
    </span>
  );
}

export const Headline: React.FC = () => {
  const frame = useCurrentFrame();

  const labelOpacity = interpolate(frame, [5, 25], [0, 1], { extrapolateRight: "clamp" });
  const subOpacity   = interpolate(frame, [55, 75], [0, 1], { extrapolateRight: "clamp" });
  const pillOpacity  = interpolate(frame, [65, 85], [0, 1], { extrapolateRight: "clamp" });

  const allWords = [
    ...WORDS_LINE1.map((w, i) => ({ word: w, delay: 8 + i * 4 })),
    ...WORDS_LINE2.map((w, i) => ({ word: w, delay: 22 + i * 5, italic: true, accent: true })),
    ...WORDS_LINE3.map((w, i) => ({ word: w, delay: 38 + i * 4 })),
  ];

  const pills = ["AI / GenAI", "Software", "Embedded", "IoT · Sensing", "Sensor POC"];

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        background: COLORS.paper,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "0 160px",
        boxSizing: "border-box",
        fontFamily: SANS,
      }}
    >
      <div style={{ maxWidth: 1280, width: "100%" }}>
        {/* label */}
        <div
          style={{
            opacity: labelOpacity,
            fontFamily: MONO,
            fontSize: 14,
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color: COLORS.olive,
            display: "flex",
            alignItems: "center",
            gap: 14,
            marginBottom: 36,
          }}
        >
          <span style={{ display: "inline-block", width: 32, height: 1, background: COLORS.olive }} />
          Engineering Practice / Est. 2025
        </div>

        {/* headline */}
        <div
          style={{
            fontFamily: SERIF,
            fontSize: 96,
            lineHeight: 1.0,
            letterSpacing: "-0.025em",
            color: COLORS.ink,
            overflow: "hidden",
          }}
        >
          <div>
            {WORDS_LINE1.map((w, i) => (
              <AnimatedWord key={i} word={w} delay={8 + i * 4} />
            ))}
          </div>
          <div>
            {WORDS_LINE2.map((w, i) => (
              <AnimatedWord key={i} word={w} delay={22 + i * 5} italic accent />
            ))}
          </div>
          <div>
            {WORDS_LINE3.map((w, i) => (
              <AnimatedWord key={i} word={w} delay={38 + i * 4} />
            ))}
          </div>
        </div>

        {/* sub copy */}
        <p
          style={{
            opacity: subOpacity,
            fontFamily: SANS,
            fontSize: 22,
            lineHeight: 1.65,
            color: COLORS.muted,
            maxWidth: 680,
            marginTop: 36,
            marginBottom: 36,
          }}
        >
          Vitarka Labs builds useful technology across multiple fields — from production AI
          products and SaaS to sensor systems engineered for real deployment.
        </p>

        {/* tag pills */}
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", opacity: pillOpacity }}>
          {pills.map((p, i) => (
            <span
              key={p}
              style={{
                fontFamily: MONO,
                fontSize: 13,
                letterSpacing: "0.16em",
                textTransform: "uppercase",
                padding: "6px 14px",
                border: `1px solid ${i === pills.length - 1 ? COLORS.signal : COLORS.rule}`,
                color: i === pills.length - 1 ? COLORS.signal : COLORS.ink,
                background: "rgba(255,255,255,0.4)",
              }}
            >
              {p}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};
