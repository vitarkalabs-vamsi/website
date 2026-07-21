import React from "react";
import { Composition } from "remotion";
import { VitarkaPromo } from "./VitarkaPromo";
import { FPS, WIDTH, HEIGHT, TOTAL_FRAMES } from "./constants";

export const Root: React.FC = () => {
  return (
    <>
      <Composition
        id="VitarkaPromo"
        component={VitarkaPromo}
        durationInFrames={TOTAL_FRAMES}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
        defaultProps={{}}
      />
    </>
  );
};
