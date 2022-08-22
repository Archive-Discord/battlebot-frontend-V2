import type {
  BattleBotEmbed,
  Guild,
  Members,
  PageDefaultProps,
  Roles,
  Ticket,
  User,
} from "@types";
import type { NextPage, GetServerSideProps } from "next";
import { cookieParser } from "@utils/utils";
import client, { swrfetcher } from "@utils/client";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";
import useSWR from "swr";
import dynamic from "next/dynamic";
import AnalyticsServer from "@components/dashboard/AnalyticsServer";
import Error from "@components/Error";
import Seo from "@components/Seo";
import Dropdown from "@components/Dropdown";
import { VerifyTypes } from "@utils/Constants";
import { useEffect, useState } from "react";
import Premium from "@components/Premium";
import CustomEmbed from "@components/CustomEmbed";
import ChangeSaveAlert from "@components/ChangeSaveAlert";

const Login = dynamic(() => import("@components/Login"));
const Layout = dynamic(() => import("@components/DashboardLayout"));
const Loading = dynamic(() => import("@components/Loading"));

const DashboardMain: NextPage<PageDefaultProps> = ({ auth, guildId }) => {
  const router = useRouter();
  const { t } = useTranslation();
  const [selectVerifyType, setSelectVerifyType] = useState<string>();
  const [onChange, setOnChange] = useState<boolean>(false);
  const [selectVerifyChannel, setSelectVerifyChannel] = useState<string>();
  const [useDeleteRole, setUseDeleteRole] = useState<boolean>(false);
  const [embed, setEmbed] = useState<BattleBotEmbed>();
  const [useCustomEmbed, setUseCustomEmbed] = useState<boolean>(false);
  const [deleteRole, setDeleteRole] = useState<string>();
  const [role, setRole] = useState<string>();

  useEffect(() => {
    setOnChange(true);
  }, [
    selectVerifyType,
    selectVerifyChannel,
    useDeleteRole,
    embed,
    useCustomEmbed,
    deleteRole,
    role,
  ]);

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

  const { data: guildPremiumData, error: guildPremiumError } = useSWR<boolean>(
    `/guilds/${guildId}/premium`,
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
  const createVerify = () => {
    client("POST", `/guilds/${guildData.id}/verify`, {
      type: selectVerifyType,
      channel: selectVerifyChannel,
      role: role,
      deleteRole: useDeleteRole ? deleteRole : null,
      embed: embed,
    });
  };

  return (
    <>
      <Seo title="인증" />
      <Layout guild={guildData}>
        <div className="flex flex-col mr-1.5 ml-1.5">
          <span className="text-2xl font-bold">인증</span>
          <span className="text-lg mt-1 text-gray-500">
            서버에 인증 기능을 추가해 보안을 향상시키세요!
          </span>
        </div>
        <div className="mx-2 mt-5">
          <div>
            <span className="text-xl font-bold">인증 추가하기</span>
            <div className="max-w-xl flex lg:flex-row flex-col justify-between items-base mt-2">
              <span className="text-lg font-bold mt-2 lg:mb-0 mb-2">
                인증방식
              </span>
              <div className="lg:w-96 w-full">
                <div className="flex flex-col">
                  <Dropdown
                    items={VerifyTypes}
                    selectCallback={setSelectVerifyType}
                  />
                  {!guildPremiumData && (
                    <div className="ml-2">
                      {selectVerifyType === "phone" && (
                        <Premium
                          title={"휴대폰 인증을 사용하세요"}
                          guild={guildData.id}
                        />
                      )}
                      {selectVerifyType === "email" && (
                        <Premium
                          title={"이메일 인증을 사용하세요"}
                          guild={guildData.id}
                        />
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="max-w-xl flex lg:flex-row flex-col justify-between items-base mt-2">
              <span className="text-lg font-bold mt-2 lg:mb-0 mb-2">
                인증채널
              </span>
              <div className="lg:w-96 w-full">
                <div className="flex flex-col">
                  <Dropdown
                    items={guildData.channels.map(channel => {
                      return {
                        ...channel,
                        name: "# " + channel.name,
                      };
                    })}
                    selectCallback={setSelectVerifyChannel}
                  />
                </div>
              </div>
            </div>
            <div className="max-w-xl flex lg:flex-row flex-col justify-between items-base mt-2">
              <span className="text-lg font-bold mt-2 lg:mb-0 mb-2">
                인증완료 역할
              </span>
              <div className="lg:w-96 w-full">
                <div className="flex flex-col">
                  <Dropdown
                    items={guildData.roles
                      .filter(role => {
                        return role.name !== "@everyone";
                      })
                      .map(role => {
                        return {
                          name: "@ " + role.name,
                          id: role.id,
                        };
                      })}
                    selectCallback={setRole}
                  />
                </div>
              </div>
            </div>
            <div className="max-w-xl flex flex-col justify-between items-base mt-4">
              <div className="flex items-center justify-between w-full">
                <span className="text-lg font-bold">인증완료시 역할삭제</span>
                <label
                  htmlFor="selectVerify-toggle"
                  className="inline-flex relative items-center cursor-pointer"
                >
                  <input
                    type="checkbox"
                    onChange={e => {
                      setUseDeleteRole(e.target.checked);
                    }}
                    id="selectVerify-toggle"
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-700 dark:peer-focus:ring-purple-800 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-purple-600" />
                </label>
              </div>
              {useDeleteRole && (
                <div>
                  <div className="flex flex-col mt-2">
                    <Dropdown
                      items={guildData.roles
                        .filter(role => {
                          return role.name !== "@everyone";
                        })
                        .map(role => {
                          return {
                            name: "@ " + role.name,
                            id: role.id,
                          };
                        })}
                      selectCallback={setDeleteRole}
                    />
                  </div>
                </div>
              )}
            </div>
            <div className="flex flex-col justify-between items-base mt-4">
              <div className="flex items-center justify-between w-full max-w-xl">
                <span className="text-lg font-bold mt-2 lg:mb-0 mb-2">
                  커스텀 임베드
                </span>
                <label
                  htmlFor="selectCustomEmbed-toggle"
                  className="inline-flex relative items-center cursor-pointer"
                >
                  <input
                    type="checkbox"
                    onChange={e => {
                      setUseCustomEmbed(e.target.checked);
                    }}
                    id="selectCustomEmbed-toggle"
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-700 dark:peer-focus:ring-purple-800 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-purple-600" />
                </label>
              </div>
              {useCustomEmbed && (
                <div className="max-w-screen-lg w-full mt-2">
                  <CustomEmbed callbackEmbed={setEmbed} />
                </div>
              )}
            </div>
          </div>
        </div>
      </Layout>
      <ChangeSaveAlert show={onChange} onClickSave={createVerify} />
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
