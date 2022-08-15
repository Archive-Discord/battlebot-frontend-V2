import type {
  Guild,
  PageDefaultProps,
  PaymentsMethods as Methods,
  PayMethods,
  User,
} from "@types";
import type { GetServerSideProps, NextPage } from "next";
import type { User as DiscordUser } from "discord.js";
import type { MethodId } from "@tosspayments/brandpay-types";
import {
  cookieParser,
  guildProfileLink,
  numberWithCommas,
  userAvaterLink,
} from "@utils/utils";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { brandpay, tossPayments } from "@utils/toss";
import { SmallLoading } from "@components/Loading";
import { payMethods } from "@utils/Constants";
import { AxiosError } from "axios";
import client, { swrfetcher } from "@utils/client";
import dynamic from "next/dynamic";
import useSWR from "swr";
import PaymentsMethods from "@components/PaymentsMethods";
import Toast from "@utils/toast";
import Error from "@components/Error";
import { useTranslation } from "react-i18next";
import Seo from "@components/Seo";

const Login = dynamic(() => import("@components/Login"));
const Loading = dynamic(() => import("@components/Loading"));
const CheckBox = dynamic(() => import("@components/Checkbox"));
const Dropdown = dynamic(() => import("@components/Dropdown"));
const Input = dynamic(() => import("@components/Input"));

