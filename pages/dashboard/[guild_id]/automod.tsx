import type { Guild, PageDefaultProps } from "@types";
import type { NextPage, GetServerSideProps } from "next";
import { cookieParser } from "@utils/utils";
import { swrfetcher } from "@utils/client";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { AutomodEvent, AutomodTarget, warningTypes } from "@utils/Constants";
import useSWR from "swr";
import dynamic from "next/dynamic";
import Error from "@components/Error";
import Premium from "@components/Premium";
import Seo from "@components/Seo";
import Modal from "@components/Modal";
import Dropdown from "@components/Dropdown";

const Login = dynamic(() => import("@components/Login"));
const Layout = dynamic(() => import("@components/DashboardLayout"));
const Loading = dynamic(() => import("@components/Loading"));
const Input = dynamic(() => import("@components/Input"));
const Button = dynamic(() => import("@components/Button"));

const DashboardAutomod: NextPage<PageDefaultProps> = ({ auth, guildId }) => {
  const router = useRouter();
  const { t } = useTranslation();
  const [openModal, setOpenModal] = useState(false);
  const [targetType, setTargetType] = useState<string>(AutomodTarget[0].id);
  const [eventType, setEventType] = useState<string>(AutomodEvent[0].id);
  const [startTarget, setStartTarget] = useState<string>();
  const { data: guildData, error: guildError } = useSWR<Guild>(
    `/guilds/${guildId}`,
    swrfetcher,
    {
      refreshInterval: 30000,
    }
  );

  const { data: guildAutomodData, error: guildAutomodError } = useSWR<Guild[]>(
    `/guilds/${guildId}/automod`,
    swrfetcher,
    {
      refreshInterval: 30000,
    }
  );
  const { data: userData, error: userError } = useSWR<Guild>(
    `/auth/me`,
    swrfetcher
  );

  const { data: guildPremium, error: guildPremiumError } = useSWR<boolean>(
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

  const selectItemDelete = () => {};
  const generateAutoMod = () => {};
  const targetIgnoreEvents = ["blacklist_ban", "usercreateat"]
  const startTartgetLoader = (type: string) => {
    if (type === "autorole") {
      return guildData.roles.filter(role => {
        return role.name !== "@everyone";
      });
    } else if (type === "usecurse" || type === "uselink") {
      return warningTypes;
    } else if (type === "resetchannel") {
      return guildData.channels
    } else {
      return warningTypes;
    }
  };
  return (
    <>
      <Seo title="자동관리" />
      <Layout guild={guildData}>
        <div className="flex flex-col mr-1.5 ml-1.5">
          <span className="text-2xl font-bold">
            {t("dashboard.automod.automod")}
          </span>
          <span className="text-lg mt-1 text-gray-500">
            {t("dashboard.automod.useage")}
          </span>
        </div>
        <div className="flex flex-col w-full">
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center px-2 mb-3 mt-2">
            <span className="text-xl font-bold">
              {t("dashboard.automod.useingAutomod")}
            </span>
            <div>
              <Button
                className="mt-2 px-5 py-2 mr-2"
                type="success"
                label={t("dashboard.automod.makeNew")}
                onClick={() => setOpenModal(true)}
                icon="fas fa-plus mr-2"
              />
              <Button
                className="mt-2 px-5 py-2"
                type="danger"
                disable={guildAutomodData?.length === 0 ? true : false}
                label={t("dashboard.automod.delete")}
                onClick={selectItemDelete}
                icon="fas fa-trash mr-2"
              />
            </div>
          </div>
          {guildAutomodData ? (
            <>
              <div className="inline-block min-w-full">
                <div className="overflow-x-auto rounded-lg max-h-[400px]">
                  <table className="min-w-full ">
                    <thead className="bg-purple-500 border-b">
                      <tr className="text-white font-bold">
                        <th
                          scope="col"
                          className="text-sm font-medium px-6 py-4 text-left"
                        >
                          {t("dashboard.customlink.link")}
                        </th>
                        <th
                          scope="col"
                          className="text-sm font-medium px-6 py-4 text-left"
                        >
                          {t("dashboard.customlink.useCount")}
                        </th>
                        <th
                          scope="col"
                          className="text-sm font-medium px-6 py-4 text-left"
                        >
                          {t("dashboard.customlink.useingOptions")}
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-purple-100 ">
                      <tr className="border-b">
                        <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                          {/* <CopyToClipboard
                            text={`https://battlebot.kr/invite/${guildCustomlink.custom.path}`}
                            onCopy={() => {
                              Toast(
                                t("dashboard.customlink.successCopy"),
                                "success"
                              );
                            }}
                          >
                            <span className="cursor-pointer">
                              https://battlebot.kr/invite/
                              {guildCustomlink.custom.path}
                            </span>
                          </CopyToClipboard> */}
                        </td>
                        <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                          {/* {numberWithCommas(
                            guildCustomlink.custom.useage
                              ? guildCustomlink.custom.useage
                              : 0
                          )}
                          회 */}
                        </td>
                        <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                          {/* {guildCustomlink.custom.option == "email" &&
                            t("dashboard.customlink.emailVerify")}
                          {guildCustomlink.custom.option == "kakao" &&
                            t("dashboard.customlink.kakaoVerify")}
                          {guildCustomlink.custom.option == "phone" &&
                            t("dashboard.customlink.phoneVerify")}
                          {!guildCustomlink.custom.option &&
                            t("dashboard.customlink.noneVerify")} */}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center justify-center h-24">
                <button onClick={() => setOpenModal(true)} className="text-lg">
                  {t("dashboard.automod.onClickMakeAutomod")}
                </button>
              </div>
            </>
          )}
        </div>
      </Layout>
      <Modal
        button={
          <Button
            type="success"
            onClick={() => generateAutoMod()}
            label={"생성하기"}
          />
        }
        title={t("dashboard.automod.makeAutomod")}
        isOpen={openModal}
        callbackOpen={open => setOpenModal(open)}
      >
        <div className="flex flex-col">
          <div className="flex lg:flex-row flex-col lg:items-baseline items-start justify-between">
            <span className="font-bold text-lg">
              {t("dashboard.automod.target")}
            </span>
            <div className="flex items-start flex-col w-full lg:max-w-[250px] lg:mt-0 mt-2">
              <Dropdown items={AutomodTarget} selectCallback={setTargetType} />
            </div>
          </div>
          <div className="flex lg:flex-row flex-col lg:items-baseline items-start justify-between mt-2">
            <span className="font-bold text-lg">
              {t("dashboard.automod.event")}
            </span>
            <div className="flex items-start flex-col w-full lg:max-w-[250px] lg:mt-0 mt-2">
              <Dropdown
                items={AutomodEvent.filter(item => {
                  return item.categori === targetType;
                })}
                selectCallback={setEventType}
              />
            </div>
          </div>
          {!targetIgnoreEvents.includes(eventType as string) && (
            <div className="flex lg:flex-row flex-col lg:items-baseline items-start justify-between mt-2">
              <span className="font-bold text-lg">
                {t("dashboard.automod.start")}
              </span>
              <div className="flex items-start flex-col w-full lg:max-w-[250px] lg:mt-0 mt-2">
                <Dropdown
                  items={startTartgetLoader(eventType)}
                  selectCallback={setStartTarget}
                />
              </div>
            </div>
          )}
        </div>
      </Modal>
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
