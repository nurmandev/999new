import {
  API_AUTH_GENERATE_QR_CODE,
  API_USER_MEDAL_STATISTICS,
  API_USER_PROFILE_BET_STATISTICS,
  API_USER_PROFILE_CONTEST_HISTORY,
  API_USER_PROFILE_EDIT_PROFILE,
  API_USER_PROFILE_GET_PROFILE,
  API_USER_PROFILE_UPLOAD_AVATAR,
  API_USER_SESSION_DELETE_SESSION,
  API_USER_SESSION_LIST_SESSIONS,
  API_USER_SETTING_DISABLE_TFA,
  API_USER_SETTING_EMAIL_AND_PHONE_VERIFY,
  API_USER_SETTING_ENABLE_TFA,
  API_USER_SETTING_GENERAL_SETTING,
  API_USER_SETTING_PRIVACY_SETTING,
  API_USER_SETTING_UPDATE,
  API_USER_SETTING_UPLOAD_ID_CARD,
} from 'constants/endpoints';

import { UserSettingGeneralType, UserSettingPrivacyType, UserSettingVerifiedType } from '@/base/types/common';

import api from '../api';

export const api_getProfile = async (userId: string) => {
  return api.get(API_USER_PROFILE_GET_PROFILE, { params: { userId } });
};

export const api_getContestHistory = async (userID: string, page: number, page_size: number) => {
  return api.get(API_USER_PROFILE_CONTEST_HISTORY, { params: { user_id: userID, page, page_size } });
};

export const api_editUserName = async (userName: string) => {
  return api.post(API_USER_PROFILE_EDIT_PROFILE, { username: userName });
};

export const api_uploadAvatar = async (formData: any) => {
  return api.post(API_USER_PROFILE_UPLOAD_AVATAR, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const api_uploadIdCards = async (formData: any) => {
  return api.post(API_USER_SETTING_UPLOAD_ID_CARD, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
};

export const api_getGeneralSetting = async () => {
  return api.get(API_USER_SETTING_GENERAL_SETTING);
};

export const api_getPrivacySetting = async () => {
  return api.get(API_USER_SETTING_PRIVACY_SETTING);
};

export const api_getVerifySetting = async () => {
  return api.get(API_USER_SETTING_EMAIL_AND_PHONE_VERIFY);
};

export const api_updateSetting = async (
  data: UserSettingGeneralType | UserSettingPrivacyType | UserSettingVerifiedType,
) => {
  return api.put(API_USER_SETTING_UPDATE, data);
};

export const api_getSessions = async (page: number, limit: number) => {
  return api.get(API_USER_SESSION_LIST_SESSIONS, { params: { page, limit } });
};

export const api_deleteSession = async (userSessionId: string) => {
  return api.delete(API_USER_SESSION_DELETE_SESSION, { params: { userSessionId } });
};

export const api_generateQRCode = async () => {
  return api.post(API_AUTH_GENERATE_QR_CODE);
};

export const api_confirmQRCode = async (codeOtp: string, password: string) => {
  return api.post(API_USER_SETTING_ENABLE_TFA, { codeOtp, password });
};

export const api_disable2FA = async (codeOtp: string, password: string) => {
  return api.post(API_USER_SETTING_DISABLE_TFA, { codeOtp, password });
};

export const api_medalStatistics = async () => {
  return api.get(API_USER_MEDAL_STATISTICS);
};

export const api_BetStatistics = async (userId: string) => {
  return api.get(API_USER_PROFILE_BET_STATISTICS, {params: {user_id: userId}});
};
