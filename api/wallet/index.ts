import {
  API_WALLET_CHAT_TIP,
  API_WALLET_DEPOSIT_TIME,
  API_WALLET_GET_CLAIM,
  API_WALLET_INFO,
  API_WALLET_INIT_DATA,
  API_WALLET_POST_CLAIM,
  API_WALLET_ROLLOVER,
  API_WALLET_SET_FAVORITE,
  API_WALLET_SWAP,
  API_WALLET_SWAP_FEE,
  API_WALLET_SWAP_RATE,
  API_WALLET_TRANSACTIONS,
  API_WALLET_USER_BALANCE,
  API_WALLET_WITHDRAW,
  API_WALLET_WITHDRAW_INFO,
} from 'constants/endpoints';

import { RolloverRequest, TransactionRequest, WithdrawRequest } from '@/base/types/requestTypes';
import { CurrencySymbolType } from '@/base/types/wallet';

import api from '../api';

export const api_getWalletInfo = async () => {
  return api.get(API_WALLET_INFO);
};

export const api_getUserBalance = async () => {
  return api.get(API_WALLET_USER_BALANCE);
};

export const api_withdraw = async (data: WithdrawRequest) => {
  return api.post(API_WALLET_WITHDRAW, data);
};

export const api_exchangeRate = async (from: string, to: string) => {
  return api.get(API_WALLET_SWAP_RATE, { params: { from, to } });
};

export const api_swap = async (from: string, to: string, amount: number) => {
  return api.post(API_WALLET_SWAP, { from, to, amount });
};

export const api_getTransactions = async ({
  type,
  symbolId,
  startDate,
  endDate,
  page,
  pageSize,
  status,
}: TransactionRequest) => {
  return api.get(API_WALLET_TRANSACTIONS, { params: { type, symbolId, startDate, endDate, page, pageSize, status } });
};

export const api_getRollover = async ({ page, pageSize, status }: RolloverRequest) => {
  return api.get(API_WALLET_ROLLOVER, { params: { page, pageSize, status } });
};

export const api_getDepositTime = async () => {
  return api.get(API_WALLET_DEPOSIT_TIME);
};

export const api_getInitData = async () => {
  return api.get(API_WALLET_INIT_DATA);
};

export const api_setCurrencyFavorite = async (currencyId: string, currencyType: CurrencySymbolType) => {
  return api.post(API_WALLET_SET_FAVORITE, { currencyId, currencyType });
};

export const api_getClaims = async () => {
  return api.get(API_WALLET_GET_CLAIM);
};

export const api_postClaims = async (amount: number) => {
  return api.post(API_WALLET_POST_CLAIM, { amount });
};

export const api_withdrawInfo = async (symbolId: string) => {
  return api.get(API_WALLET_WITHDRAW_INFO, { params: { symbolId } });
};

export const api_swapFeeInfo = async () => {
  return api.get(API_WALLET_SWAP_FEE);
};

export const api_chatTip = async (receiverId: string, symbolId: string, amount: number) => {
  return api.post(API_WALLET_CHAT_TIP, { receiverId, symbolId, amount });
};
