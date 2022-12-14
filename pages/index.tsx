import type { NextPage, GetServerSideProps } from "next";
import type { LottiePlayer } from "lottie-web";
import { useEffect, useRef, useState } from "react";
import { battlebot } from "@utils/Constants";
import client from "@utils/client";
import dayjs from "dayjs";
import CountUp from "react-countup";
import { useTranslation } from "react-i18next";
import Seo from "@components/Seo";

const Home: NextPage<ServerSideProps> = ({
  servers,
  users,
}: ServerSideProps) => {
  const { t } = useTranslation();
  const verifiedRef = useRef<HTMLDivElement>(null);
  const [verifiedLottie, setVerifiedLottie] = useState<LottiePlayer | null>(
    null
  );

  useEffect(() => {
    import("lottie-web").then(Lottie => setVerifiedLottie(Lottie.default));
  }, []);

  useEffect(() => {
    if (verifiedLottie && verifiedRef.current) {
      const animation = verifiedLottie.loadAnimation({
        container: verifiedRef.current,
        renderer: "svg",
        loop: true,
        autoplay: true,
        animationData: require("../lottieFiles/verified.json"),
      });

      return () => animation.destroy();
    }
  }, [verifiedLottie]);

  return (
    <>
      <Seo />
      <section
        className="min-h-[100vh] items-center flex overflow-hidden bg-[#7C3AED]"
      >
        <div className="grid lg:grid-cols-3 grid-cols-1 container content-center">
          <div className="col-span-2">
            <img
              src={"/dashbord-ui-old.png"}
              className="rounded-3xl lg:p-5 p-10"
              data-aos="fade-right"
              data-aos-offset="100"
              data-aos-easing="ease-in-sine"
            />
          </div>
          <div
            className="flex flex-col items-center lg:items-start justify-center text-white lg:text-4xl text-2xl font-bold"
            style={{ fontFamily: "Noto Sans KR" }}
            data-aos="fade-left"
            data-aos-offset="200"
            data-aos-easing="ease-in-sine"
          >
            <span className="drop-shadow-[6px_7px_#7800ff] lg:text-9xl text-6xl lg:mb-12 mb-5 font-bold">
              {t("index.battlebot")}
            </span>
            <span className="drop-shadow-[5px_4.5px_#7800ff]">
              {t("index.description1")}
            </span>
            <span className="drop-shadow-[5px_4.5px_#7800ff]">
              {t("index.description2")}
            </span>
          </div>
        </div>
      </section>
      <section
        className="lg:min-h-[60vh] min-h-[50vh]  items-center flex flex-col justify-center font-bold"
        style={{ backgroundColor: "#fffff", fontFamily: "Noto Sans KR" }}
        data-aos="fade-bottom"
        data-aos-offset="200"
        data-aos-easing="ease-in-sine"
      >
        <span className="text-sm">
          {dayjs().format("YYYY.MM.DD")} {t("index.standard")}
        </span>
        <span className="lg:mt-5 mt-10 lg:block flex flex-col items-center">
          <span className="lg:text-2xl text-xl font-normal">
            {t("index.withBattlebot")}{" "}
          </span>
          <span className="text-4xl lg:mt-5 mt-2">
            <CountUp
              start={0}
              end={dayjs(new Date()).diff("2022-1-6", "days")}
              enableScrollSpy
              separator=","
            />
            {t("index.day")}
          </span>
        </span>
        <div className="text-base lg:max-w-[1000px] max-w-[400px] lg:space-y-0 space-y-2 mt-10 w-full lg:border lg:mt-10 flex lg:flex-row flex-col justify-between p-5 border-[#e6e6e6] items-center rounded-2xl">
          <div
            className="w-full flex lg:justify-center justify-between	lg:border-r lg:flex-col flex-row items-center"
            style={{ flex: "1 1 25%", margin: "15x 0px 15px" }}
          >
            <span className="font-blod">{t("index.useingUsers")}</span>
            <span className="lg:mt-3 lg:text-xl">
              <CountUp start={0} end={users} enableScrollSpy separator="," />
              {t("index.userCount")}
            </span>
          </div>
          <div
            className="w-full flex lg:justify-center justify-between lg:flex-col flex-row items-center"
            style={{ flex: "1 1 25%", margin: "15x 0px 15px" }}
          >
            <span className="font-blod">{t("index.useingServers")}</span>
            <span className="lg:mt-3 lg:text-xl">
              <CountUp start={0} end={servers} enableScrollSpy separator="," />
              {t("index.serverCount")}
            </span>
          </div>
        </div>
      </section>
      <section
        className="items-center flex lg:min-h-[60vh] min-h-[40vh] overflow-hidden bg-[#f6f6f6] text-black"
        style={{ fontFamily: "Noto Sans KR" }}
      >
        <div className="grid lg:grid-cols-2 grid-cols-1 container content-center">
          <div className="col-span-1 flex flex-col lg:items-start items-center justify-center p-10">
            <span className="lg:text-2xl text-xl font-bold mt-5">
              {t("index.simpleAuthSetup")}
            </span>
            <span className="lg:text-4xl text-2xl font-bold">
              {t("index.serverSecurityHigher")}
            </span>
          </div>
          <div className="col-span-1">
            <video
              loop
              autoPlay
              muted
              className="lg:p-0 p-10"
              style={{ borderRadius: "50px" }}
            >
              <source src="/verify.mp4" type="video/mp4" />
            </video>
          </div>
        </div>
      </section>
      <section
        className="items-center flex lg:min-h-[80vh] min-h-[80vh] bg-[#7C3AED] overflow-hidden text-white font-bold"
        style={{ fontFamily: "Noto Sans KR" }}
      >
        <div className="flex items-center justify-center container flex-col">
          <div ref={verifiedRef} className="w-48 h-48" />
          <span className="mt-10 text-2xl">{t("index.verifyInDiscord")}</span>
          <span className="text-2xl">{t("index.usefulRelief")}</span>
          <button
            onClick={() => {
              window.open(
                battlebot.invite,
                "??? ????????????",
                "width=450, height=850"
              );
            }}
            className="mt-8 bg-white text-lg text-gray-800 px-3 py-1 rounded-md"
          >
            {t("index.start")}
          </button>
        </div>
      </section>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async ctx => {
  const { data, error } = await client("GET", "/discord/caches");
  if (error) {
    return {
      props: {
        servers: 0,
        users: 0,
      },
    };
  } else {
    return {
      props: {
        servers: data.servers,
        users: data.users,
      },
    };
  }
};

interface ServerSideProps {
  servers: number;
  users: number;
}

export default Home;
