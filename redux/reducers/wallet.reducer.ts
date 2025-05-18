import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import {
  api_getClaims,
  api_getDepositTime,
  api_getUserBalance,
  api_getWalletInfo,
  api_swapFeeInfo,
} from '@/api/wallet';
import { AppDispatch } from '@/base/redux/store';
import { WalletState } from '@/base/types/reducer-states';
import {
  BalanceType,
  BonusType,
  CryptoCurrencyType,
  CryptoNetWorkType,
  CurrencyType,
  DepositAddressType,
  PriceUpdateType,
} from '@/base/types/wallet';
import { api_bonusClaimList } from '@/api/bonus';

const initialState: WalletState = {
  isWalletLoading: true,
  localFiat: null,
  totalBalance: 0,
  realBalance: 0,
  bonusBalance: 0,
  depositTime: 0,
  activeCurrency: {
    id: '',
    name: '',
    alias: '',
    logo: '',
    iso_currency: '',
    iso_decimals: 0,
    availableNetworks: [],
    type: 'crypto',
    price: 0,
    favorite: false,
  },
  networks: [],
  symbols: [],
  fiatSymbols: [],
  balances: [],
  depositAddress: [], // wallet address
  cryptoCurrencies: [],
  lockedAmount: 0,
  swapFee: 0.015,
  activeTransactionStatus: {
    id: '',
    status: 0,
    amount: 0,
    amountUsd: 0,
    symbol: 'USD',
    hash: '0x',
    time: '19/03/2024',
    network: '',
  }, // socket deposit address
  bonuses: [],
};

export const walletReducer = createSlice({
  name: 'wallet',
  initialState,
  reducers: {
    setBalance: (
      state: WalletState,
      action: PayloadAction<{ totalBalance: number; realBalance: number; bonusBalance: number }>,
    ) => {
      state.totalBalance = action.payload.totalBalance;
      state.realBalance = action.payload.realBalance;
      state.bonusBalance = action.payload.bonusBalance;
    },
    setNetworks: (state: WalletState, action: PayloadAction<CryptoNetWorkType[]>) => {
      state.networks = [...action.payload];
    },
    setSymbols: (state: WalletState, action: PayloadAction<CurrencyType[]>) => {
      state.symbols = [...action.payload];
    },
    setBalances: (state: WalletState, action: PayloadAction<BalanceType[]>) => {
      state.balances = [...action.payload];
    },
    setDepositAddress: (state: WalletState, action: PayloadAction<DepositAddressType[]>) => {
      state.depositAddress = [...action.payload];
    },
    setCryptoCurrencies: (state: WalletState, action: PayloadAction<CryptoCurrencyType[]>) => {
      state.cryptoCurrencies = [...action.payload];
    },
    setFiatSymbols: (state: WalletState, action: PayloadAction<CurrencyType[]>) => {
      state.fiatSymbols = [...action.payload];
    },
    setLocalFiat: (state: WalletState, action: PayloadAction<CurrencyType | null>) => {
      state.localFiat = action.payload;
    },
    setActiveCurrency: (state: WalletState, action: PayloadAction<CurrencyType>) => {
      state.activeCurrency = { ...action.payload };
    },
    setDepositTime: (state: WalletState, action: PayloadAction<number>) => {
      state.depositTime = action.payload;
    },
    addDepositTime: (state: WalletState, action: PayloadAction<number>) => {
      state.depositTime += action.payload;
    },
    updateBalance: (state: WalletState, action: PayloadAction<BalanceType>) => {
      const index = state.balances.findIndex((item) => item.symbolId === action.payload.symbolId);
      if (index !== -1) {
        state.balances[index] = action.payload;
      }
    },
    updateCryptoPrice: (state: WalletState, action: PayloadAction<PriceUpdateType[]>) => {
      const priceUpdateData = [...action.payload];
      const _cryptos = [...state.symbols];
      const _res = _cryptos.map((crypto) => {
        const selectedPriceUpdateData = priceUpdateData.find((item) => item.id === crypto.id);
        let updatedPrice = crypto.price;
        if (selectedPriceUpdateData) {
          updatedPrice = selectedPriceUpdateData.price;
        }
        return {
          ...crypto,
          price: updatedPrice,
        };
      });
      state.symbols = [..._res];
    },
    updatedFiatPrice: (state: WalletState, action: PayloadAction<PriceUpdateType[]>) => {
      const priceUpdateData = [...action.payload];
      const _fiats = [...state.fiatSymbols];
      const _res = _fiats.map((fiat) => {
        const selectedPriceUpdateData = priceUpdateData.find((item) => item.id === fiat.id);
        let updatedPrice = fiat.price;
        if (selectedPriceUpdateData) {
          updatedPrice = selectedPriceUpdateData.price;
        }
        return {
          ...fiat,
          price: updatedPrice,
        };
      });
      state.fiatSymbols = [..._res];
    },
    setLockedAmount: (state: WalletState, action: PayloadAction<number>) => {
      state.lockedAmount = action.payload;
    },
    setSwapFee: (state: WalletState, action: PayloadAction<number>) => {
      state.swapFee = action.payload;
    },
    setActiveTransactionStatus: (
      state: WalletState,
      action: PayloadAction<{
        id: string;
        status: number;
        amount: number;
        amountUsd: number;
        symbol: string;
        hash: string;
        time: Date;
        network: string;
      }>,
    ) => {
      state.activeTransactionStatus = action.payload;
    },
    setIsWalletLoading: (state: WalletState, action: PayloadAction<boolean>) => {
      state.isWalletLoading = action.payload;
    },
    setBonus: (state: WalletState, action: PayloadAction<BonusType[]>) => {
      state.bonuses = action.payload;
    },
  },
});

