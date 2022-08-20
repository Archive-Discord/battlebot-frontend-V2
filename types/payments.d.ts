import { Guild, User } from "discord.js";

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

export interface Subscribe {
  _id: string
  name: string;
  method: string;
  paymentsType: paymentsType;
  target: string;
  targetType: targetType;
  useing: boolean;
  metadata: metadata;
  product: product;
}
export interface product {
  _id: mongoTypes.ObjectId;
  itemId: string;
  amount: string;
  itemName: string;
  itemDescription: string;
  plan: "month" | "year";
  itemFunctions: string[];
  type: targetType;
  published_date: Date;
}

export interface PaymentsTarget {
  createAt: Date,
  id: string;
  process: string
  metadata: metadata;
  nextPayDate: Date;
  paymentsErrors?: paymentsError[]
  name: string;
  amount: string;
  payment: Payment;
}

export interface paymentsError {
  message: string;
  data: any
}

export interface Payment {
  balanceAmount: number;
  method: string;
  approvedAt: Date;
  card?: any
}
export type metadata = User | Guild;

export type paymentsType = "kakaopay" | "tosspayments";
export type targetType = "guild" | "user";
