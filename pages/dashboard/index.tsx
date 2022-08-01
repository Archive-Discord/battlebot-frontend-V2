import Error from "@components/Error";
import Loading from "@components/Loading";
import Login from "@components/Login";
import { PageDefaultProps, User } from "@types";
import { swrfetcher } from "@utils/client";
import { NextPage } from "next";
import { useRouter } from "next/router";
import useSWR from "swr";
import { UserGulds } from "types/guild";

const Dashboard: NextPage<PageDefaultProps> = ({ auth }) => {
  const router = useRouter();
  const { data: guildData, error: guildError } = useSWR<UserGulds>(
    "/auth/me/guilds",
    swrfetcher
  );
  const { data: userData, error: userError } = useSWR<User>(
    "/auth/me",
    swrfetcher
  );
  
  if(!auth) return <Login/>
  if (userError && userError.cause === 401) return <Login />;
  if (guildError && guildError.cause === 429)
    return (
      <Error message={guildError.message || userError.message}>
        <button
          className="hover:bg-gray-200 font-bold rounded-md px-3 py-1 mt-5"
          onClick={() => router.reload()}
        >
          다시 시도하기
        </button>
      </Error>
    );
  if (userError || guildError)
    return <Error message={guildError.message || userError.message} />;
  if (!guildData) return <Loading />;
  return (
    <>
      <div className="container min-h-[100vh] w-full h-full flex justify-center lg:p-5 p-6" style={{fontFamily: "Noto Sans KR"}}>
        <span className="lg:text-2xl text-xl" style={{ margin: "100px auto 0px"}}>
          관리할 서버를 선택해주세요
        </span>
        <div className="flex mt-5">

        </div>
      </div>
    </>
  );
};

export default Dashboard;
