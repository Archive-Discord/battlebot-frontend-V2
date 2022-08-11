import type { Guild, PageDefaultProps } from "@types";
import type { NextPage, GetServerSideProps } from "next";
import { cookieParser } from "@utils/utils";
import { swrfetcher } from "@utils/client";
import { useRouter } from "next/router";
import useSWR from "swr";
import dynamic from "next/dynamic";
import Error from "@components/Error";
import { useTranslation } from "react-i18next";

const Login = dynamic(() => import("@components/Login"));
const Layout = dynamic(() => import("@components/DashboardLayout"));
const Loading = dynamic(() => import("@components/Loading"));

const DashboardAutomod: NextPage<PageDefaultProps> = ({ auth, guildId }) => {
  const router = useRouter();
  const { t } = useTranslation() 
  const { data: guildData, error: guildError } = useSWR<Guild>(
    `/guilds/${guildId}`,
    swrfetcher,
    {
      refreshInterval: 30000,
    }
  );
  const { data: userData, error: userError } = useSWR<Guild>(
    `/auth/me`,
    swrfetcher
  );
  if (!auth) return <Login />;
  if (userError && userError.cause === 401) return <Login />;
  if (guildError && guildError.cause !== 401)
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
  if (!guildData) return <Loading />;
  return (
    <>
      <Layout guild={guildData}></Layout>
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

export default DashboardAutomod;
