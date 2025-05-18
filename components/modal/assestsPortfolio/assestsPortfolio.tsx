import { DialogProps, Switch, TransitionRootProps } from '@headlessui/react';
import cn from 'classnames';
import Image from 'next/image';
import { ElementType, useEffect, useMemo, useRef, useState } from 'react';
import { shallowEqual, useSelector } from 'react-redux';

import { useTranslation } from '@/base/config/i18next';
import { useExchange } from '@/base/hooks/useExchange';
import { currencyFormat1 } from '@/base/libs/utils';
import { updateSetting } from '@/base/redux/reducers/auth.reducer';
import { AppState, useAppDispatch } from '@/base/redux/store';
import { BalanceType, CurrencyType } from '@/base/types/wallet';
import InputSearch from '@/components/input/typing/InputSearch';

import CommonModal from '../commonModal/commonModal';
import ViewInFiat from '../viewInFiat/viewInFiat';

type ModalAssetsPortfolioProps = {
  onClose: () => void;
  show: boolean;
  cryptoSymbol: string;
  cryptoSymbols: CurrencyType[];
  onChangeCoin?: (coin: CurrencyType) => void;
} & TransitionRootProps<ElementType> &
  DialogProps<ElementType>;

const fiatDecimals = 2;
const cryptoDecimals = 4;

