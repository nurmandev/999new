import { Menu, Switch, Transition } from '@headlessui/react';
import cn from 'classnames';
import { AddSquare, Lock } from 'iconsax-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useTheme } from 'next-themes';
import React, { Fragment, useEffect, useMemo, useState } from 'react';
import { isMobile } from 'react-device-detect';
import ReactLoading from 'react-loading';
import { shallowEqual, useSelector } from 'react-redux';

import { useTranslation } from '@/base/config/i18next';
import { CookieKey } from '@/base/constants/common';
import { useActiveCurrencyPrice } from '@/base/hooks/useActiveCurrencyPrice';
import { useExchange } from '@/base/hooks/useExchange';
import { useUSDTPrice } from '@/base/hooks/useUSDTPrice';
import { CookiesStorage } from '@/base/libs/storage/cookie';
import { currencyFormat1 } from '@/base/libs/utils';
import { updateSetting } from '@/base/redux/reducers/auth.reducer';
import { changeActiveFiat } from '@/base/redux/reducers/common.reducer';
import {
  changeIsShowFavoriteCoin,
  changeIsShowRakeBack,
  changeIsShowViewInFiat,
} from '@/base/redux/reducers/modal.reducer';
import { setActiveCurrency } from '@/base/redux/reducers/wallet.reducer';
import { AppState, useAppDispatch } from '@/base/redux/store';
import { BalanceType, CurrencyType } from '@/base/types/wallet';
import CsrWrapper from '@/components/CsrWrapper';
import InputSearch from '@/components/input/typing/InputSearch';

type FiatHeaderProps = {
  inGamePage?: boolean;
  wrapperClass?: string;
  buttonClass?: string;
};

const fiatDecimals = 2;
const cryptoDecimals = 4;

