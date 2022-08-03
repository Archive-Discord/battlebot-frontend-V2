import type { LottiePlayer } from "lottie-web";
import { useEffect, useRef, useState } from "react";

const Loading = () => {
  const loadingRef = useRef<HTMLDivElement>(null);
  const [loadingLottie, setLoadingLottie] = useState<LottiePlayer | null>(null);

  useEffect(() => {
    import("lottie-web").then(Lottie => setLoadingLottie(Lottie.default));
  }, []);

  useEffect(() => {
    if (loadingLottie && loadingRef.current) {
      const animation = loadingLottie.loadAnimation({
        container: loadingRef.current,
        renderer: "svg",
        loop: true,
        autoplay: true,
        animationData: require("../lottieFiles/loading.json"),
      });

      return () => animation.destroy();
    }
  }, [loadingLottie]);

  return (
    <>
      <div
        id="loading"
        className="fixed w-full h-full top-0 left-0 backdrop-blur-sm"
        style={{ transition: "all .3s ease", zIndex: "1000", background: "rgba(0,0,0,.3)" }}
      >
        <div className="flex items-center justify-center h-full opacity-100">
          <div className="w-64 h-64 p-12" ref={loadingRef} />
        </div>
      </div>
    </>
  );
};

export const SmallLoading = () => {
  const loadingRef = useRef<HTMLDivElement>(null);
  const [loadingLottie, setLoadingLottie] = useState<LottiePlayer | null>(null);

  useEffect(() => {
    import("lottie-web").then(Lottie => setLoadingLottie(Lottie.default));
  }, []);

  useEffect(() => {
    if (loadingLottie && loadingRef.current) {
      const animation = loadingLottie.loadAnimation({
        container: loadingRef.current,
        renderer: "svg",
        loop: true,
        autoplay: true,
        animationData: require("../lottieFiles/loading.json"),
      });

      return () => animation.destroy();
    }
  }, [loadingLottie]);

  return (
    <>
      <div
        className="w-full h-full"
        style={{ transition: "all .3s ease" }}
      >
        <div className="flex items-center justify-center h-full opacity-100">
          <div className="w-42 h-42 p-12" ref={loadingRef} />
        </div>
      </div>
    </>
  );
};

export default Loading;
