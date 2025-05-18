import { yupResolver } from '@hookform/resolvers/yup';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import * as yup from 'yup';

import { api_get2FAStatus, api_login, api_sendVerifyQRCode } from '@/api/auth';
import { useTranslation } from '@/base/config/i18next';
import { TOAST_ENUM } from '@/base/constants/common';
import { COUNTRY_CALLING_CODES } from '@/base/constants/countryCallingCode';
import { convertUserInfo, isEmail, isPhone } from '@/base/libs/utils';
import { getErrorMessage } from '@/base/libs/utils/notificationToast';
import { changeDisabledPeriod } from '@/base/redux/reducers/common.reducer';
import {
  changeAuthenticationType,
  changeIsShowAuthenticationModal,
  changeIsShowSelfExclusion,
} from '@/base/redux/reducers/modal.reducer';
import { initWalletInfo, setLocalFiat } from '@/base/redux/reducers/wallet.reducer';
import { useAppDispatch } from '@/base/redux/store';
import { AuthenticationModeEnum } from '@/base/types/common';
import { CurrencyType } from '@/base/types/wallet';
import Loader from '@/components/common/preloader/loader';
import InputEmailPhone from '@/components/input/typing/InputEmailPhone';
import InputPassAuthentication from '@/components/input/typing/InputPassAuthentication';
import InputText from '@/components/input/typing/InputText';
import { CookiesStorage } from '@/libs/storage/cookie';
import { saveUserInfo, saveVerifyInfo, setIsForgetPassword } from '@/redux/reducers/auth.reducer';
import { LoginRequest } from '@/types/requestTypes';

type SignInTabProps = {
  setIsLoginTwoFactor: (isTowFactor: boolean) => void;
  isLoginTwoFactor?: boolean;
  setForgotKey: (isForgot: boolean) => void;
  forgotKey?: boolean;
  email?: string;
};

type VerificationCodeOtpForm = {
  codeOtp: string;
};

