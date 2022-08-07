export interface PaymentsMethods {
  id: string;
  iconUrl: string;
  type: "account" | "card";
  accountName?: string;
  accountNumber?: string;
  bank?: string;
  bankCode?: string;
  cardName?: string;
  cardNumber?: string;
  cardType?: string;
  companyCode?: string;
  select: boolean;
}
