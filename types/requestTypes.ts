import { Currency } from 'iso-country-currency';
import { CurrencySymbolType } from './wallet';
import { RolloverStatus } from './common';

export type VerifyRequestType = 'reset' | '';

export enum TRANSACTION_TYPE {
  'Deposit' = 'deposit',
  'Withdraw' = 'withdraw',
  'Swap' = 'swap',
  'Buy_Crypto' = 'buy Crypto',
  'Bill' = 'bill',
  'Bonus' = 'bonus',
}

type ClientType = 'mobile' | 'desktop' | 'all';

export type SignUpEmailRequest = {
  email: string;
  password: string;
  referralCode?: string;
};

export type VerifyCodeRequest = {
  email?: string;
  phone?: string;
  code: string;
  request: VerifyRequestType;
};

export type SignUpPhoneRequest = {
  phone: string;
  password: string;
  referralCode?: string;
};

export type LoginRequest = {
  email?: string;
  phone?: string;
  password: string;
};

export type ResetPasswordRequest = {
  password: string;
  confirmPassword: string;
};

export type ParamsRequest = {
  q?: string | number;
  limit?: string | number;
  page?: string | number;
};

export type WithdrawRequest = {
  symbolId: string;
  networkId: string;
  withdrawAddress: string;
  withdrawAmount: number;
};

export type TransactionRequest = {
  type: TRANSACTION_TYPE;
  symbolId: string;
  startDate: number;
  endDate: number;
  page: number;
  pageSize: number;
  status: number;
};

export type RolloverRequest = {
  page: number;
  pageSize: number;
  status: RolloverStatus;
};

export type GameDemoRequest = {
  gameId: string;
  locale: string;
};

export type GameCreateSessionRequest = {
  gameId: string;
  currencyType: CurrencySymbolType;
  currencyId: string;
};
