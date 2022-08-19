import type { Guild, PageDefaultProps, Automod } from "@types";
import type { NextPage, GetServerSideProps } from "next";
import { cookieParser } from "@utils/utils";
import client, { swrfetcher } from "@utils/client";
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
import Toast from "@utils/toast";

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
  const [deleteAutomods, setDeleteAutomods] = useState<string[]>([]);
  const [startTarget, setStartTarget] = useState<string>();
  const [error, setErorr] = useState<string>();
  const { data: guildData, error: guildError } = useSWR<Guild>(
    `/guilds/${guildId}`,
    swrfetcher,
    {
      refreshInterval: 30000,
    }
  );

  const {
    data: guildAutomodData,
    error: guildAutomodError,
    mutate: reloadAutomod,
  } = useSWR<Automod[]>(`/guilds/${guildId}/automod`, swrfetcher, {
    refreshInterval: 30000,
  });
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
  const getChecked = (id: string): boolean => {
    if (deleteAutomods.includes(id)) {
      return true;
    }
    return false;
  };
  const selectItemDelete = () => {
    client("DELETE", `/guilds/${guildData.id}/automod`, {
      id: deleteAutomods,
    }).then(res => {
      setDeleteAutomods([]);
      if (res.error) {
        Toast(res.message, "error");
      } else {
        Toast(
          t("dashboard.customlink.successDelete", { count: res.data.count }),
          "success"
        );
        reloadAutomod();
      }
    });
  };
  const generateAutoMod = () => {
    setErorr(undefined);
    client("POST", `/guilds/${guildData.id}/automod`, {
      event: eventType,
      start: startTarget,
    }).then(res => {
      if (res.error) {
        return setErorr(res.message);
      }
      reloadAutomod();
      setOpenModal(false);
    });
  };
  const targetIgnoreEvents = ["blacklist_ban", "usercreateat"];
  const startTartgetLoader = (type: string) => {
    if (type === "autorole") {
      return guildData.roles.filter(role => {
        return role.name !== "@everyone";
      });
    } else if (type === "usecurse" || type === "uselink") {
      return warningTypes;
    } else if (type === "resetchannel") {
      return guildData.channels.map(channel => {
        return {
          name: "# " + channel.name,
          id: channel.id,
        };
      });
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
              <span className="px-3 py-1 rounded-md bg-purple-500 text-white mt-2 px-5 py-2 mr-2">
                {guildAutomodData?.length}개 / {guildPremium ? "15개" : "5개"}
              </span>
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
                disable={deleteAutomods?.length === 0 ? true : false}
                label={t("dashboard.automod.delete")}
                onClick={selectItemDelete}
                icon="fas fa-trash mr-2"
              />
            </div>
          </div>
          {guildAutomodData?.length === 0 ? (
            <>
              <div className="flex items-center justify-center h-24">
                <button onClick={() => setOpenModal(true)} className="text-lg">
                  {t("dashboard.automod.onClickMakeAutomod")}
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="inline-block min-w-full mx-2">
                <div className="overflow-x-auto rounded-lg max-h-[400px]">
                  <table className="min-w-full ">
                    <thead className="bg-purple-500 border-b">
                      <tr className="text-white font-bold">
                        <th
                          scope="col"
                          className="text-sm font-medium px-6 py-4 text-left"
                        >
                          {t("dashboard.automod.select")}
                        </th>
                        <th
                          scope="col"
                          className="text-sm font-medium px-6 py-4 text-left"
                        >
                          {t("dashboard.automod.event")}
                        </th>
                        <th
                          scope="col"
                          className="text-sm font-medium px-6 py-4 text-left"
                        >
                          {t("dashboard.automod.start")}
                        </th>
                      </tr>
                    </thead>
                    {guildAutomodData?.map(automod => (
                      <>
                        <tbody className="bg-purple-100 ">
                          <tr className="border-b">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              <input
                                type={"checkbox"}
                                checked={getChecked(automod._id)}
                                onChange={e => {
                                  if (e.target.checked) {
                                    setDeleteAutomods(prev => [
                                      ...prev,
                                      automod._id,
                                    ]);
                                  } else {
                                    setDeleteAutomods(prev => [
                                      ...prev.filter(id => {
                                        return id !== automod._id;
                                      }),
                                    ]);
                                  }
                                }}
                              />
                            </td>
                            <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                              {automod.event === "autorole" &&
                                "유저 접속시 역할지급"}
                              {automod.event === "blacklist_ban" &&
                                "블렉리스트 자동차단"}
                              {automod.event === "resetchannel" &&
                                "매일 12시 채널 초기화"}
                              {automod.event === "usecurse" && "욕설 사용시"}
                              {automod.event === "uselink" && "링크 사용시"}
                              {automod.event === "usercreateat" &&
                                "계정 생성일 제한"}
                            </td>
                            <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                              {automod.start === "delete" && "메시지 삭제"}
                              {automod.start === "warning" &&
                                "메시지 삭제 후 경고지급"}
                              {automod.start === "kick" &&
                                "메시지 삭제 후 추방"}
                              {automod.start === "ban" && "메시지 삭제 후 차단"}
                              {automod.event === "resetchannel" && (
                                <>
                                  #{" "}
                                  {
                                    guildData.channels.find(channel => {
                                      return channel.id === automod.start;
                                    })?.name
                                  }
                                </>
                              )}
                              {automod.event === "autorole" && (
                                <>
                                  {
                                    guildData.roles.find(role => {
                                      return role.id === automod.start;
                                    })?.name
                                  }
                                </>
                              )}
                              {automod.event === "blacklist_ban" && <>사용중</>}
                            </td>
                          </tr>
                        </tbody>
                      </>
                    ))}
                  </table>
                </div>
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
          {eventType === "usercreateat" && (
            <div className="flex lg:flex-row flex-col lg:items-baseline items-start justify-between mt-2">
              <span className="font-bold text-lg">
                {t("dashboard.automod.start")}
              </span>
              <div className="flex items-start flex-col w-full lg:max-w-[250px] lg:mt-0 mt-2">
                <Input
                  type={"number"}
                  max={30}
                  className="h-12 w-full"
                  placeholder={"1일"}
                  onChangeHandler={setStartTarget}
                />
              </div>
            </div>
          )}
          {error && (
            <span className="text-sm font-bold mt-1 text-red-500">{error}</span>
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