export const {
  setNetworks,
  setBalances,
  setDepositAddress,
  setSymbols,
  setCryptoCurrencies,
  setFiatSymbols,
  setBalance,
  setDepositTime,
  setLocalFiat,
  addDepositTime,
  setActiveCurrency,
  updateBalance,
  setLockedAmount,
  updateCryptoPrice,
  updatedFiatPrice,
  setActiveTransactionStatus,
  setSwapFee,
  setIsWalletLoading,
  setBonus,
} = walletReducer.actions;
export default walletReducer.reducer;

export const logoutWallet = () => async (dispath: AppDispatch) => {
  dispath(setNetworks([]));
  dispath(setBalances([]));
  dispath(setDepositAddress([]));
  dispath(setSymbols([]));
  dispath(setCryptoCurrencies([]));
  dispath(setFiatSymbols([]));
  dispath(setDepositTime(0));
  dispath(
    setBalance({
      totalBalance: 0,
      bonusBalance: 0,
      realBalance: 0,
    }),
  );

  dispath(setLocalFiat(null));
};

export const initWalletInfo = () => async (dispatch: AppDispatch) => {
  try {
    dispatch(setIsWalletLoading(true));
    const [_res, _resSwap] = await Promise.all([api_getWalletInfo(), api_swapFeeInfo()]);
    const { wallets, balances, networks, symbols, currency, fiatSymbols, depositTime, lockedUSDT } = _res.data;

    const tempWallets: DepositAddressType[] =
      wallets?.map((item: any) => ({
        address: item.depositAddress,
        network: item.network.network,
        networkId: item.network.id,
      })) || [];

    const tempBalances: BalanceType[] =
      balances?.cryptoBalances.map((item: any) => ({
        amount: Number(item.balance),
        symbol: item.symbol,
        symbolId: item.symbolId,
      })) || [];

    const tempNetworks: CryptoNetWorkType[] =
      networks?.map((item: any) => ({
        id: item.id,
        name: item.network,
        type: item.type,
      })) || [];

    const tempSymbols: CurrencyType[] =
      symbols?.map((item: any) => ({
        id: item.id,
        name: item.symbol,
        alias: item.name,
        logo: item.logo,
        iso_currency: item.iso_currency,
        iso_decimals: item.iso_decimals,
        availableNetworks: item.availableNetworks,
        price: Number(item.price),
        type: 'crypto',
        favorite: item.favorite,
      })) || [];
    const usdtIndex = tempSymbols.findIndex((symbol) => symbol.name === 'USDT');
    tempSymbols.splice(0, 0, tempSymbols.splice(usdtIndex, 1)[0]);

    const tempCurrencies: CryptoCurrencyType[] =
      currency?.map((item: any) => ({
        id: item.id,
        networkId: item.network.id,
        symbolId: item.symbol.id,
        withdrawFee: Number(item.withdrawFee),
        minWithdrawAmount: Number(item.withdrawFee),
      })) || [];

    const tempFiatSymbols: CurrencyType[] =
      fiatSymbols?.map((item: any) => ({
        id: item.id,
        name: item.symbol,
        alias: item.name,
        logo: `/img/fiats/${item.symbol}.png`,
        iso_currency: item.iso_currency,
        iso_decimals: item.iso_decimals,
        availableNetworks: item.availableNetworks,
        price: Number(item.price),
        type: 'fiat',
        favorite: item.favorite,
      })) || [];
    const usdIndex = tempFiatSymbols.findIndex((symbol) => symbol.name === 'USD');
    tempFiatSymbols.splice(0, 0, tempFiatSymbols.splice(usdIndex, 1)[0]);

    const tempLockedAmount = Number(lockedUSDT || 0);
    dispatch(
      setBalance({
        totalBalance: Number(balances.totalBalance),
        realBalance: Number(balances.realBalance),
        bonusBalance: Number(balances.bonusBalance),
      }),
    );
    dispatch(setNetworks(tempNetworks));
    dispatch(setBalances(tempBalances));
    dispatch(setDepositAddress(tempWallets));
    dispatch(setSymbols(tempSymbols));
    dispatch(setFiatSymbols(tempFiatSymbols));
    dispatch(setCryptoCurrencies(tempCurrencies));
    dispatch(setDepositTime(Number(depositTime)));
    dispatch(setLockedAmount(tempLockedAmount));

    const swapFee = _resSwap.data?.feePercentage || 0.015;
    dispatch(setSwapFee(swapFee));

    dispatch(setIsWalletLoading(false));
  } catch (error) {
    console.log(error);
    dispatch(setNetworks([]));
    dispatch(setBalances([]));
    dispatch(setDepositAddress([]));
    dispatch(setSymbols([]));
    dispatch(setFiatSymbols([]));
    dispatch(setCryptoCurrencies([]));
    dispatch(setDepositTime(0));
    dispatch(setLockedAmount(0));
  } finally {
    dispatch(setIsWalletLoading(false));
  }
};

