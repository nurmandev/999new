import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { AuthenticationModeEnum, BetTableDataType, VerifyModeEnum } from '@/base/types/common';
import { ModalState } from '@/base/types/reducer-states';
import { MultiLanguageTabEnum } from '@/components/modal/multiLanguage/MultiLanguage';

export const initialCommonState: ModalState = {
  isShowInformation: false,
  isShowReferAndEarn: false,
  isShowDepositModal: false,
  isShowAuthenticationModal: false,
  isShowForgotPassModal: false,
  isShowUpdateInformation: false,
  isShowUpdateAvatar: false,
  isShowMultiLanguage: false,
  authenticationType: AuthenticationModeEnum.SIGN_IN,
  multiLanguageTab: MultiLanguageTabEnum.LANGUAGE,
  selectedAvatar: '',
  showChatType: false,
  isToggleSidebar: true,
  showFullChat: false,
  isShowVipClubModal: false,
  isShowVipLevelModal: false,
  isShowCryptoOnlineModal: false,
  isShowResetPassword: false,
  isShowDetailBets: false,
  isShowCasinoSearch: false,
  isShowRakeBackModal: false,
  isShowRakeBackDetailModal: false,
  isShowModalBonusHistory: false,
  isShowAccountPannel: false,
  isShowMenuPannel: false,
  isShowVerifyMailAndPhone: false,
  verifyModeType: VerifyModeEnum.MAIL,
  isShowWagerContestHistory: false,
  isShowLogOutConfirm: false,
  isShowSpin: false,
  isShowDepositProgress: false,
  isShowSpinClaim: false,
  isShowBonusDetail: false,
  detailBets: {
    isPublicProfile: true,
    titleModal: '',
    betId: 0,
    betDetail: {
      game: '',
      gameIdenfiter: '',
      player: '',
      playerId: '',
      playerAvatar: '',
      betAmount: 0,
      betAmountUsd: 0,
      multiplier: 0,
      profitAmount: 0,
      profitAmountUsd: 0,
      currency: '',
      betId: '',
      time: new Date('20/04/2024'),
      providerName: '',
    },
  },
  isShowQuest: false,
  isShowDepositRule: false,
  isShowSelfExclusion: false,
  isShowDailyContest: false,
  isShowAccountRestriction: false,
  isShowChatTip: false,
  isShowAddressConfirm: false,
  isShowWagerRule: false,
  tipReceiver: {
    userId: '',
    userName: '',
    userAvatar: '',
  },
  isViewInFiat: false,
  isShowFavoriteCoin: false,
  isShowNotification: false,
};

