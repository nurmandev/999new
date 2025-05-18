import {
  API_QUEST_HISTORY,
  API_QUEST_LIST,
  API_SPIN_DATA,
  API_SPIN_LATEST,
  APIN_SPIN_AVAILABLE,
  APIN_SPIN_TRY,
} from '@/base/constants/endpoints';

import api from '../api';

export const api_getSpinData = async () => {
  return api.get(API_SPIN_DATA);
};

export const api_getSpinLatest = async () => {
  return api.get(API_SPIN_LATEST);
};

export const api_getSpinAvailableCount = async () => {
  return api.get(APIN_SPIN_AVAILABLE);
};

export const api_postSpinTry = async (spinType: number) => {
  return api.post(APIN_SPIN_TRY, { type: spinType });
};

export const api_questList = async () => {
  return api.get(API_QUEST_LIST);
};

export const api_questHistory = async () => {
  return api.get(API_QUEST_HISTORY);
};
