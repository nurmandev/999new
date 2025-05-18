import { Switch } from '@headlessui/react';
import cn from 'classnames';
import { Lock, SearchNormal } from 'iconsax-react';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { ReactElement, useMemo, useState } from 'react';
import { shallowEqual, useSelector } from 'react-redux';

import { useTranslation } from '@/base/config/i18next';
import { ROUTER } from '@/base/constants/common';
import { useExchange } from '@/base/hooks/useExchange';
import { useUSDTPrice } from '@/base/hooks/useUSDTPrice';
import { currencyFormat1 } from '@/base/libs/utils';
import { changeIsShowRakeBack } from '@/base/redux/reducers/modal.reducer';
import { AppState, useAppDispatch } from '@/base/redux/store';
import { BalanceType, CurrencyType } from '@/base/types/wallet';
import Loader from '@/components/common/preloader/loader';
import withAuth from '@/components/hoc/withAuth';
import DepositLayout from '@/components/layouts/deposit.layout';

const fiatDecimals = 2;
const cryptoDecimals = 4;

const BalancePage = () => {
  const usdtPrice = useUSDTPrice();
  const exchangeRate = useExchange();
  const [hideBalance, setHideBalance] = useState<boolean>(false);
  const [searchValue, setSearchValue] = useState('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { t } = useTranslation('');
  const dispatch = useAppDispatch();

  const {
    localFiat,
    viewInFiat,
    cryptoSymbols,
    fiatSymbols,
    cryptoBalances,
    totalUsdBalance,
    realUsdBalance,
    bonusUsdBalance,
    lockedAmount,
    showFullNameCurrency,
  } = useSelector(
    (state: AppState) => ({
      localeFiat: state.common.localeFiat,
      activeFiat: state.common.activeFiat,
      fiatArray: state.common.fiatArray,
      usdtNetwork: state.common.usdtNetwork,
      viewInFiat: state.auth.user.generalSetting.settingViewInFiat,

      userCurrency: state.auth.user.generalSetting.settingCurrency,

      fiatSymbols: state.wallet.fiatSymbols,
      cryptoSymbols: state.wallet.symbols,
      cryptoBalances: state.wallet.balances,

      localFiat: state.wallet.localFiat,
      totalUsdBalance: state.wallet.totalBalance,
      realUsdBalance: state.wallet.realBalance,
      bonusUsdBalance: state.wallet.bonusBalance,
      lockedAmount: state.wallet.lockedAmount,
      showFullNameCurrency: state.auth.user.generalSetting.settingShowFullNameCrypto,
    }),
    shallowEqual,
  );

  const filterListFiat = useMemo(() => {
    const arraySearch = fiatSymbols.filter((item) => {
      return String(item.name).toLowerCase().includes(searchValue.toLowerCase());
    });

    return hideBalance ? [] : arraySearch;
  }, [searchValue, fiatSymbols, hideBalance]);

  const filterListCrypto = useMemo(() => {
    let arraySearch = cryptoSymbols.filter((item) => {
      return String(item.name).toLowerCase().includes(searchValue.toLowerCase());
    });

    if (hideBalance) {
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
  }, [searchValue, cryptoSymbols, hideBalance, cryptoBalances]);

  const renderBalance = (symbol: CurrencyType) => {
    const balance = [...cryptoBalances].find((item) => item.symbolId === symbol.id);
    const usdPrice = symbol.price || 1;

    return {
      usd: balance ? balance.amount * usdPrice : 0,
      amount: balance ? balance.amount : 0,
    };
  };

  return (
    <div className={'relative'}>
      {isLoading && <Loader />}
      <div className="flex items-center justify-between bg-white dark:bg-color-modal-bg-secondary">
        <div className="flex items-center justify-start gap-[15px] w-full">
          <Image src={'/img/total-balance.png'} width={35} height={35} alt="balance" />
          <div className="flex sm:flex-row flex-col items-center justify-start md:gap-[40px] gap-[15px] flex-1">
            <div className="flex w-full">
              <div className="pr-2 text-start sm:text-default text-[12px] dark:text-gray-300 text-color-light-text-primary font-[700] border-solid border-r-[2px] border-color-border-secondary">
                {t('balance:totalBalance')}
              </div>
              <div className="pl-2 truncate text-start text-color-secondary sm:text-[16px] text-default font-bold break-keep">
                {currencyFormat1(realUsdBalance * exchangeRate, fiatDecimals, localFiat?.name)}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full mt-[20px] dark:bg-color-modal-bg-secondary bg-white">
        <div className="w-full flex justify-between items-center mb-[20px] sm:mb-[30px] gap-[30px]">
          <div className="flex items-center gap-[10px]">
            <div className="dark:text-color-text-primary text-color-light-text-primary sm:text-default text-[12px]">
              {t('fiatHeader:smallFiat')}
            </div>
            <Switch
              checked={hideBalance}
              onChange={setHideBalance}
              className={cn('relative inline-flex h-[24px] min-w-[44px] w-[44px] items-center rounded-full', {
                'bg-[#3bc11733]': hideBalance,
                'dark:bg-color-toggle-primary bg-gray-200': !hideBalance,
              })}
            >
              <span
                className={cn('inline-block h-[20px] w-[20px] transform rounded-full transition', {
                  'translate-x-[20px] bg-color-primary': hideBalance,
                  'translate-x-1 bg-gray-400': !hideBalance,
                })}
              />
            </Switch>
          </div>
          <div className="flex justify-end flex-1">
            <div className="relative">
              <input
                className={cn(
                  'sm:pl-[50px] pl-[40px] w-full max-w-[250px] dark:text-white text-color-light-text-primary sm:text-default text-[12px] h-[40px] rounded-[5px] dark:bg-color-header-primary bg-[#f5f6fa] border border-solid border-gray-800 focus-within:border-color-primary placeholder:text-white outline-none pointer-events-auto',
                )}
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder="Search"
              />
              <SearchNormal
                width={24}
                height={24}
                className="absolute top-1/2 dark:text-color-text-primary text-color-light-text-primary sm:left-[30px] left-[20px] transform -translate-x-1/2 -translate-y-1/2 sm:!text-default !text-[12px]"
              />
            </div>
          </div>
        </div>

        {!!filterListCrypto?.length && (
          <div className="flex flex-col items-start justify-start w-full">
            <div className="text-default dark:text-[#C2C2C2] text-color-light-text-primary mb-[10px]">
              {t('balance:cryptoCurrency')}
            </div>
            <div className="w-full flex flex-col justify-start items-start gap-[5px]">
              {filterListCrypto?.map((item: CurrencyType, index: number): any => (
                <div
                  key={index}
                  className="w-full dark:bg-color-active-default bg-color-light-bg-primary px-[20px] py-[10px] rounded-default flex justify-between items-center"
                >
                  <div className="flex justify-center items-center md:gap-3 gap-2 sm:text-[16px] text-default">
                    <Image
                      height={30}
                      width={30}
                      src={item.logo || '/img/fiats/USDT.png'}
                      alt="currency"
                      onError={(e) => {
                        e.currentTarget.src = '/img/fiats/USDT.png';
                      }}
                    />
                    <div className="flex-1 font-bold text-black text-start text-default dark:text-white">
                      {item.name}
                      {showFullNameCurrency && <div className="mt-[5px] text-[12px] text-gray-400">{item.alias}</div>}
                    </div>
                  </div>
                  <div className="flex flex-1 items-center justify-end xl:gap-[30px] md:gap-[20px] gap-[10px] text-color-primary font-normal">
                    {viewInFiat ? (
                      <div className="text-end">
                        <div className="dark:text-white text-black font-[600] truncate md:text-default text-[12px]">
                          {currencyFormat1(renderBalance(item).usd * exchangeRate, fiatDecimals, localFiat?.name)}{' '}
                        </div>
                        <div className="font-normal md:text-[12px] text-[10px] text-[#53575C]">
                          {currencyFormat1(renderBalance(item).amount, cryptoDecimals, '', false)}
                        </div>
                        {item.name.toLowerCase() === 'usdt' && (
                          <div className="flex justify-end mt-1 text-color-secondary">
                            <div
                              role="button"
                              className="w-fit flex items-center justify-end dark:bg-white/20 bg-black/10 px-1 rounded gap-2 text-[10px]"
                              onClick={() => {
                                dispatch(changeIsShowRakeBack(true));
                              }}
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
                    ) : (
                      <div className="text-end">
                        <div className="dark:text-white text-black truncate md:text-default text-[12px] font-bold">
                          {currencyFormat1(renderBalance(item).amount, cryptoDecimals, '', false)}
                        </div>
                        {item.name.toLowerCase() === 'usdt' && (
                          <div className="flex justify-end mt-1 text-color-secondary">
                            <div
                              className="w-fit flex items-center justify-end dark:bg-white/20 bg-black/10 px-1 rounded gap-2 text-[10px]"
                              onClick={() => dispatch(changeIsShowRakeBack(true))}
                            >
                              <Lock size={12} variant="Bold" />{' '}
                              {viewInFiat
                                ? currencyFormat1(
                                  lockedAmount * usdtPrice * exchangeRate,
                                  cryptoDecimals,
                                  localFiat?.name,
                                )
                                : currencyFormat1(lockedAmount, 2, '', false)}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                    <div className="flex md:text-[12px] text-[10px] sm:flex-row flex-col sm:items-center items-end  xl:gap-[30px] md:gap-[10px] gap-[5px] text-color-primary font-normal">
                      <Link
                        className="dark:hover:text-white hover:text-color-primary"
                        href={`${ROUTER.DepositCrypto}?coin=${item.name}`}
                      >
                        {t('balance:deposit')}
                      </Link>
                      <Link
                        className="dark:hover:text-white hover:text-color-primary"
                        href={`${ROUTER.WithdrawCrypto}?coin=${item.name}`}
                      >
                        {t('balance:withdraw')}
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const BalancePageAuth = withAuth(BalancePage);

BalancePageAuth.getLayout = function getLayout(page: ReactElement) {
  return <DepositLayout>{page}</DepositLayout>;
};

export default BalancePageAuth;