export default function FiatHeader({ inGamePage, wrapperClass, buttonClass }: FiatHeaderProps) {
  const usdtPrice = useUSDTPrice();
  const activeCurrencyPrice = useActiveCurrencyPrice();
  const dispatch = useAppDispatch();
  const { t } = useTranslation('');
  const exchangeRate = useExchange();
  const { theme } = useTheme();
  const router = useRouter();

  const {
    isWalletLoading,
    viewInFiat,
    viewInFullName,
    showFullNameCurrency,
    cryptoSymbols,
    cryptoBalances,
    fiatSymbols,
    localFiat,
    settings,
    activeCurrency,
    lockedAmount,
  } = useSelector(
    (state: AppState) => ({
      isWalletLoading: state.wallet.isWalletLoading,
      // fiatArray: state.common.fiatArray,
      viewInFiat: state.auth.user.generalSetting.settingViewInFiat,
      viewInFullName: state.auth.user.generalSetting.settingShowFullNameCrypto,
      settings: state.auth.user.generalSetting,

      activeCurrency: state.wallet.activeCurrency,
      showFullNameCurrency: state.auth.user.generalSetting.settingShowFullNameCrypto,
      cryptoSymbols: state.wallet.symbols,
      cryptoBalances: state.wallet.balances,
      fiatSymbols: state.wallet.fiatSymbols,
      localFiat: state.wallet.localFiat,
      bonus: state.wallet.bonusBalance,
      lockedAmount: state.wallet.lockedAmount,
    }),

    shallowEqual,
  );

  const [showCurrency, setShowCurrency] = useState<boolean>(true);
  const [searchFiatInput, setSearchFiatInput] = useState<string>('');

  const [showSmallFiat, setShowSmallFiat] = useState<boolean>(false);

  const filterListFiat = useMemo(() => {
    const arraySearch = fiatSymbols.filter(
      (item: CurrencyType) => item.name.toLowerCase().includes(searchFiatInput.toLowerCase()) && item.favorite,
    );

    return showSmallFiat ? [] : arraySearch;
    // return arraySearch?.filter((item) => {
    //   return !searchFiatInput && showSmallFiat ? Number(item.amount) : true;
    // });
  }, [searchFiatInput, fiatSymbols, showSmallFiat]);

  const filterListCrypto = useMemo(() => {
    let arraySearch = cryptoSymbols.filter(
      (item: CurrencyType) =>
        item.name.toLowerCase().includes(searchFiatInput.toLowerCase()) &&
        // (item.favorite || (cryptoBalances.find((bal) => bal.symbolId === item.id)?.amount ?? 0) > 0),
        item.favorite,
    );
    if (showSmallFiat) {
      const avaSymbols = cryptoBalances
        .filter(
          (item: BalanceType) =>
            item.amount * (cryptoSymbols.find((symbol) => symbol.id === item.symbolId)?.price || 0) > 1,
        )
        .map((item) => item.symbolId);
      arraySearch = [...arraySearch.filter((item) => avaSymbols.indexOf(item.id) != -1)];
    }
    return arraySearch.sort(
      (a, b) =>
        (cryptoBalances.find((item) => item.symbolId === b.id)?.amount || 0) * b.price -
        (cryptoBalances.find((item) => item.symbolId === a.id)?.amount || 0) * a.price,
    );
  }, [searchFiatInput, cryptoSymbols, cryptoBalances, showSmallFiat]);

  const usdFiat = useMemo(() => {
    const usd = fiatSymbols.find((item) => item.name.toLowerCase() === 'usd');
    if (usd) return usd;
    return null;
  }, [fiatSymbols]);

  const getBalanceBySymbol = (symbol: CurrencyType) => {
    const tempBalances = [...cryptoBalances];
    const selectedBalance = tempBalances.find((item) => item.symbolId === symbol.id);

    return selectedBalance?.amount || 0;
  };

  const listSuggestCoins = useMemo(() => {
    let commonArray = Array.isArray(cryptoSymbols) && Array.isArray(fiatSymbols) ? [...cryptoSymbols] : [];

    return commonArray.filter((item: CurrencyType) =>
      item.name.toLowerCase().includes(searchFiatInput.toLowerCase().trim()),
    );
  }, [searchFiatInput, cryptoSymbols, fiatSymbols]);

  useEffect(() => {
    if (cryptoSymbols.length > 0) {
      /** SET USDT as a default coin */
      const defaultSymbol = cryptoSymbols.find((item) => item.name.toLowerCase() === 'usdt');
      if (defaultSymbol && !activeCurrency.id) {
        dispatch(setActiveCurrency(defaultSymbol));
      }
    }
  }, [cryptoSymbols, activeCurrency]);

  useEffect(() => {
    const path = router.asPath;
    if (path.indexOf('/game/') > -1) setShowCurrency(false);
    else setShowCurrency(true);
  }, [router]);

  return (
    <>
      <Menu as="div" className="relative w-auto text-left rounded flex dark:text-white h-full text-[#000]">
        <Menu.Button>
          {!activeCurrency.id && (
            <div className="flex items-center h-full">
              <ReactLoading type="bubbles" color="#00AAE6" />
            </div>
          )}
          {activeCurrency.id && (
            <div
              role="button"
              className={cn(
                'flex justify-center items-center max-[435px]:max-w-[150px] sm:max-md:max-w-[150px] md:max-w-[200px] gap-2 py-2 px-2 w-full rounded',
                buttonClass,
              )}
            >
              <Image
                height={20}
                width={20}
                src={activeCurrency.logo ? activeCurrency.logo : '/img/fiats/USDT.png'}
                alt="currency"
                onError={(e) => {
                  e.currentTarget.src = '/img/fiats/USDT.png';
                }}
              />
              {!showCurrency && activeCurrency.name}
              {showCurrency && viewInFiat && (
                <div className="text-[16px] truncate w-full font-semibold">
                  {viewInFiat
                    ? `${currencyFormat1(
                      getBalanceBySymbol(activeCurrency) * activeCurrencyPrice * exchangeRate,
                      fiatDecimals,
                      localFiat?.name || 'USD',
                    )}`
                    : `${currencyFormat1(Number(getBalanceBySymbol(activeCurrency)), cryptoDecimals, '', false)}`}
                </div>
              )}
              {showCurrency && !viewInFiat && (
                <div className="w-full font-bold truncate text-default">
                  {currencyFormat1(getBalanceBySymbol(activeCurrency), cryptoDecimals, '', false)}
                </div>
              )}
            </div>
          )}
        </Menu.Button>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed hidden inset-0 bg-black/80 transition-opacity z-[1]" />
        </Transition.Child>

        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items
            className={cn(
              'sm:absolute sm:mr-0 mr-[10px] fixed sm:-right-[123px] lg:right-0 sm:left-auto left-0 z-[50] sm:min-w-[470px] min-w-[calc(100vw-20px)] origin-top-right ring-1 ring-black ring-opacity-5 focus:outline-none top-0',
              wrapperClass,
              {
                'mt-[57px]': !(inGamePage && isMobile),
                'mt-[280px]': inGamePage && isMobile,
              },
            )}
          >
            <div
              className={
                cn('fixed flex flex-col',
                  'sm:py-1 sm:relative sm:right-0 sm:left-auto left-0 sm:w-auto w-[100vw]',
                  'bg-white dark:bg-color-menu-secondary',
                  'border-solid border-[1px] border-color-bg-primary border-r-color-card-body-primary drop-shadow-lg shadow-bs-default',
                  'rounded-default gap-[20px] dark:shadow-gray-900 shadow-gray-200 shadow')
              }
            >
              <div className="flex px-[20px] mt-[20px]">
                <div className="grow">
                  <InputSearch
                    value={searchFiatInput}
                    showClose={searchFiatInput !== '' ? true : false}
                    onClose={() => {
                      setSearchFiatInput('');
                    }}
                    className="dark:text-white !bg-color-light-bg-primary dark:!bg-color-menu-primary min-h-[40px]"
                    onChange={(e) => setSearchFiatInput(e.target.value)}
                  />
                </div>
                {!inGamePage && (
                  <div
                    onClick={() => dispatch(changeIsShowFavoriteCoin(true))}
                    className="flex flex-col items-center justify-center px-[10px] pb-[2px] dark:text-[#67707B] text-[36px] text-[#9FA5AC] cursor-pointer"
                  >
                    <AddSquare size={24} stroke="2" />
                  </div>
                )}
              </div>

              {/* Hiding header */}
              {/*<div className="flex w-full px-[20px] ">
                <div className="flex w-full p-[5px] dark:bg-color-header-secondary bg-color-light-header-secondary rounded-[3px]">
                  <div
                    role="button"
                    className="flex w-full py-[10px] dark:text-white text-color-light-text-primary font-bold text-center justify-center rounded-[3px] dark:bg-color-panel-bg-primary bg-white"
                  >
                    Currency
                  </div>
                  <div
                    role="button"
                    className="flex w-full py-[10px] text-color-text-primary text-center justify-center"
                  >
                    mNFT
                  </div>
                </div>
                </div>*/}
              {/* Fiat */}
              <div className="sm:max-h-[40vh] max-h-[calc(100vh_-_366px)] overflow-y-auto px-[20px] w-full">
                {!!filterListCrypto?.length && (
                  <div className="mb-2 ml-4 text-gray-400 text-default">{t('deposit:crypto')}</div>
                )}
                {filterListCrypto?.map((crypto, index) => {
                  return (
                    <Menu.Item key={index}>
                      {({ active }) => (
                        <div
                          className={cn(
                            'mb-[5px]',
                            active
                              ? 'dark:bg-color-hover-primary bg-gray-100 dark:text-white text-black mb-1'
                              : 'dark:text-white text-black  mb-1',
                            activeCurrency.id === crypto.id && 'border border-solid border-color-primary',
                            'sm:px-[20px] sm:py-[10px] px-[10px] py-[5px] text-sm cursor-pointer flex rounded-md items-center gap-[10px]',
                          )}
                          onClick={() => dispatch(setActiveCurrency(crypto))}
                        >
                          <Image
                            height={30}
                            width={30}
                            src={crypto.logo ? crypto.logo : '/img/fiats/USDT.png'}
                            alt="currency"
                            onError={(e) => {
                              e.currentTarget.src = '/img/fiats/USDT.png';
                            }}
                          />
                          <div className="min-w-[120px]">
                            <div className="text-default font-vietnam-bold">{crypto.name}</div>
                            {viewInFullName && (
                              <div className="text-m_default text-color-text-secondary">{crypto.alias}</div>
                            )}
                          </div>
                          <div className="w-full font-bold text-right text-black truncate text-default dark:text-white">
                            {viewInFiat &&
                              currencyFormat1(
                                getBalanceBySymbol(crypto) * crypto.price * exchangeRate,
                                fiatDecimals,
                                localFiat?.name || 'USD',
                              )}
                            {!viewInFiat && currencyFormat1(getBalanceBySymbol(crypto), cryptoDecimals, '', false)}
                            {viewInFiat && (
                              <>
                                <br />
                                <span className="text-gray-400 text-[12px]">
                                  {currencyFormat1(getBalanceBySymbol(crypto), cryptoDecimals, '', false)}
                                </span>
                                <br />
                              </>
                            )}
                            <div className="w-full text-right text-black truncate text-default dark:text-white font-vietnam-bold">
                              {crypto.name.toLowerCase() === 'usdt' && (
                                <div className="flex justify-end mt-1 text-color-secondary">
                                  <div
                                    className="flex items-center justify-end gap-2 px-1 rounded w-fit dark:bg-white/20 bg-black/10"
                                    onClick={() => dispatch(changeIsShowRakeBack(true))}
                                  >
                                    <Lock size={12} variant="Bold" />{' '}
                                    {viewInFiat
                                      ? currencyFormat1(
                                        lockedAmount * usdtPrice * exchangeRate,
                                        fiatDecimals,
                                        localFiat?.name,
                                      )
                                      : currencyFormat1(lockedAmount, 2, '', false)}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    </Menu.Item>
                  );
                })}
                {!!filterListFiat?.length && (
                  <div className="pt-[10px] text-default text-gray-400 mb-2 ml-4">{t('deposit:fiat')}</div>
                )}
                {filterListFiat?.map((fiat, index) => {
                  return (
                    <Menu.Item key={index}>
                      {({ active }) => (
                        <div
                          className={cn(
                            active
                              ? 'dark:bg-color-hover-primary bg-gray-100 dark:text-white text-black mb-1'
                              : 'dark:text-white text-black mb-1',
                            activeCurrency.id === fiat.id && 'border border-solid border-color-secondary',
                            'sm:px-[20px] sm:py-[10px] px-[10px] py-[5px] text-sm cursor-pointer flex rounded-md items-center gap-[10px]',
                          )}
                          onClick={() => {
                            dispatch(setActiveCurrency(fiat));
                          }}
                        >
                          <Image
                            height={30}
                            width={30}
                            src={fiat.logo ? fiat.logo : '/img/fiats/USDT.png'}
                            alt="currency"
                            onError={(e) => {
                              e.currentTarget.src = '/img/fiats/USDT.png';
                            }}
                          />
                          <div className="w-full">
                            <div className="text-default font-vietnam-bold">{fiat.name}</div>
                            {showFullNameCurrency && <div className="text-[12px] text-gray-400">{fiat.alias}</div>}
                          </div>
                          <div className="w-full font-bold text-right text-black truncate text-default dark:text-white">
                            {viewInFiat ? (
                              <>
                                {currencyFormat1(
                                  getBalanceBySymbol(fiat) * fiat.price * exchangeRate,
                                  fiatDecimals,
                                  localFiat?.name,
                                )}
                                <br />
                                <span className="text-gray-400 text-[12px]">
                                  {currencyFormat1(getBalanceBySymbol(fiat) * fiat.price, fiatDecimals, '', false)}
                                </span>
                              </>
                            ) : (
                              <>{currencyFormat1(getBalanceBySymbol(fiat) * fiat.price, fiatDecimals, '', false)}</>
                            )}
                          </div>
                        </div>
                      )}
                    </Menu.Item>
                  );
                })}
                {searchFiatInput && !!listSuggestCoins.length && (
                  <div className="text-gray-400 text-default">{t('deposit:otherSupportedCoin')}</div>
                )}
                {searchFiatInput &&
                  listSuggestCoins?.map((coin, index) => {
                    return (
                      <Menu.Item key={index}>
                        {({ active }) => (
                          <div
                            className="px-2 py-2 text-sm cursor-pointer flex rounded-md items-center gap-[10px] dark:text-white text-black"
                          // onClick={() => handleChangeCoinSuggest(coin)}
                          >
                            <Image
                              height={30}
                              width={30}
                              src={coin.logo ? coin.logo : '/img/fiats/USDT.png'}
                              alt="currency"
                              onError={(e) => {
                                e.currentTarget.src = '/img/fiats/USDT.png';
                              }}
                            />
                            <div className="w-full">
                              <div className="font-bold text-default">{coin.name}</div>
                              {showFullNameCurrency && <div className="text-[12px] text-gray-400">{coin.alias}</div>}
                            </div>
                            <div className="w-full font-bold text-right text-black truncate text-default dark:text-white">
                              {viewInFiat && (
                                <>
                                  {currencyFormat1(
                                    getBalanceBySymbol(coin) * coin.price * exchangeRate,
                                    fiatDecimals,
                                    localFiat?.name,
                                  )}
                                  <br />
                                </>
                              )}
                              <span className="text-gray-400 text-[12px]">
                                {currencyFormat1(getBalanceBySymbol(coin), cryptoDecimals, '', false)}
                              </span>
                            </div>
                          </div>
                        )}
                      </Menu.Item>
                    );
                  })}
                {filterListFiat?.length === 0 && filterListCrypto?.length === 0 && listSuggestCoins?.length === 0 && (
                  <>
                    <div className="relative flex items-center justify-center  my-[32px]">
                      <CsrWrapper>
                        <Image
                          src={theme === 'dark' ? '/img/empty-dark.png' : '/img/empty-light.png'}
                          width={200}
                          height={200}
                          alt="noData"
                          onError={(e) => {
                            e.currentTarget.src = '/img/empty-dark.png';
                          }}
                        />
                      </CsrWrapper>
                      {/* <Image
                        src={theme === 'dark' ? '/img/empty-dark.png' : '/img/empty-light.png'}
                        width={200}
                        height={200}
                        alt=""
                        onError={(e) => {
                          e.currentTarget.src = '/img/fiats/USD.png';
                        }}
                      /> */}
                      <p className="absolute dark:text-color-text-primary text-color-light-text-primary text-[12px] sm:text-default bottom-0 text-center">
                        {t('table:noData')}
                      </p>
                    </div>
                    <div className="flex items-center justify-center mt-[60px] mb-[20px]">
                      <div className="w-full">
                        <Link href="/swap" className="hover:text-white">
                          <div className="flex text-white items-center bg-color-primary w-full justify-center font-bold h-[40px] sm:h-[3rem] rounded-[4px] cursor-pointer text-[12px] sm:text-default">
                            {t('deposit:swapCoin')}
                          </div>
                        </Link>
                        <p className="text-center dark:text-color-text-primary text-color-light-text-primary text-[12px] sm:text-default mt-[10px]">
                          {t('deposit:swapCoinContent')}
                        </p>
                      </div>
                    </div>
                  </>
                )}
              </div>

              {!inGamePage && (
                <div className="py-[20px] px-[10px] flex border-t-[1px] border-[#98a7b566] border-solid items-center justify-between">
                  <div className="flex items-center gap-[5px]">
                    <Switch
                      checked={viewInFiat}
                      onChange={(value) => {
                        if (!value) {
                          if (usdFiat) {
                            dispatch(
                              updateSetting({ ...settings, settingViewInFiat: value, settingCurrency: usdFiat.id }),
                            );
                          }
                        } else {
                          dispatch(updateSetting({ ...settings, settingViewInFiat: value }));
                        }
                        if (value) dispatch(changeIsShowViewInFiat(true));
                      }}
                      className={`${viewInFiat ? 'bg-[#3bc11733]' : 'dark:bg-color-toggle-primary bg-gray-200'
                        } relative inline-flex h-[24px] w-[44px] items-center rounded-full`}
                    >
                      <span
                        className={`${viewInFiat ? 'translate-x-[20px] bg-color-primary' : 'translate-x-1 bg-gray-400'
                          } inline-block h-[18px] w-[18px] transform rounded-full transition`}
                      />
                    </Switch>
                    <div className="text-[15px] dark:text-white text-black">{t('fiatHeader:viewInFiat')}</div>
                  </div>
                  <div className="flex items-center gap-[5px]">
                    <Switch
                      checked={showSmallFiat}
                      onChange={setShowSmallFiat}
                      className={`${showSmallFiat ? 'bg-[#3bc11733]' : 'dark:bg-color-toggle-primary bg-gray-200'
                        } relative inline-flex h-[24px] w-[44px] items-center rounded-full`}
                    >
                      <span
                        className={`${showSmallFiat ? 'translate-x-[20px] bg-color-primary' : 'translate-x-1 bg-gray-400'
                          } inline-block h-[18px] w-[18px] transform rounded-full transition`}
                      />
                    </Switch>
                    <div className="text-[15px] dark:text-white text-black">{t('fiatHeader:smallFiat')}</div>
                  </div>
                </div>
              )}
            </div>
          </Menu.Items>
        </Transition>
      </Menu>
    </>
  );
}
