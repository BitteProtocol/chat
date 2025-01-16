import Lottie from "react-lottie-player/dist/LottiePlayerLight";
import bitteAnimation from "./../../assets/bitte_animation.json";

export const BitteSpinner = ({
  width = 200,
  height = 200,
}: {
  width?: number;
  height?: number;
}) => {
  return (
    <div>
      <Lottie
        loop
        animationData={bitteAnimation}
        play
        speed={1.5}
        style={{ width, height }}
        color='#FF0000'
      />
    </div>
  );
};
