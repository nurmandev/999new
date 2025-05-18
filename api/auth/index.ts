import {
  API_AUTH_CHANGE_PASSWORD,
  API_AUTH_FE,
  API_AUTH_FORGOT_PASSWORD,
  API_AUTH_GET_2FA_STATUS,
  API_AUTH_LOGIN,
  API_AUTH_LOGIN_WITH_GOOGLE,
  API_AUTH_LOGIN_WITH_GOOGLE_TOP,
  API_AUTH_LOGIN_WITH_TELEGRAM,
  API_AUTH_LOGIN_WITH_WALLET,
  API_AUTH_REQUEST_SELF_EXCULSIVE,
  API_AUTH_RESET_PASSWORD,
  API_AUTH_SEND_MAIL,
  API_AUTH_SEND_SMS,
  API_AUTH_SEND_USER_MAIL,
  API_AUTH_SEND_USER_PHONE,
  API_AUTH_SET_LOGIN,
  API_AUTH_SET_LOGIN_PASSWORD,
  API_AUTH_SET_SELF_EXCULSIVE,
  API_AUTH_SIGNUP_WITH_EMAIL,
  API_AUTH_SIGNUP_WITH_PHONE,
  API_AUTH_VALIDATE_AUTH_TOKEN,
  API_AUTH_VALIDATE_TOKEN,
  API_AUTH_VERIFY_CODE,
  API_AUTH_VERIFY_QR_CODE,
  API_AUTH_VERIFY_USER_CODE,
} from 'constants/endpoints';

import {
  LoginRequest,
  ResetPasswordRequest,
  SignUpEmailRequest,
  SignUpPhoneRequest,
  VerifyCodeRequest,
  VerifyRequestType,
} from '@/base/types/requestTypes';

import api from '../api';

export const api_checkAuthKey = (key: string) => {
  return api.get(API_AUTH_FE(key));
};

export const api_validateAuthToken = (token: string) => {
  return api.get(API_AUTH_VALIDATE_AUTH_TOKEN(token));
};

export const api_login = (data: LoginRequest) => {
  return api.post(API_AUTH_LOGIN, data);
};

export const api_loginWithGoogle = (code: string, referralCode: string) => {
  return api.post(API_AUTH_LOGIN_WITH_GOOGLE, { code, referralCode });
};

export const api_loginWithGooglePop = (token: string, referralCode: string) => {
  return api.post(API_AUTH_LOGIN_WITH_GOOGLE_TOP, { token, referralCode });
};

export const api_loginWithTelegram = (data: any) => {
  return api.post(API_AUTH_LOGIN_WITH_TELEGRAM, data);
};

export const api_loginWithWallet = (address: string, signature: string, referralCode: string) => {
  return api.post(API_AUTH_LOGIN_WITH_WALLET, { address, signature, referralCode });
};

export const api_verify = (data: VerifyCodeRequest) => {
  return api.post(API_AUTH_VERIFY_CODE, data);
};

export const api_sendMail = (email: string, request: VerifyRequestType) => {
  return api.post(API_AUTH_SEND_MAIL, { email, request });
};

export const api_signupWithEmail = (data: SignUpEmailRequest) => {
  return api.post(API_AUTH_SIGNUP_WITH_EMAIL, data);
};

export const api_sendMailToUser = (email: string, request: VerifyRequestType) => {
  return api.post(API_AUTH_SEND_USER_MAIL, { email, request });
};

export const api_sendSMSToUser = (phone: string, request: VerifyRequestType) => {
  return api.post(API_AUTH_SEND_USER_PHONE, { phone, request });
};

export const api_verifyCodeToUser = (data: VerifyCodeRequest) => {
  return api.post(API_AUTH_VERIFY_USER_CODE, data);
};

export const api_signupWithPhone = (data: SignUpPhoneRequest) => {
  return api.post(API_AUTH_SIGNUP_WITH_PHONE, data);
};

export const api_forgetPassword = (email: string) => {
  return api.post(API_AUTH_FORGOT_PASSWORD, { email });
};

export const api_sendSMS = (phone: string, request: VerifyRequestType) => {
  return api.post(API_AUTH_SEND_SMS, { phone, request });
};

export const api_sendVerifyQRCode = (email: string) => {
  return api.post(API_AUTH_VERIFY_QR_CODE, { email });
};

export const api_resetPassword = (data: ResetPasswordRequest) => {
  return api.post(API_AUTH_RESET_PASSWORD, data);
};

export const api_validateToken = (token: string) => {
  return api.get(API_AUTH_VALIDATE_TOKEN(token));
};

export const api_getSetLogin = () => {
  return api.get(API_AUTH_SET_LOGIN);
};

export const api_setLoginPassword = (password: string) => {
  return api.put(API_AUTH_SET_LOGIN_PASSWORD, { password });
};

export const api_changePassword = (
  oldPassword: string,
  newPassword: string,
  confirmNewPassword: string,
  codeOtp: string = '',
) => {
  return api.post(API_AUTH_CHANGE_PASSWORD, { oldPassword, newPassword, confirmNewPassword, codeOtp });
};

export const api_get2FAStatus = (email: string) => {
  return api.get(API_AUTH_GET_2FA_STATUS, { params: { email } });
};

export const api_requestSelfExclusion = async (disabledTo: number) => {
  return api.post(API_AUTH_REQUEST_SELF_EXCULSIVE, { disabledTo });
};

export const api_setSelfExclusion = async (token: string, disabledTo: number) => {
  return api.post(API_AUTH_SET_SELF_EXCULSIVE, { token, disabledTo });
};
