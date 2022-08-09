import type { PageDefaultProps } from "@types";
import type { NextPage, GetServerSideProps } from "next";
import { cookieParser, numberWithCommas } from "@utils/utils";
import { useRouter } from "next/router";
import client from "@utils/client";
import dynamic from "next/dynamic";
import dayjs from "dayjs";
import Error from "@components/Error"

const Login = dynamic(() => import("@components/Login"));

const PaymentsSuccess: NextPage<PageDefaultProps> = ({
  auth,
  error,
  status,
  message,
  data,
}) => {
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

  return (
    <>
      <div
        className="min-h-[85vh] container lg:p-10 p-3 lg:mt-12 mt-16"
        style={{ fontFamily: "Noto Sans KR" }}
      >
        <div className="flex flex-col">
          <span className="text-3xl font-bold">결제완료</span>
          <span className="text-xl text-gray-500">
            결제가 성공적으로 완료되었습니다
          </span>
        </div>
        <div className="flex flex-col">
          <div className="mt-5 border rounded-lg p-4 w-full">
            <span className="text-xl font-bold">주문정보</span>
            <hr className="w-full my-3" />
            <div className="flex flex-col w-full">
              <div className="flex lg:items-center lg:justify-between text-lg lg:flex-row flex-col">
                <span className="font-bold">상품명</span>
                <span>{data.name}</span>
              </div>
              <div className="flex lg:items-center lg:justify-between text-lg lg:flex-row flex-col">
                <span className="font-bold">주문금액</span>
                <span>{numberWithCommas(data.amount)}원</span>
              </div>
              <div className="flex lg:items-center lg:justify-between text-lg lg:flex-row flex-col">
                <span className="font-bold">
                  적용
                  {data.metadata.type === "guild"
                    ? "서버"
                    : data.metadata.type === "유저"
                    ? "유저"
                    : ""}
                </span>
                <span>{data.metadata.name}</span>
              </div>
            </div>
            <hr className="w-full my-3" />
            <div className="flex items-center justify-between text-lg">
              <span className="font-bold text-2xl">총 결제금액</span>
              <span className="text-2xl">
                {numberWithCommas(data.payment.balanceAmount)}원
              </span>
            </div>
          </div>
          <div className="mt-5 border rounded-lg w-full p-4">
            <span className="text-xl font-bold">결제정보</span>
            <hr className="w-full my-3" />
            <div className="flex flex-col w-full">
              <div className="flex lg:items-center lg:justify-between text-lg lg:flex-row flex-col">
                <span className="font-bold">결제방식</span>
                <span>{data.payment.method}</span>
              </div>
              <div className="flex lg:items-center lg:justify-between text-lg lg:flex-row flex-col">
                <span className="font-bold">결제일시</span>
                <span className="truncate">
                  {dayjs(data.payment.approvedAt).format(
                    "YYYY년 MM월 DD일 HH시 mm분"
                  )}
                </span>
              </div>
              <div className="flex lg:items-center lg:justify-between text-lg lg:flex-row flex-col">
                <span className="font-bold">다음 결제 예정일</span>
                <span className="truncate">
                  {dayjs(data.nextPayDate).format("YYYY년 MM월 DD일 HH시 mm분")}
                </span>
              </div>
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
