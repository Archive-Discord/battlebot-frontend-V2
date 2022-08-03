import type { LottiePlayer } from "lottie-web";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";

const Login = () => {
  const Ref = useRef<HTMLDivElement>(null);
  const [lottie, setLottie] = useState<LottiePlayer | null>(null);
  const [loading, setLoading] = useState("");
  const [count, setCount] = useState(0);
  const router = useRouter();
  const completionWord = "...";
  
  useEffect(() => {
    window.location.href =
      process.env.NEXT_PUBLIC_API_URL +
      `/auth/discord?redirect=${router.asPath}`;
  }, []);

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
        animationData:require('../lottieFiles/loading.json')
      });

      return () => animation.destroy();
    }
  }, [lottie]);

  useEffect(() => {
    const typingInterval = setInterval(() => {
      setLoading(prevTitleValue => {
        let result = prevTitleValue
          ? prevTitleValue + completionWord[count]
          : completionWord[0];
        setCount(count + 1);

        if (count >= completionWord.length) {
          setCount(0);
          setLoading("");
        }

        return result;
      });
    }, 300);

    return () => {
      clearInterval(typingInterval);
    };
  });

  return (
    <>
      <div
        className="min-h-[100vh] h-full w-full flex items-center justify-center flex-col font-bold text-lg"
        style={{ fontFamily: "Noto Sans KR" }}
      >
        <div className="w-48 h-48" ref={Ref}></div>
        <span className="-mt-12 w-24 ml-5">로그인 중{loading}</span>
      </div>
    </>
  );
};

export default Login;
