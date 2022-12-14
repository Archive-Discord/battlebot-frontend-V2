import type { PageDefaultProps, UserGulds } from "@types";
import type { GetServerSideProps, NextPage } from "next";
import { swrfetcher } from "@utils/client";
import { cookieParser } from "@utils/utils";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";
import dynamic from "next/dynamic";
import useSWR from "swr";
import Error from "@components/Error";
import Seo from "@components/Seo";

const Login = dynamic(() => import("@components/Login"));
const Loading = dynamic(() => import("@components/Loading"));
const ServerCard = dynamic(() => import("@components/ServerCard"));

const Dashboard: NextPage<PageDefaultProps> = ({ auth }) => {
  const router = useRouter();
  const { t } = useTranslation();
  const { data: guildData, error: guildError } = useSWR<UserGulds>(
    "/auth/me/guilds",
    swrfetcher,
    {
      refreshInterval: 30000,
    }
  );

  if (!auth) return <Login />;
  if (guildError && guildError.cause === 401) return <Login />;
  if (guildError && guildError.cause === 429)
    return (
      <Error message={guildError.message}>
        <button
          className="hover:bg-gray-200 font-bold rounded-md px-3 py-1 mt-5"
          onClick={() => router.reload()}
        >
          {t("retry")}
        </button>
      </Error>
    );
  if (guildError) return <Error message={guildError.message} />;
  if (!guildData) return <Loading />;

  return (
    <>
      <Seo title="대시보드" />
      <div
        className="container min-h-[100vh] w-full h-full flex flex-col justify-center lg:p-5 p-6"
        style={{ fontFamily: "Noto Sans KR" }}
      >
        <span
          className="lg:text-2xl text-xl"
          style={{ margin: "100px auto 0px" }}
        >
          {t("dashboard.selectManageServer")}
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

export const getServerSideProps: GetServerSideProps = async ctx => {
  const cookies = cookieParser(ctx);
  return {
    props: {
      auth: cookies?.Authorization ? cookies.Authorization : null,
    },
  };
};

export default Dashboard;
