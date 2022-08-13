import type { CustomLinkList, Guild, PageDefaultProps } from "@types";
import type { NextPage, GetServerSideProps } from "next";
import { cookieParser, numberWithCommas } from "@utils/utils";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import client, { swrfetcher } from "@utils/client";
import useSWR from "swr";
import dynamic from "next/dynamic";
import Error from "@components/Error";
import Modal from "@components/Modal";
import Button from "@components/Button";
import Input from "@components/Input";
import Premium from "@components/Premium";
import CheckBox from "@components/Checkbox";
import Toast from "@utils/toast";

const Login = dynamic(() => import("@components/Login"));
const Layout = dynamic(() => import("@components/DashboardLayout"));
const Loading = dynamic(() => import("@components/Loading"));

const DashboardCustomLink: NextPage<PageDefaultProps> = ({ auth, guildId }) => {
  const router = useRouter();
  const { t } = useTranslation();
  const [openModal, setOpenModal] = useState(false);
  const [useCaptcha, setUseCaptcha] = useState(true);
  const [usePhone, setUsePhone] = useState(false);
  const [useKakao, setUseKakao] = useState(false);
  const [useEmail, setUseEmail] = useState(false);
  const [customLink, setCustomLink] = useState<string>();
  const [deleteCustomLinks, setDeleteCustomLinks] = useState<string[]>([]);
  useEffect(() => {
    if (useEmail) {
      setUseKakao(false);
      setUsePhone(false);
      return;
    }
  }, [useEmail, deleteCustomLinks]);

  useEffect(() => {
    if (usePhone) {
      setUseEmail(false);
      setUseKakao(false);
      return;
    }
  }, [usePhone]);

  useEffect(() => {
    if (useKakao) {
      setUseEmail(false);
      setUsePhone(false);
      return;
    }
  }, [useKakao]);

  const { data: guildData, error: guildError } = useSWR<Guild>(
    `/guilds/${guildId}`,
    swrfetcher,
    {
      refreshInterval: 30000,
    }
  );
  const { data: guildPremium, error: guildPremiumError } = useSWR<boolean>(
    `/guilds/${guildId}/premium`,
    swrfetcher,
    {
      refreshInterval: 30000,
    }
  );
  const { data: userData, error: userError } = useSWR<Guild>(
    `/auth/me`,
    swrfetcher
  );

  const {
    data: guildCustomlink,
    error: customlinkError,
    mutate: reloadCustomLink,
  } = useSWR<CustomLinkList>(`/guilds/${guildId}/customlink`, swrfetcher);

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
  const getChecked = (path: string): boolean => {
    if (deleteCustomLinks.includes(path)) {
      return true;
    }
    return false;
  };
  const generateCustomLink = () => {
    const option = useEmail
      ? "email"
      : usePhone
      ? "phone"
      : useKakao
      ? "kakao"
      : undefined;
    setOpenModal(false);
    setUseKakao(false);
    setUseEmail(false);
    setUsePhone(false);
    client("POST", `/guilds/${guildData.id}/customlink`, {
      type: customLink ? "custom" : "random",
      option: option ? option : null,
      path: customLink ? customLink : null,
    }).then(res => {
      if (res.error) {
        Toast(res.message, "error");
      } else {
        Toast(res.message, "success");
        reloadCustomLink();
      }
    });
  };
  const selectItemDelete = () => {
    client("DELETE", `/guilds/${guildData.id}/customlink`, {
      path: deleteCustomLinks,
    }).then(res => {
      setDeleteCustomLinks([])
      if (res.error) {
        Toast(res.message, "error");
      } else {
        Toast(
          t("dashboard.customlink.successDelete", { count: res.data.count }),
          "success"
        );
        reloadCustomLink();
      }
    });
  };
  return (
    <>
      <Layout guild={guildData}>
        <div className="w-full" style={{ fontFamily: "Noto Sans KR" }}>
          <div className="w-full flex flex-col mr-1.5 ml-1.5">
            <span className="text-2xl font-bold">
              {t("dashboard.customlink.customLink")}
            </span>
            <span className="text-lg mt-1 text-gray-500">
              {t("dashboard.customlink.useage")}
            </span>
          </div>
        </div>
        <div className="flex flex-col">
          <div className="overflow-x-auto flex flex-col">
            <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center px-2 mb-3 mt-2">
              <span className="text-xl font-bold">
                {t("dashboard.customlink.random")}
              </span>
              <div>
                <Button
                  className="mt-2 px-5 py-2 mr-2"
                  type="success"
                  label={t("dashboard.customlink.makeNew")}
                  onClick={() => setOpenModal(true)}
                  icon="fas fa-plus mr-2"
                />
                <Button
                  className="mt-2 px-5 py-2"
                  type="danger"
                  disable={deleteCustomLinks.length === 0 ? true : false}
                  label={t("dashboard.customlink.delete")}
                  onClick={selectItemDelete}
                  icon="fas fa-trash mr-2"
                />
              </div>
            </div>
            <div className="inline-block min-w-full px-2">
              <div className="overflow-x-auto rounded-lg max-h-[400px]">
                {guildCustomlink?.random.length === 0 ? (
                  <>
                    <div className="w-full flex items-center justify-center">
                      <button
                        onClick={() => setOpenModal(true)}
                        className="text-lg my-7"
                      >
                        {t("dashboard.customlink.onClickMakeRandom")}
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <table className="min-w-full ">
                      <thead className="bg-purple-500 border-b">
                        <tr className="text-white font-bold">
                          <th
                            scope="col"
                            className="text-sm font-medium px-6 py-4 text-left"
                          >
                            {t("dashboard.customlink.select")}
                          </th>
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
                        {guildCustomlink?.random.map(customlink => (
                          <>
                            <tr className="border-b">
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                <input
                                  type={"checkbox"}
                                  checked={getChecked(customlink.path)}
                                  onChange={e => {
                                    if (e.target.checked) {
                                      setDeleteCustomLinks(prev => [
                                        ...prev,
                                        customlink.path,
                                      ]);
                                    } else {
                                      setDeleteCustomLinks(prev => [
                                        ...prev.filter(path => {
                                          return path !== customlink.path;
                                        }),
                                      ]);
                                    }
                                  }}
                                />
                              </td>
                              <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                                <CopyToClipboard
                                  text={`https://battlebot.kr/invite/${customlink.path}`}
                                  onCopy={() => {
                                    Toast(
                                      t("dashboard.customlink.successCopy"),
                                      "success"
                                    );
                                  }}
                                >
                                  <span className="cursor-pointer">
                                    https://battlebot.kr/invite/
                                    {customlink.path}
                                  </span>
                                </CopyToClipboard>
                              </td>
                              <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                                {numberWithCommas(
                                  customlink.useage ? customlink.useage : 0
                                )}
                                회
                              </td>
                              <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                                {customlink.option == "email" &&
                                  t("dashboard.customlink.emailVerify")}
                                {customlink.option == "kakao" &&
                                  t("dashboard.customlink.kakaoVerify")}
                                {customlink.option == "phone" &&
                                  t("dashboard.customlink.phoneVerify")}
                                {!customlink.option &&
                                  t("dashboard.customlink.noneVerify")}
                              </td>
                            </tr>
                          </>
                        ))}
                      </tbody>
                    </table>
                  </>
                )}
              </div>
            </div>
          </div>
          <div className="flex flex-col w-full mt-6 px-2">
            <span className="text-xl font-bold mb-3">
              {t("dashboard.customlink.useingCustomlink")}
            </span>
            {guildCustomlink?.custom ? (
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
                            <CopyToClipboard
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
                            </CopyToClipboard>
                          </td>
                          <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                            {numberWithCommas(
                              guildCustomlink.custom.useage
                                ? guildCustomlink.custom.useage
                                : 0
                            )}
                            회
                          </td>
                          <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                            {guildCustomlink.custom.option == "email" &&
                              t("dashboard.customlink.emailVerify")}
                            {guildCustomlink.custom.option == "kakao" &&
                              t("dashboard.customlink.kakaoVerify")}
                            {guildCustomlink.custom.option == "phone" &&
                              t("dashboard.customlink.phoneVerify")}
                            {!guildCustomlink.custom.option && "없음"}
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
                  {guildPremium ? (
                    <button
                      onClick={() => setOpenModal(true)}
                      className="text-lg"
                    >
                      {t("dashboard.customlink.onClickMakeCustom")}
                    </button>
                  ) : (
                    <Premium
                      guild={guildData.id}
                      title={"커스텀 링크를 이용해보세요!"}
                    />
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </Layout>

      <Modal
        button={
          <Button
            type="success"
            onClick={() => generateCustomLink()}
            label={
              customLink
                ? t("dashboard.customlink.generate")
                : t("dashboard.customlink.generateRandom")
            }
          />
        }
        title={t("dashboard.customlink.makeCustomLink")}
        isOpen={openModal}
        callbackOpen={open => setOpenModal(open)}
      >
        <div className="flex flex-col">
          <div className="flex lg:flex-row flex-col lg:items-baseline items-start justify-between">
            <span className="font-bold text-lg">
              {t("dashboard.customlink.customLink")}
            </span>
            <div className="flex items-start flex-col">
              <div className="flex items-center">
                <span>https:///battlebot.kr/invite/</span>
                <Input
                  style={{
                    width: "inherit",
                  }}
                  className="lg:w-fit w-full ml-1"
                  type={"customlink"}
                  placeholder={"battlebot"}
                  disable={guildPremium ? false : true}
                  defaultValue={guildCustomlink?.custom?.path}
                  onChangeHandler={value => setCustomLink(value as string)}
                />
              </div>
              {customLink && (
                <span className="mt-1 text-red-400">
                  {t("dashboard.customlink.emptyRandomGenerate")}
                </span>
              )}
              {!guildPremium && (
                <Premium
                  title="서버만의 링크를 만들어보세요!"
                  guild={guildData.id}
                />
              )}
            </div>
          </div>
          <span className="font-bold text-lg mt-1">
            {t("dashboard.customlink.options")}
          </span>
          <div className="grid lg:grid-cols-2 grid-cols-1 gap-4 mt-1">
            <div className="flex flex-col">
              <CheckBox
                placeholder={t("dashboard.customlink.useCaptha")}
                isSelect={true}
                disable
                onChangeHandler={setUseCaptcha}
              />
              <span className="ml-6 text-sm text-gray-500 mb-1">
                {t("dashboard.customlink.useCapthaDescription")}
              </span>
            </div>
            <div className="flex flex-col">
              <CheckBox
                placeholder={t("dashboard.customlink.useEmail")}
                isSelect={useEmail}
                onChangeHandler={setUseEmail}
              />
              <span className="ml-6 text-sm text-gray-500 mb-1">
                {t("dashboard.customlink.useEmailDescription")}
              </span>
            </div>
            <div className="flex flex-col">
              <CheckBox
                placeholder={t("dashboard.customlink.usePhone")}
                isSelect={usePhone}
                disable={guildPremium ? false : true}
                onChangeHandler={setUsePhone}
              />
              <span className="ml-6 text-sm text-gray-500 mb-">
                {t("dashboard.customlink.usePhoneDescription")}
              </span>
              {!guildPremium && (
                <Premium
                  title="전화번호 인증을 사용해보세요!"
                  guild={guildData.id}
                />
              )}
            </div>
            <div className="flex flex-col">
              <CheckBox
                placeholder={t("dashboard.customlink.useKakao")}
                isSelect={useKakao}
                disable={guildPremium ? false : true}
                onChangeHandler={setUseKakao}
              />
              <span className="ml-6 text-sm text-gray-500 mb-1">
                {t("dashboard.customlink.useKakaoDescription")}
              </span>
              {!guildPremium && (
                <Premium
                  title="카카오 계정 인증을 이용해보세요!"
                  guild={guildData.id}
                />
              )}
            </div>
          </div>
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

export default DashboardCustomLink;
