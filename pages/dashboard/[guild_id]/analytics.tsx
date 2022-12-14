import type {
  Guild,
  Members,
  PageDefaultProps,
  Roles,
  Ticket,
  User,
} from "@types";
import type { NextPage, GetServerSideProps } from "next";
import { cookieParser } from "@utils/utils";
import { swrfetcher } from "@utils/client";
import { useRouter } from "next/router";
import { SmallLoading } from "@components/Loading";
import { useTranslation } from "react-i18next";
import useSWR from "swr";
import dynamic from "next/dynamic";
import Error from "@components/Error";
import GuildRolesChart from "@components/dashboard/GuildRolesChart";
import GuildMemberJoinChart from "@components/dashboard/GuildMemberJoinChart";
import Seo from "@components/Seo";

const Login = dynamic(() => import("@components/Login"));
const Layout = dynamic(() => import("@components/DashboardLayout"));
const Loading = dynamic(() => import("@components/Loading"));

const DashboardMain: NextPage<PageDefaultProps> = ({ auth, guildId }) => {
  const router = useRouter();
  const { t } = useTranslation();
  const { data: guildData, error: guildError } = useSWR<Guild>(
    `/guilds/${guildId}`,
    swrfetcher,
    {
      refreshInterval: 30000,
    }
  );
  const { data: userData, error: userError } = useSWR<User>(
    `/auth/me`,
    swrfetcher
  );

  const { data: guildMembersData, error: guildMembersError } = useSWR<
    Members[]
  >(`/guilds/${guildId}/members`, swrfetcher, {
    refreshInterval: 30000,
  });

  const { data: guildRolesData, error: guildRolesError } = useSWR<Roles[]>(
    `/guilds/${guildId}/roles`,
    swrfetcher,
    {
      refreshInterval: 30000,
    }
  );

  const { data: guildTicketData, error: guildTicketError } = useSWR<Ticket[]>(
    `/guilds/${guildId}/tickets`,
    swrfetcher,
    {
      refreshInterval: 30000,
    }
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
      <Seo title="??????" />
      <Layout guild={guildData}>
        <div className="flex flex-col mr-1.5 ml-1.5">
          <span className="text-2xl font-bold">
            {t("dashboard.analytics.analytics")}
          </span>
          <span className="text-lg mt-1 text-gray-500">
            {t("dashboard.analytics.analyticsDescrption")}
          </span>
        </div>
        <div className="flex flex-row lg:flex-nowrap flex-wrap lg:space-y-0 space-y-6 mt-2 p-2">
          <div className="lg:w-2/3 w-full border rounded-md lg:mr-2 flex justify-center flex-col items-center">
            {guildMembersData ? (
              <GuildMemberJoinChart guildMembersData={guildMembersData} />
            ) : (
              <SmallLoading />
            )}
          </div>
          <div className="lg:w-1/3 w-full border rounded-md lg:mr-2 flex justify-center flex-col items-center">
            {guildMembersData && guildRolesData ? (
              <GuildRolesChart guildRolesData={guildRolesData} />
            ) : (
              <SmallLoading />
            )}
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

export default DashboardMain;
