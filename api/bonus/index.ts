import {
  API_AFFILIATE,
  API_AFFILIATE_COMMISSION_HISTORY,
  API_AFFILIATE_FRIENDS,
  API_AFFILIATE_REFERRAL_HISTORY,
  API_AFFILIATE_REFERRAL_RULE,
  API_AFFILIATE_REWARDS,
  API_AFFILIATE_WITHDRAW,
  API_BONUS_BONUS_STATISTIC,
  API_BONUS_CLAIM,
  API_BONUS_CLAIM_LIST,
  API_BONUS_DETAILS,
  API_BONUS_DETAILS_CATEGORIES,
  API_BONUS_DETAILS_TRANSACTIONS,
  API_BONUS_REDEEM,
  API_BONUS_USDT_BONUS_HISTORY,
} from '@/base/constants/endpoints';

import api from '../api';

export type bonusCategoryType = 'all' | 'level_up' | 'weekly_cashback' | 'monthly_cashback' | 'deposit_bonus';

export const api_affiliate = async () => {
  return api.get(API_AFFILIATE);
};

export const api_affiliateFriends = async (
  page: number,
  pageSize: number,
  userName: string | undefined = undefined,
  userId: string | undefined = undefined,
  registrationStartDate: number | undefined = undefined,
  registrationEndDate: number | undefined = undefined,
  wagerStartDate: number | undefined = undefined,
  wagerEndDate: number | undefined = undefined,
) => {
  return api.get(API_AFFILIATE_FRIENDS, {
    params: {
      page,
      pageSize,
      userName,
      userId,
      registrationStartDate,
      registrationEndDate,
      wagerStartDate,
      wagerEndDate,
    },
  });
};

export const api_affiliateRewards = async () => {
  return api.get(API_AFFILIATE_REWARDS);
};

export const api_affiliateRewardsWithdraw = async () => {
  return api.post(API_AFFILIATE_WITHDRAW);
};

export const api_affiliateCommissionRewardsHistory = async (page: number, pageSize: number) => {
  return api.get(API_AFFILIATE_COMMISSION_HISTORY, { params: { page, pageSize } });
};

export const api_affiliateReferralRewardsHistory = async (
  page: number,
  pageSize: number,
  userName: string | undefined = undefined,
  registrationStartDate: number | undefined = undefined,
  registrationEndDate: number | undefined = undefined,
) => {
  return api.get(API_AFFILIATE_REFERRAL_HISTORY, {
    params: { userName, registrationStartDate, registrationEndDate, page, pageSize },
  });
};

export const api_bonusUsdtHistory = async (page: number, pageSize: number) => {
  return api.get(API_BONUS_USDT_BONUS_HISTORY, { params: { page, pageSize } });
};

export const api_bonusClaimList = async () => {
  return api.get(API_BONUS_CLAIM_LIST);
};

export const api_bonusClaim = async (bonusId: string, type: string = 'level_up') => {
  return api.post(API_BONUS_CLAIM, { type, bonusId });
};

export const api_bonusStatistics = async () => {
  return api.get(API_BONUS_BONUS_STATISTIC);
};

export const api_bonusDetail = async (category: bonusCategoryType = 'all') => {
  return api.get(API_BONUS_DETAILS, { params: { category } });
};

export const api_referralRule = async () => {
  return api.get(API_AFFILIATE_REFERRAL_RULE);
};

export const api_referralHistory = async (page: number, pageSize: number) => {
  return api.get(API_AFFILIATE_REFERRAL_HISTORY, { params: { page, pageSize } });
};

export const api_bonusDetailCategories = async () => {
  return api.get(API_BONUS_DETAILS_CATEGORIES);
};

export const api_bonusDetailTransactions = async (category: bonusCategoryType = 'all') => {
  return api.get(API_BONUS_DETAILS_TRANSACTIONS, { params: { category } });
};

export const api_redeem = async (code: string) => {
  return api.post(API_BONUS_REDEEM, { code });
};
