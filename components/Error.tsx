import { LottiePlayer } from "lottie-web";
import { useEffect, useRef, useState } from "react";
import Seo from "./Seo";

const Error: React.FC<ErrorPageProps> = ({message, children}) => {
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
        path: "/lottie/error.json"
      });

      return () => animation.destroy();
    }
  }, [lottie]);
  return <>
  <Seo title={message}/>
    <div className="flex flex-col justify-center items-center min-h-[100vh] w-full h-full" style={{ fontFamily: "Noto Sans KR" }}>
        <div className="w-52 h-52" ref={Ref}/>
        <span className="lg:text-2xl text-xl font-bold px-2">{message}</span>
        <div className="mt-2">
            {children}
        </div>
    </div>
  </>;
};

interface ErrorPageProps {
    message: string
    children?: React.ReactNode
}

export default Error;
