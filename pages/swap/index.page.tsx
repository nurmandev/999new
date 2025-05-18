import { ChevronDownIcon } from '@heroicons/react/24/outline';
import { yupResolver } from '@hookform/resolvers/yup';
import cn from 'classnames';
import { Repeat } from 'iconsax-react';
import Head from 'next/head';
import Image from 'next/image';
import { ReactElement, useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import ReactLoading from 'react-loading';
import { shallowEqual, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import * as yup from 'yup';

import { api_swap, api_withdrawInfo } from '@/api/wallet';
import { useTranslation } from '@/base/config/i18next';
import { SWAP_MIN, TOAST_ENUM } from '@/base/constants/common';
import { currencyFormat1, numberWithRounding, roundDeciamls } from '@/base/libs/utils';
import { getErrorMessage } from '@/base/libs/utils/notificationToast';
import { getBalance } from '@/base/redux/reducers/wallet.reducer';
import { AppState, useAppDispatch } from '@/base/redux/store';
import { CurrencyType } from '@/base/types/wallet';
import Loader from '@/components/common/preloader/loader';
import withAuth from '@/components/hoc/withAuth';
import { InputNumber } from '@/components/input/typing';
import DepositLayout from '@/components/layouts/deposit.layout';
import ModalAssetsPortfolio from '@/components/modal/assestsPortfolio/assestsPortfolio';
import SelectCurrencySwap, {
  SelectCurrencySwapFormRef,
  SwapFormType,
} from '@/components/selectCurrencySwap/selectCurrencySwap';

import styles from './index.module.scss';

const SwapPage = () => {
  const {
    symbols: rawSymbols,
    balances,
    swapFee,
  } = useSelector(
    (state: AppState) => ({
      symbols: state.wallet.symbols,
      balances: state.wallet.balances,
      swapFee: state.wallet.swapFee,
    }),
    shallowEqual,
  );

  const { t } = useTranslation('');
  const dispatch = useAppDispatch();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSwapAvailable, setIsSwapAvailable] = useState<boolean>(true);
  const formDataRef = useRef<SelectCurrencySwapFormRef>(null);

  const [isLoadingApproximately, setIsLoadingApproximately] = useState<boolean>(false);
  const [isShowFromModal, setIsShowFromModal] = useState<boolean>(false);
  const [isShowToModal, setIsShowToModal] = useState<boolean>(false);

  const [rolloverInfo, setRolloverInfo] = useState({
    availableAmountUsd: 0,
    availableAmount: 0,
    lockedAmount: 0,
    lockedAmountUsd: 0,
  });

  const schema = yup.object().shape({
    amountFrom: yup
      .string()
      .required(String(t('withdraw:withdrawAddressRequire')))
      .trim(),
    amountTo: yup
      .string()
      .required(String(t('withdraw:withdrawAmountRequire')))
      .trim(),
  });

  const symbols = useMemo(() => {
    const values = rawSymbols.filter((symbol) => symbol.name !== 'SLC');
    return values;
  }, [rawSymbols]);

  const {
    handleSubmit,
    control,
    watch,
    getValues,
    setValue,
    formState: { errors },
  } = useForm<SwapFormType>({
    resolver: yupResolver(schema),
    defaultValues: { amountFrom: '0', amountTo: '0', symbolFrom: symbols[0]?.id, symbolTo: symbols[1]?.id },
  });

  const emitData = () => formDataRef.current?.emitData?.();

  const getBalanceBySymbolId = (symbolId: string) => {
    const tempBalance = balances.find((item) => item.symbolId === symbolId);
    return tempBalance ? tempBalance.amount : 0;
  };

  const getSymbolById = (id: string) => {
    const symbol = symbols.find((item: CurrencyType) => item.id === id);
    if (!symbol) return null;
    return symbol;
  };

  const minSwap = useMemo(() => {
    const val = SWAP_MIN / (getSymbolById(watch('symbolFrom'))?.price || 1);
    return val.toFixed(4);
  }, [symbols, watch('symbolFrom')]);

  const handleErrors = () => {
    let error = false;
    let messError = '';
    if (Number(getValues('amountFrom')) == 0) {
      error = true;
      messError = t('swap:inValidSwapAmount');
    }
    if (Number(getValues('amountFrom')) < Number(minSwap)) {
      error = true;
      messError = t('swap:inValidSwapAmount');
    }
    if (Number(minSwap) > getBalanceBySymbolId(watch('symbolFrom'))) {
      error = true;
      messError = t('swap:notEnoughAmount');
    }
    if (messError) {
      toast.error(t(messError), { containerId: TOAST_ENUM.COMMON });
    }
    return error;
  };

  const toSymbols = useMemo(() => {
    const tempSymbols = [...symbols];
    const symbolFromIndex = tempSymbols.findIndex((item) => item.id === watch('symbolFrom'));
    tempSymbols.splice(symbolFromIndex, 1);
    return tempSymbols;
  }, [watch('symbolFrom'), symbols]);

  const fromSymbols = useMemo(() => {
    const tempSymbols = [...symbols];
    const symbolFromIndex = tempSymbols.findIndex((item) => item.id === watch('symbolTo'));
    tempSymbols.splice(symbolFromIndex, 1);
    return tempSymbols;
  }, [watch('symbolTo')]);

  const exchangeCoinRate = useMemo(() => {
    const symbolFrom = getSymbolById(watch('symbolFrom'));
    const symbolTo = getSymbolById(watch('symbolTo'));

    const fromPrice = symbolFrom ? symbolFrom.price : 0;
    const toPrice = symbolTo ? symbolTo.price : 1;
    return fromPrice / toPrice;
  }, [watch('symbolFrom'), watch('symbolTo')]);

  const handleChangeCoinSwap = () => {
    const curVal = JSON.parse(JSON.stringify(getValues()));
    const currentSymbolBalance = getBalanceBySymbolId(curVal.symbolTo);
    setValue('symbolFrom', curVal.symbolTo);
    setValue('symbolTo', curVal.symbolFrom);
    setValue('amountFrom', curVal.amountTo > currentSymbolBalance ? currentSymbolBalance : curVal.amountTo);
  };

  const handleApproximately = useCallback(async () => {
    try {
      setIsLoadingApproximately(true);
      const _balance = watch('amountFrom');
      // const res = await api_exchangeRate(watch('symbolFrom'), watch('symbolTo'));
      const symbolFrom = getSymbolById(watch('symbolFrom'));
      const symbolTo = getSymbolById(watch('symbolTo'));

      const fromPrice = symbolFrom ? symbolFrom.price : 0;
      const toPrice = symbolTo ? symbolTo.price : 1;

      // const { fromPrice, toPrice } = res.data;
      const amountTo = (Number(_balance) * fromPrice) / toPrice;

      setValue('amountTo', roundDeciamls(amountTo, 8).toString());
    } catch (error) {
      setValue('amountTo', '0');
    } finally {
      setIsLoadingApproximately(false);
    }
  }, [watch('symbolFrom'), watch('symbolTo'), watch('amountFrom')]);

  const handleGetMaxBalance = () => {
    const symbolFrom = getSymbolById(watch('symbolFrom'));
    if (symbolFrom) {
      const avaBalance = getBalanceBySymbolId(symbolFrom.id);
      setValue('amountFrom', roundDeciamls(avaBalance, 4).toString());
    }
  };

  const onBlurFromBalance = () => {
    const balance = getBalanceBySymbolId(watch('symbolFrom'));
    const inputBalance = Number(getValues('amountFrom'));

    if (balance > Number(minSwap)) {
      if (inputBalance < Number(minSwap)) {
        setValue('amountFrom', Number(minSwap).toFixed(4));
      }
      if (inputBalance > balance) {
        setValue('amountFrom', Number(balance).toFixed(4));
      }
    }

    if (balance < Number(minSwap)) {
      setValue('amountFrom', Number(balance).toFixed(4));
    }
  };

  const getRolloverInfo = useCallback(async () => {
    try {
      if (!watch('symbolFrom')) {
        return;
      }
      const _fromCoinId = watch('symbolFrom');
      const _res = await api_withdrawInfo(_fromCoinId);
      setRolloverInfo({
        availableAmountUsd: Number(_res.data?.availableWithdrawalAmountUsd || 0),
        availableAmount: Number(_res.data?.availableWithdrawalAmount || 0),
        lockedAmount: Number(_res.data?.lockedFundsAmount || 0),
        lockedAmountUsd: Number(_res.data?.lockedFundsAmountUsd || 0),
      });
    } catch (error) {
      setRolloverInfo({
        availableAmountUsd: 0,
        availableAmount: 0,
        lockedAmount: 0,
        lockedAmountUsd: 0,
      });
    }
  }, [watch('symbolFrom')]);

  useEffect(() => {
    if (symbols.length) {
      const symbolFrom = symbols[0].id;
      const symbolTo = symbols[1].id;
      const tempAmountFrom = Math.min(getBalanceBySymbolId(symbolFrom), SWAP_MIN / (symbols[0].price || 1));

      setValue('symbolFrom', symbolFrom);
      setValue('symbolTo', symbolTo);
      setValue('amountFrom', tempAmountFrom.toFixed(4));
    }
  }, [symbols]);

  useEffect(() => {
    handleApproximately();
  }, [handleApproximately]);

  useEffect(() => {
    getRolloverInfo();
  }, [getRolloverInfo]);

  useEffect(() => {
    const amountFrom = watch('amountFrom');
    if (parseFloat(amountFrom) < parseFloat(minSwap)) {
      setIsSwapAvailable(false);
    } else {
      setIsSwapAvailable(true);
    }
  }, [watch('amountFrom', minSwap)]);

  const onSubmit = async (data: SwapFormType) => {
    if (handleErrors()) return;
    try {
      setIsLoading(true);
      // disable slc for swap
      const slc = symbols.find((symbol) => symbol.name.toLowerCase() === 'slc');
      if (slc?.id === data.symbolFrom || slc?.id === data.symbolTo) {
        toast.error(t('errors:swap:disabledToken'), { containerId: TOAST_ENUM.COMMON, toastId: 'swap-error' });
        return;
      }
      if (Number(data.amountFrom) === 0) {
        toast.error(t('swap:inValidSwapAmount'), { containerId: TOAST_ENUM.COMMON, toastId: 'swap-error' });
        return;
      }
      if (data.symbolTo === data.symbolFrom) {
        toast.error(t('swap:duplicateSwapAddress'), { containerId: TOAST_ENUM.COMMON, toastId: 'swap-error' });
        return;
      }

      await api_swap(String(data.symbolFrom), String(data.symbolTo), Number(data.amountFrom));
      dispatch(getBalance());

      toast.success(String(t('swap:swapSuccessfully')), { containerId: TOAST_ENUM.COMMON, toastId: 'swap-success' });
    } catch (error: any) {
      const errType = error.response?.data?.message ?? '';
      const errMessage = getErrorMessage(errType);
      toast.error(t(errMessage), { containerId: TOAST_ENUM.COMMON, toastId: 'swap-error' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className={`${styles.cardContent}`}>
        <div className={`lg:max-w-[75%] ${styles.contentHeader}`}>
          <div className="w-full text-left">
            <div className="flex items-center justify-between gap-1">
              <div className="text-[16px] text-color-light-text-primary dark:text-color-text-primary mb-[20px] text-left">
                {t('swap:getApproximately')}
              </div>
              <div className="text-[16px] text-color-light-text-primary dark:text-color-text-primary mb-[20px] text-left">
                <div>
                  Min:
                  {numberWithRounding(Number(minSwap), 4)} {getSymbolById(watch('symbolFrom'))?.name ?? ''}
                </div>
              </div>
            </div>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="flex flex-col gap-[5px] relative min-h-[45px]">
                <div
                  className={cn(
                    'w-full pl-[18px] pr-[5px] h-full py-[5px] text-[16px] rounded-default bg-color-light-input-primary dark:bg-color-input-primary flex items-center justify-between border border-solid border-transparent gap-[10px] focus-within:border-color-primary min-h-[45px]',
                    {
                      'border-red-500': errors.amountFrom?.message,
                    },
                  )}
                >
                  <InputNumber
                    size={7}
                    customClass="flex-1 pl-[2px]"
                    control={control}
                    onBlur={onBlurFromBalance}
                    isShowError={false}
                    name="amountFrom"
                  />
                  <div className="flex items-center md:gap-[10px] gap-[5px] h-full md:text-[16px] text-[12px]">
                    <div
                      role="button"
                      onClick={handleGetMaxBalance}
                      className="px-2 md:px-3 py-[6px] md:min-w-[60px] rounded-default dark:bg-color-btn-primary bg-white dark:text-white text-black text-center text-default"
                    >
                      {t('deposit:max')}
                    </div>
                    <div
                      className="flex items-center dark:bg-color-btn-primary rounded-default px-2 py-1 bg-white dark:text-white text-black justify-between gap-[10px] w-full min-w-[120px]"
                      role="button"
                      onClick={() => setIsShowFromModal(true)}
                    >
                      <Image
                        width={24}
                        height={24}
                        src={getSymbolById(watch('symbolFrom'))?.logo || '/img/icon/USDT-logo.svg'}
                        onError={(e) => {
                          e.currentTarget.src = '/img/icon/USDT-logo.svg';
                        }}
                        className="inline"
                        alt="symbol"
                      />
                      <div className="text-default ">
                        {getSymbolById(watch('symbolFrom')) && getSymbolById(watch('symbolFrom'))?.name}
                      </div>

                      <div>
                        <ChevronDownIcon width={15} />
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  className="sm:hidden block z-[2] absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rotate-90 dark:bg-color-btn-primary bg-color-light-active-primary dark:text-white text-black dark:border-0 rounded-[10px] p-[8px]"
                  role="button"
                  onClick={handleChangeCoinSwap}
                >
                  <Repeat size={14} />
                </div>
                <div
                  className="sm:block hidden z-[2] absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rotate-90 dark:bg-color-btn-primary bg-color-light-active-primary dark:text-white text-black dark:border-0 rounded-[10px] p-[8px]"
                  role="button"
                  onClick={handleChangeCoinSwap}
                >
                  <Repeat size={20} />
                </div>
                <div
                  className={cn(
                    'w-full pl-[18px] pr-[5px] py-[5px] text-[16px] rounded-default bg-color-light-input-primary dark:bg-color-input-primary flex items-center justify-between gap-[10px] border border-solid border-transparent focus-within:border-color-primary min-h-[45px]',
                    {
                      'border-red-500': errors.amountFrom?.message,
                      'blur-[2px]': isLoadingApproximately,
                    },
                  )}
                >
                  <div className={cn('w-full flex-1')}>
                    <InputNumber
                      size={7}
                      customClass="flex-1 bg-transparent pl-[2px]"
                      control={control}
                      isShowError={false}
                      name="amountTo"
                      disabled
                    />
                  </div>
                  <div className="flex items-center md:gap-[10px] gap-[2px] h-full md:text-[16px] text-[12px]">
                    <div
                      className="flex items-center dark:bg-color-btn-primary px-2 py-1 bg-white dark:text-white text-black justify-between gap-[10px] w-full rounded-default  min-w-[120px]"
                      role="button"
                      onClick={() => setIsShowToModal(true)}
                    >
                      <Image
                        width={24}
                        height={24}
                        src={getSymbolById(watch('symbolTo'))?.logo || '/img/icon/USDT-logo.svg'}
                        onError={(e) => {
                          e.currentTarget.src = '/img/icon/USDT-logo.svg';
                        }}
                        className="inline"
                        alt="symbol"
                      />
                      <div className="text-[14px]">
                        {getSymbolById(watch('symbolTo')) && getSymbolById(watch('symbolTo'))?.name}
                      </div>

                      <div>
                        <ChevronDownIcon width={15} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-[20px] flex items-center mb-2 gap-1 justify-between text-[14px]">
                <div className="flex flex-wrap gap-1">
                  <span className="dark:text-color-text-primary text-color-light-text-primary">
                    {t('withdraw:available')}:
                  </span>
                  <span>
                    {currencyFormat1(rolloverInfo.availableAmount, 8, '', false)}{' '}
                    {getSymbolById(watch('symbolFrom'))?.name ?? ''}
                  </span>
                </div>
                {/* <div>Bonus Money: {Number(swapData.bonusMoney)}</div> */}
              </div>
              <div
                className={cn(
                  'flex flex-col items-start gap-[15px] w-full px-[20px] py-[10px] dark:text-color-text-primary text-color-light-text-primary bg-color-light-bg-primary dark:bg-color-input-primary rounded-default text-start',
                  {
                    'blur-[2px]': isLoadingApproximately,
                  },
                )}
              >
                <div className="dark:text-white text-color-light-text-primary font-[700]">
                  <span className="inline-block w-1 h-1 mr-1 rounded-full bg-color-primary"></span>{' '}
                  {currencyFormat1(1, 2, '', false)} {getSymbolById(watch('symbolFrom'))?.name} ≈{' '}
                  {currencyFormat1(exchangeCoinRate, 8, '', false)} {getSymbolById(watch('symbolTo'))?.name}
                </div>
              </div>
              <div className="flex items-center mt-[2px] justify-between text-[0.75rem] gap-[0.5rem] w-full px-[20px] py-[10px] bg-color-light-bg-primary dark:bg-color-input-primary rounded-t-default">
                <p className="text-color-text-primary">{t('swap:estimatedTime')}</p>
                <p className="dark:text-white text-color-light-text-primary">{t('swap:seconds')}</p>
              </div>
              <div className="flex items-center justify-between text-[0.75rem] gap-[0.5rem] w-full px-[20px] py-[10px] bg-color-light-bg-primary dark:bg-color-input-primary rounded-b-default">
                <p className="text-color-text-primary">{t('swap:swapFee')}</p>
                <p className="dark:text-white text-color-light-text-primary">
                  {(Number(swapFee) * Number(watch('amountFrom'))).toFixed(8)}{' '}
                  <span className="text-color-text-primary">{getSymbolById(watch('symbolFrom'))?.name}</span>
                </p>
              </div>
              <div className="mt-[40px] w-full text-white text-start flex items-center justify-center gap-[10px]">
                <button
                  type="submit"
                  className="flex justify-center items-center bg-gradient-btn-play shadow-bs-btn rounded-large h-[45px] min-w-[150px] hover:opacity-[0.9] disabled:opacity-60 disabled:text-gray-300"
                  disabled={!isSwapAvailable}
                >
                  {isLoading ? (
                    <ReactLoading type="bubbles" color="#FFF" delay={50} className="!w-10 !h-10" />
                  ) : (
                    t('swap:swapNow')
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      {isShowFromModal && (
        <ModalAssetsPortfolio
          onChangeCoin={(crypto: CurrencyType) => {
            const minValue: number = Math.min(getBalanceBySymbolId(crypto.id), SWAP_MIN / (crypto.price || 1));
            setValue('symbolFrom', String(crypto.id));
            setValue('amountFrom', minValue.toFixed(4));
          }}
          cryptoSymbol={watch('symbolFrom')}
          cryptoSymbols={fromSymbols}
          show={isShowFromModal}
          onClose={() => setIsShowFromModal(false)}
        />
      )}

      {isShowToModal && (
        <ModalAssetsPortfolio
          onChangeCoin={(crypto: CurrencyType) => {
            setValue('symbolTo', String(crypto.id));
          }}
          cryptoSymbol={watch('symbolTo')}
          cryptoSymbols={toSymbols}
          show={isShowToModal}
          onClose={() => setIsShowToModal(false)}
        />
      )}
    </>
  );
};

const SwapPageAuth = withAuth(SwapPage);

SwapPageAuth.getLayout = function getLayout(page: ReactElement) {
  return <DepositLayout>{page}</DepositLayout>;
};

export default SwapPageAuth;