const PaymentsOrder: NextPage<PageDefaultProps> = ({
  auth,
  error,
  status,
  message,
  data,
}) => {
  const [name, setName] = useState<string>();
  const [phone, setPhone] = useState<string>();
  const [email, setEmail] = useState<string>();
  const [autoPayments, setAutoPayments] = useState<boolean>(false);
  const [culturelandFee, setCulturelandFee] = useState<boolean>(false);
  const [selectPayMethod, setSelectPayMethod] = useState<string>();
  const [payMethod, setPayMethod] = useState<PayMethods>();
  const [discount, setDiscount] = useState<number>(0);
  const [defaultAmount, setDefalutAmount] = useState<number>(
    data?.amount ? Number(data.amount) : 0
  );
  const [amount, setAmount] = useState<number>(0);
  const router = useRouter();
  const { t } = useTranslation();
  useEffect(() => {
    setAmount(defaultAmount);
    if (discount > 1) setAmount(defaultAmount - defaultAmount / discount);
    if (payMethod === "battlepay") {
      setAmount(prev => prev);
    } else if (payMethod === "cultureland") {
      setAmount(defaultAmount + defaultAmount / 10);
    }
  }, [payMethod, discount]);

  const { data: userData, error: userError } = useSWR<User>(
    `/auth/me`,
    swrfetcher
  );
  const {
    data: userCards,
    error: userCardsError,
    mutate: reloadCards,
  } = useSWR<Methods[]>(`/payments/methods`, swrfetcher);

  if (error && status === 401) return <Login />;
  if (error && message)
    return (
      <Error message={message}>
        <button
          className="hover:bg-gray-200 border font-bold rounded-md px-3 py-1 mt-5"
          onClick={() => router.back()}
        >
          {t("retry")}
        </button>
      </Error>
    );
  if (!auth) return <Login />;
  if (userError && userError.cause === 401) return <Login />;
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

  const paymentsMethodHandler = (method: string) => {
    setSelectPayMethod(method);
  };
  const payMethodsHanler = (method: string) => {
    setPayMethod(method as PayMethods);
  };
  const requestPayments = () => {
    if (!name) return Toast(t("input.error.noName"), "error");
    if (!email) return Toast(t("input.error.noEmail"), "error");
    if (!phone) return Toast(t("input.error.noPhone"), "error");
    if (payMethod === "battlepay") {
      if (!autoPayments)
        return Toast(t("payments.acceptAutoPayments"), "error");
      if (!userCards || userCards.length === 0)
        return Toast(t("payments.noCard"), "error");
      brandpay(userData).then(pay => {
        pay
          .requestPayment({
            amount: amount,
            orderId: data.id,
            orderName: data.name,
            customerEmail: email,
            methodId: selectPayMethod
              ? (selectPayMethod as MethodId)
              : (userCards[0].id as MethodId),
          })
          .then(result => {
            return client("POST", "/payments/confirm-payment", {
              phone: phone ? phone.replace(/-/g, "") : userData.phone,
              email: email ? email : userData.email,
              ...result,
            }).then(payments => {
              if (payments.error) throw new AxiosError(payments.message);
            });
          })
          .then(() => {
            router.push(`/payments/success?orderId=${data.id}`);
          })
          .catch(error => {
            Toast(error.message, "error");
          });
      });
    } else if (payMethod === "cultureland") {
      if (!culturelandFee) return Toast(t("payments.cultureland.fee"), "error");
      tossPayments().then(payments => {
        payments.requestPayment("문화상품권", {
          amount: amount,
          orderId: data.id,
          orderName: data.name,
          customerEmail: email,
          successUrl: window.location.origin + `/payments/gift?phone=${phone}`,
          failUrl: window.location.origin + `/payments/fail?phone=${phone}`,
        });
      });
    }
  };
  return (
    <>
      <Seo title="결제" />
      <div
        className="min-h-[100vh] container lg:p-10 p-3 lg:mt-12 mt-16"
        style={{ fontFamily: "Noto Sans KR" }}
      >
        <span className="text-3xl font-bold">{t("payments.orderInfo")}</span>
        <div className="flex mt-5 flex-wrap lg:flex-nowrap">
          <div className="lg:w-3/5 w-full lg:mr-3">
            <div className="w-full border p-5 rounded-lg">
              <span className="text-xl font-bold">
                <i className="fas fa-user mr-2" />
                {t("payments.usersInfo")}
              </span>
              <div className="flex-wrap flex flex-row text-lg my-3 items-center">
                <span>{t("payments.name")}</span>
                <Input
                  placeholder={t("input.error.noName")}
                  defaultValue={userData.user.username}
                  onChangeHandler={value => setName(value)}
                  className="text-base ml-auto lg:w-80 w-full lg:mt-0 mt-1"
                />
              </div>
              <div className="flex-wrap flex flex-row text-lg my-3 items-center">
                <span>연락처</span>
                <Input
                  type={"phone"}
                  placeholder={t("input.error.phoneNumberCheck")}
                  defaultValue={userData.phone ? userData.phone : undefined}
                  onChangeHandler={value => setPhone(value?.replace(/-/g, ""))}
                  className="text-base ml-auto lg:w-80 w-full lg:mt-0 mt-1"
                />
              </div>
              <div className="flex-wrap flex flex-row text-lg my-3 items-center">
                <span>이메일</span>
                <Input
                  type={"email"}
                  placeholder={t("input.error.noEmail")}
                  defaultValue={
                    userData.email
                      ? userData.email
                      : userData.kakao_email
                      ? userData.kakao_email
                      : undefined
                  }
                  onChangeHandler={value => setEmail(value)}
                  className="text-base ml-auto lg:w-80 w-full lg:mt-0 mt-1"
                />
              </div>
            </div>
            <div className="w-full border p-5 rounded-lg mt-5">
              <div className="flex flex-row justify-between mb-2">
                <span className="text-xl font-bold">
                  <i className="fas fa-credit-card mr-2" />
                  {t("payments.method")}
                </span>
              </div>
              <Dropdown items={payMethods} selectCallback={payMethodsHanler} />
              {payMethod === "battlepay" ? (
                <>
                  {userCards ? (
                    <PaymentsMethods
                      methods={userCards}
                      selectMethod={paymentsMethodHandler}
                      methodAddHanler={addMethod}
                    />
                  ) : (
                    <SmallLoading className="w-36 h-36" />
                  )}
                </>
              ) : (
                <></>
              )}
            </div>
          </div>
          <div className="lg:w-2/5 w-full lg:mt-0 mt-5">
            <div className="w-full border p-5 rounded-lg">
              <span className="text-xl font-bold">
                <i className="fas fa-shopping-cart mr-2" />
                {t("payments.itemInfo")}
              </span>
              <div className="flex flex-row mt-3 h-24">
                <img
                  className="w-24 rounded-xl border mr-2"
                  src={
                    data.metadata.type === "guild"
                      ? guildProfileLink(data.metadata as Guild)
                      : userAvaterLink(data.metadata as DiscordUser)
                  }
                />
                <div className="flex flex-col h-full pb-1">
                  <span className="font-bold">{data.name}</span>
                  <span className="text-sm">{data.metadata.name}</span>
                  <span className="font-bold text-xl mt-auto">
                    {numberWithCommas(data.amount as number)}
                    {t("payments.won")}
                  </span>
                </div>
              </div>
              <hr className="w-full my-4" />
              <div>
                <div className="flex flex-row justify-between">
                  <span className="text-lg font-bold">
                    {t("payments.orderAmount")}
                  </span>
                  <span className="text-lg">
                    {numberWithCommas(data.amount as number)}
                    {t("payments.won")}
                  </span>
                </div>
                {discount > 1 ? (
                  <>
                    <div className="flex flex-row justify-between">
                      <span className="text-lg font-bold">
                        {t("payments.disacountAmount")}
                      </span>
                      <span className="text-lg">
                        -{numberWithCommas(defaultAmount / discount)}
                        {t("payments.won")}
                      </span>
                    </div>
                  </>
                ) : (
                  <></>
                )}
                {payMethod === "cultureland" ? (
                  <>
                    <div className="flex flex-row justify-between">
                      <span className="text-lg font-bold">
                        {t("payments.cultureland.feeAmount")}
                      </span>
                      <span className="text-lg">
                        {numberWithCommas(defaultAmount / 10)}
                        {t("payments.won")}
                      </span>
                    </div>
                  </>
                ) : (
                  <></>
                )}
              </div>
              <hr className="w-full my-4" />
              <div className="flex flex-row justify-between items-center">
                <span className="text-2xl font-bold">
                  {t("payments.amount")}
                </span>
                <span className="text-lg">
                  {t("payments.month")}{" "}
                  <span className="font-bold text-xl">
                    {numberWithCommas(amount)}
                  </span>
                  {t("payments.won")}
                </span>
              </div>
              {payMethod === "cultureland" ? (
                <>
                  <CheckBox
                    className="mt-2"
                    placeholder={t("payments.cultureland.agree")}
                    onChangeHandler={check => setCulturelandFee(check)}
                  />
                </>
              ) : (
                <>
                  <CheckBox
                    className="mt-2"
                    placeholder={t("payments.battlepay.autoPayment")}
                    onChangeHandler={check => setAutoPayments(check)}
                  />
                </>
              )}
              <button
                onClick={() => {
                  requestPayments();
                }}
                className="w-full py-3 rounded-lg mt-6 bg-[#7C3AED] text-white font-bold"
              >
                {t("payments.payments")}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async ctx => {
  const cookies = cookieParser(ctx);
  const auth = cookies?.Authorization ? cookies.Authorization : null;
  const data = await client(
    "GET",
    `/payments/order/${ctx.params?.id}`,
    null,
    auth
  );
  return {
    props: {
      auth,
      ...JSON.parse(JSON.stringify(data)),
    },
  };
};

export default PaymentsOrder;
