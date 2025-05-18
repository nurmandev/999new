import { shallowEqual, useSelector } from 'react-redux';

import { AppState } from '../redux/store';

export const useExchange = () => {
  const { localFiat, fiatSymbols } = useSelector(
    (state: AppState) => ({
      localFiat: state.wallet.localFiat,
      fiatSymbols: state.wallet.fiatSymbols,
    }),
    shallowEqual,
  );
  const localFiatId = localFiat?.id;
  const price = fiatSymbols.find((item) => item.id === localFiat?.id)?.price;
  return price ? 1 / price : 1;
};
