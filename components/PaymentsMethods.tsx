import { PaymentsMethods as Methods } from "@types";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper";

const PaymentsMethods: React.FC<PaymentsMethodsProps> = ({
  methods,
  selectMethod,
  methodAddHanler,
}) => {
  const slideHanler = (e: any) => {
    if (methods.length <= e.activeIndex) return;
    selectMethod(methods[e.activeIndex].id);
  };
  return (
    <>
      <Swiper
        navigation={true}
        modules={[Navigation]}
        className="h-60"
        onSlideChange={slideHanler}
      >
        {methods.map(method => (
          <SwiperSlide
            className="items-center flex justify-center"
            data-method={method.id}
          >
            <div className="w-80 h-48 border rounded-xl p-4 relative">
              <img className="w-9 absolute" src={method.iconUrl} />
              <div className="left-5 bottom-5 absolute flex flex-col">
                <span className="font-bold">
                  {method.type === "account"
                    ? method.accountName
                    : method.cardName}
                </span>
                <span>
                  {method.type === "account"
                    ? method.accountNumber
                    : method.cardNumber}
                </span>
              </div>
            </div>
          </SwiperSlide>
        ))}
        <SwiperSlide className="items-center flex justify-center items-center">
          <div
            onClick={() => methodAddHanler()}
            className="w-80 h-48  border rounded-xl p-4 flex items-center justify-center flex-col"
          >
            <i className="fas fa-plus text-3xl" />
            <span className="mt-1 font-bold">결제 수단 추가</span>
          </div>
        </SwiperSlide>
      </Swiper>
    </>
  );
};

interface PaymentsMethodsProps {
  methods: Methods[];
  selectMethod: (id: string) => void;
  methodAddHanler: () => void;
}

export default PaymentsMethods;
