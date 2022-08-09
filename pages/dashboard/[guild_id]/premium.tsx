import type { Guild, PageDefaultProps, User } from "@types";
import type { NextPage, GetServerSideProps } from "next";
import { cookieParser } from "@utils/utils";
import { useRouter } from "next/router";
import { premiumItems } from "@utils/Constants";
import { useState } from "react";
import client, { swrfetcher } from "@utils/client";
import useSWR from "swr";
import dynamic from "next/dynamic";
import LottieAnimaition from "@components/LottieAnimaition";
import Toast from "@utils/toast";
import Error from "@components/Error"

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
  const { data: userData, error: userError } = useSWR<User>(
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

  const handlePayments = () => {
    client('POST', '/payments/order', {
      itemId: `guild_${selectPremiumType}`,
      guildId: guildData.id
    }).then(data => {
      if(data.error) {
        Toast(data.message, 'error')
      } else {
        router.push(`/payments/${data.data.paymentId}`)
      }
    })
  }
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
          <div className="grid lg:grid-cols-2 w-full mt-12 gap-4 lg:mr-1.5 lg:ml-1.5">
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
              onClick={() => {handlePayments()}}
              style={{ transition: "all 0.3s" }}
              className="px-5 py-2 rounded-xl text-xl lg:ml-2 hover:bg-violet-100 border hover:border-purple-500"
            >
              결제 진행하기
            </button>
          </div>
          <div className="max-w-[1300px] mx-auto mt-20">
            {guildData.memberCount > 500 ? (
              <>
                <section className="flex flex-col items-center justify-center min-h-[50vh]">
                  <LottieAnimaition
                    className="w-52 h-52 -z-10"
                    animation={require("../../../lottieFiles/partner.json")}
                  />
                  <span className="lg:text-xl text-base font-bold">
                    어라.. 서버 인원이 500명 이상인 거 같아요!
                  </span>
                  <span className="lg:text-2xl text-xl font-bold">
                    배틀이 파트너는 어떠세요?
                  </span>
                  <button
                    onClick={() => {
                      router.push("/partner");
                    }}
                    className="mt-3 rounded-md border border-purple-500 hover:bg-violet-100 text-xl px-3 py-1 font-bold"
                  >
                    신청하기
                  </button>
                </section>
              </>
            ) : (
              <></>
            )}
            <section className="grid lg:grid-cols-2 grid-cols-1 lg:mt-10 mt-20 px-2 pb-10">
              <div className="col-span-1 flex lg:items-start justify-center items-center flex-col lg:p-10 py-10">
                <span className="lg:text-2xl text-xl font-bold">이메일</span>
                <span className="lg:text-3xl text-2xl font-bold">
                  이메일을 이용한 이메일 인증
                </span>
              </div>
              <div className="col-span-1">
                <video
                  loop
                  autoPlay
                  muted
                  className="border-2"
                  style={{ borderRadius: "50px" }}
                >
                  <source src="/verify_email.mp4" type="video/mp4" />
                </video>
              </div>
            </section>
            <section className="grid lg:grid-cols-2 grid-cols-1 lg:mt-10 mt-20 px-2 pb-10">
              <div className="col-span-1 lg:order-first order-last lg:p-10 py-10">
                <img
                  src="/verify_phone.png"
                  className="border-2"
                  style={{ borderRadius: "50px" }}
                />
              </div>
              <div className="col-span-1 flex lg:items-end justify-center items-center flex-col lg:p-10">
                <span className="lg:text-2xl text-xl font-bold">전화번호</span>
                <span className="lg:text-3xl text-2xl font-bold">
                  문자를 이용한 전화번호 인증
                </span>
              </div>
            </section>
            <section className="grid lg:grid-cols-2 grid-cols-1 lg:mt-10 mt-20 px-2 pb-10 min-h-[420px]">
              <div className="col-span-1 flex lg:items-start justify-center items-center flex-col lg:p-10 py-10">
                <span className="lg:text-2xl text-xl font-bold">
                  커스텀 링크
                </span>
                <span className="lg:text-3xl text-2xl font-bold">
                  서버만의 링크로 서버 입장
                </span>
              </div>
              <div className="col-span-1 flex items-center justify-center">
                <img
                  src="/custom_link.png"
                  className="border-2"
                  style={{ borderRadius: "50px" }}
                />
              </div>
            </section>
            <section className="flex items-center justify-center flex-col pb-32">
              <LottieAnimaition
                className="w-96 h-96 -z-10"
                animation={require("../../../lottieFiles/developer.json")}
              />
              <span className="lg:text-xl text-base -mt-8 font-bold">
                지속적으로 개발 중인 배틀이를 확인하세요
              </span>
              <div className="flex flex-row items-center">
                <button
                  onClick={() => {
                    window.open("https://github.com/Archive-Discord");
                  }}
                  className="mt-8 hover:bg-violet-100 border hover:border-purple-500 text-base text-black px-3 py-1 rounded-md"
                >
                  Github
                </button>
              </div>
            </section>
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
