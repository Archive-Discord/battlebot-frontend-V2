import type { GetServerSideProps, NextPage } from "next/types";
import { PageDefaultProps, User } from "@types";
import client, { swrfetcher } from "@utils/client";
import { cookieParser, guildProfileLink } from "@utils/utils";
import Error from "@components/Error";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";
import { SwitchTransition, CSSTransition } from "react-transition-group";
import { useRef, useState } from "react";
import Button from "@components/Button";
import HCaptcha from "@hcaptcha/react-hcaptcha";
import Toast from "@utils/toast";
import LottieAnimaition from "@components/LottieAnimaition";
import Login from "@components/Login";
import Modal from "@components/Modal";
import Input from "@components/Input";
import useSWR from "swr";
import Loading from "@components/Loading";
import Advertisement from "@components/Adsense";
import Seo from "@components/Seo";

const Invite: NextPage<PageDefaultProps & { path: string }> = ({
  error,
  message,
  data,
  path,
  auth,
}) => {
  const [page, setPage] = useState<"email" | "phone" | "kakao" | "end" | null>(
    data?.option ? data.option : null
  );
  const [isSend, setIsSend] = useState(false);
  const [email, setEmail] = useState<string>();
  const [phone, setPhone] = useState<string>();
  const [sendError, setSendError] = useState<string>();
  const [emailToken, setEmailToken] = useState<string>();
  const [phoneToken, setPhoneToken] = useState<string>();
  const [emailCode, setEmailCode] = useState<string>();
  const [phoneCode, setPhoneCode] = useState<string>();
  const captchaRef = useRef<HCaptcha>(null);
  const router = useRouter();
  const { t } = useTranslation();
  const { data: userData, error: userError } = useSWR<User>(
    `/auth/me`,
    swrfetcher
  );
  if (error && message)
    return (
      <Error message={message}>
        <button
          className="hover:bg-gray-200 font-bold rounded-md px-3 py-1 mt-5"
          onClick={() => router.back()}
        >
          {t("beforePage")}
        </button>
      </Error>
    );
  if (userError && userError.cause === 401) return <Login />;
  if (!userData) return <Loading />;

  const handleVerify = (token: string) => {
    client("POST", `/invite/${path}`, { token }).then(res => {
      if (res.error) {
        captchaRef.current?.resetCaptcha();
        Toast(res.message, "error");
      } else {
        setPage("end");
      }
    });
  };

  const handleEmailVerify = () => {
    setSendError(undefined)
    if (!emailCode) return setSendError("인증번호를 입력해주세요");
    client("POST", `/invite/${path}/email/verify`, {
      token: emailToken,
      code: emailCode,
    }).then(res => {
      if (res.error) {
        setSendError(res.message);
      } else {
        setPage(null);
      }
    });
  };
  const handleSendEmail = () => {
    if (!email) return;
    client("POST", `/invite/${path}/email`, {
      email,
    }).then(res => {
      if (res.error) {
        setSendError(res.message);
      } else {
        setIsSend(true);
        setEmailToken(res.data);
      }
    });
  };

  const handlePhoneVerify = () => {
    if (!phoneCode) return setSendError("인증번호를 입력해주세요");
    client("POST", `/invite/${path}/phone/verify`, {
      token: phoneToken,
      code: phoneCode,
    }).then(res => {
      if (res.error) {
        setSendError(res.message);
      } else {
        setPage(null);
      }
    });
  };

  const handleSendPhone = () => {
    if (!phone) return;
    client("POST", `/invite/${path}/phone`, {
      phone,
    }).then(res => {
      if (res.error) {
        setSendError(res.message);
      } else {
        setIsSend(true);
        setPhoneToken(res.data.token);
      }
    });
  };
  return (
    <>
      <Seo
        title={`${data.metadata.name} 서버 입장`}
        description={`${data.metadata.name} 서버에 인증 후 안전하게 입장하세요!`}
        image={guildProfileLink(data.metadata)}
      />
      <div
        className="min-h-[100vh] flex items-center justify-center flex-col"
        style={{ fontFamily: "Noto Sans KR" }}
      >
        <div className="max-w-7xl mx-auto w-full pt-3 pb-7">
          <Advertisement />
        </div>
        <div className="flex flex-col items-center">
          <div className="flex flex-col items-center">
            <img
              className="rounded-full my-2 w-40"
              src={guildProfileLink(data.metadata)}
            />
            <p className="text-2xl font-bold">{data.metadata.name}</p>
          </div>
          <SwitchTransition mode={"out-in"}>
            <CSSTransition
              key={page ? page : "captha"}
              addEndListener={(node, done) => {
                node.addEventListener("transitionend", done, false);
              }}
              classNames="fade"
            >
              <div className="flex flex-col items-center">
                {page === "phone" && userData?.phone ? (
                  <>
                    <Modal
                      description="해당 서버는 휴대폰 인증을 진행한 후 입장이 가능합니다"
                      title="휴대폰 인증"
                      button={
                        <>
                          <Button
                            type="success"
                            label="인증"
                            onClick={() => {
                              setPage(null);
                            }}
                          />
                        </>
                      }
                      isOpen={true}
                      callbackOpen={console.log}
                      notClose
                    >
                      <div className="flex items-center">
                        <LottieAnimaition
                          className="w-10 h-10 mr-1"
                          animation={require("../../lottieFiles/success.json")}
                          loop={false}
                        />
                        <span className="text-base font-bold">
                          기존에 인증한 휴대폰으로 인증을 진행합니다
                        </span>
                      </div>
                    </Modal>
                  </>
                ) : (
                  <>
                    {page === "phone" && (
                      <>
                        <Modal
                          description="해당 서버는 휴대폰 인증을 진행한 후 입장이 가능합니다"
                          title="휴대폰 인증"
                          button={
                            <>
                              <Button
                                type="success"
                                label="인증"
                                disable={phoneToken ? false : true}
                                onClick={handlePhoneVerify}
                              />
                            </>
                          }
                          isOpen={true}
                          callbackOpen={console.log}
                          notClose
                        >
                          <div className="flex lg:items-center lg:flex-row flex-col mb-3">
                            <span className="text-lg font-bold lg:mb-0 mb-1">
                              전화번호
                            </span>
                            <div className="flex flex-row lg:ml-auto lg:max-w-[310px] lg:w-full">
                              <Input
                                className="w-[70%] mr-2"
                                type={"phone"}
                                disable={isSend ? true : false}
                                onChangeHandler={value =>
                                  setPhone(value?.replace(/-/g, ""))
                                }
                                placeholder="01012341234"
                                defaultValue={userData?.phone}
                              />
                              <Button
                                label={isSend ? "전송됨" : "전송"}
                                disable={isSend ? true : false}
                                type="success"
                                className="w-full rounded-lg"
                                onClick={handleSendPhone}
                              />
                            </div>
                          </div>
                          <div className="flex lg:items-baseline lg:flex-row flex-col">
                            <span className="text-lg font-bold lg:mb-0 mb-1">
                              인증번호
                            </span>
                            <div className="flex flex-col lg:ml-auto lg:max-w-[310px] lg:w-full">
                              <Input
                                className="w-full"
                                onChangeHandler={setPhoneCode}
                                placeholder="인증번호"
                              />
                              {sendError && (
                                <span className="text-sm font-bold mt-1 text-red-500">
                                  {sendError}
                                </span>
                              )}
                            </div>
                          </div>
                        </Modal>
                      </>
                    )}
                  </>
                )}
                {page === "email" && (
                  <>
                    <Modal
                      description="해당 서버는 이메일 인증을 진행한 후 입장이 가능합니다"
                      title="이메일 인증"
                      button={
                        <>
                          <Button
                            type="success"
                            label="인증"
                            disable={emailToken ? false : true}
                            onClick={handleEmailVerify}
                          />
                        </>
                      }
                      isOpen={true}
                      callbackOpen={console.log}
                      notClose
                    >
                      <div className="flex lg:items-center lg:flex-row flex-col mb-3">
                        <span className="text-lg font-bold lg:mb-0 mb-1">
                          이메일
                        </span>
                        <div className="flex flex-row lg:ml-auto lg:max-w-[310px] lg:w-full">
                          <Input
                            className="w-[100%] mr-2"
                            type={"email"}
                            disable={isSend ? true : false}
                            onChangeHandler={setEmail}
                            placeholder="admin@battlebot.kr"
                            defaultValue={userData?.email}
                          />
                          <Button
                            label={isSend ? "전송됨" : "전송"}
                            disable={isSend ? true : false}
                            type="success"
                            className="w-[40%] rounded-lg"
                            onClick={handleSendEmail}
                          />
                        </div>
                      </div>
                      <div className="flex lg:items-baseline lg:flex-row flex-col">
                        <span className="text-lg font-bold lg:mb-0 mb-1">
                          인증번호
                        </span>
                        <div className="flex flex-col lg:ml-auto lg:max-w-[310px] lg:w-full">
                          <Input
                            className="w-full"
                            onChangeHandler={setEmailCode}
                            placeholder="인증번호"
                          />
                          {sendError && (
                            <span className="text-sm font-bold mt-1 text-red-500">
                              {sendError}
                            </span>
                          )}
                        </div>
                      </div>
                    </Modal>
                  </>
                )}
                {!page && (
                  <>
                    <p className="lg:text-xl text-base mt mb-2">
                      인증시 서버에 자동으로 입장됩니다
                    </p>
                    <HCaptcha
                      sitekey={
                        process.env.NODE_ENV === "development"
                          ? "10000000-ffff-ffff-ffff-000000000001"
                          : (process.env
                              .NEXT_PUBLIC_CAPTHA_CLIENT_KEY as string)
                      }
                      ref={captchaRef}
                      onVerify={token => handleVerify(token)}
                    />
                  </>
                )}
                {page === "end" && (
                  <>
                    <span className="flex flex-row items-center lg:text-xl text-base">
                      <LottieAnimaition
                        className="lg:w-12 lg:h-12 w-8 h-8"
                        animation={require("../../lottieFiles/success.json")}
                        loop={false}
                      />
                      성공적으로 서버에 입장되었습니다
                    </span>
                  </>
                )}
              </div>
            </CSSTransition>
          </SwitchTransition>
        </div>
        <div className="max-w-7xl mx-auto w-full pt-7 pb-3">
          <Advertisement />
        </div>
      </div>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async ctx => {
  const cookies = cookieParser(ctx);
  const { data, error, message } = await client(
    "GET",
    `/invite/${encodeURI(ctx.params?.id as string)}`
  );
  if (error) {
    return {
      props: {
        auth: cookies?.Authorization ? cookies.Authorization : null,
        path: ctx.params?.id,
        error: true,
        message: message,
      },
    };
  } else {
    return {
      props: {
        auth: cookies?.Authorization ? cookies.Authorization : null,
        path: ctx.params?.id,
        error: false,
        data,
      },
    };
  }
};

export default Invite;
