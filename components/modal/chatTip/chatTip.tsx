import { DialogProps, TransitionRootProps } from '@headlessui/react';
import { yupResolver } from '@hookform/resolvers/yup';
import Image from 'next/image';
import { ElementType, useCallback, useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import ReactLoading from 'react-loading';
import { shallowEqual, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import * as yup from 'yup';

import { api_sendChat } from '@/api/chat';
import { api_chatTip, api_withdrawInfo } from '@/api/wallet';
import { useTranslation } from '@/base/config/i18next';
import { API_AVATAR, TOAST_ENUM } from '@/base/constants/common';
import { useExchange } from '@/base/hooks/useExchange';
import { currencyFormat1 } from '@/base/libs/utils';
import { getErrorMessage } from '@/base/libs/utils/notificationToast';
import { changeIsShowChatTip } from '@/base/redux/reducers/modal.reducer';
import { getBalance } from '@/base/redux/reducers/wallet.reducer';
import { AppState, useAppDispatch } from '@/base/redux/store';
import { CryptoNetWorkType, CurrencyType } from '@/base/types/wallet';
import { InputNumber } from '@/components/input/typing';
import Textarea from '@/components/input/typing/Textarea';
import SelectCurrency from '@/components/selectCurrency/selectCurrency';

import CommonModal from '../commonModal/commonModal';
import ModalRollover from '../rollover/Rollover';

type ChatTipProps = {
  onClose: () => void;
  show: boolean;
} & TransitionRootProps<ElementType> &
  DialogProps<ElementType>;

type TipFormType = {
  tipAmount: string;
  tipMessage: string;
};

export default function ModalChatTip({ show, onClose }: ChatTipProps) {
  const { t } = useTranslation('');
  const exchangeRate = useExchange();
  const dispatch = useAppDispatch();
  const { tipReceiver } = useSelector(
    (state: AppState) => ({
      tipReceiver: state.modal.tipReceiver,
    }),
    shallowEqual,
  );
  const [openRollover, setOpenRollover] = useState<boolean>(false);
  const [isSending, setIsSending] = useState<boolean>(false);
  const [isShowMessage, setIsShowMessage] = useState<boolean>(false);

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

  const [tipInfo, setTipInfo] = useState({
    availableAmountUsd: 0,
    availableAmount: 0,
    lockedAmount: 0,
    lockedAmountUsd: 0,
  });

  const { cryptoCurrencies, cryptoSymbols, balances, localFiat, viewInFiat, restrictedTo, isLogin } = useSelector(
    (state: AppState) => ({
      // localeFiat: state.common.localeFiat,
      restrictedTo: state.auth.user.restrictedTo,
      localFiat: state.wallet.localFiat,
      balances: state.wallet.balances,
      cryptoCurrencies: state.wallet.cryptoCurrencies,
      viewInFiat: state.auth.user.generalSetting.settingViewInFiat,
      cryptoSymbols: state.wallet.symbols,
      isLogin: state.auth.isLogin,
    }),
    shallowEqual,
  );

  const getTipInfo = useCallback(async () => {
    try {
      if (!activeCoin.id || !isLogin) {
        return;
      }
      const _res = await api_withdrawInfo(activeCoin.id);
      setTipInfo({
        availableAmountUsd: Number(_res.data?.availableWithdrawalAmountUsd || 0),
        availableAmount: Number(_res.data?.availableWithdrawalAmount || 0),
        lockedAmount: Number(_res.data?.lockedFundsAmount || 0),
        lockedAmountUsd: Number(_res.data?.lockedFundsAmountUsd || 0),
      });
    } catch (error) {
      setTipInfo({
        availableAmountUsd: 0,
        availableAmount: 0,
        lockedAmount: 0,
        lockedAmountUsd: 0,
      });
    }
  }, [activeCoin.id, isLogin]);

  const renderMaxValue = useMemo(() => {
    const activeCrypto = cryptoSymbols.find((item) => item.id === activeCoin.id);
    const withdrawableAmountUsd = tipInfo.availableAmountUsd;
    const withdrawableAmount = withdrawableAmountUsd / (activeCrypto?.price || 1);
    return withdrawableAmount;
  }, [cryptoSymbols, tipInfo, activeCoin]);

  const renderBalanceValue = useMemo(() => {
    const selectedBalanceInfo = balances.find((item) => item.symbolId === activeCoin.id);
    return selectedBalanceInfo ? selectedBalanceInfo.amount : 0;
  }, [balances, activeCoin]);

  const handleBlur = useCallback(() => {
    // if (Number(watch('tipAmount')) > Math.min(renderMaxValue, renderBalanceValue)) {
    //   setValue('tipAmount', Math.min(renderMaxValue, renderBalanceValue).toFixed(4));
    // }
  }, [renderMaxValue, renderBalanceValue]);

  const schema = yup.object().shape({
    tipMessage: yup.string(),
    tipAmount: yup
      .number()
      .required('Tip amount is required')
      .typeError('Tip amount is required')
      .max(+renderMaxValue.toFixed(4), `Tip amount should be less than or equal to ${renderMaxValue.toFixed(4)}`)
      .min(0, `Tip amount should greater than 0}`),
  });

  const {
    handleSubmit,
    setValue,
    control,
    watch,
    reset,
    formState: { errors },
  } = useForm<TipFormType>({
    resolver: yupResolver(schema),
    defaultValues: { tipAmount: '0', tipMessage: '' },
    mode: 'onSubmit',
  });

  const onSubmit = async (data: TipFormType) => {
    try {
      setIsSending(true);
      const _res = await api_chatTip(tipReceiver.userId || '', activeCoin.id, +data.tipAmount);
      toast.success(t('errors:tip:success'), { toastId: 'chat-tip-notify-success', containerId: TOAST_ENUM.COMMON });
      dispatch(getBalance());
      if (!isShowMessage)
        await api_sendChat(
          `<div style="background: #00000022; padding: 8px; color: #BBBBBB; border-radius: 8px; margin-bottom: 4px; font-weight: 600; overflow: hidden;">Sent tip to <span style="cursor: pointer; font-weight:400; color: #44DDFF;" id="message-${tipReceiver.userId}">@${tipReceiver.userName}</span></div> ${data.tipMessage}`,
          undefined,
        );
      reset({ tipAmount: '0', tipMessage: '' });
      dispatch(changeIsShowChatTip(false));
      dispatch(getBalance());
    } catch (error: any) {
      const errType = error.response?.data?.message ?? '';
      const errMessage = getErrorMessage(errType);
      toast.error(t(errMessage), { toastId: 'chat-tip-notify-error', containerId: TOAST_ENUM.COMMON });
    } finally {
      setIsSending(false);
    }
  };

  useEffect(() => {
    getTipInfo();
    reset({ tipAmount: '0', tipMessage: '' });
  }, [show, getTipInfo]);

  return (
    <>
      <CommonModal
        show={show}
        onClose={onClose}
        panelClass={`max-w-full sm:max-w-[420px] sm:max-h-[90vh] h-full sm:!h-[710px]`}
      >
        <div className="h-full p-6">
          <div className="flex flex-col h-full overflow-y-auto relative">
            <div className="sticky top-0 font-normal dark:text-white text-black text-[14px] sm:text-[16px] pb-4">
              {t('mycasino:tip')}
            </div>
            <div className="flex flex-col items-center gap-4">
              {tipReceiver?.userName ? (
                <Image
                  className="w-[80px] h-[80px] rounded-full"
                  width={80}
                  height={80}
                  src={tipReceiver.userAvatar ? `${API_AVATAR}/${tipReceiver.userAvatar}` : '/img/avatar-1.png'}
                  alt="avatar"
                  onError={(e) => {
                    e.currentTarget.src = '/img/avatar-1.png';
                  }}
                />
              ) : (
                <Image
                  className="w-[80px] h-[80px] rounded-full grayscale brightness-50"
                  width={80}
                  height={80}
                  src="/img/avatar-hidden.png"
                  alt="avatar hidden"
                />
              )}
              <span className="font-bold">{tipReceiver.userName || ''}</span>
            </div>
            <form className="flex flex-col h-full" onSubmit={handleSubmit(onSubmit)}>
              <div>
                <SelectCurrency
                  activeCoin={activeCoin}
                  activeNetwork={activeNetwork}
                  onChangeCoin={setActiveCoin}
                  onChangeNetwork={setActiveNetwork}
                  withDrawTab={true}
                  isShowNetwork={false}
                  labelText={String(t('tip:tipCurrency'))}
                />
                <div className="mt-[20px] flex flex-col gap-2">
                  <div className="flex justify-between text-left text-default dark:text-color-text-primary text-color-light-text-primary">
                    <span>{t('tip:tipAmount')}</span>
                    <span>{`${(1 / activeCoin.price).toFixed(4)} ${activeCoin.name} ~ ${
                      Math.ceil((5000 / activeCoin.price) * 100) / 100
                    } ${activeCoin.name}`}</span>
                  </div>
                  <InputNumber
                    customClass="px-[20px] py-[15px] dark:bg-color-input-primary bg-color-light-input-primary !text-default rounded-default"
                    control={control}
                    placeholder={String(t('withdraw:withdrawalAddressPlaceholder'))}
                    onBlur={handleBlur}
                    name="tipAmount"
                  />
                  <div className="flex flex-wrap justify-between gap-1 mt-2 text-default">
                    <span className="dark:text-color-text-primary text-color-light-text-primary">
                      {t('withdraw:available')}:
                    </span>
                    <div className="flex text-black dark:text-white gap-1">
                      {viewInFiat
                        ? currencyFormat1(
                            tipInfo.availableAmountUsd * exchangeRate,
                            4,
                            String(localFiat?.name || 'USD'),
                          )
                        : `${currencyFormat1(tipInfo.availableAmount, 4, '', false)}`}
                      <span className="dark:text-color-text-primary text-color-light-text-primary">
                        {viewInFiat && `( ${currencyFormat1(tipInfo.availableAmount, 4, '', false)} )`}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-wrap justify-between mt-1 gap-1 text-default">
                    <span
                      className="underline cursor-pointer dark:text-color-text-primary text-color-light-text-primary"
                      onClick={() => setOpenRollover(true)}
                    >
                      {t('withdraw:lockedFunds')}:
                    </span>
                    <div className="flex text-black dark:text-white gap-1">
                      {viewInFiat
                        ? `${currencyFormat1(tipInfo.lockedAmountUsd * exchangeRate, 4, localFiat?.name || 'USD')}`
                        : `${currencyFormat1(tipInfo.lockedAmount, 4, '', false)}`}
                      <span className="dark:text-color-text-primary text-color-light-text-primary">
                        {viewInFiat && `( ${currencyFormat1(tipInfo.lockedAmount, 4, '', false)} )`}
                      </span>
                    </div>
                  </div>
                </div>
                {!isShowMessage && (
                  <div className="flex flex-col gap-2 mt-5">
                    <div className="text-left text-default dark:text-color-text-primary text-color-light-text-primary">
                      {t('tip:tipMessage')}
                    </div>
                    <Textarea
                      customClass="px-[20px] py-[15px] dark:bg-color-input-primary bg-color-light-input-primary !text-default rounded-default"
                      control={control}
                      name="tipMessage"
                    />
                  </div>
                )}
                <div className="flex items-center gap-[10px] mt-5">
                  <input
                    checked={isShowMessage}
                    onChange={(event) => {
                      setIsShowMessage(event.target.checked);
                      if (event.target.checked === true) setValue('tipMessage', '');
                    }}
                    className="w-[14px] h-[14px] bg-color-primary text-color-primary"
                    type="checkbox"
                    id="vehicle1"
                  />
                  <label htmlFor="vehicle1" className="text-m_default !text-color-text-primary font-normal text-start">
                    {t('tip:tipMessageDescription')}
                  </label>
                </div>
              </div>
              <div className="mt-6 w-full text-white text-start flex items-center justify-center gap-[10px]">
                <button
                  type="submit"
                  className="bg-gradient-btn-play shadow-bs-btn hover:opacity-[0.9] rounded-large h-[41px] px-[20px] min-w-[140px] text-center text-default"
                >
                  {isSending ? (
                    <ReactLoading type="bubbles" color="#FFFFFF" className="!h-9 !w-9 m-auto" />
                  ) : (
                    t('tip:tipConfirm')
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </CommonModal>
      {openRollover && <ModalRollover show={openRollover} onClose={() => setOpenRollover(false)} />}
    </>
  );
}
