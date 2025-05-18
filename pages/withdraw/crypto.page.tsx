import { QuestionMarkCircleIcon } from '@heroicons/react/24/outline';
import { yupResolver } from '@hookform/resolvers/yup';
import cn from 'classnames';
import Head from 'next/head';
import { ReactElement, useCallback, useEffect, useMemo, useState } from 'react';
import Countdown from 'react-countdown';
import { useForm } from 'react-hook-form';
import ReactLoading from "react-loading";
import { shallowEqual, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { Tooltip } from 'react-tooltip';
import * as yup from 'yup';

import { api_withdraw, api_withdrawInfo } from '@/api/wallet';
import { useTranslation } from '@/base/config/i18next';
import { TOAST_ENUM } from '@/base/constants/common';
import { useExchange } from '@/base/hooks/useExchange';
import { currencyFormat1, formatDate } from '@/base/libs/utils';
import { getErrorMessage } from '@/base/libs/utils/notificationToast';
import { AppState, useAppDispatch } from '@/base/redux/store';
import { WithdrawRequest } from '@/base/types/requestTypes';
import { CryptoNetWorkType, CurrencyType } from '@/base/types/wallet';
import Loader from '@/components/common/preloader/loader';
import CsrWrapper from '@/components/CsrWrapper';
import withAuth from '@/components/hoc/withAuth';
import InputNumber from '@/components/input/typing/InputNumber';
import InputText from '@/components/input/typing/InputText';
import DepositLayout from '@/components/layouts/deposit.layout';
import ModalRollover from '@/components/modal/rollover/Rollover';
import SelectCurrency from '@/components/selectCurrency/selectCurrency';

import styles from './index.module.scss';

type WithdrawFormType = {
  withdrawAddress: string;
  withdrawAmount: string;
};

const WithdrawCryptoPage = () => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation('');
  const exchangeRate = useExchange();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isWithdrawing, setIsWithdrawing] = useState<boolean>(false);
  const [openRollover, setOpenRollover] = useState<boolean>(false);
  const [withdrawInfo, setWithdrawInfo] = useState({
    availableAmountUsd: 0,
    availableAmount: 0,
    lockedAmount: 0,
    lockedAmountUsd: 0,
  });
  const [activeCoin, setActiveCoin] = useState<CurrencyType>({
    id: '',
    name: '',
    alias: '',
    logo: '',
    iso_currency: '',
    availableNetworks: [],
    iso_decimals: 0,
    price: 0,
    type: 'crypto',
    favorite: false,
  });
  const [activeNetwork, setActiveNetwork] = useState<CryptoNetWorkType>({
    id: '',
    name: '',
    type: 1,
  });

  const { cryptoCurrencies, cryptoSymbols, balances, localFiat, viewInFiat, restrictedTo, disabledWithdraw } = useSelector(
    (state: AppState) => ({
      restrictedTo: state.auth.user.restrictedTo,
      disabledWithdraw: state.auth.user.disabledWithdraw,
      localFiat: state.wallet.localFiat,
      balances: state.wallet.balances,
      cryptoCurrencies: state.wallet.cryptoCurrencies,
      viewInFiat: state.auth.user.generalSetting.settingViewInFiat,
      cryptoSymbols: state.wallet.symbols,
    }),
    shallowEqual,
  );

  const renderMinValue = useMemo(() => {
    const cryptoCurrency = cryptoCurrencies.find(
      (item) => item.networkId === activeNetwork.id && item.symbolId === activeCoin.id,
    );
    return {
      min: cryptoCurrency ? cryptoCurrency.minWithdrawAmount : 0,
      fee: cryptoCurrency ? cryptoCurrency.withdrawFee : 0,
    };
  }, [activeNetwork, activeCoin, cryptoCurrencies, withdrawInfo]);

  const renderMaxValue = useMemo(() => {
    const activeCrypto = cryptoSymbols.find((item) => item.id === activeCoin.id);
    const withdrawableAmountUsd = withdrawInfo.availableAmountUsd;
    const withdrawableAmount = withdrawableAmountUsd / (activeCrypto?.price || 1);
    return withdrawableAmount;
  }, [cryptoSymbols, withdrawInfo, activeCoin]);

  const renderBalanceValue = useMemo(() => {
    const selectedBalanceInfo = balances.find((item) => item.symbolId === activeCoin.id);
    return selectedBalanceInfo ? selectedBalanceInfo.amount : 0;
  }, [balances, activeCoin]);

  const renderKeys = useMemo(() => {
    let key = {
      isMin: true,
      isQuater: true,
      isHalf: true,
      isMax: true,
    };
    const percent = renderMinValue.min / renderBalanceValue;
    if (percent > 1) {
      key = {
        isMax: false,
        isMin: false,
        isHalf: false,
        isQuater: false,
      };
    } else if (percent > 0.5) {
      key = {
        isMin: true,
        isQuater: false,
        isHalf: false,
        isMax: true,
      };
    } else if (percent > 0.25) {
      key = {
        isMin: true,
        isQuater: false,
        isHalf: true,
        isMax: true,
      };
    } else {
      key = {
        isMin: true,
        isQuater: true,
        isHalf: true,
        isMax: true,
      };
    }
    return key;
  }, [renderMinValue, renderBalanceValue]);

  const schema = yup.object().shape({
    withdrawAddress: yup
      .string()
      .matches(/\b(0x[a-fA-F0-9]{40})\b/, 'Incorrect Address Format')
      .required(String(t('withdraw:withdrawAddressRequire')))
      .trim(),
    withdrawAmount: yup
      .number()
      .required('Withdraw amount is required')
      .typeError('Withdraw amount is required')
      .min(+renderMinValue.min.toFixed(4), `Withdraw amount should greater than ${renderMinValue.min.toFixed(4)}`)
      .max(
        +renderMaxValue.toFixed(4),
        `Withdraw amount should be less than or equal to ${renderMaxValue.toFixed(4)} ${activeCoin.name}`,
      ),
    // .required(String(t('withdraw:withdrawAmountRequire')))
    // .test('withdrawAmount', String(t('withdraw:withdrawAmountGreater', { max: minValue })), (_item, testContext) => {
    //   if (testContext?.parent.withdrawAmount > Number(activeCoin?.balance || 0)) return false;
    //   return true;
    // }),
  });
  const {
    handleSubmit,
    setValue,
    control,
    watch,
    formState: { errors },
  } = useForm<WithdrawFormType>({
    resolver: yupResolver(schema),
    defaultValues: { withdrawAmount: '0' },
    mode: 'onBlur',
  });

  // account is restricted by changing password
  const restrictedDuration = useMemo(() => {
    const now = Math.floor(Date.now() / 1000);
    const diff = Number(restrictedTo) - now;
    return diff;
  }, [restrictedTo]);


  const restricted = useMemo(() => {
    return restrictedDuration > 0 || disabledWithdraw;
  }, [restrictedDuration, disabledWithdraw])

  const getWithdrawInfo = useCallback(async () => {
    try {
      if (!activeCoin.id) {
        return;
      }
      const _res = await api_withdrawInfo(activeCoin.id);
      setWithdrawInfo({
        availableAmountUsd: Number(_res.data?.availableWithdrawalAmountUsd || 0),
        availableAmount: Number(_res.data?.availableWithdrawalAmount || 0),
        lockedAmount: Number(_res.data?.lockedFundsAmount || 0),
        lockedAmountUsd: Number(_res.data?.lockedFundsAmountUsd || 0),
      });
    } catch (error) {
      setWithdrawInfo({
        availableAmountUsd: 0,
        availableAmount: 0,
        lockedAmount: 0,
        lockedAmountUsd: 0,
      });
    }
  }, [activeCoin.id]);

  const setAmountByPercent = useCallback(
    (percent: number) => {
      const percentValue = Math.min((renderMaxValue * percent) / 100, renderBalanceValue);

      const avaBalance = percentValue > renderMinValue.min ? percentValue : renderMinValue.min;
      setValue('withdrawAmount', (Math.floor(avaBalance * 10000) / 10000).toString());
    },
    [renderBalanceValue, renderMaxValue, renderMinValue],
  );

  const handleBlur = useCallback(() => {
    if (Number(watch('withdrawAmount')) > Math.min(renderMaxValue, renderBalanceValue)) {
      setValue('withdrawAmount', Math.min(renderMaxValue, renderBalanceValue).toFixed(4));
    }
  }, [renderMaxValue, renderBalanceValue]);

  const wrappErrors = (formWithdraw: WithdrawFormType) => {
    let messError = '';
    let validate = false;
    if (!formWithdraw.withdrawAddress) {
      messError = t('withdraw:withdrawFailMess1');
      validate = true;
    } else if (!formWithdraw.withdrawAmount) {
      messError = t('withdraw:withdrawFailMess2');
      validate = true;
    } else if (Number(formWithdraw.withdrawAmount) > withdrawInfo.availableAmount) {
      messError = t('withdraw:withdrawFailMess4');
      validate = true;
    } else if (Number(formWithdraw.withdrawAmount) <= renderMinValue.min) {
      messError = t('withdraw:withdrawFailMess3');
      validate = true;
    }
    if (messError) {
      toast.error(t(messError), { containerId: TOAST_ENUM.COMMON, toastId: 'withdraw-error' });
    }
    return validate;
  };

  const handleConfirmWithdraw = async (formWithdraw: WithdrawFormType) => {
    const validate = wrappErrors(formWithdraw);
    if (validate) {
      return;
    }
    try {
      setIsWithdrawing(true);

      const formData: WithdrawRequest = {
        symbolId: activeCoin.id,
        networkId: activeNetwork.id,
        withdrawAddress: formWithdraw.withdrawAddress,
        withdrawAmount: Number(formWithdraw.withdrawAmount),
      };
      const _res = await api_withdraw(formData);
      await getWithdrawInfo();
      // const totalWithdrawAmount = Number(watch('withdrawAmount')) * (1 - Number(WITHDRAW_FEE));
      const { status, message } = _res.data;
      if (status) {
        toast.success(t('success:confirmedWithdraw', { amount: formWithdraw.withdrawAmount, token: activeCoin.name }), {
          containerId: TOAST_ENUM.COMMON,
        });
        setValue('withdrawAddress', '');
      } else {
        toast.success(message, { containerId: TOAST_ENUM.COMMON });
        setValue('withdrawAddress', '');
      }
      // router.push(ROUTER.Transaction);
    } catch (error: any) {
      const errType = error.response?.data?.message ?? '';
      const errMessage = getErrorMessage(errType);
      toast.error(t(errMessage), { containerId: TOAST_ENUM.COMMON, toastId: 'withdraw-error' });
      setValue('withdrawAmount', '')
    } finally {
      setIsLoading(false);
      setIsWithdrawing(false);
    }
  };

  useEffect(() => {
    setValue(
      'withdrawAmount',
      String(
        renderMinValue.min > renderBalanceValue
          ? withdrawInfo.availableAmount > renderBalanceValue
            ? currencyFormat1(renderBalanceValue, 4, '', false)
            : currencyFormat1(withdrawInfo.availableAmount, 4, '', false)
          : withdrawInfo.availableAmount > renderMinValue.min
            ? renderMinValue.min
            : currencyFormat1(withdrawInfo.availableAmount, 4, '', false),
      ),
    );
  }, [renderMinValue, renderBalanceValue]);

  useEffect(() => {
    getWithdrawInfo();
  }, [getWithdrawInfo]);

  return (
    <>
      <div className={`${styles.cardContent}`}>

        {isLoading && <Loader />}
        <div className={`h-1/3 ${styles.contentHeader}`}>
          <div className="md:max-w-[492px]">
            {
              disabledWithdraw && <div className='text-[13px] text-white text-left my-4 bg-color-red/30 p-3 px-4 rounded-default'>
                {t('withdraw:withdrawDisable')}
              </div>
            }
            {!disabledWithdraw && restrictedDuration > 0 && (
              <div className="">
                <CsrWrapper>
                  <Countdown
                    date={new Date(restrictedTo * 1000)}
                    renderer={({ days, hours, minutes, seconds }) => (
                      <div
                        className="text-[13px] text-white text-left my-4 bg-color-red/30 p-3 px-4 rounded-default"
                        dangerouslySetInnerHTML={{
                          __html: String(
                            t('withdraw:withdrawRestriction', {
                              time: formatDate(new Date(0, 0, 0, hours, minutes, seconds), 'HH:mm:ss'),
                            }),
                          ),
                        }}
                      ></div>
                    )}
                  />
                </CsrWrapper>
              </div>
            )}
            <div className="">
              <SelectCurrency
                activeCoin={activeCoin}
                activeNetwork={activeNetwork}
                onChangeCoin={setActiveCoin}
                onChangeNetwork={setActiveNetwork}
                withDrawTab={true}
                disabled={restricted}
              />
            </div>

            <form onSubmit={handleSubmit(handleConfirmWithdraw)}>
              <div className="mt-[20px] text-left">
                <div className="text-default dark:text-color-text-primary text-color-light-text-primary mb-[10px] text-left">
                  {t('withdraw:withdrawalAddress')}
                </div>
                <InputText
                  customClass="px-[20px] py-[15px] dark:bg-color-input-primary bg-color-light-input-primary !text-default rounded-default"
                  control={control}
                  disabled={restricted}
                  placeholder={String(t('withdraw:withdrawalAddressPlaceholder'))}
                  name="withdrawAddress"
                />
              </div>

              <div className="mt-[20px] text-left">
                <div className="flex justify-between">
                  <div className="text-default dark:text-color-text-primary text-color-light-text-primary mb-[10px] text-left">
                    {t('withdraw:withdrawAmount')}
                  </div>
                  <div className="text-default dark:text-color-text-primary text-color-light-text-primary mb-[10px] text-left">
                    {t('deposit:min')} : {renderMinValue.min}
                  </div>
                </div>
                <div
                  className={cn(
                    'w-full pl-[18px] min-h-[51px] pr-[20px] py-[5px] text-[16px] rounded-large dark:bg-color-input-primary bg-color-light-input-primary flex items-center justify-between gap-[10px] border-[1px] border-solid border-transparent focus-within:border-color-primary',
                    {
                      'border-red-500 border border-solid': errors.withdrawAmount?.message,
                    },
                  )}
                >
                  <InputNumber
                    size={7}
                    customClass="flex-1 bg-transparent pl-[2px]"
                    control={control}
                    isShowError={false}
                    onBlur={handleBlur}
                    name="withdrawAmount"
                    disabled={restricted}
                    placeholder={String(t('withdraw:withdrawAmount'))}
                  />
                  <div className="flex items-center md:gap-[10px] gap-[2px] h-full md:text-default text-m_default">
                    {renderKeys.isMin && (
                      <div
                        role="button"
                        aria-disabled={restricted}
                        className={cn(
                          'text-default px-2 md:px-3 py-[10px] md:min-w-[60px] md:rounded-default rounded-default dark:bg-[#FFFFFF19] hover-color-light-bg-primary bg-white text-center',
                          {
                            'dark:hover:bg-gray-700 dark:text-white text-black': !restricted,
                            'cursor-default text-gray-400': restricted,
                          },
                        )}
                        onClick={() => {
                          if (restricted) return;
                          setValue('withdrawAmount', String(renderMinValue.min));
                        }}
                      >
                        {t('deposit:min')}
                      </div>
                    )}
                    {renderKeys.isQuater && (
                      <div
                        role="button"
                        aria-disabled={restricted}
                        className={cn(
                          'md:block hidden text-default px-2 md:px-3 py-[10px] md:min-w-[60px] md:rounded-default rounded-default dark:bg-[#FFFFFF19] hover-color-light-bg-primary bg-white text-center',
                          {
                            'dark:hover:bg-gray-700 dark:text-white text-black': !restricted,
                            'cursor-default text-gray-400': restricted,
                          },
                        )}
                        onClick={() => {
                          if (restricted) return;
                          setAmountByPercent(25);
                        }}
                      >
                        25%
                      </div>
                    )}
                    {renderKeys.isHalf && (
                      <div
                        role="button"
                        aria-disabled={restricted}
                        className={cn(
                          'md:block hidden text-default px-2 md:px-3 py-[10px] md:min-w-[60px] md:rounded-default rounded-default dark:bg-[#FFFFFF19] bg-white hover-color-light-bg-primary text-center',
                          {
                            'dark:hover:bg-gray-700 dark:text-white text-black': !restricted,
                            'cursor-default text-gray-400': restricted,
                          },
                        )}
                        onClick={() => {
                          if (restricted) return;
                          setAmountByPercent(50);
                        }}
                      >
                        50%
                      </div>
                    )}
                    {renderKeys.isMax && (
                      <div
                        role="button"
                        aria-disabled={restricted}
                        className={cn(
                          'text-default px-2 md:px-3 py-[10px] md:min-w-[60px] md:rounded-default rounded-default dark:bg-[#FFFFFF19] bg-white hover-color-light-bg-primary text-center',
                          {
                            'dark:hover:bg-gray-700 dark:text-white text-black': !restricted,
                            'cursor-default text-gray-400': restricted,
                          },
                        )}
                        onClick={() => {
                          if (restricted) return;
                          setAmountByPercent(100);
                        }}
                      >
                        {t('deposit:max')}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex flex-wrap justify-between gap-1 mt-2 text-default">
                  <span className="dark:text-color-text-primary text-color-light-text-primary">
                    {t('withdraw:available')}:
                  </span>
                  <div className="flex text-black dark:text-white gap-1">
                    {viewInFiat
                      ? currencyFormat1(
                        withdrawInfo.availableAmountUsd * exchangeRate,
                        4,
                        String(localFiat?.name || 'USD'),
                      )
                      : `${currencyFormat1(withdrawInfo.availableAmount, 4, '', false)}`}
                    <span className="dark:text-color-text-primary text-color-light-text-primary">
                      {viewInFiat && `(${currencyFormat1(withdrawInfo.availableAmount, 4, '', false)} )`}
                    </span>
                  </div>
                </div>
                <div className="flex flex-wrap justify-between gap-1 mt-2 text-default">
                  <span
                    className="underline cursor-pointer dark:text-color-text-primary text-color-light-text-primary"
                    onClick={() => setOpenRollover(true)}
                  >
                    {t('withdraw:lockedFunds')}:
                  </span>
                  <div className="flex text-black dark:text-white gap-1">
                    {viewInFiat
                      ? `${currencyFormat1(withdrawInfo.lockedAmountUsd * exchangeRate, 4, localFiat?.name || 'USD')}`
                      : `${currencyFormat1(withdrawInfo.lockedAmount, 4, '', false)}`}
                    <span className="dark:text-color-text-primary text-color-light-text-primary">
                      {viewInFiat && `(${currencyFormat1(withdrawInfo.lockedAmount, 4, '', false)})`}
                    </span>
                  </div>
                </div>
                {errors.withdrawAmount?.message && (
                  <span className="w-full text-red-500 text-default"> {errors.withdrawAmount?.message}</span>
                )}
              </div>
              <div className="dark:bg-color-input-primary bg-color-light-bg-primary rounded-default px-[12px] py-[6px] dark:text-color-text-primary text-color-light-text-primary mt-[22px] flex flex-col gap-[12px]">
                <div className="flex items-center justify-between">
                  <div className="text-default">{t('withdraw:totalWithdrawAmount')}</div>
                  <div className="font-semibold dark:text-color-primary text-color-light-text-primary">
                    {currencyFormat1(Number(watch('withdrawAmount')), 4, '', false)} {activeCoin.name}
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-default flex gap-[5px]">
                    {t('withdraw:fee')}{' '}
                    <QuestionMarkCircleIcon
                      width={20}
                      className="text-color-primary"
                      role="button"
                      data-tooltip-id={'fee-tooltip'}
                    />
                    <Tooltip id={'fee-tooltip'} place="bottom" content={String(t('withdraw:feeTooltip'))} />
                  </div>
                  <div className="font-semibold dark:text-white text-color-light-text-primary">
                    {currencyFormat1(renderMinValue.fee, 4, '', false)} {activeCoin.name}
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-default">{t('withdraw:withDrawAmount')}</div>
                  <div className="font-semibold dark:text-white text-color-light-text-primary">
                    {Number(watch('withdrawAmount')) - renderMinValue.fee > 0
                      ? currencyFormat1(Number(watch('withdrawAmount')) - renderMinValue.fee, 4, '', false)
                      : currencyFormat1(0, 4, '', false)}{' '}
                    {activeCoin.name}
                  </div>
                </div>
              </div>
              <div className="mt-[12px] w-full px-[20px] py-[10px] dark:text-white text-color-light-text-primary dark:bg-color-notice-primary bg-color-light-notice-primary/10 rounded-large text-start">
                <p className="text-default">
                  <span className="inline text-color-primary me-1">{t('withdraw:notice')}</span> {t('withdraw:note2')}{' '}
                </p>
              </div>

              <div className={cn("mt-[40px] text-white w-full text-start flex items-center justify-center gap-[10px]", {
                'opacity-90': restricted || isWithdrawing
              })}>
                <button
                  type="submit"
                  disabled={restricted || isWithdrawing}
                  className="flex justify-center bg-gradient-btn-play shadow-bs-btn hover:opacity-[0.9] rounded-large py-[10px] px-[20px] min-w-[140px] gap-[5px]"
                >
                  {isWithdrawing && <ReactLoading type='bubbles' className='text-color-text-primary' width={20} height={20} />}
                  <span>{t('withdraw:confirm')}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
        {openRollover && <ModalRollover show={openRollover} onClose={() => setOpenRollover(false)} />}
      </div>
    </>
  );
};

const WithdrawCryptoPageAuth = withAuth(WithdrawCryptoPage);

WithdrawCryptoPageAuth.getLayout = function getLayout(page: ReactElement) {
  return <DepositLayout>{page}</DepositLayout>;
};

export default WithdrawCryptoPageAuth;
