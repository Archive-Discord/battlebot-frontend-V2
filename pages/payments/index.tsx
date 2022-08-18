import type { PageDefaultProps } from "@types";
import type { NextPage, GetServerSideProps } from "next";
import { cookieParser, numberWithCommas } from "@utils/utils";
import { useRouter } from "next/router";
import client from "@utils/client";
import dynamic from "next/dynamic";
import dayjs from "dayjs";
import Error from "@components/Error";
import { useTranslation } from "react-i18next";
import Seo from "@components/Seo";

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
      <Seo title="결제관리" />
      <div
        className="min-h-[100vh] container lg:p-10 p-3 lg:mt-12 mt-16"
        style={{ fontFamily: "Noto Sans KR" }}
      >
        <div className="flex flex-col">
          <span className="text-3xl font-bold">
            {t("payments.users.user")}
          </span>
          <span className="text-xl text-gray-500">
            {t("payments.users.userDescription")}
          </span>
        </div>
        <div>
            
        </div>
      </div>
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