export const queryDataSlice = createSlice({
  name: 'auth',
  initialState: initialCommonState,
  reducers: {
    changeIsShowInformation: (state: ModalState, action: PayloadAction<boolean>) => {
      state.isShowInformation = action.payload;
    },
    changeIsShowCasinoSearch: (state: ModalState, action: PayloadAction<boolean>) => {
      state.isShowCasinoSearch = action.payload;
    },
    changeIsShowReferAndEarn: (state: ModalState, action: PayloadAction<boolean>) => {
      state.isShowReferAndEarn = action.payload;
    },
    changeIsShowDepositModal: (state: ModalState, action: PayloadAction<boolean>) => {
      state.isShowDepositModal = action.payload;
    },
    changeIsShowUpdateInformation: (state: ModalState, action: PayloadAction<boolean>) => {
      state.isShowUpdateInformation = action.payload;
    },
    changeIsShowUpdateAvatar: (state: ModalState, action: PayloadAction<boolean>) => {
      state.isShowUpdateAvatar = action.payload;
    },
    changeIsShowMultiLanguageModal: (state: ModalState, action: PayloadAction<boolean>) => {
      state.isShowMultiLanguage = action.payload;
    },
    changeIsShowAuthenticationModal: (state: ModalState, action: PayloadAction<boolean>) => {
      state.isShowAuthenticationModal = action.payload;
    },
    changeAuthenticationType: (state: ModalState, action: PayloadAction<AuthenticationModeEnum>) => {
      state.authenticationType = action.payload;
    },
    changeMultiLanguageTab: (state: ModalState, action: PayloadAction<MultiLanguageTabEnum>) => {
      state.multiLanguageTab = action.payload;
    },
    changeIsShowForgotPassModal: (state: ModalState, action: PayloadAction<boolean>) => {
      state.isShowForgotPassModal = action.payload;
    },
    changeSelectedAvatar: (state: ModalState, action: PayloadAction<string>) => {
      state.selectedAvatar = action.payload;
    },
    changeShowChatType: (state: ModalState, action: PayloadAction<boolean>) => {
      state.showChatType = action.payload;
    },
    changeToggleSidebar: (state: ModalState, action: PayloadAction<boolean>) => {
      state.isToggleSidebar = action.payload;
    },
    changeShowFullChat: (state: ModalState, action: PayloadAction<boolean>) => {
      state.showFullChat = action.payload;
    },
    changeIsShowVipClubModal: (state: ModalState, action: PayloadAction<boolean>) => {
      state.isShowVipClubModal = action.payload;
    },
    changeIsShowVipLevelModal: (state: ModalState, action: PayloadAction<boolean>) => {
      state.isShowVipLevelModal = action.payload;
    },
    changeIsShowCryptoOnlineModal: (state: ModalState, action: PayloadAction<boolean>) => {
      state.isShowCryptoOnlineModal = action.payload;
    },
    changeIsShowResetPassword: (state: ModalState, action: PayloadAction<boolean>) => {
      state.isShowResetPassword = action.payload;
    },
    changeIsShowDetailBets: (state: ModalState, action: PayloadAction<boolean>) => {
      state.isShowDetailBets = action.payload;
    },
    changeIsShowRakeBack: (state: ModalState, action: PayloadAction<boolean>) => {
      state.isShowRakeBackModal = action.payload;
    },
    changeIsShowRakeBackDetail: (state: ModalState, action: PayloadAction<boolean>) => {
      state.isShowRakeBackDetailModal = action.payload;
    },
    changeIsShowBonusHistory: (state: ModalState, action: PayloadAction<boolean>) => {
      state.isShowModalBonusHistory = action.payload;
    },
    changeIsShowAccountPannel: (state: ModalState, action: PayloadAction<boolean>) => {
      state.isShowAccountPannel = action.payload;
    },
    changeIsShowMenuPannel: (state: ModalState, action: PayloadAction<boolean>) => {
      state.isShowMenuPannel = action.payload;
    },
    changeIsShowVerifyMailAndPhone: (state: ModalState, action: PayloadAction<boolean>) => {
      state.isShowVerifyMailAndPhone = action.payload;
    },
    changeVerifyMode: (state: ModalState, action: PayloadAction<VerifyModeEnum>) => {
      state.verifyModeType = action.payload;
    },
    changeIsShowWagerContestHistory: (state: ModalState, action: PayloadAction<boolean>) => {
      state.isShowWagerContestHistory = action.payload;
    },
    changeIsShowLogOutConfirm: (state: ModalState, action: PayloadAction<boolean>) => {
      state.isShowLogOutConfirm = action.payload;
    },
    changeIsShowSpin: (state: ModalState, action: PayloadAction<boolean>) => {
      state.isShowSpin = action.payload;
    },
    changeIsShowDepositProgress: (state: ModalState, action: PayloadAction<boolean>) => {
      state.isShowDepositProgress = action.payload;
    },
    changeIsShowSpinClaim: (state: ModalState, action: PayloadAction<boolean>) => {
      state.isShowSpinClaim = action.payload;
    },
    changeIsShowQuest: (state: ModalState, action: PayloadAction<boolean>) => {
      state.isShowQuest = action.payload;
    },
    changeIsShowChatRule: (state: ModalState, action: PayloadAction<boolean>) => {
      state.isShowChatRule = action.payload;
    },
    changeIsShowBonusDetail: (state: ModalState, action: PayloadAction<boolean>) => {
      state.isShowBonusDetail = action.payload;
    },
    changeIsShowSelfExclusion: (state: ModalState, action: PayloadAction<boolean>) => {
      state.isShowSelfExclusion = action.payload;
    },
    changeIsShowDailyContest: (state: ModalState, action: PayloadAction<boolean>) => {
      state.isShowDailyContest = action.payload;
    },
    changeIsShowDepositRule: (state: ModalState, action: PayloadAction<boolean>) => {
      state.isShowDepositRule = action.payload;
    },
    changeIsShowAccountRestriction: (state: ModalState, action: PayloadAction<boolean>) => {
      state.isShowAccountRestriction = action.payload;
    },
    changeIsShowChatTip: (state: ModalState, action: PayloadAction<boolean>) => {
      state.isShowChatTip = action.payload;
    },
    changeIsShowWagerRules: (state: ModalState, action: PayloadAction<boolean>) => {
      state.isShowWagerRule = action.payload;
    },
    changeIsShowFavoriteCoin: (state: ModalState, action: PayloadAction<boolean>) => {
      state.isShowFavoriteCoin = action.payload;
    },
    changeIsShowViewInFiat: (state: ModalState, action: PayloadAction<boolean>) => {
      state.isViewInFiat = action.payload;
    },
    changeIsShowAddressConfirm: (state: ModalState, action: PayloadAction<boolean>) => {
      state.isShowAddressConfirm = action.payload;
    },
    changeIsShowNotification: (state: ModalState, action: PayloadAction<boolean>) => {
      state.isShowNotification = action.payload;
    },
    setDetailBets: (
      state: ModalState,
      action: PayloadAction<{
        betDetail: BetTableDataType;
        betId?: number;
        isPublicProfile?: boolean;
        titleModal?: String;
      }>,
    ) => {
      state.detailBets = action.payload;
    },
    setTipReceiver: (
      state: ModalState,
      action: PayloadAction<{
        userId: string;
        userName: string;
        userAvatar: string;
      }>,
    ) => {
      state.tipReceiver = action.payload;
    },
    setInitialModals: (state: ModalState) => {
      state.isShowAccountPannel = false;
      state.isShowInformation = false;
      state.isShowReferAndEarn = false;
      state.isShowDepositModal = false;
      state.isShowAuthenticationModal = false;
      state.isShowForgotPassModal = false;
      state.isShowUpdateInformation = false;
      state.isShowUpdateAvatar = false;
      state.isShowMultiLanguage = false;
      state.authenticationType = AuthenticationModeEnum.SIGN_IN;
      state.multiLanguageTab = MultiLanguageTabEnum.LANGUAGE;
      state.selectedAvatar = '';
      state.showChatType = false;
      state.isToggleSidebar = true;
      state.showFullChat = false;
      state.isShowVipClubModal = false;
      state.isShowVipLevelModal = false;
      state.isShowCryptoOnlineModal = false;
      state.isShowResetPassword = false;
      state.isShowDetailBets = false;
      state.isShowCasinoSearch = false;
      state.isShowRakeBackModal = false;
      state.isShowRakeBackDetailModal = false;
      state.isShowModalBonusHistory = false;
      state.isShowAccountPannel = false;
      state.isShowMenuPannel = false;
      state.isShowVerifyMailAndPhone = false;
      state.verifyModeType = VerifyModeEnum.MAIL;
      state.isShowWagerContestHistory = false;
      state.isShowLogOutConfirm = false;
      state.isShowDepositProgress = false;
      state.isShowChatTip = false;
    },
  },
});

