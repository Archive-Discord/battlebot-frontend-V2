import type { LottiePlayer } from "lottie-web";
import { useEffect, useRef, useState } from "react";

const LottieAnimaition: React.FC<LottieAnimaitionProps> = ({animation: animationData, className}) => {
  const lottieRef = useRef<HTMLDivElement>(null);
  const [lottie, setLottie] = useState<LottiePlayer | null>(null);

  useEffect(() => {
    import("lottie-web").then(Lottie => setLottie(Lottie.default));
  }, []);

  useEffect(() => {
    if (lottie && lottieRef.current) {
      const animation = lottie.loadAnimation({
        container: lottieRef.current,
        renderer: "svg",
        loop: true,
        autoplay: true,
        animationData
      });

      return () => animation.destroy();
    }
  }, [lottie]);
  return <>
    <div className={className} ref={lottieRef}/>
  </>;
};

interface LottieAnimaitionProps {
    animation: NodeRequire
    className?: string
}

export default LottieAnimaition;
