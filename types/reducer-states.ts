import { MultiLanguageTabEnum } from '@/components/modal/multiLanguage/MultiLanguage';

import {
  AuthenticationModeEnum,
  BetTableDataType,
  DepositAddress,
  FiatType,
  GameListType,
  MessageType,
  NotificationType,
  UserDetail,
  VerifyModeEnum,
} from './common';
import { VerifyRequestType } from './requestTypes';
import {
  BalanceType,
  BonusType,
  CryptoCurrencyType,
  CryptoNetWorkType,
  CurrencyType,
  DepositAddressType,
} from './wallet';

export type TokenState = {
  accessToken?: string;
  refreshToken?: string;
  tokenType?: string;
  expiresIn?: string;
  expiresAt?: string;
};

export type AuthState = {
  isLoading: {
    isCurrency: boolean;
    isLanguage: boolean;
  };
  isLogin: boolean;
  user: UserDetail;
  verifyRequest: VerifyRequestType;
  isPhoneVerifyRequested: boolean;
  isForgetPassword: boolean;
};

export type ModalState = {
  isShowDepositModal?: boolean;
  isShowReferAndEarn?: boolean;
  isShowInformation?: boolean;
  isShowUpdateInformation?: boolean;
  isShowUpdateAvatar?: boolean;
  isShowMultiLanguage?: boolean;
  isShowAuthenticationModal?: boolean;
  isShowForgotPassModal?: boolean;
  authenticationType?: AuthenticationModeEnum;
  multiLanguageTab?: MultiLanguageTabEnum;
  selectedAvatar?: string;
  showChatType: boolean;
  isToggleSidebar?: boolean;
  showFullChat: boolean;
  isShowVipClubModal?: boolean;
  isShowVipLevelModal?: boolean;
  isShowCryptoOnlineModal?: boolean;
  isShowResetPassword?: boolean;
  isShowDetailBets?: boolean;
  isShowSpinClaim?: boolean;
  detailBets: {
    betDetail: BetTableDataType;
    betId?: number;
    isPublicProfile?: boolean;
    titleModal?: String;
  };
  isShowCasinoSearch?: boolean;
  isShowRakeBackModal?: boolean;
  isShowRakeBackDetailModal?: boolean;
  isShowModalBonusHistory?: boolean;
  isShowAccountPannel?: boolean;
  isShowMenuPannel?: boolean;
  isShowVerifyMailAndPhone?: boolean;
  verifyModeType?: VerifyModeEnum;
  isShowWagerContestHistory?: boolean;
  isShowLogOutConfirm?: boolean;
  isShowSpin?: boolean;
  isShowDepositProgress?: boolean;
  isShowDetailTransaction?: boolean;
  isShowQuest?: boolean;
  isShowChatRule?: boolean;
  isShowBonusDetail?: boolean;
  isShowDepositRule?: boolean;
  isShowSelfExclusion?: boolean;
  isShowDailyContest?: boolean;
  isShowAccountRestriction?: boolean;
  isShowChatTip?: boolean;
  isShowAddressConfirm?: boolean;
  isShowWagerRule?: boolean;
  isShowFavoriteCoin?: boolean;
  isViewInFiat?: boolean;
  tipReceiver: {
    userId?: string;
    userName?: string;
    userAvatar?: string;
  };
  isShowNotification?: boolean;
};

export type LoadingState = {
  isShowDetailLoading?: boolean;
};

export type CommonState = {
  isLoading?: boolean;
  disabledPeriod?: number;
  fiatArray?: FiatType[];
  cryptoArray?: FiatType[];
  depositCryptoArray: DepositAddress[];
  localeFiat?: FiatType;
  prevLocaleFiat?: FiatType;
  activeFiat?: any;
  viewInFiat?: boolean;
  showFullNameCurrency?: boolean;
  usdtNetwork?: string;
  casinoTab?: boolean;
  lastMessage?: MessageType;
  lastNotification?: NotificationType;
  isNewMessage?: boolean;
  isNewNotification?: boolean;
  isRestricting?: boolean;
};

export type UserDataState = {
  userId: string;
  userName: string;
  avatar: string;
};

export type WalletState = {
  isWalletLoading: boolean;
  localFiat: CurrencyType | null;
  activeCurrency: CurrencyType;
  totalBalance: number;
  depositTime: number;
  realBalance: number;
  bonusBalance: number;
  networks: CryptoNetWorkType[];
  symbols: CurrencyType[];
  fiatSymbols: CurrencyType[];
  balances: BalanceType[];
  cryptoCurrencies: CryptoCurrencyType[];
  depositAddress: DepositAddressType[];
  lockedAmount: number;
  swapFee: number;
  activeTransactionStatus: {
    id: string;
    status: number; // 0 processing, 1 complete
    amountUsd: number;
    amount: number;
    symbol: string;
    hash: string;
    time: Date | string;
    network: string;
  };
  bonuses: BonusType[];
};

export type GameState = {
  betHistory: BetTableDataType[];
  recommandGames: GameListType[];
};