export default function ModalAssetsPortfolio({
  show,
  onClose,
  cryptoSymbol,
  cryptoSymbols,
  onChangeCoin,
}: ModalAssetsPortfolioProps) {
  const exchangeRate = useExchange();
  const cancelButtonRef = useRef(null);
  const { t } = useTranslation('');
  const dispatch = useAppDispatch();

  const { balances, localFiat, viewInFiat, settings, fiatSymbols } = useSelector(
    (state: AppState) => ({
      cryptoSymbols: state.wallet.symbols,
      balances: state.wallet.balances,
      localFiat: state.wallet.localFiat,
      fiatSymbols: state.wallet.fiatSymbols,
      viewInFiat: state.auth.user.generalSetting.settingViewInFiat,
      settings: state.auth.user.generalSetting,
    }),
    shallowEqual,
  );

  const [activeCoin, setActiveCoin] = useState<CurrencyType>();
  const [searchFiatInput, setSearchFiatInput] = useState<string>('');
  const [showSmallFiat, setShowSmallFiat] = useState<boolean>(false);
  const [showAllFiat, setShowAllFiat] = useState<boolean>(false);
  const [tab, setTab] = useState<number>(0);

  const handleChangeCoin = (coin: CurrencyType) => {
    setActiveCoin(coin);
    if (onChangeCoin) {
      onChangeCoin(coin);
    }
    onClose();
  };

  const usdFiat = useMemo(() => {
    const usd = fiatSymbols.find((item) => item.name.toLowerCase() === 'usd');
    if (usd) return usd;
    return null;
  }, [fiatSymbols]);

  const filterListCryptos = useMemo(() => {
    let arraySearch = [...cryptoSymbols].filter((item) =>
      item.name.toLowerCase().includes(searchFiatInput.trim().toLowerCase()),
    );
    if (showSmallFiat) {
      const avaSymbols = balances
        .filter(
          (item: BalanceType) =>
            item.amount * (cryptoSymbols.find((symbol) => symbol.id === item.symbolId)?.price || 0) > 1,
        )
        .map((item) => item.symbolId);
      arraySearch = [...arraySearch.filter((item) => avaSymbols.indexOf(item.id) != -1)];
    }
    return arraySearch;
  }, [cryptoSymbols, searchFiatInput, showSmallFiat, balances]);

  useEffect(() => {
    const active = filterListCryptos.find((crypto) => crypto.id === cryptoSymbol);
    if (active) {
      setActiveCoin(active);
    }
  }, [cryptoSymbol, filterListCryptos]);

  const getBalanceByCrypto = (crypto: CurrencyType) => {
    const tempBalances = [...balances];
    const selectedBalance = tempBalances.find((item) => item.symbolId === crypto.id);
    if (selectedBalance) return selectedBalance.amount;
    return 0;
  };

  return (
    <>
      <CommonModal
        show={show}
        onClose={onClose}
        panelClass="sm:max-w-[500px] max-w-full sm:max-h-[90vh] sm:min-h-[90vh]"
        header={
          <div className="flex !items-center !flex-row pr-[40px] modal-header gap-[20px]">
            <div className="flex items-center text-[0.875rem] sm:text-[1rem] dark:text-white text-black font-[600]">
              {t('deposit:assetsPortfolio')}
            </div>
            <div className="flex items-center gap-1">
              <div className="w-[9.375rem]">
                <InputSearch
                  value={searchFiatInput}
                  className="border border-solid border-transparent focus-within:border-color-primary"
                  showClose={searchFiatInput !== '' ? true : false}
                  onClose={() => {
                    setSearchFiatInput('');
                  }}
                  onChange={(e) => setSearchFiatInput(e.target.value)}
                />
              </div>
            </div>
          </div>
        }
      >
        <div className="overflow-y-auto mt-5 sm:p-5 sm:pt-6 px-3 pb-[80px]">
          {filterListCryptos?.map((coin: CurrencyType, index) => (
            <div
              key={index}
              className={cn('flex items-center justify-start p-[10px] w-full rounded-[3px]', {
                'border border-solid border-color-primary': coin.id === activeCoin?.id,
                'dark:hover:bg-color-hover-primary hover:bg-[#f5f6fa]': coin?.id !== activeCoin?.id,
              })}
              role="button"
              onClick={() => handleChangeCoin(coin)}
            >
              <div className="flex-1 flex items-center justify-start gap-[10px]">
                <Image
                  width={30}
                  height={30}
                  src={coin.logo ? coin.logo : '/img/fiats/USDT.png'}
                  className="inline"
                  alt="currency"
                  onError={(e) => {
                    e.currentTarget.src = '/img/fiats/USDT.png';
                  }}
                />
                <div className="flex-1 text-start text-[14px]">
                  {coin.name}
                  {/* <span className="ml-[5px] text-[10px] dark:text-gray-400 text-[#31373d]">
                                {coin.symbol == 'USDT' ? coin?.network : ''}
                              </span> */}
                </div>
              </div>
              <div className="text-right">
                {viewInFiat && (
                  <>
                    {currencyFormat1(
                      getBalanceByCrypto(coin) * coin.price * exchangeRate,
                      fiatDecimals,
                      localFiat?.name || 'USD',
                    )}
                    <br />
                    <span className="dark:text-gray-400 text-[#31373d] text-[12px]">
                      {currencyFormat1(getBalanceByCrypto(coin), cryptoDecimals, '', false)}
                    </span>
                  </>
                )}
                {!viewInFiat && <>{currencyFormat1(getBalanceByCrypto(coin), cryptoDecimals, '', false)}</>}
              </div>
            </div>
          ))}
          <div className="py-[10px] px-[10px] flex items-center justify-between">
            <div className="flex items-center gap-[5px]">
              <Switch
                checked={viewInFiat}
                onChange={(value: any) => {
                  if (!value) {
                    if (usdFiat) {
                      dispatch(updateSetting({ ...settings, settingViewInFiat: value, settingCurrency: usdFiat.id }));
                    }
                  } else {
                    dispatch(updateSetting({ ...settings, settingViewInFiat: value }));
                  }
                  dispatch(updateSetting({ ...settings, settingViewInFiat: value }));
                  if (value) setShowAllFiat(true);
                }}
                className={`${
                  viewInFiat ? 'bg-[#3bc11733]' : 'dark:bg-color-toggle-primary bg-gray-200'
                } relative inline-flex h-4 w-8 items-center rounded-full`}
              >
                <span
                  className={`${
                    viewInFiat ? 'translate-x-[15px] bg-color-primary' : 'translate-x-0 bg-gray-400'
                  } inline-block h-4 w-4 transform rounded-full transition`}
                />
              </Switch>
              <div className="text-[12px] dark:text-gray-400 text-[#31373d]">{t('fiatHeader:viewInFiat')}</div>
            </div>
            <div className="flex items-center gap-[5px]">
              <Switch
                checked={showSmallFiat}
                onChange={setShowSmallFiat}
                className={`${
                  showSmallFiat ? 'bg-[#3bc11733]' : 'dark:bg-color-toggle-primary bg-gray-200'
                } relative inline-flex h-4 w-8 items-center rounded-full`}
              >
                <span
                  className={`${
                    showSmallFiat ? 'translate-x-[15px] bg-color-primary' : 'translate-x-0 bg-gray-400'
                  } inline-block h-4 w-4 transform rounded-full transition`}
                />
              </Switch>
              <div className="text-[12px] dark:text-gray-400 text-[#31373d]">{t('fiatHeader:smallFiat')}</div>
            </div>
          </div>
        </div>
      </CommonModal>
      <ViewInFiat show={showAllFiat} onClose={() => setShowAllFiat(false)} />
    </>
  );
}
