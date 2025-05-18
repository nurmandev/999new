import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { CookieKey, CRYPTO_DATA, FIAT_DATA } from '@/base/constants/common';
import { CookiesStorage } from '@/base/libs/storage/cookie';
import { DepositAddress, FiatType, MessageType, NotificationType } from '@/base/types/common';
import { CommonState } from '@/base/types/reducer-states';

const initialCommonState: CommonState = {
  isLoading: true,
  disabledPeriod: 0,
  fiatArray: FIAT_DATA,
  cryptoArray: [],
  depositCryptoArray: CRYPTO_DATA,
  localeFiat: undefined,
  activeFiat: undefined,
  viewInFiat: false,
  showFullNameCurrency: true,
  usdtNetwork: 'BEP20',
  casinoTab: false,
  lastMessage: {
    id: '',
    userId: '',
    userName: '',
    userAvatar: '',
    level: '',
    time: '',
    text: '',
    replyId: '',
    replyText: '',
    replyTime: '',
    replyUserId: '',
    replyUserName: '',
    replyUserLevel: '',
  },
  lastNotification: {
    id: '',
    title: '',
    description: '',
    link: '',
    image: '',
    createdAt: '',
  },
  isRestricting: false,
  isNewMessage: false,
  isNewNotification: false,
};

export const queryDataSlice = createSlice({
  name: 'common',
  initialState: initialCommonState,
  reducers: {
    changeDepositCryptoArray: (state: CommonState, action: PayloadAction<DepositAddress[]>) => {
      state.depositCryptoArray = action.payload;
    },
    changeUsdtNetwork: (state: CommonState, action: PayloadAction<string>) => {
      state.usdtNetwork = action.payload.length ? action.payload : 'BEP20';
    },
    changeFiatArray: (state: CommonState, action: PayloadAction<FiatType[]>) => {
      state.fiatArray = action.payload;
    },
    changeCryptoArray: (state: CommonState, action: PayloadAction<FiatType[]>) => {
      state.cryptoArray = action.payload;
    },
    changeShowFullNameCurrency: (state: CommonState, action: PayloadAction<boolean>) => {
      state.showFullNameCurrency = action.payload;
    },
    changeActiveFiat: (state: CommonState, action: PayloadAction<FiatType | DepositAddress>) => {
      state.activeFiat = action.payload;
      CookiesStorage.setCookieData(CookieKey.activeFiatData, JSON.stringify(action.payload));
    },
    changeViewInFiat: (state: CommonState, action: PayloadAction<boolean>) => {
      state.viewInFiat = action.payload;
    },
    setCasinoTab: (state: CommonState, action: PayloadAction<boolean>) => {
      state.casinoTab = action.payload;
    },
    setLastMessage: (state: CommonState, action: PayloadAction<MessageType>) => {
      state.lastMessage = action.payload;
    },
    setLastNotification: (state: CommonState, action: PayloadAction<NotificationType>) => {
      state.lastNotification = action.payload;
    },
    setIsNewMessage: (state: CommonState, action: PayloadAction<boolean>) => {
      state.isNewMessage = action.payload;
    },
    setIsNewNotification: (state: CommonState, action: PayloadAction<boolean>) => {
      state.isNewNotification = action.payload;
    },
    changeIsLoading: (state: CommonState, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    changeDisabledPeriod: (state: CommonState, action: PayloadAction<number>) => {
      state.disabledPeriod = action.payload;
    },
    changeIsRestricting: (state: CommonState, action: PayloadAction<boolean>) => {
      state.isRestricting = action.payload;
    },
  },
});

export const {
  changeShowFullNameCurrency,
  changeDepositCryptoArray,
  changeFiatArray,
  changeActiveFiat,
  changeCryptoArray,
  changeViewInFiat,
  changeUsdtNetwork,
  setCasinoTab,
  setLastMessage,
  setIsNewMessage,
  setIsNewNotification,
  changeIsLoading,
  changeDisabledPeriod,
  changeIsRestricting,
} = queryDataSlice.actions;
export default queryDataSlice.reducer;