export const getBalance = () => async (dispatch: AppDispatch) => {
  try {
    const result = await api_getUserBalance();
    const bonusData = await api_getClaims();
    const tempBalances: BalanceType[] = result.data?.cryptoBalances?.map((item: any) => ({
      amount: Number(item.balance),
      symbol: item.symbol,
      symbolId: item.symbolId,
    }));

    const temptotalBalance = result.data?.totalBalance;
    const temprealBalance = result.data?.realBalance;
    const tempbonusBalance = result.data?.bonusBalance;
    const tempLockedAmount = Number(bonusData.data?.lockedAmount ?? 0);

    dispatch(
      setBalance({
        totalBalance: Number(temptotalBalance),
        realBalance: Number(temprealBalance),
        bonusBalance: Number(tempbonusBalance),
      }),
    );
    dispatch(setLockedAmount(tempLockedAmount));
    dispatch(setBalances(tempBalances));
  } catch (error) {
    console.log(error);
  }
};

export const getDepositTime = () => async (dispatch: AppDispatch) => {
  try {
    const result = await api_getDepositTime();
    dispatch(setDepositTime(result.data?.times ?? 0));
  } catch (error) {
    console.log(error);
  }
};

export const getBonusList = () => async (dispatch: AppDispatch) => {
  try {
    const result = await api_bonusClaimList();
    const tempBonuses: BonusType[] = result.data?.map((item: any) => ({
      id: item.id ?? '',
      amount: Number(item.amount || 0),
      amountUsd: Number(item.amountUsd || 0),
      type: item.type,
      typeName: item?.typeName || '',
      allow: item.allowClaim,
      symbolName: item.symbolName || '',
      symbolLogo: item.symbolLogo || '',
    }));
    dispatch(setBonus(tempBonuses));
  } catch (error) {
    dispatch(setBonus([]));
  }
};
