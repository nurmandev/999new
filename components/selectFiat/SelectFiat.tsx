import cn from 'classnames';
import { ArrowDown2, Global } from 'iconsax-react';
import Image from 'next/image';
import { useEffect, useMemo, useState } from 'react';
import { shallowEqual, useSelector } from 'react-redux';

import { useTranslation } from '@/base/config/i18next';
import { changeIsShowMultiLanguageModal, changeMultiLanguageTab } from '@/base/redux/reducers/modal.reducer';
import { AppState, useAppDispatch } from '@/base/redux/store';
import { CurrencyType } from '@/base/types/wallet';

import InputSearch from '../input/typing/InputSearch';
import CommonModal from '../modal/commonModal/commonModal';
import { MultiLanguageTabEnum } from '../modal/multiLanguage/MultiLanguage';

type SelectFiatProps = {
  onChangeMoonpayFiat?: (value: CurrencyType) => void;
};

const SelectFiat = ({ onChangeMoonpayFiat }: SelectFiatProps) => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation('');

  const { fiatSymbols, defaultCurrencyId } = useSelector(
    (state: AppState) => ({
      fiatSymbols: state.wallet.fiatSymbols,
      localFiat: state.wallet.localFiat,
      defaultCurrencyId: state.auth.user.generalSetting.settingCurrency,
    }),
    shallowEqual,
  );

  const [isShowFiatModal, setIsShowFiatModal] = useState<boolean>(false);
  const [activeFiat, setActiveFiat] = useState<CurrencyType>({
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
  const [searchInput, setSearchInput] = useState<string>('');

  useEffect(() => {
    const defaultFiat = fiatSymbols.find((item) => item.id === defaultCurrencyId);
    if (defaultFiat != undefined) {
      setActiveFiat(defaultFiat);
    }
  }, [fiatSymbols, defaultCurrencyId]);

  const filterListFiat = useMemo(() => {
    return fiatSymbols?.filter((item) => {
      return (
        String(item.name).toLowerCase().includes(searchInput.toLowerCase()) ||
        String(item.alias).toLowerCase().includes(searchInput.toLowerCase())
      );
    });
  }, [fiatSymbols, searchInput]);

  return (
    <>
      <div
        role="button"
        className="flex items-center gap-2 px-2 py-2 border-0 border-solid rounded dark:bg-gray-700/50 bg-color-light-bg-primary dark:border border-color-border-primary"
        onClick={() => {
          dispatch(changeMultiLanguageTab(MultiLanguageTabEnum.FIAT));
          dispatch(changeIsShowMultiLanguageModal(true));
        }}
      >
        {activeFiat ? (
          <div className="flex items-center gap-3">
            <Image
              height={25}
              width={25}
              src={activeFiat.logo || '/image/fiats/USDT.png'}
              alt="symbol"
              onError={(error) => {
                error.currentTarget.src = '/image/fiats/USDT.png';
              }}
            />
            <div className="font-normal text-black dark:text-white text-default">{activeFiat.name}</div>
          </div>
        ) : (
          <Global />
        )}
        <ArrowDown2 className="text-black dark:text-white" />
      </div>

      <CommonModal
        show={isShowFiatModal}
        onClose={() => setIsShowFiatModal(false)}
        header={
          <div className="relative p-[20px] pb-0">
            <div className="flex items-center text-black dark:text-white gap-[10px]">
              <div className="text-[18px] font-[600]">{t('deposit:selectFiat')}</div>
            </div>
          </div>
        }
      >
        <>
          <div className="px-5 py-[10px]">
            <InputSearch
              className="dark:!bg-color-panel-bg-primary border border-solid border-transparent focus-within:border-color-primary"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
          </div>
          <div className="p-5 py-5 overflow-y-auto border">
            <div className={`grid grid-cols-1 gap-2`}>
              {filterListFiat?.map((item, key) => (
                <button
                  key={key}
                  className={cn(
                    'flex rounded-md text-left px-5 py-2 hover:bg-gray-200 dark:hover:bg-color-hover-primary items-center',
                    {
                      'border border-solid border-color-primary': activeFiat?.id === item.id,
                    },
                  )}
                  onClick={() => {
                    setActiveFiat(item);
                    onChangeMoonpayFiat && onChangeMoonpayFiat(item);
                    setIsShowFiatModal(false);
                  }}
                >
                  <div className="flex-1 flex gap-[10px] items-center">
                    <Image height={30} width={30} src={item.logo} alt="symbol" />

                    <div className="font-semibold text-default">{item.name}</div>
                  </div>
                  <div className="text-color-text-primary text-default">{item.alias}</div>
                </button>
              ))}
            </div>
          </div>
        </>
      </CommonModal>
    </>
  );
};

export default SelectFiat;