export default function SignInTab({
  setIsLoginTwoFactor,
  isLoginTwoFactor,
  setForgotKey,
  forgotKey,
  email,
}: SignInTabProps) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [codeOtp, setCodeOtp] = useState<string>('');
  const [countryCallingCode, setCountryCallingCode] = useState<(typeof COUNTRY_CALLING_CODES)[number]>();

  const dispatch = useAppDispatch();

  const { t } = useTranslation('');

  const verificationOtpSchema = yup.object().shape({
    codeOtp: yup.string().required(String(t('authentication:codeOtpRequired'))),
  });

  const { control: verificationCodeOtpControl, setValue: setOtpValue } = useForm<VerificationCodeOtpForm>({
    resolver: yupResolver(verificationOtpSchema),
  });

  const schema = yup.object().shape({
    email: yup
      .string()
      // .email()
      .required(String(t('authentication:email&phoneRequired')))
      .trim(),
    password: yup
      .string()
      // .matches(isPhoneReg)
      .required(String(t('authentication:passwordRequired')))
      .trim(),
  });

  const {
    handleSubmit,
    control,
    formState: { errors },
    getValues,
  } = useForm<LoginRequest>({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    if (isLoginTwoFactor) {
      setCodeOtp('');
      setOtpValue('codeOtp', '');
    } else {
      setCodeOtp('');
    }
  }, [isLoginTwoFactor]);

  const getTwoFactorAuthStatus = async (formLogin: LoginRequest) => {
    if (!formLogin.email) return false;
    let isTwoFactor = false;
    setIsLoading(true);
    try {
      const res = await api_get2FAStatus(formLogin.email);
      isTwoFactor = res.data;
    } catch (error: any) {
    } finally {
      setIsLoading(false);
    }
    return isTwoFactor;
  };

  const onLogin = async (formLogin: LoginRequest) => {
    let checkTwoFactor = false;
    const isPhoneNumber = formLogin.email && formLogin.email.length > 2 && Number.isInteger(Number(formLogin.email));
    // will be implemented with 2fa
    if (!codeOtp && !isPhoneNumber) {
      checkTwoFactor = await getTwoFactorAuthStatus(formLogin);
    }
    if (checkTwoFactor) {
      setIsLoginTwoFactor(true);
      return;
    } else {
      try {
        setIsLoading(true);
        const phone = `+${String(countryCallingCode?.countryCallingCode) + formLogin.email}`;
        if (isPhoneNumber && !isPhone(phone)) {
          toast.error(t('authentication:phoneWrong'), { containerId: TOAST_ENUM.COMMON });
          return;
        }
        if (!isPhoneNumber && !isEmail(formLogin.email)) {
          toast.error(t('authentication:emailWrong'), { containerId: TOAST_ENUM.COMMON });
          return;
        }

        const request = {
          email: !isPhoneNumber ? formLogin.email : '',
          codeOtp: codeOtp,
          password: formLogin.password,
          phone: isPhoneNumber ? `+${String(countryCallingCode?.countryCallingCode) + formLogin.email}` : '',
        };
        const _res = await api_login(request);
        const { token, user } = _res.data;
        const localFiat: CurrencyType = {
          id: user.settingFiatCurrency.id ?? '',
          name: user.settingFiatCurrency.symbol ?? '',
          alias: user.settingFiatCurrency.name ?? '',
          logo: `/img/fiats/${user.settingFiatCurrency.symbol}.png`,
          iso_currency: user.settingFiatCurrency.iso_currency,
          iso_decimals: user.settingFiatCurrency.iso_decimals,
          availableNetworks: [],
          price: Number(user.settingFiatCurrency.price),
          type: 'fiat',
          favorite: user.settingFiatCurrency.favorite,
        };
        CookiesStorage.setAccessToken(token);
        dispatch(
          saveUserInfo({
            ...convertUserInfo(user),
          }),
        );
        setIsLoginTwoFactor(false);
        dispatch(initWalletInfo());
        dispatch(setLocalFiat(localFiat));
        dispatch(changeIsShowAuthenticationModal(false));
      } catch (error: any) {
        const isPhoneNumber =
          formLogin.email && formLogin.email.length > 2 && Number.isInteger(Number(formLogin.email));

        setCodeOtp('');
        setOtpValue('codeOtp', '');
        const errType = error.response?.data?.message ?? '';
        const status = error.response?.data?.statusCode ?? '';

        const errMessage = getErrorMessage(errType);
        toast.error(String(t(errMessage)), { containerId: TOAST_ENUM.COMMON });

        // user is not allowed
        if (status === 401 && errType === 'isNotAllowedUser') {
          const phone = isPhoneNumber ? `+${String(countryCallingCode?.countryCallingCode) + formLogin.email}` : '';
          dispatch(changeAuthenticationType(AuthenticationModeEnum.VERIFY));
          dispatch(setIsForgetPassword(false));
          dispatch(
            saveVerifyInfo({
              verifyRequest: isPhoneNumber ? phone : formLogin.email,
              isPhoneVerifyRequested: !!isPhoneNumber,
            }),
          );
        }
        if (status === 401 && errType.includes('disabledAccount') === true) {
          const period = errType.split('_')[1];
          dispatch(changeIsShowAuthenticationModal(false));
          dispatch(changeIsShowSelfExclusion(true));
          dispatch(changeDisabledPeriod(Number(period)));
        }
      } finally {
        setIsLoading(false);
      }
    }
  };

  const sendQrCodeToEmail = async () => {
    const formData = getValues();
    if (!formData.email) return;
    setIsLoading(true);
    try {
      const res = await api_sendVerifyQRCode(formData.email);
      toast.success(t('setting:verificationEmail'), { containerId: TOAST_ENUM.COMMON });
    } catch (error: any) {
      const errType = error?.response?.data?.message ?? '';
      const errMessage = getErrorMessage(errType);
      toast.error(String(t(errMessage)), { containerId: TOAST_ENUM.COMMON });
      setCodeOtp('');
      setOtpValue('codeOtp', '');
    } finally {
      setIsLoading(false);
      onClose();
    }
  };

  const paste = () => {
    toast.success(t('success:pasted'), { containerId: TOAST_ENUM.COMMON });
    try {
      navigator.clipboard.readText().then((text) => {
        setCodeOtp(text);
        setOtpValue('codeOtp', text);
      });
    } catch (error) {
      console.log(error);
    }
  };

  const onClose = () => {
    setForgotKey(false);
    setIsLoginTwoFactor(false);
  };
  return (
    <>
      {isLoading && <Loader />}
      {forgotKey ? (
        <div className="dark:bg-[#25262B] bg-white text-[16px]">
          <div className="flex items-center justify-center h-[140px] dark:text-color-text-primary text-color-light-text-primary">
            {t('setting:2FASentEmail')}
          </div>
          <div className="flex items-center p-10 pt-0 gap-4 mt-[20px]">
            <div
              onClick={onClose}
              role="button"
              className="bg-color-red grow hover:opacity-[0.9] rounded-large text-center text-white text-default px-[30px] py-[10px] m-auto"
            >
              {t('setting:cancel')}
            </div>
            <div
              onClick={sendQrCodeToEmail}
              role="button"
              className="bg-gradient-btn-play shadow-bs-btn grow hover:opacity-[0.9] text-center rounded-large text-white text-default px-[30px] py-[10px] m-auto"
            >
              {t('setting:confirm')}
            </div>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onLogin)} data-testid="user-detail-form">
          {isLoginTwoFactor ? (
            <>
              <div className="sm:mt-5 mt-3 flex flex-col items-start sm:gap-[20px] gap-[10px]">
                <div className="relative w-full">
                  <InputText
                    customClass="px-[10px] py-[10px] my-[10px] rounded-default w-full bg-white dark:bg-color-input-primary !text-default placeholder:text-default placeholder:text-[#777777]"
                    name="codeOtp"
                    onChange={(e) => setCodeOtp(e.target.value)}
                    value={codeOtp}
                    placeholder={String(t('authentication:googleSecurity2FA'))}
                    control={verificationCodeOtpControl}
                  />
                  <div
                    onClick={paste}
                    className="absolute cursor-pointer right-[10px] h-[41px] top-[11px] flex items-center"
                  >
                    <span className="dark:text-white text-black text-default ml-[6px]">
                      {t('authentication:paste')}
                    </span>
                  </div>
                </div>
                <div
                  onClick={() => setForgotKey(true)}
                  className="w-full mb-4 text-right text-black cursor-pointer text-default dark:text-white hover:underline"
                >
                  {t('authentication:lostSecutiry2FAKey')}
                </div>
              </div>
              <button
                type="submit"
                className={`${codeOtp.length < 6 && 'opacity-70 pointer-events-none'
                  } bg-gradient-btn-play shadow-bs-btn w-full rounded-large flex justify-between items-center py-[10px] pl-[40px] pr-[17px] sm:mt-5 mt-3`}
              >
                <div />
                <div className="text-white text-default">{t('authentication:submit')}</div>
                <div className="p-[10px] flex items-center justify-center rounded-large bg-white/20">
                  <Image height={14} width={14} src="/img/icon/arrow-right.png" alt="arrow right" />
                </div>
              </button>
            </>
          ) : (
            <>
              <div className="sm:mt-5 mt-3 flex flex-col items-start sm:gap-[20px] gap-[10px]">
                <InputEmailPhone
                  onChangeCountryCallingCode={setCountryCallingCode}
                  control={control}
                  customClass="rounded-sm"
                  name="email"
                  placeholder={String(t('authentication:emailOrPhoneNumber'))}
                />
                <InputPassAuthentication
                  control={control}
                  name="password"
                  placeholder={String(t('authentication:password'))}
                  type="password"
                />
              </div>
              <div className="flex justify-end">
                <div
                  role="button"
                  className="text-default text-color-text-primary sm:mt-[19px] mt-[10px] hover:text-color-secondary max-w-[160px] hover:underline"
                  onClick={() => {
                    dispatch(changeAuthenticationType(AuthenticationModeEnum.FORGOT_PASS));
                  }}
                >
                  {t('authentication:forgotYourPass')}
                </div>
              </div>
              <button
                type="submit"
                className="bg-gradient-btn-play shadow-bs-btn w-full rounded-large flex justify-between items-center py-[5px] pl-[40px] pr-[17px] sm:mt-5 mt-3"
              >
                <div />
                <div className="text-white text-default">{t('authentication:continue')}</div>
                <div className="p-[10px] flex items-center justify-center rounded-large bg-white/20">
                  <Image height={14} width={14} src="/img/icon/arrow-right.png" alt="arrow right" />
                </div>
              </button>
              <div className="flex">
                <div role="button" className="text-default w-full dark:text-white sm:mt-[19px] mt-[10px] text-center">
                  <span className="text-color-text-primary">{t('authentication:newtoBonenza')}&nbsp;&nbsp;</span>
                  <span
                    className="font-bold text-color-primary hover:text-color-secondary hover:underline"
                    onClick={() => {
                      dispatch(changeAuthenticationType(AuthenticationModeEnum.SIGN_UP));
                    }}
                  >
                    {t('authentication:createAccount')}
                  </span>
                </div>
              </div>
            </>
          )}
        </form>
      )}
    </>
  );
}