export const {
  changeToggleSidebar,
  changeMultiLanguageTab,
  changeAuthenticationType,
  changeIsShowAuthenticationModal,
  changeIsShowForgotPassModal,
  changeIsShowInformation,
  changeIsShowReferAndEarn,
  changeIsShowUpdateInformation,
  changeSelectedAvatar,
  changeIsShowMultiLanguageModal,
  changeShowChatType,
  changeShowFullChat,
  changeIsShowDepositModal,
  changeIsShowVipClubModal,
  changeIsShowVipLevelModal,
  changeIsShowCryptoOnlineModal,
  changeIsShowUpdateAvatar,
  changeIsShowResetPassword,
  changeIsShowDetailBets,
  changeIsShowCasinoSearch,
  changeIsShowRakeBack,
  changeIsShowRakeBackDetail,
  changeIsShowBonusHistory,
  changeIsShowAccountPannel,
  changeIsShowMenuPannel,
  changeIsShowVerifyMailAndPhone,
  changeVerifyMode,
  changeIsShowWagerContestHistory,
  changeIsShowLogOutConfirm,
  changeIsShowSpin,
  changeIsShowDepositProgress,
  changeIsShowSpinClaim,
  changeIsShowQuest,
  changeIsShowChatRule,
  changeIsShowBonusDetail,
  changeIsShowDepositRule,
  changeIsShowSelfExclusion,
  changeIsShowDailyContest,
  changeIsShowAccountRestriction,
  changeIsShowChatTip,
  changeIsShowWagerRules,
  changeIsShowAddressConfirm,
  setDetailBets,
  setInitialModals,
  setTipReceiver,
  changeIsShowFavoriteCoin,
  changeIsShowViewInFiat,
  changeIsShowNotification,
} = queryDataSlice.actions;
export default queryDataSlice.reducer;
