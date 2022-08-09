import type { Guild, PageDefaultProps } from "@types";
import type { NextPage, GetServerSideProps } from "next";
import { cookieParser } from "@utils/utils";
import { swrfetcher } from "@utils/client";
import { useRouter } from "next/router";
import useSWR from "swr";
import dynamic from "next/dynamic";
import AnalyticsServer from "@components/dashboard/AnalyticsServer";
import Error from "@components/Error"

const Login = dynamic(() => import("@components/Login"));
const Layout = dynamic(() => import("@components/DashboardLayout"));
const Loading = dynamic(() => import("@components/Loading"));

const DashboardMain: NextPage<PageDefaultProps> = ({ auth, guildId }) => {
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
        <div className="flex flex-col mr-1.5 ml-1.5">
          <span className="text-2xl font-bold">대시보드</span>
          <span className="text-lg mt-1 text-gray-500">
            서버에 대한 간략한 정보를 확인하세요!
          </span>
        </div>
        <AnalyticsServer guild={guildData} />
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

export default DashboardMain;
