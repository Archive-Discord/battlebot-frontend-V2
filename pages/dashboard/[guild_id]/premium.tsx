import type { Guild, PageDefaultProps } from "@types";
import type { NextPage, GetServerSideProps } from "next";
import { cookieParser } from "@utils/utils";
import useSWR from "swr";
import { swrfetcher } from "@utils/client";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import { premiumItems } from "@utils/Constants";
import { useState } from "react";
import LottieAnimaition from "@components/LottieAnimaition";

const Error = dynamic(() => import("@components/Error"));
const Login = dynamic(() => import("@components/Login"));
const Layout = dynamic(() => import("@components/DashboardLayout"));
const Loading = dynamic(() => import("@components/Loading"));

const DashboardPremium: NextPage<PageDefaultProps> = ({ auth, guildId }) => {
  const [selectPremiumType, setSelectPremiumType] = useState<"month" | "year">(
    "month"
  );
  const router = useRouter();
  const { data: guildData, error: guildError } = useSWR<Guild>(
    `/guilds/${guildId}`,
    swrfetcher,
    {
      refreshInterval: 10000,
    }
  );
  const { data: userData, error: userError } = useSWR<Guild>(
    `/auth/me`,
    swrfetcher
  );
  if (userError && userError.cause === 401) return <Login />;
  if (!auth) return <Login />;
  if (!guildData) return <Loading />;
  if (guildError && guildError.cause !== 401)
    return (
      <Error message={guildError.message}>
        <button
          className="hover:bg-gray-200 font-bold rounded-md px-3 py-1 mt-5"
          onClick={() => router.reload()}
        >
          다시 시도하기
        </button>
      </Error>
    );
  return (
    <>
      <Layout guild={guildData}>
        <div className="w-full" style={{ fontFamily: "Noto Sans KR" }}>
          <div className="w-full flex flex-col mr-1.5 ml-1.5">
            <span className="text-2xl font-bold">배틀이 프리미엄</span>
            <span className="text-lg mt-1 text-gray-500">
              배틀이를 더욱 유용하게 사용하세요!
            </span>
          </div>
          <div className="grid lg:grid-cols-2 w-full mt-5 gap-4 mr-1.5 ml-1.5">
            <div
              onClick={() => {
                setSelectPremiumType("month");
              }}
              className={`flex items-center justify-center w-full border p-5 rounded-xl flex-col min-h-[270px] ${
                selectPremiumType === "month" &&
                "bg-violet-100 border-2 border-purple-500"
              }`}
              style={{ transition: "all 0.3s" }}
            >
              <span className="font-bold">프리미엄 월간플랜</span>
              <span className="mt-5 font-bold lg:text-3xl text-2xl">
                4,900 ₩
              </span>
              <div className="flex flex-col items-center min-h-[100px] justify-center my-auto">
                {premiumItems
                  .filter(item => {
                    return item.type.includes("month");
                  })
                  .map((item, index) => (
                    <span className="font-bold" key={index}>
                      <i className="text-purple-500 mr-2 fas fa-check" />
                      {item.name}
                    </span>
                  ))}
              </div>
            </div>
            <div
              onClick={() => {
                setSelectPremiumType("year");
              }}
              className={`flex items-center justify-center w-full border p-5 rounded-xl flex-col min-h-[270px] ${
                selectPremiumType === "year" &&
                "bg-violet-100 border-2 border-purple-500"
              }`}
            >
              <span className="font-bold">프리미엄 연간플랜</span>
              <span className="mt-5 font-bold lg:text-3xl text-2xl">
                49,000 ₩
              </span>
              <div className="flex flex-col items-center min-h-[100px] justify-center my-auto">
                {premiumItems
                  .filter(item => {
                    return item.type.includes("year");
                  })
                  .map((item, index) => (
                    <span className="font-bold" key={index}>
                      <i className="text-purple-500 mr-2 fas fa-check" />
                      {item.name}
                    </span>
                  ))}
              </div>
            </div>
          </div>
          <div className="mt-3 w-full flex">
            <button
              style={{ transition: "all 0.3s" }}
              className="px-5 py-2 rounded-md text-xl ml-2 hover:bg-violet-100 border hover:border-purple-500"
            >
              결제 진행하기
            </button>
          </div>
          <div>
          </div>
        </div>
      </Layout>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async ctx => {
  const cookies = cookieParser(ctx);
  return {
    props: {
      auth: cookies?.Authorization ? cookies.Authorization : null,
      guildId: ctx.params?.guild_id,
    },
  };
};

export default DashboardPremium;
