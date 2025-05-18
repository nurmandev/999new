import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { KYC_ENUM } from '@/base/constants/common';
import {
  UserDetail,
  UserSettingGeneralType,
  UserSettingPrivacyType,
  UserSettingVerifiedType,
} from '@/base/types/common';
import { AuthState } from '@/base/types/reducer-states';

import { AppDispatch } from '../store';
import { api_updateSetting } from './../../api/user/index';
import { convertUserInfo } from './../../libs/utils/index';

const initialUser: UserDetail = {
  userId: '',
  userName: '',
  email: '',
  phone: '',
  wallet: '',
  avatar: '',
  betCount: '',
  winCount: '',
  totalWager: 0,
  referralCode: '',
  restrictedTo: 0,
  disabledWithdraw: false,
  isKyc: KYC_ENUM.REQUIRED, // 1: required, 2: pending, 3: accepted, 4: rejected
  tfa: false,
  generalSetting: {
    settingShowFullNameCrypto: false,
    settingReceiveMarketPromotion: false,
    settingLanguage: 'en',
    settingCurrency: '',
    settingViewInFiat: false,
  },
  privacySetting: {
    settingHideUserName: false,
    settingHideGamingData: false,
    settingRefuseTipFromStrangers: false,
  },
  verifiedSetting: {
    emailVerified: false,
    phoneVerified: false,
  },
};

const initialCommonState: AuthState = {
  isLoading: {
    isCurrency: false,
    isLanguage: false,
  },
  isLogin: false,
  user: initialUser,
  verifyRequest: '',
  isPhoneVerifyRequested: false,
  isForgetPassword: false,
};

export const queryDataSlice = createSlice({
  name: 'auth',
  initialState: initialCommonState,
  reducers: {
    saveUserInfo: (state: AuthState, action: PayloadAction<UserDetail>) => {
      state.isLogin = true;
      state.user = { ...action.payload };
    },
    logoutState: (state: AuthState) => {
      state.isLogin = false;
      state.user = { ...initialUser };
      state.verifyRequest = '';
      state.isPhoneVerifyRequested = false;
      state.isForgetPassword = false;
    },
    saveVerifyInfo: (state: AuthState, action: PayloadAction<any>) => {
      state.verifyRequest = action.payload.verifyRequest;
      state.isPhoneVerifyRequested = action.payload.isPhoneVerifyRequested;
    },
    setIsForgetPassword: (state: AuthState, action: PayloadAction<boolean>) => {
      state.isForgetPassword = action.payload;
    },
    updateViewInFiat: (state: AuthState, action: PayloadAction<boolean>) => {
      state.user.generalSetting.settingViewInFiat = action.payload;
    },
    setIsLoading: (state: AuthState, action: PayloadAction<{ isCurrency: boolean; isLanguage: boolean }>) => {
      state.isLoading = { ...action.payload };
    },
  },
});

export const { saveUserInfo, logoutState, saveVerifyInfo, setIsForgetPassword, updateViewInFiat, setIsLoading } =
  queryDataSlice.actions;
export default queryDataSlice.reducer;

export const updateSetting =
  (setting: UserSettingGeneralType | UserSettingPrivacyType | UserSettingVerifiedType) =>
  async (dispatch: AppDispatch) => {
    try {
      const res = await api_updateSetting(setting);
      dispatch(saveUserInfo({ ...convertUserInfo(res.data) }));
      dispatch(setIsLoading({ isCurrency: false, isLanguage: false }));
    } catch (error) {
      console.log(error, '------ update Setting ------');
    }
  };
