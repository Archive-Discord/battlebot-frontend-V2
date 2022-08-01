import Error from "@components/Error";
import Loading from "@components/Loading";
import Login from "@components/Login";
import ServerCard from "@components/ServerCard";
import { PageDefaultProps, User } from "@types";
import { swrfetcher } from "@utils/client";
import { NextPage } from "next";
import { useRouter } from "next/router";
import useSWR from "swr";
import { UserGulds } from "types/guild";

const Dashboard: NextPage<PageDefaultProps> = ({ auth }) => {
  const router = useRouter();
  const {
    data: guildData,
    error: guildError,
    mutate: guildMutate,
  } = useSWR<UserGulds>("/auth/me/guilds", swrfetcher);
  if (!auth) return <Login />;
  if (guildError && guildError.cause === 401) return <Login />;
  if (guildError && guildError.cause === 429)
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
  if (guildError)
    return <Error message={guildError.message} />;
  if (!guildData) return <Loading />;

  const serverReload = () => {
    guildMutate();
  };

  return (
    <>
      <div
        className="container min-h-[100vh] w-full h-full flex flex-col justify-center lg:p-5 p-6"
        style={{ fontFamily: "Noto Sans KR" }}
      >
        <span
          className="lg:text-2xl text-xl"
          style={{ margin: "100px auto 0px" }}
        >
          관리할 서버를 선택해주세요
        </span>
        <div className="flex mt-10 flex-row w-full h-full flex-wrap items-center justify-center">
          {guildData.map((server, index) => (
            <ServerCard server={server} key={index} />
          ))}
        </div>
      </div>
    </>
  );
};

export default Dashboard;
