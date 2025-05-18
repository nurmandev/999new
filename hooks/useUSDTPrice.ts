import { shallowEqual, useSelector } from 'react-redux';

import { AppState } from '../redux/store';

export const useUSDTPrice = () => {
  const cryptoPrices = useSelector((state: AppState) => state.wallet.symbols, shallowEqual);
  const usdt = cryptoPrices.find((item) => item.name.toLowerCase() === 'usdt');
  if (!usdt) return 1;
  return usdt.price === 0 ? 1 : usdt.price;
};
