import cn from 'classnames';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { shallowEqual, useSelector } from 'react-redux';

import { updateSetting } from '@/base/redux/reducers/auth.reducer';
import { setLocalFiat } from '@/base/redux/reducers/wallet.reducer';
import { AppState, useAppDispatch } from '@/base/redux/store';
import { CurrencyType } from '@/base/types/wallet';

import CommonModal from '../commonModal/commonModal';

interface ViewInFiatProps {
  show: boolean;
  onClose: () => void;
}

export default function ViewInFiat({ show, onClose }: ViewInFiatProps) {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const [selectedFiat, setSelectedFiat] = useState<CurrencyType>({
    id: '',
    name: '',
    alias: '',
    logo: '',
    iso_currency: '',
    iso_decimals: 0,
    type: 'fiat',
    availableNetworks: [], // for cryptos
    price: 0,
    favorite: false,
  });
  const { fiatSymbols, settings, localFiat, defaultCurrencyId } = useSelector(
    (state: AppState) => ({
      fiatSymbols: state.wallet.fiatSymbols,
      settings: state.auth.user.generalSetting,
      defaultCurrencyId: state.auth.user.generalSetting.settingCurrency,
      localFiat: state.wallet.localFiat,
    }),
    shallowEqual,
  );

  useEffect(() => {
    if (fiatSymbols.length > 0) {
      const usdFiat = fiatSymbols.find((item) => item.name.toLowerCase() === 'usd');
      if (usdFiat && !defaultCurrencyId) {
        dispatch(setLocalFiat(usdFiat));
        setSelectedFiat(usdFiat);
      }
    }
    if (defaultCurrencyId) {
      const currency = [...fiatSymbols].find((item) => item.id === defaultCurrencyId);
      if (currency) {
        dispatch(setLocalFiat(currency));

        setSelectedFiat(currency);
      }
    }
  }, [fiatSymbols, defaultCurrencyId]);

  return (
    <CommonModal
      show={show}
      panelClass="sm:max-w-[400px]"
      onClose={onClose}
      header={
        <div className="relative p-[20px] pb-0">
          <div className="flex items-center dark:text-white gap-[10px]">
            <div className="text-[18px] font-[600]">Information</div>
          </div>
        </div>
      }
    >
      <div className="p-[20px] flex flex-col gap-3 overflow-y-auto">
        <div className="text-[12px] text-gray-500 text-center">
          Please note that these are currency approximations. All bets & transactions will be calculated in equivalent
          currencies. For more details feel free to contact our live support.
        </div>
        <div className={'grid grid-cols-3 gap-y-2 justify-between items-center'}>
          {fiatSymbols.map((item, key) => (
            <label
              htmlFor={String(key)}
              key={key}
              role="button"
              className={cn(
                'p-[2px] text-left flex items-center justify-between dark:text-white text-black dark:hover:text-white hover:text-amber-600 w-full text-[14px] max-w-[80px] rounded m-auto',
              )}
              onClick={() => {
                setSelectedFiat(item);
              }}
            >
              <div className="flex gap-3 items-center justify-between w-full">
                <div className="flex items-center gap-1">
                  {item.id === selectedFiat.id && (
                    <input
                      readOnly
                      id={String(key)}
                      type="radio"
                      checked={true}
                      name="default-radio"
                      className="w-4 h-4 accent-color-primary bg-gray-100 border-gray-300 ring-none outline-none"
                    />
                  )}
                  {item.id !== selectedFiat.id && (
                    <div className="w-4 h-4 border border-solid dark:border-gray-600 border-gray-300 dark:bg-gray-800 bg-gray-200 rounded-full"></div>
                  )}

                  <div className="text-[12px]">{item.name}</div>
                </div>
                <Image
                  height={16}
                  width={16}
                  src={item.logo ? item.logo : '/img/fiats/USDT.png'}
                  alt="currency"
                  onError={(e) => {
                    e.currentTarget.src = '/img/fiats/USDT.png';
                  }}
                />
              </div>
            </label>
          ))}
        </div>
        <div className="m-auto">
          <button
            className="text-white rounded-[5px] bg-color-primary p-[10px] xl:text-[14px] text-[12px]"
            onClick={() => {
              if (selectedFiat.id) {
                dispatch(setLocalFiat(selectedFiat));
                dispatch(updateSetting({ ...settings, settingCurrency: selectedFiat.id }));
              }
              onClose();
            }}
          >
            {String(t('withdraw:confirm'))}
          </button>
        </div>
      </div>
    </CommonModal>
  );
}
