import type { PageDefaultProps } from "@types";
import type { NextPage, GetServerSideProps } from "next";
import { cookieParser, numberWithCommas } from "@utils/utils";
import { useRouter } from "next/router";
import client from "@utils/client";
import dynamic from "next/dynamic";
import dayjs from "dayjs";
import Error from "@components/Error";
import { useTranslation } from "react-i18next";

const Login = dynamic(() => import("@components/Login"));

const PaymentsSuccess: NextPage<PageDefaultProps> = ({
  auth,
  error,
  status,
  message,
  data,
}) => {
  const router = useRouter();
  const { t } = useTranslation();
  if (error && status === 401) return <Login />;
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

  return (
    <>
      <div
        className="min-h-[85vh] container lg:p-10 p-3 lg:mt-12 mt-16"
        style={{ fontFamily: "Noto Sans KR" }}
      >
        <div className="flex flex-col">
          <span className="text-3xl font-bold">
            {t("payments.success.order")}
          </span>
          <span className="text-xl text-gray-500">
            {t("payments.success.orderDescription")}
          </span>
        </div>
        <div className="flex flex-col">
          <div className="mt-5 border rounded-lg p-4 w-full">
            <span className="text-xl font-bold">
              {t("payments.success.orderInfo")}
            </span>
            <hr className="w-full my-3" />
            <div className="flex flex-col w-full">
              <div className="flex lg:items-center lg:justify-between text-lg lg:flex-row flex-col">
                <span className="font-bold">
                  {t("payments.success.itemName")}
                </span>
                <span>{data.name}</span>
              </div>
              <div className="flex lg:items-center lg:justify-between text-lg lg:flex-row flex-col">
                <span className="font-bold">
                  {t("payments.success.orderAmount")}
                </span>
                <span>
                  {numberWithCommas(data.amount)}
                  {t("payments.won")}
                </span>
              </div>
              <div className="flex lg:items-center lg:justify-between text-lg lg:flex-row flex-col">
                <span className="font-bold">
                  {t("payments.success.active")}
                  {data.metadata.type === "guild"
                    ? t("payments.success.guild")
                    : data.metadata.type === "user"
                    ? t("payments.success.user")
                    : ""}
                </span>
                <span>{data.metadata.name}</span>
              </div>
            </div>
            <hr className="w-full my-3" />
            <div className="flex items-center justify-between text-lg">
              <span className="font-bold text-2xl">{t("payments.success.totalOrderAmount")}</span>
              <span className="text-2xl">
                {numberWithCommas(data.payment.balanceAmount)}{t("payments.won")}
              </span>
            </div>
          </div>
          <div className="mt-5 border rounded-lg w-full p-4">
            <span className="text-xl font-bold">{t("payments.orderInfo")}</span>
            <hr className="w-full my-3" />
            <div className="flex flex-col w-full">
              <div className="flex lg:items-center lg:justify-between text-lg lg:flex-row flex-col">
                <span className="font-bold">{t("payments.payMethod")}</span>
                <span>{data.payment.method}</span>
              </div>
              <div className="flex lg:items-center lg:justify-between text-lg lg:flex-row flex-col">
                <span className="font-bold">{t("payments.payDate")}</span>
                <span className="truncate">
                  {dayjs(data.payment.approvedAt).format(
                    "YYYY년 MM월 DD일 HH시 mm분"
                  )}
                </span>
              </div>
              <div className="flex lg:items-center lg:justify-between text-lg lg:flex-row flex-col">
                <span className="font-bold">{t("payments.nextPayDate")}</span>
                <span className="truncate">
                  {dayjs(data.nextPayDate).format("YYYY년 MM월 DD일")}
                </span>
              </div>
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
    `/payments/order/success/${ctx.query?.orderId}`,
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

export default PaymentsSuccess;
