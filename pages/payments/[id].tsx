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
import { useState } from "react";
import { brandpay } from "@utils/toss";
import { SmallLoading } from "@components/Loading";
import { payMethods } from "@utils/Constants";
import { AxiosError } from "axios";
import client, { swrfetcher } from "@utils/client";
import dynamic from "next/dynamic";
import useSWR from "swr";
import PaymentsMethods from "@components/PaymentsMethods";
import Toast from "@utils/toast";

const Error = dynamic(() => import("@components/Error"));
const Login = dynamic(() => import("@components/Login"));
const Loading = dynamic(() => import("@components/Loading"));
const CheckBox = dynamic(() => import("@components/checkbox"));
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
  const [selectPayMethod, setSelectPayMethod] = useState<string>();
  const [payMethod, setPayMethod] = useState<PayMethods>();
  const router = useRouter();

  if (error && status === 401) return <Login />;
  if (error && message)
    return (
      <Error message={message}>
        <button
          className="hover:bg-gray-200 border font-bold rounded-md px-3 py-1 mt-5"
          onClick={() => router.back()}
        >
          이전 페이지로
        </button>
      </Error>
    );
  if (!auth) return <Login />;

  const { data: userData, error: userError } = useSWR<User>(
    `/auth/me`,
    swrfetcher
  );
  const {
    data: userCards,
    error: userCardsError,
    mutate: reloadCards,
  } = useSWR<Methods[]>(`/payments/methods`, swrfetcher);

  if (userError && userError.cause === 401) return <Login />;
  if (!userData) return <Loading />;
  if (userCardsError) {
    brandpay(userData).then((pay) => {
      pay.authenticate();
    });
  }
  const addMethod = () => {
    brandpay(userData).then((pay) => {
      pay.addPaymentMethod().then((result) => {
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
    if (!autoPayments) return Toast("자동결제 이용에 동의해주세요", "error");
    if (!name) return Toast("이름을 입력해주세요", "error");
    if (!email) return Toast("이메일을 입력해주세요", "error");
    if (!phone) return Toast("전화번호를 입력해주세요", "error");
    if (payMethod === "battlepay") {
      if (!userCards || userCards.length === 0)
        return Toast("등록된 카드가 없습니다", "error");
      brandpay(userData).then((pay) => {
        pay
          .requestPayment({
            amount: Number(data.amount),
            orderId: data.id,
            orderName: data.name,
            customerEmail: email,
            methodId: selectPayMethod
              ? (selectPayMethod as MethodId)
              : (userCards[0].id as MethodId),
          })
          .then((result) => {
            return client("POST", "/payments/confirm-payment", {
              phone: phone ? phone : userData.phone,
              email: email ? email : userData.email,
              ...result,
            }).then((payments) => {
              if (payments.error) throw new AxiosError(payments.message);
            });
          })
          .then(() => {
            router.push(`/payments/success?orderId=${data.id}`);
          })
          .catch((error) => {
            Toast(error.message, "error");
          });
      });
    }
  };
  return (
    <>
      <div
        className="min-h-[100vh] container lg:p-10 p-3 lg:mt-12 mt-16"
        style={{ fontFamily: "Noto Sans KR" }}
      >
        <span className="text-3xl font-bold">결제정보</span>
        <div className="flex mt-5 flex-wrap lg:flex-nowrap">
          <div className="lg:w-3/5 w-full lg:mr-3">
            <div className="w-full border p-5 rounded-lg">
              <span className="text-xl font-bold">
                <i className="fas fa-user mr-2" />
                주문자 정보
              </span>
              <div className="flex-wrap flex flex-row text-lg my-3 items-center">
                <span>이름</span>
                <Input
                  placeholder="이름을 입력해 주세요"
                  defaultValue={userData.user.username}
                  onChangeHandler={(value) => setName(value)}
                  className="text-base ml-auto lg:w-80 w-full lg:mt-0 mt-1"
                />
              </div>
              <div className="flex-wrap flex flex-row text-lg my-3 items-center">
                <span>연락처</span>
                <Input
                  type={"phone"}
                  placeholder="“-“없이 입력해 주세요"
                  defaultValue={userData.phone ? userData.phone : undefined}
                  onChangeHandler={(value) =>
                    setPhone(value?.replace(/-/g, ""))
                  }
                  className="text-base ml-auto lg:w-80 w-full lg:mt-0 mt-1"
                />
              </div>
              <div className="flex-wrap flex flex-row text-lg my-3 items-center">
                <span>이메일</span>
                <Input
                  type={"email"}
                  placeholder="이메일 주소를 입력해주세요"
                  defaultValue={
                    userData.email
                      ? userData.email
                      : userData.kakao_email
                      ? userData.kakao_email
                      : undefined
                  }
                  onChangeHandler={(value) => setEmail(value)}
                  className="text-base ml-auto lg:w-80 w-full lg:mt-0 mt-1"
                />
              </div>
            </div>
            <div className="w-full border p-5 rounded-lg mt-5">
              <div className="flex flex-row justify-between mb-2">
                <span className="text-xl font-bold">
                  <i className="fas fa-credit-card mr-2" />
                  결제 수단
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
                상품 정보
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
                    {numberWithCommas(data.amount as number)}원
                  </span>
                </div>
              </div>
              <hr className="w-full my-4" />
              <div>
                <div className="flex flex-row justify-between">
                  <span className="text-lg font-bold">상품금액</span>
                  <span className="text-lg">
                    {numberWithCommas(data.amount as number)}원
                  </span>
                </div>
              </div>
              <hr className="w-full my-4" />
              <div className="flex flex-row justify-between items-center">
                <span className="text-2xl font-bold">결제금액</span>
                <span className="text-lg">
                  월{" "}
                  <span className="font-bold text-xl">
                    {numberWithCommas(data.amount as number)}
                  </span>
                  원
                </span>
              </div>
              <CheckBox
                className="mt-2"
                placeholder={"자동결제 이용 동의"}
                onChangeHandler={(check) => setAutoPayments(check)}
              />
              <button
                onClick={() => {
                  requestPayments();
                }}
                className="w-full py-3 rounded-lg mt-6 bg-[#7C3AED] text-white font-bold"
              >
                결제하기
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
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