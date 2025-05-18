import { shallowEqual, useSelector } from 'react-redux';

import { AppState } from '../redux/store';

export const useActiveCurrencyPrice = () => {
  const { cryptoPrices, activeCurrency } = useSelector(
    (state: AppState) => ({ cryptoPrices: state.wallet.symbols, activeCurrency: state.wallet.activeCurrency }),
    shallowEqual,
  );
  const price = cryptoPrices.find((item) => item.id === activeCurrency.id)?.price;
  if (!price) return 1;
  return price === 0 ? 1 : price;
};
