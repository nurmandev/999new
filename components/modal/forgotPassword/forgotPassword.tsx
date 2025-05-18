import { yupResolver } from '@hookform/resolvers/yup';
import Image from 'next/image';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import * as yup from 'yup';

import { api_forgetPassword, api_sendSMS } from '@/api/auth';
import { useTranslation } from '@/base/config/i18next';
import { TOAST_ENUM } from '@/base/constants/common';
import { COUNTRY_CALLING_CODES } from '@/base/constants/countryCallingCode';
import { isEmail, isPhone } from '@/base/libs/utils';
import { saveVerifyInfo, setIsForgetPassword } from '@/base/redux/reducers/auth.reducer';
import { changeAuthenticationType } from '@/base/redux/reducers/modal.reducer';
import { AuthenticationModeEnum } from '@/base/types/common';
import Loader from '@/components/common/preloader/loader';
import InputEmailPhone from '@/components/input/typing/InputEmailPhone';
import { getErrorMessage } from '@/base/libs/utils/notificationToast';

type ForgotPasswordFormType = {
  email: string;
};

export default function ModalForgotPassword() {
  const { t } = useTranslation('');
  const dispatch = useDispatch();
  const [countryCallingCode, setCountryCallingCode] = useState<(typeof COUNTRY_CALLING_CODES)[number]>();

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const schema = yup.object().shape({
    email: yup
      .string()
      .required(String(t('authentication:email&phoneRequired')))
      .trim(),
  });

  const wrappErrors = () => {
    let error = false;
    let mes = '';
    const email = getValues('email');
    const isPhoneNumber = email?.length > 2 && Number.isInteger(Number(email));

    if (!isPhoneNumber! && !isEmail(email)) {
      error = true;
      mes = t('authentication:emailWrong');
    }

    if (isPhoneNumber) {
      const phone = `+${String(countryCallingCode?.countryCallingCode)}${email}`;
      if (!isPhone(phone)) {
        error = true;
        mes = t('authentication:phoneWrong');
      }
    }

    if (error) {
      toast.error(mes, { containerId: TOAST_ENUM.MODAL, toastId: 'type-error' });
    }
    return error;
  };

  const {
    handleSubmit,
    control,
    getValues,
    formState: { errors },
  } = useForm<ForgotPasswordFormType>({
    resolver: yupResolver(schema),
  });

  const onReset = async (formReset: ForgotPasswordFormType) => {
    if (wrappErrors()) return;
    try {
      setIsLoading(true);
      const isPhoneNumber = formReset.email?.length > 2 && Number.isInteger(Number(formReset.email));
      let _res;
      if (isPhoneNumber) {
        const phone = `+${String(countryCallingCode?.countryCallingCode)}${formReset.email}`;
        _res = await api_sendSMS(phone, 'reset');
      } else {
        _res = await api_forgetPassword(formReset.email);
      }

      const verifyRequest = isPhoneNumber
        ? `+${String(countryCallingCode?.countryCallingCode)}${formReset.email}`
        : formReset.email;
      dispatch(saveVerifyInfo({ isPhoneVerifyRequested: !!isPhoneNumber, verifyRequest }));

      // request verify from forget password
      dispatch(setIsForgetPassword(true));

      // close modal
      dispatch(changeAuthenticationType(AuthenticationModeEnum.VERIFY));
      if (!isPhoneNumber) {
        toast.success(t('authentication:sendMailSuccessfully'), { containerId: TOAST_ENUM.MODAL });
      } else {
        toast.success(t('authentication:sendSMSSuccessfully'), { containerId: TOAST_ENUM.MODAL });
      }
    } catch (error: any) {
      const errType = error.response?.data?.message ?? '';
      const errMessage = getErrorMessage(errType);
      toast.error(String(t(errMessage)), { containerId: TOAST_ENUM.COMMON });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {isLoading && <Loader />}
      <div className="sm:min-h-[428px]">
        <div className="sm:overflow-y-auto w-full h-full">
          <div className="font-bold text-[16px] text-color-light-text-primary dark:text-white">
            {t('resetPassword:resetPassword')}
          </div>
          <form onSubmit={handleSubmit(onReset)} data-testid="user-detail-form">
            <div className="sm:mt-5 mt-3 flex flex-col items-start sm:gap-[20px] gap-[10px]">
              <InputEmailPhone
                onChangeCountryCallingCode={setCountryCallingCode}
                control={control}
                name="email"
                placeholder={String(t('authentication:emailOrPhoneNumber'))}
              />
            </div>
            <button
              type="submit"
              className="bg-gradient-btn-play shadow-bs-btn w-full rounded-default flex justify-between items-center py-[10px] pl-[40px] pr-[17px] mt-5"
            >
              <div />
              <div className="text-[14px] text-white">{t('resetPassword:resetPassword')}</div>
              <div className="p-[10px] flex items-center justify-center rounded-large bg-white/20">
                <Image height={14} width={14} src="/img/icon/arrow-right.png" alt="arrow right" />
              </div>
            </button>
            <div className="text-[13px] mt-5">
              <span className="mr-[5px] text-color-text-primary dark:text-white">{t('resetPassword:haveAccount')}</span>
              <span
                role="button"
                className="text-color-primary text-[16px] hover:border-b hover:border-solid hover:border-color-primary"
                onClick={() => {
                  dispatch(changeAuthenticationType(AuthenticationModeEnum.SIGN_IN));
                }}
              >
                {t('layout:signIn')}
              </span>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
