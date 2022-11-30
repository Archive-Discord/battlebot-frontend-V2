import type {
  PageDefaultProps,
  Subscribe,
  User,
  PaymentsMethods as Methods,
  PaymentsTarget,
  paymentsType,
} from "@types";
import type { Guild, User as DiscordUser } from "discord.js";
import type { NextPage, GetServerSideProps } from "next";
import {
  cookieParser,
  guildProfileLink,
  numberWithCommas,
  userAvaterLink,
} from "@utils/utils";
import { useRouter } from "next/router";
import client, { swrfetcher } from "@utils/client";
import dynamic from "next/dynamic";
import dayjs, { Dayjs } from "dayjs";
import Error from "@components/Error";
import { useTranslation } from "react-i18next";
import Seo from "@components/Seo";
import useSWR from "swr";
import Loading, { SmallLoading } from "@components/Loading";
import { brandpay, tossPayments } from "@utils/toss";
import Button from "@components/Button";
import Modal from "@components/Modal";
import { useEffect, useState } from "react";
import PaymentsMethods from "@components/PaymentsMethods";
import Toast from "@utils/toast";
import Dropdown from "@components/Dropdown";

const Login = dynamic(() => import("@components/Login"));

const PaymentsSuccess: NextPage<PageDefaultProps> = ({
  auth,
  error,
  status,
  message,
  data,
}) => {
  const [openModal, setOpenModal] = useState(false);
  const [method, setMethod] = useState<string>();
  const [selectSubscribe, setSelectSubscribe] = useState<Subscribe>();
  const [selectSubscribePayments, setSelectSubscribePayments] =
    useState<PaymentsTarget[]>();
  const router = useRouter();
  const { t } = useTranslation();
  const { data: userData, error: userError } = useSWR<User>(
    `/auth/me`,
    swrfetcher
  );
  const {
    data: subscribesData,
    error: subscribesError,
    mutate: reloadSubscribes,
  } = useSWR<Subscribe[]>(`/payments/subscribes`, swrfetcher, {
    refreshInterval: 500000,
  });
  const {
    data: userCards,
    error: userCardsError,
    mutate: reloadCards,
  } = useSWR<Methods[]>(`/payments/methods`, swrfetcher);

  useEffect(() => {
    if (subscribesData) {
      setSelectSubscribePayments([]);
      client("GET", `/payments/order/target/${selectSubscribe?.target}`).then(
        res => {
          if (res.error)
            return Toast("결제정보를 불러오는데 실패했습니다", "error");
          setSelectSubscribePayments(res.data);
        }
      );
    }
  }, [selectSubscribe]);

  useEffect(() => {
    if (!selectSubscribe && subscribesData) {
      setSelectSubscribe(subscribesData[0]);
    }
  }, [subscribesData]);

  if (error && message)
    return (
      <Error message={message}>
        <button
          className="hover:bg-gray-200 border font-bold rounded-md px-3 py-1 mt-5"
          onClick={() => router.back()}
        >
          {t("beforePage")}
        </button>
      </Error>
    );
  if (!auth) return <Login />;
  if (userError) return <Login />;
  if (!userData) return <Loading />;
  if (userCardsError) {
    brandpay(userData).then(pay => {
      pay.authenticate();
    });
  }
  const addMethod = () => {
    brandpay(userData).then(pay => {
      pay.addPaymentMethod().then(result => {
        reloadCards();
      });
    });
  };
  const changeMethod = () => {
    setOpenModal(false);
    if (selectSubscribe?.paymentsType === "kakaopay") {
      // @ts-ignore
      window.ChannelIO(
        "openChat",
        undefined,
        `카카오페이 결제수단 변경요청\n결제ID: ${selectSubscribe._id}\n유저ID: ${userData.id}`
      );
    } else if (selectSubscribe?.paymentsType === "tosspayments") {
      if (!method) return;
      client(
        "POST",
        `/payments/subscribes/${selectSubscribe._id}/changemethod`,
        {
          method,
          paymentsType: "tosspayments",
        }
      ).then(res => {
        if (res.error) {
          return Toast(res.message, "error");
        }
        Toast("결제 수단이 변경되었습니다", "success");
        reloadSubscribes();
      });
    }
  };

  const autoPayHandler = (status: boolean) => {
    client("POST", `/payments/subscribes/${selectSubscribe?._id}/autopay`, {
      status,
    }).then(res => {
      if (res.error) {
        return Toast(res.message, "error");
      }
      if (res.data) {
        Toast(`${selectSubscribe?.name}의 자동결제를 사용합니다`, "success");
      } else {
        Toast(`${selectSubscribe?.name}의 자동결제를 미사용합니다`, "error");
      }
      reloadSubscribes();
    });
  };

  const useingPayMethod = {
    tosspayments: (
      <UseingMethod userCards={userCards} selectSubscribe={selectSubscribe} />
    ),
    kakaopay: <span className="font-bold">카카오 페이</span>,
  };

  const changeMethodItems = {
    tosspayments: (
      <PaymentsMethods
        methods={userCards ? userCards : []}
        selectMethod={setMethod}
        methodAddHanler={addMethod}
      />
    ),
    kakaopay: (
      <div className="lg:ml-auto">
        <span>결제수단 변경을 위해 우측 하단 변경 버튼을 눌러주세요</span>
      </div>
    ),
  };

  return (
    <>
      <Seo title="결제관리" />
      <div
        className="min-h-[100vh] container lg:p-10 p-3 lg:mt-12 mt-16"
        style={{ fontFamily: "Noto Sans KR" }}
      >
        <div className="flex flex-col">
          <span className="text-3xl font-bold">{t("payments.users.user")}</span>
          <span className="text-xl text-gray-500">
            {t("payments.users.userDescription")}
          </span>
        </div>
        <div className="flex mt-5 flex-wrap lg:flex-nowrap">
          <div className="lg:w-3/5 w-full lg:mr-3">
            <div className="w-full border p-5 rounded-lg">
              <span className="text-xl font-bold">
                <i className="fas fa-shopping-bag mr-2" />
                구독중인 목록
              </span>
              {subscribesData?.length === 0 ? (
                <>
                  <div className="flex items-center justify-center mt-2 text-lg">
                    <span>구독중인 향목이 없습니다</span>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex flex-col space-y-2 mt-2">
                    {subscribesData?.map(subscribes => (
                      <>
                        <div
                          className={`flex flex-row border rounded-2xl px-3 py-4 items-center justify-between cursor-pointer ${
                            subscribes._id === selectSubscribe?._id
                              ? "bg-gray-100"
                              : ""
                          }`}
                          onClick={() => {
                            setSelectSubscribe(subscribes);
                          }}
                        >
                          <div className="flex flex-row items-center">
                            <img
                              className="w-10 h-10 rounded-full mr-3"
                              src={
                                subscribes.targetType === "guild"
                                  ? guildProfileLink(
                                      subscribes.metadata as Guild
                                    )
                                  : userAvaterLink(
                                      subscribes.metadata as DiscordUser
                                    )
                              }
                            />
                            <div className="flex flex-col">
                              <span className="font-bold text-lg">
                                {subscribes.name}
                              </span>
                              <div className="flex flex-row text-base lg:flex-nowrap flex-wrap text-gray-600">
                                <span>
                                  {subscribes.targetType === "user"
                                    ? // @ts-ignore
                                      subscribes.metadata.username
                                    : // @ts-ignore
                                      subscribes.metadata.name}
                                </span>
                                <span className="mx-1">/</span>
                                <span>
                                  {numberWithCommas(
                                    Number(subscribes.product.amount)
                                  )}
                                  원
                                </span>
                                {!subscribes.useing && (
                                  <span className="px-2 ml-1 bg-red-500 text-white rounded-md text-sm flex items-center">
                                    자동결제 미사용
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                          <Button
                            className="max-w-[54px] w-full"
                            type="success"
                            label="관리"
                            onClick={() => {
                              setSelectSubscribe(subscribes);
                              setOpenModal(true);
                            }}
                          />
                        </div>
                      </>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
          <div className="lg:w-2/5 w-full lg:mt-0 mt-5">
            <div className="w-full border p-5 rounded-lg">
              <span className="text-xl font-bold">
                <i className="fas fa-credit-card mr-2" />
                결제정보
              </span>
              <div className="mt-2 space-y-2">
                {!selectSubscribePayments ? (
                  <>
                    <span>결제 기록이 없습니다</span>
                  </>
                ) : (
                  <>
                    {selectSubscribePayments.length === 0 ? (
                      <>
                        <SmallLoading />
                      </>
                    ) : (
                      <>
                        {selectSubscribePayments
                          .reverse()
                          .map(subscribePayment => (
                            <>
                              {subscribePayment.paymentsErrors &&
                              subscribePayment.paymentsErrors?.length != 0 ? (
                                <>
                                  <div
                                    className={`flex flex-row border rounded-2xl px-3 py-4 items-center bg-red-100 justify-between`}
                                  >
                                    <div className="flex flex-row items-center">
                                      <div className="flex flex-col">
                                        <span className="font-bold text-lg space-x-1">
                                          <span>결제실패</span>
                                          <span className="text-sm font-gray-300">
                                            {dayjs(
                                              subscribePayment.createAt
                                            ).format("YYYY.MM.DD HH시 MM분")}
                                          </span>
                                        </span>
                                        <div className="flex flex-row text-base lg:flex-nowrap flex-wrap text-gray-600">
                                          <span>{subscribePayment.name}</span>
                                          <span className="mx-1">/</span>
                                          <span>
                                            {
                                              subscribePayment.paymentsErrors[0]
                                                .message
                                            }
                                          </span>
                                          <span className="mx-1">/</span>
                                          <span>
                                            {numberWithCommas(
                                              Number(subscribePayment.amount)
                                            )}
                                            원
                                          </span>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </>
                              ) : (
                                <>
                                  <div
                                    className={`flex flex-row border rounded-2xl px-3 py-4 items-center justify-between`}
                                  >
                                    <div className="flex flex-row items-center">
                                      <div className="flex flex-col">
                                        <span className="font-bold text-lg space-x-1">
                                          <span>
                                            {subscribePayment.payment.method}
                                          </span>
                                          <span className="text-sm font-gray-300">
                                            {dayjs(
                                              subscribePayment.createAt
                                            ).format("YYYY.MM.DD HH시 MM분")}
                                          </span>
                                        </span>
                                        <div className="flex flex-row text-base lg:flex-nowrap flex-wrap text-gray-600">
                                          <span>{subscribePayment.name}</span>
                                          <span className="mx-1">/</span>
                                          <span>
                                            {subscribePayment.payment.card && (
                                              <>
                                                {
                                                  subscribePayment.payment.card
                                                    .company
                                                }{" "}
                                                {
                                                  subscribePayment.payment.card
                                                    .number
                                                }
                                                <span className="mx-1">/</span>
                                              </>
                                            )}
                                          </span>
                                          <span>
                                            {numberWithCommas(
                                              Number(subscribePayment.amount)
                                            )}
                                            원
                                          </span>
                                        </div>
                                      </div>
                                    </div>
                                    <Button
                                      className="max-w-[54px] w-full"
                                      type="success"
                                      label="상세"
                                      onClick={() => {
                                        router.push(
                                          `/payments/success?orderId=${subscribePayment.id}`
                                        );
                                      }}
                                    />
                                  </div>
                                </>
                              )}
                            </>
                          ))}
                      </>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <Modal
        title={"구독관리"}
        button={<Button label="변경" type="success" onClick={changeMethod} />}
        isOpen={openModal}
        callbackOpen={setOpenModal}
      >
        <div className="flex flex-row items-center items-start justify-between mb-3">
          <span className="font-bold text-lg">자동결제</span>
          <label
            htmlFor="selectSubscribe-toggle"
            className="inline-flex relative items-center cursor-pointer"
          >
            <input
              type="checkbox"
              onChange={e => {
                setMethod(undefined);
                autoPayHandler(e.target.checked);
                setOpenModal(false);
              }}
              id="selectSubscribe-toggle"
              className="sr-only peer"
              checked={selectSubscribe?.useing}
            />
            <div className="w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-700 dark:peer-focus:ring-purple-800 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-purple-600" />
          </label>
        </div>
        <div className="flex lg:flex-row flex-col lg:items-baseline items-start justify-between">
          <span className="font-bold text-lg">사용중인 결제수단</span>
          <span>
            {useingPayMethod[selectSubscribe?.paymentsType as paymentsType]}
          </span>
        </div>
        <div className="flex-wrap flex lg:flex-row text-lg my-3">
          <span className="font-bold text-lg">결제수단 변경</span>
          {changeMethodItems[selectSubscribe?.paymentsType as paymentsType]}
        </div>
      </Modal>
    </>
  );
};

const UseingMethod: React.FC<{
  userCards?: Methods[];
  selectSubscribe?: Subscribe;
}> = ({ userCards, selectSubscribe }) => {
  const seletMethod = userCards?.find(card => {
    return card.id === selectSubscribe?.method;
  });
  return (
    <>
      <span className="font-bold mr-2">
        {seletMethod?.type === "account"
          ? seletMethod.accountName
          : seletMethod?.cardName}
      </span>
      <span>
        {seletMethod?.type === "account"
          ? seletMethod.accountNumber
          : seletMethod?.cardNumber}
      </span>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async ctx => {
  const cookies = cookieParser(ctx);
  const auth = cookies?.Authorization ? cookies.Authorization : null;
  return {
    props: {
      auth,
    },
  };
};

export default PaymentsSuccess;
