import type { NextPage, GetServerSideProps, GetStaticProps } from "next";
import Head from "next/head";
import Image from "next/image";
import client from "../utils/client";
import { numberWithCommas } from "../utils/utils";

const Home: NextPage<ServerSideProps> = ({
  servers,
  users,
}: ServerSideProps) => {
  return (
    <>
      <section
        className="min-h-[100vh] items-center flex"
        style={{ backgroundColor: "#7C3AED" }}
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
              배틀이
            </span>
            <span className="drop-shadow-[5px_4.5px_#7800ff]">
              웹 대시보드로 편리하게
            </span>
            <span className="drop-shadow-[5px_4.5px_#7800ff]">
              디스코드 서버를 관리하세요.
            </span>
          </div>
        </div>
      </section>
      <section
        className="lg:min-h-[100vh] min-h-[160vh]  items-center flex flex-col justify-center font-bold"
        style={{ backgroundColor: "#fffff", fontFamily: "Noto Sans KR" }}
      >
        <div
          className="mx-auto lg:text-6xl text-4xl mb-4"
          data-aos="fade-up"
          data-aos-anchor-placement="top-bottom"
        >
          <span className="font-thin">지금 </span>
          <span>배틀이</span>
          <span className="font-thin">는 바빠요</span>
        </div>
        <span
          className="text-4xl text-gray-500 font-bold mb-24"
          data-aos="fade-up"
          data-aos-anchor-placement="top-bottom"
        >
          ACTIVITY
        </span>
        <div className="flex flex-row lg:space-x-24 items-center justify-center text-white flex-wrap">
          <div
            data-aos="fade-up"
            data-aos-anchor-placement="top-bottom"
            data-aos-offset="200"
            className="bg-violet-600 flex flex-col items-center lg:p-20 lg:px-28 p-14 px-20 rounded-3xl  lg:mb-0 mb-20"
          >
            <span className="lg:text-5xl text-3xl">사용중인 서버 수</span>
            <span className="lg:text-2xl mt-5 lg:border-4 border-2 px-5 py-1 rounded-3xl">
              SERVER
            </span>
            <span className="lg:text-7xl text-5xl mt-8">
              {numberWithCommas(servers)}
            </span>
            <span className="lg:text-5xl text-2xl mt-8 underline underline-offset-4">
              서버에서 사용중
            </span>
          </div>
          <div
            data-aos="fade-up"
            data-aos-anchor-placement="top-bottom"
            data-aos-offset="500"
            className="bg-neutral-900 flex flex-col items-center lg:p-20 lg:px-28 p-14 px-20 rounded-3xl"
          >
            <span className="lg:text-5xl text-3xl">사용중인 유저 수</span>
            <span className="lg:text-2xl mt-5 lg:border-4 border-2 px-5 py-1 rounded-3xl">
              USER
            </span>
            <span className="lg:text-7xl text-5xl mt-8">{numberWithCommas(users)}</span>
            <span className="lg:text-5xl text-2xl mt-8 underline underline-offset-4">
              유저가 사용중
            </span>
          </div>
        </div>
      </section>
      <section>
        
      </section>
    </>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const { data, error } = await client("GET", "/discord/caches");
  if (error) {
    return {
      props: {
        servers: 0,
        users: 0,
      },
      revalidate: 5000,
    };
  } else {
    return {
      props: {
        servers: data.servers,
        users: data.users,
      },
      revalidate: 5000,
    };
  }
};

interface ServerSideProps {
  servers: number;
  users: number;
}

export default Home;
