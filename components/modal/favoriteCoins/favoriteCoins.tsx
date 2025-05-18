import { DialogProps, Switch, TransitionRootProps } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import cn from 'classnames';
import { ArrowDown, ArrowUp } from 'iconsax-react';
import Image from 'next/image';
import { useTheme } from 'next-themes';
import { ElementType, useEffect, useMemo, useState } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';

import { api_setCurrencyFavorite } from '@/api/wallet';
import { useTranslation } from '@/base/config/i18next';
import { TOAST_ENUM } from '@/base/constants/common';
import { getErrorMessage } from '@/base/libs/utils/notificationToast';
import { setFiatSymbols, setSymbols } from '@/base/redux/reducers/wallet.reducer';
import { AppState } from '@/base/redux/store';
import { CurrencyType } from '@/base/types/wallet';
import Loader from '@/components/common/preloader/loader';
import InputSearch from '@/components/input/typing/InputSearch';

import CommonModal from '../commonModal/commonModal';
import CsrWrapper from '@/components/CsrWrapper';

type ModalCurrencyTypesProps = {
  onClose: () => void;
  show: boolean;
} & TransitionRootProps<ElementType> &
  DialogProps<ElementType>;

export default function ModalCurrencyTypes({ show, onClose }: ModalCurrencyTypesProps) {
  const { t } = useTranslation('');
  const { theme } = useTheme();
  const dispatch = useDispatch();

  const { showFullNameCurrency, fiatArray, cryptoArray } = useSelector(
    (state: AppState) => ({
      fiatArray: state.wallet.fiatSymbols,
      cryptoArray: state.wallet.symbols,
      showFullNameCurrency: state.auth.user.generalSetting.settingShowFullNameCrypto,
    }),
    shallowEqual,
  );

  const [searchInput, setSearchInput] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isReverse, setIsReverse] = useState<boolean>(false);
  const [openTab, setOpenTab] = useState<number>(1);
  const [listCrypto, setListCrypto] = useState<CurrencyType[]>([]);
  const [listFiat, setListFiat] = useState<CurrencyType[]>([]);
  const [listFavorite, setListFavorite] = useState<CurrencyType[]>([]);

  const listCoinCrypto = useMemo(() => {
    return listCrypto
      ?.filter(
        (coin: CurrencyType) =>
          coin.name.toLowerCase()?.includes(searchInput.toLowerCase().trim()) ||
          String(coin.name).toLowerCase().includes(searchInput.toLowerCase()),
      )
      ?.filter((item) => item.name !== 'USDT' || item.name === 'USDT');
  }, [searchInput, listCrypto, isReverse]);

  const listCoinFiat = useMemo(() => {
    return listFiat?.filter(
      (coin: CurrencyType) =>
        coin.name.toLowerCase()?.includes(searchInput.toLowerCase().trim()) ||
        String(coin.name).toLowerCase().includes(searchInput.toLowerCase().trim()),
    );
  }, [searchInput, listFiat, isReverse]);

  const listCoinFavorite = useMemo(() => {
    return listFavorite.filter(
      (coin: CurrencyType) =>
        (coin.name.toLowerCase()?.includes(searchInput.toLowerCase().trim()) ||
          String(coin.name).toLowerCase().includes(searchInput.toLowerCase().trim())) &&
        coin.favorite,
    );
  }, [searchInput, listFavorite, isReverse]);

  const handleFavoriteCoin = async (coin: CurrencyType) => {
    try {
      setIsLoading(true);
      const _res = await api_setCurrencyFavorite(coin.id, coin.type);
      const state = _res.data.state;
      let tempCurrency = coin.type === 'crypto' ? [...cryptoArray] : [...fiatArray];
      tempCurrency = tempCurrency.map((item) => {
        if (item.id === coin.id) {
          item = {
            ...item,
            favorite: state,
          };
        }
        return item;
      });
      dispatch(coin.type === 'crypto' ? setSymbols([...tempCurrency]) : setFiatSymbols([...tempCurrency]));
    } catch (error: any) {
      const errType = error.response?.data?.message ?? '';
      const errMessage = getErrorMessage(errType);
      toast.error(t(errMessage), { containerId: TOAST_ENUM.COMMON });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setListCrypto(cryptoArray);
    setListFiat(fiatArray);
    setListFavorite([...cryptoArray, ...fiatArray]);
  }, [cryptoArray, fiatArray]);

  useEffect(() => {
    setIsReverse(!isReverse);
  }, [openTab]);

  const handleSortCoins = () => {
    switch (openTab) {
      case 1:
        sort(listCrypto, setListCrypto);
        break;
      case 2:
        sort(listFiat, setListFiat);
        break;
      default:
        sort(listFavorite, setListFavorite);
        break;
    }
  };

  const sort = (listCoin: CurrencyType[], callBack: Function) => {
    const listCoinsSort = JSON.parse(JSON.stringify(listCoin)).reverse();
    setIsReverse(!isReverse);
    callBack(listCoinsSort);
  };

  return (
    <>
      <CommonModal
        show={show}
        onClose={onClose}
        panelClass="sm:!max-w-[480px] sm:h-[90vh] sm:min-h-[90vh] sm:!my-0"
        isShowCloseButton={false}
        header={
          <div className="flex gap-4 items-center w-full pb-[10px] pt-[25px] px-5">
            <InputSearch
              value={searchInput}
              className="!w-full border border-solid dark:border-transparent border-color-light-border-primary focus-within:border-color-primary"
              showClose={searchInput !== '' ? true : false}
              onClose={() => {
                setSearchInput('');
              }}
              onChange={(e) => setSearchInput(e.target.value)}
            />
            <div className="rounded-md group" role="button" onClick={onClose}>
              <XMarkIcon width={15} className="text-color-text-primary group-hover:text-white w-[1.5rem] h-[1.5rem] transition-all duration-300 rotate-0 hover:rotate-90" />
            </div>
          </div>
        }
      >
        <>
          {isLoading && <Loader />}
          <div className="flex-col flex gap-[10px] justify-between my-[20px] px-5">
            <div className="flex">
              <div
                onClick={() => setOpenTab(1)}
                className={cn('text-default inline-block px-2 py-3 cursor-pointer grow text-center', {
                  'dark:text-white dark:bg-color-input-primary text-[#000] bg-color-light-active-primary font-bold':
                    openTab === 1,
                  'dark:hover:text-white hover:bg-color-input-primary hover:text-black text-[#31373D] dark:text-color-text-primary':
                    openTab !== 1,
                })}
              >
                {t('deposit:crypto')}
              </div>
              {/* Hiding fiat header & mnFT */}
              {/* <div
                onClick={() => setOpenTab(2)}
                className={cn('text-default inline-block px-2 py-3 cursor-pointer grow text-center', {
                  'dark:text-white dark:bg-color-active-secondary text-[#000]  bg-color-light-active-primary font-bold':
                    openTab === 2,
                  'dark:hover:text-white dark:bg-color-header-secondary bg-color-light-header-secondary hover:bg-color-light-header-secondary hover:text-black text-[#31373D] dark:text-color-text-primary':
                    openTab !== 2,
                })}
              >
                {t('deposit:fiat')}
              </div>
              <div
                onClick={() => setOpenTab(3)}
                className={cn('text-default inline-block px-2 py-3 cursor-pointer grow text-center', {
                  'dark:text-white dark:bg-color-active-secondary text-[#000]  bg-color-light-active-primary font-bold':
                    openTab === 3,
                  'dark:hover:text-white dark:bg-color-header-secondary bg-color-light-header-secondary hover:bg-color-light-header-secondary hover:text-black text-[#31373D] dark:text-color-text-primary':
                    openTab !== 3,
                })}
              >
                {t('deposit:mNFT')}
              </div> */}
              <div
                onClick={() => setOpenTab(4)}
                className={cn('text-default inline-block px-2 py-3 cursor-pointer grow text-center', {
                  'dark:text-white dark:bg-color-input-primary text-[#000]  bg-color-light-active-primary font-bold':
                    openTab === 4,
                  'dark:hover:text-white hover:bg-color-input-primary hover:text-black text-[#31373D] dark:text-color-text-primary':
                    openTab !== 4,
                })}
              >
                {t('deposit:myFavorite')}
              </div>
            </div>
          </div>
          <div className="text-color-text-primary block relative h-[calc(90vh_-_170px)]">
            <div className="flex items-center justify-between px-5">
              {t('deposit:myFavoriteCoins')}
              {isReverse ? (
                <ArrowUp
                  size="28"
                  color="#98a7b5"
                  variant="Bold"
                  className="cursor-pointer"
                  onClick={handleSortCoins}
                />
              ) : (
                <ArrowDown
                  size="28"
                  color="#98a7b5"
                  variant="Bold"
                  className="cursor-pointer"
                  onClick={handleSortCoins}
                />
              )}
            </div>
            <div className="flex flex-col pt-[10px] max-h-[calc(100%_-_30px)] overflow-y-auto scrollbar  px-5">
              {openTab === 1 &&
                listCoinCrypto.length > 0 &&
                listCoinCrypto?.map((coin, index) => (
                  <div
                    onClick={() => handleFavoriteCoin(coin)}
                    key={index}
                    className="flex items-center justify-between p-[10px] w-full rounded-lg"
                    role="button"
                  >
                    <div className="flex-1 flex items-center justify-start gap-[10px]">
                      <Image width={30} height={30} src={coin.logo} className="inline" alt="symbol" />
                      <div className="flex-1 text-black dark:text-white text-start text-default">{coin.name}</div>
                    </div>
                    <div className="flex items-center gap-[5px]">
                      {showFullNameCurrency && <span className="text-m_default">{coin.alias}</span>}
                      <Switch
                        id={`coin_${index}`}
                        checked={coin.favorite}
                        className={`${coin.favorite ? 'bg-color-select-bg-primary' : 'dark:bg-color-toggle-primary bg-gray-200'
                          } relative inline-flex h-4 w-8 items-center rounded-full`}
                      >
                        <span
                          className={`${coin.favorite ? 'translate-x-[15px] bg-color-primary' : 'translate-x-0 bg-gray-400'
                            } inline-block h-4 w-4 transform rounded-full transition`}
                        />
                      </Switch>
                    </div>
                  </div>
                ))}
              {openTab === 2 &&
                listCoinFiat.length > 0 &&
                listCoinFiat?.map((fiat, index) => (
                  <div
                    onClick={() => handleFavoriteCoin(fiat)}
                    key={index}
                    className="flex items-center  justify-between p-[10px] w-full rounded-lg"
                    role="button"
                  >
                    <div className="flex-1 flex items-center justify-start gap-[10px]">
                      <Image width={30} height={30} src={fiat.logo} className="inline" alt="symbol" />
                      <div className="flex-1 text-black dark:text-white text-start text-default">{fiat.name}</div>
                    </div>
                    <div className="flex items-center gap-[5px]">
                      <span>{fiat.alias}</span>
                      <Switch
                        id={`fiat_${index}`}
                        checked={fiat.favorite}
                        className={`${fiat.favorite ? 'bg-[#3bc11733]' : 'dark:bg-color-toggle-primary bg-gray-200'
                          } relative inline-flex h-4 w-8 items-center rounded-full`}
                      >
                        <span
                          className={`${fiat.favorite ? 'translate-x-[15px] bg-color-primary' : 'translate-x-0 bg-gray-400'
                            } inline-block h-4 w-4 transform rounded-full transition`}
                        />
                      </Switch>
                    </div>
                  </div>
                ))}
              {openTab === 4 &&
                listCoinFavorite.length > 0 &&
                listCoinFavorite.map((coin: CurrencyType, index) => (
                  <div
                    key={index}
                    className="flex items-center  justify-between p-[10px] w-full rounded-lg"
                    role="button"
                  >
                    <div className="flex-1 flex items-center justify-start gap-[10px]">
                      <Image width={30} height={30} src={coin.logo} className="inline" alt="symbol" />
                      <div className="flex-1 text-black text-start dark:text-white text-default">{coin.name}</div>
                    </div>
                    {showFullNameCurrency && (
                      <div className="flex items-center text-m_default">
                        <span>{coin.alias}</span>
                      </div>
                    )}
                  </div>
                ))}
              {!!listCoinCrypto.length || !!listCoinFiat.length || (openTab === 4 && !!listCoinFavorite.length) || (
                <div className="relative flex items-center justify-center">
                  <CsrWrapper>
                    <Image
                      src={theme === 'dark' ? '/img/empty-dark.png' : '/img/empty-light.png'}
                      width={200}
                      height={200}
                      alt="noData"
                    />
                  </CsrWrapper>

                  <p className="absolute bottom-0 text-center text-14">{t('deposit:noCoin')}</p>
                </div>
              )}
            </div>
          </div>
        </>
      </CommonModal>
    </>
  );
}
