import { DialogProps, TransitionRootProps } from '@headlessui/react';
import { yupResolver } from '@hookform/resolvers/yup';
import Image from 'next/image';
import { ElementType, useState } from 'react';
import { useForm } from 'react-hook-form';
import { shallowEqual, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import * as yup from 'yup';

import { api_resetPassword } from '@/api/auth';
import { useTranslation } from '@/base/config/i18next';
import { TOAST_ENUM } from '@/base/constants/common';
import { getErrorMessage } from '@/base/libs/utils/notificationToast';
import { changeIsShowResetPassword } from '@/base/redux/reducers/modal.reducer';
import { initWalletInfo } from '@/base/redux/reducers/wallet.reducer';
import { AppState, useAppDispatch } from '@/base/redux/store';
import { ResetPasswordRequest } from '@/base/types/requestTypes';
import Loader from '@/components/common/preloader/loader';
import { InputPassAuthentication } from '@/components/input/typing';

import CommonModal from '../commonModal/commonModal';

type ModalResetPasswordProps = {
  onClose: () => void;
  show: boolean;
} & TransitionRootProps<ElementType> &
  DialogProps<ElementType>;

export default function ModalResetPassword({ show, onClose }: ModalResetPasswordProps) {
  const { t } = useTranslation('');
  const dispatch = useAppDispatch();

  const { localFiat } = useSelector(
    (state: AppState) => ({
      localFiat: state.wallet.localFiat,
    }),
    shallowEqual,
  );

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const schema = yup.object().shape({
    password: yup
      .string()
      .required(String(t('authentication:passwordRequired')))
      .trim(),
    confirmPassword: yup
      .string()
      .required(String(t('authentication:confirmPasswordRequired')))
      .oneOf([yup.ref('password')], String(t('authentication:confirmPasswordMatchNewPassword')))
      .trim(),
  });

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<ResetPasswordRequest>({
    resolver: yupResolver(schema),
  });

  const onReset = async (formReset: ResetPasswordRequest) => {
    try {
      setIsLoading(true);

      const res = await api_resetPassword(formReset);
      // const localFiat: CurrencyType = {
      //   id: res.data.settingFiatCurrency.id ?? '',
      //   name: res.data.settingFiatCurrency.symbol ?? '',
      //   alias: res.data.settingFiatCurrency.name ?? '',
      //   logo: `/img/fiats/${res.data.settingFiatCurrency.symbol}.png`,
      //   iso_currency: res.data.settingFiatCurrency.iso_currency,
      //   iso_decimals: res.data.settingFiatCurrency.iso_decimals,
      //   availableNetworks: [],
      //   price: Number(res.data.settingFiatCurrency.price),
      //   type: 'fiat',
      //   favorite: res.data.settingFiatCurrency.favorite,
      // };
      // dispatch(
      //   saveUserInfo({
      //     ...convertUserInfo(res.data),
      //   }),
      // );

      dispatch(initWalletInfo());

      // dispatch(setLocalFiat(localFiat));

      dispatch(changeIsShowResetPassword(false));
      toast.success(t('authentication:resetPasswordSuccessfully'), { containerId: TOAST_ENUM.COMMON });
    } catch (error: any) {
      const errType = error.response?.data?.message ?? '';
      const errMessage = getErrorMessage(errType);
      toast.error(t(errMessage), { containerId: TOAST_ENUM.COMMON });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <CommonModal
        show={show}
        onClose={onClose}
        panelClass="sm:max-w-[464px]"
        header={
          <div className="flex flex-col items-start modal-header">
            <div className="text-[16px] text-white font-[600]">{t('authentication:resetAccountPassword')}</div>
          </div>
        }
      >
        <>
          {isLoading && <Loader />}
          <div className="flex flex-col items-center my-[50px] gap-[20px]">
            <div>
              <Image src={'/img/img-reset-password.png'} width={88} height={100} alt="reset" />
            </div>
            <div>
              <div className="text-[#99a4b099] text-[20px] text-center">{t('authentication:resetAccountPassword')}</div>
              <div className="text-[#99a4b099] text-[14px] text-center">{t('authentication:rememberPassword')}</div>
            </div>
            <form onSubmit={handleSubmit(onReset)} data-testid="user-detail-form">
              <div className="sm:mt-5 mt-3 flex flex-col items-start sm:gap-[20px] gap-[10px]">
                <InputPassAuthentication
                  control={control}
                  name="password"
                  placeholder={'New password'}
                  type="password"
                />
                <InputPassAuthentication
                  control={control}
                  name="confirmPassword"
                  placeholder={'New password again'}
                  type="password"
                />
              </div>
              <button
                type="submit"
                className="bg-gradient-btn-play shadow-bs-btn w-full rounded-default text-center py-[10px] sm:mt-5 mt-3"
              >
                <div />
                <div className="text-[14px] text-white">{t('authentication:confirm')}</div>
              </button>
            </form>
          </div>
        </>
      </CommonModal>
    </>
  );
}
