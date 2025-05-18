import { API_VIP_CHECK_DEPOSIT, API_VIP_LEVEL_SYSTEM, API_VIP_VIP_PROGRESS } from '@/base/constants/endpoints';

import api from '../api';

export const api_getVipProgress = async () => {
  return api.get(API_VIP_VIP_PROGRESS);
};

export const api_checkDeposit = async () => {
  return api.get(API_VIP_CHECK_DEPOSIT);
};

export const api_vipLevelSystem = async () => {
  return api.get(API_VIP_LEVEL_SYSTEM);
};
