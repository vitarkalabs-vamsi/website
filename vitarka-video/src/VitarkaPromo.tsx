import React from "react";
import { AbsoluteFill, Sequence, useCurrentFrame, interpolate } from "remotion";
import { SCENES, TOTAL_FRAMES } from "./constants";
import { LogoReveal } from "./scenes/LogoReveal";
import { Headline } from "./scenes/Headline";
import { Expertise } from "./scenes/Expertise";
import { ARCNode } from "./scenes/ARCNode";
import { CTA } from "./scenes/CTA";

function SceneFade({ from, duration, children }: { from: number; duration: number; children: React.ReactNode }) {
  const frame = useCurrentFrame();
  const fadeIn  = interpolate(frame, [from, from + 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const fadeOut = interpolate(frame, [from + duration - 8, from + duration], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const opacity = Math.min(fadeIn, fadeOut);
  return <div style={{ position: "absolute", inset: 0, opacity }}>{children}</div>;
}

export const VitarkaPromo: React.FC = () => {
  return (
    <AbsoluteFill>
      <Sequence from={SCENES.LOGO_REVEAL.start}  durationInFrames={SCENES.LOGO_REVEAL.duration + 10}>
        <SceneFade from={SCENES.LOGO_REVEAL.start} duration={SCENES.LOGO_REVEAL.duration}>
          <LogoReveal />
        </SceneFade>
      </Sequence>

      <Sequence from={SCENES.HEADLINE.start} durationInFrames={SCENES.HEADLINE.duration + 10}>
        <SceneFade from={SCENES.HEADLINE.start} duration={SCENES.HEADLINE.duration}>
          <Headline />
        </SceneFade>
      </Sequence>

      <Sequence from={SCENES.EXPERTISE.start} durationInFrames={SCENES.EXPERTISE.duration + 10}>
        <SceneFade from={SCENES.EXPERTISE.start} duration={SCENES.EXPERTISE.duration}>
          <Expertise />
        </SceneFade>
      </Sequence>

      <Sequence from={SCENES.ARC_NODE.start} durationInFrames={SCENES.ARC_NODE.duration + 10}>
        <SceneFade from={SCENES.ARC_NODE.start} duration={SCENES.ARC_NODE.duration}>
          <ARCNode />
        </SceneFade>
      </Sequence>

      <Sequence from={SCENES.CTA.start} durationInFrames={SCENES.CTA.duration}>
        <SceneFade from={SCENES.CTA.start} duration={SCENES.CTA.duration}>
          <CTA />
        </SceneFade>
      </Sequence>
    </AbsoluteFill>
  );
};
