import Lottie from "react-lottie-player/dist/LottiePlayerLight";

import { Color } from "../../lib/animation-colors/colors";
import { hexToRgb } from "../../lib/animation-colors/hex-to-rgb";
import { Solver } from "../../lib/animation-colors/solver";
import bitteAnimation from "./../../assets/bitte_animation.json";

export const BitteSpinner = ({
  width = 200,
  height = 200,
  color = "#000000", // Default color
}: {
  width?: number;
  height?: number;
  color?: string;
}) => {
  const rgb = hexToRgb(color) || [0, 0, 0];

  const colorObj = new Color(rgb[0], rgb[1], rgb[2]);
  const solver = new Solver(colorObj);
  const result = solver.solve();

  console.log({ colorObj, rgb, solver, result });
  return (
    <div>
      <Lottie
        loop
        animationData={bitteAnimation}
        play
        speed={1.5}
        style={{ width, height, filter: result.filter }}
      />
    </div>
  );
};
