export type CryptoNetWorkType = {
  id: string;
  name: string;
  type: number; // wallet type 1: erc/bsc 2: tron
};

export type CryptoCurrencyType = {
  id: string;
  networkId: string;
  symbolId: string;
  withdrawFee: number;
  minWithdrawAmount: number;
};

export type DepositAddressType = {
  address: string;
  network: string;
  networkId: string;
};

export type BalanceType = {
  amount: number;
  symbol: string;
  symbolId: string;
};

export type CurrencySymbolType = 'crypto' | 'fiat';

export type CurrencyType = {
  id: string;
  name: string;
  alias: string;
  logo: string;
  iso_currency: string;
  iso_decimals: number;
  type: CurrencySymbolType;
  availableNetworks: string[]; // for cryptos
  price: number;
  favorite: false;
};

export type PriceUpdateType = {
  id: string;
  price: number;
};

export type BonusType = {
  id: string;
  amount: number;
  amountUsd: number;
  type: string;
  typeName: string;
  allow: boolean;
  symbolName: string;
  symbolLogo: string;
};
