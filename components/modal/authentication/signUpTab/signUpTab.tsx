import cn from 'classnames';
import Image from 'next/image';
import Link from 'next/link';
import { useCallback, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';

import { api_signupWithEmail, api_signupWithPhone } from '@/api/auth';
import { Trans, useTranslation } from '@/base/config/i18next';
import { TOAST_ENUM } from '@/base/constants/common';
import { COUNTRY_CALLING_CODES } from '@/base/constants/countryCallingCode';
import { isPhone } from '@/base/libs/utils';
import { getErrorMessage } from '@/base/libs/utils/notificationToast';
import { saveVerifyInfo, setIsForgetPassword } from '@/base/redux/reducers/auth.reducer';
import { changeAuthenticationType } from '@/base/redux/reducers/modal.reducer';
import { AuthenticationModeEnum, SignUpEmailFormRef, SignUpPhoneFormRef } from '@/base/types/common';
import { SignUpEmailRequest, SignUpPhoneRequest } from '@/base/types/requestTypes';
import Loader from '@/components/common/preloader/loader';

import SignUpEmailForm from './signUpEmailForm';
import SignUpPhoneForm from './signUpPhoneForm';
type SignUpTabProps = {
  onClose: () => void;
};

export default function SignUpTab({ onClose }: SignUpTabProps) {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [isCheckboxApprove, setIsCheckboxApprove] = useState<boolean>(true);
  const [isConfirm, setCheckIsConfirm] = useState<boolean>(false);
  const [isPhoneNumber, setCheckIsPhoneNumber] = useState<boolean>(false);
  const [countryCallingCode, setCountryCallingCode] = useState<(typeof COUNTRY_CALLING_CODES)[number]>();

  const emailFormDataRef = useRef<SignUpEmailFormRef>(null);
  const phoneFormDataRef = useRef<SignUpPhoneFormRef>(null);

  const dispatch = useDispatch();

  const { t } = useTranslation('');

  const emitEmailData = () => emailFormDataRef.current?.emitData?.();
  const emitPhoneData = () => phoneFormDataRef.current?.emitData?.();

  const onSubmitEmail = async (data: SignUpEmailRequest) => {
    try {
      setIsLoading(true);
      const _res = await api_signupWithEmail(data);
      if (_res?.status === 201) {
        dispatch(saveVerifyInfo({ verifyRequest: data.email, isPhoneVerifyRequested: false }));
        dispatch(setIsForgetPassword(false));
        dispatch(changeAuthenticationType(AuthenticationModeEnum.VERIFY));
        setIsLoading(false);
      }
    } catch (error: any) {
      const errType = error.response?.data?.message ?? '';
      const status = error.response?.data?.statusCode ?? '';
      const errMessage = getErrorMessage(errType);
      toast.error(String(t(errMessage)), { containerId: TOAST_ENUM.COMMON });
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmitPhone = async (data: SignUpPhoneRequest) => {
    try {
      setIsLoading(true);
      const phoneNumber = `+${String(countryCallingCode?.countryCallingCode) + data.phone}`;
      if (!isPhone(phoneNumber)) {
        toast.error(t('authentication:phoneWrong'), { containerId: TOAST_ENUM.COMMON });
        return;
      }
      const formData = {
        ...data,
        phone: phoneNumber,
      };
      const _res = await api_signupWithPhone(formData);
      if (_res?.status === 201) {
        // store verification data
        dispatch(saveVerifyInfo({ verifyRequest: phoneNumber, isPhoneVerifyRequested: true }));

        // request to open verification code not from forget-password
        dispatch(setIsForgetPassword(false));

        dispatch(changeAuthenticationType(AuthenticationModeEnum.VERIFY));
        setIsLoading(false);
      }
    } catch (error: any) {
      const errType = error.response?.data?.message ?? '';
      const errMessage = getErrorMessage(errType);
      toast.error(String(t(errMessage)), { containerId: TOAST_ENUM.COMMON });
    } finally {
      setIsLoading(false);
    }
  };

  const onSignUp = async () => {
    if (!isConfirm) {
      toast.error(String(t('authentication:pleaseAgree')), { containerId: TOAST_ENUM.COMMON, toastId: 'agree-policy' });
      return;
    }
    if (isPhoneNumber) await emitPhoneData();
    else await emitEmailData();
  };

  const returnForm = useCallback(() => {
    return (
      <>
        {!isPhoneNumber && <SignUpEmailForm onSubmit={onSubmitEmail} ref={emailFormDataRef} />}
        {isPhoneNumber && (
          <SignUpPhoneForm
            onSubmit={onSubmitPhone}
            setCountryCallingCode={setCountryCallingCode}
            ref={phoneFormDataRef}
          />
        )}
      </>
    );
  }, [isPhoneNumber, setCountryCallingCode, onSubmitEmail, onSubmitPhone]);

  return (
    <>
      {isLoading && <Loader />}
      <div className="sm:min-h-[275px]">
        <div className="sm:mt-5 mt-1 flex flex-col items-start gap-[5px] sm:gap-[13px]">
          <div className="flex w-full">
            <div
              className={cn(
                ' flex-1 flex hover:opacity-[0.9] items-center justify-center border-b-2 border-solid border-transparent dark:border-color-border-primary pb-[10px]',
                { 'bg-gradient-to-t from-color-primary/10 !border-color-primary': !isPhoneNumber },
              )}
              role="button"
              onClick={() => {
                setCheckIsPhoneNumber(false);
              }}
            >
              <div className="text-[12px] sm:text-[16px] dark:text-white text-color-light-text-primary font-[700]">
                {t('authentication:email')}
              </div>
            </div>
            <div
              className={cn(
                'flex-1 flex items-center hover:opacity-[0.9]  justify-center border-b-2 border-solid border-transparent dark:border-color-border-primary pb-[10px]',
                { 'bg-gradient-to-t from-color-primary/10 !border-color-primary': isPhoneNumber },
              )}
              role="button"
              onClick={() => {
                setCheckIsPhoneNumber(true);
              }}
            >
              <div className="text-[12px] sm:text-[16px] dark:text-white text-color-light-text-primary font-[700]">
                {t('setting:phoneNumber')}
              </div>
            </div>
          </div>
          {returnForm()}
          <div className="flex items-center gap-[10px]">
            <input
              checked={isConfirm}
              onChange={(event) => {
                setCheckIsConfirm(event.target.checked);
              }}
              className="w-[14px] h-[14px] checked:bg-color-primary before:bg-[#161D26]"
              type="checkbox"
              id="confirm18"
            />
            <label
              htmlFor="confirm18"
              className="text-m_des sm:text-des !text-color-text-primary font-normal text-start"
            >
              <Trans i18nKey="authentication:confirmAtLeast18YearsOld">
                I agree to the
                <Link className="text-color-primary font-bold" href="/helper-center/terms-of-service/" target="_blank">
                  User Agreement
                </Link>
                & confirm I am at least 18 years old
              </Trans>
            </label>
          </div>
          <div className="flex items-center gap-[10px]">
            <input
              checked={isCheckboxApprove}
              onChange={(event) => {
                setIsCheckboxApprove(event.target.checked);
              }}
              className="w-[14px] h-[14px] bg-color-primary text-color-primary"
              type="checkbox"
              id="vehicle1"
            />
            <label htmlFor="vehicle1" className="text-m_des text-des !text-color-text-primary font-normal text-start">
              {t('authentication:agreeToReceive')}
            </label>
          </div>
        </div>
        <button
          type="submit"
          onClick={onSignUp}
          className="bg-gradient-btn-play shadow-bs-btn  w-full rounded-large flex justify-between items-center py-[5px] pl-[40px] pr-[17px] mt-1"
        >
          <div />
          <div className="text-[14px] text-white">{t('authentication:continue')}</div>
          <div className="w-[34px] h-[35px] flex items-center justify-center rounded-large bg-white/20">
            <Image width={15} height={15} src="/img/icon/arrow-right.png" alt="arrow right" />
          </div>
        </button>
        <div className="flex">
          <div
            role="button"
            className="text-[12px] sm:text-[14px] w-full dark:text-white sm:mt-[19px] mt-[10px] text-center"
          >
            <span className="text-color-text-primary">{t('authentication:alreadyHaveAccount')}&nbsp;&nbsp;</span>
            <span
              className="text-color-primary hover:text-color-secondary hover:underline"
              onClick={() => {
                dispatch(changeAuthenticationType(AuthenticationModeEnum.SIGN_IN));
              }}
            >
              {t('layout:signIn')}
            </span>
          </div>
        </div>
      </div>
    </>
  );
}
