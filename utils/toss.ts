import { loadBrandPay } from "@tosspayments/brandpay-sdk";
import type { User } from "@types";

export const brandpay = async (user: User) => {
  return await loadBrandPay(
    process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY as string,
    user.id,
    {
      redirectUrl: process.env.NEXT_PUBLIC_API_URL + "/payments/auth",
      ui: {
        buttonStyle: "full",
        highlightColor: "#7C3AED",
        labels: {
          oneTouchPay: "배틀페이",
        },
      },
    }
  );
};
