import { LottiePlayer } from "lottie-web";
import { useEffect, useRef, useState } from "react";

const NotFoundPage = () => {
  const Ref = useRef<HTMLDivElement>(null);
  const [lottie, setLottie] = useState<LottiePlayer | null>(null);

  useEffect(() => {
    import("lottie-web").then(Lottie => setLottie(Lottie.default));
  }, []);

  useEffect(() => {
    if (lottie && Ref.current) {
      const animation = lottie.loadAnimation({
        container: Ref.current,
        renderer: "svg",
        loop: true,
        autoplay: true,
        path: "/404.json",
      });

      return () => animation.destroy();
    }
  }, [lottie]);

  return (<>
    <div className="h-[100vh] flex items-center justify-center p-5 flex-col ">
      <div className="-mt-16" ref={Ref}/>
      <span className="-mt-12 lg:text-3xl text-xl font-bold" style={{fontFamily: "Noto Sans KR"}}>찾을 수 없는 페이지</span>
    </div>
  </>);
};

export default NotFoundPage;
