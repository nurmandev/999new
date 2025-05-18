import { Disclosure, Transition } from '@headlessui/react';
import { ChevronUpIcon } from '@heroicons/react/24/outline';
import { yupResolver } from '@hookform/resolvers/yup';
import { googleLogout } from '@react-oauth/google';
import cn from 'classnames';
import { Copy, InfoCircle } from 'iconsax-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { ReactElement, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { shallowEqual, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { OtpInput } from 'reactjs-otp-input';
import * as yup from 'yup';

import { api_changePassword, api_getSetLogin, api_setLoginPassword } from '@/api/auth';
import { api_confirmQRCode, api_disable2FA, api_generateQRCode } from '@/api/user';
import { useTranslation } from '@/base/config/i18next';
import { ROUTER, TOAST_ENUM } from '@/base/constants/common';
import { CookiesStorage } from '@/base/libs/storage/cookie';
import { convertUserInfo, copyClipBoard } from '@/base/libs/utils';
import { getErrorMessage } from '@/base/libs/utils/notificationToast';
import { logoutState, saveUserInfo } from '@/base/redux/reducers/auth.reducer';
import { changeIsRestricting } from '@/base/redux/reducers/common.reducer';
import {
  changeAuthenticationType,
  changeIsShowAccountRestriction,
  changeIsShowAuthenticationModal,
} from '@/base/redux/reducers/modal.reducer';
import { logoutWallet } from '@/base/redux/reducers/wallet.reducer';
import { AppState, useAppDispatch } from '@/base/redux/store';
import { AuthenticationModeEnum } from '@/base/types/common';
import Loader from '@/components/common/preloader/loader';
import withAuth from '@/components/hoc/withAuth';
import InputPassword from '@/components/input/typing/InputPassword';
import SettingLayout from '@/components/layouts/setting.layout';
import ModalEnterCodeSecurity from '@/components/modal/confirmChangeSecurity/confrimChangeSecurity';

type ForgotPasswordForm = {
  oldPassword: string;
  newPassword: string;
  confirmNewPassword: string;
  codeOtp?: string;
};

type LoginPassword = {
  password: string;
};

const SettingSecurity = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSetLogin, setIsSetLogin] = useState<boolean>(false);
  const [openModalCode, setOpenModalCode] = useState<boolean>(false);
  const [password, setPassword] = useState<string>('');
  const [passwordLogin, setPasswordLogin] = useState<string>('');
  const [otp, setOtp] = useState('');
  const [qrCode, setQrCode] = useState<string>('');
  const [secret, setSecret] = useState<string>('');
  const [logOutDelay, setLogOutDelay] = useState<number>(0);
  const [passwordBody, setPasswordBody] = useState<ForgotPasswordForm>({
    oldPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  });
  const { t } = useTranslation('');
  const dispatch = useAppDispatch();
  const router = useRouter();

  const { email, tfa, isRestricting, showChatType } = useSelector(
    (state: AppState) => ({
      email: state.auth.user.email,
      tfa: state.auth.user.tfa,
      isRestricting: state.common.isRestricting,
      showChatType: state.modal.showChatType,
    }),
    shallowEqual,
  );

  const schema = yup.object().shape({
    email: yup.string().required(String(t('deposit:currencyRequired'))),
  });

  const loginPasswordControl = yup.object().shape({
    password: yup.string().required(String(t('deposit:currencyRequired'))),
  });

  const { control } = useForm<ForgotPasswordForm>({
    resolver: yupResolver(schema),
  });

  const { control: LoginPasswordControl, reset: resetLoginPassword } = useForm<LoginPassword>({
    resolver: yupResolver(loginPasswordControl),
  });

  useEffect(() => {
    getLoginPassword();
    getQrCode();
  }, []);

  const handleChange = (otp: string) => setOtp(otp);

  const onLogout = () => {
    CookiesStorage.logout();
    googleLogout();
    dispatch(logoutState());
    dispatch(logoutWallet());
    router.replace(ROUTER.Home);
  };

  const getLoginPassword = async () => {
    setIsLoading(true);
    try {
      const res = await api_getSetLogin();
      setIsSetLogin(res?.data?.setLogin);
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  const setLoginPassword = async () => {
    setIsLoading(true);
    try {
      const res = api_setLoginPassword(password);
      toast.success(t('setting:done'), { containerId: TOAST_ENUM.COMMON });
      setIsSetLogin(true);
      setPassword('');
    } catch (error: any) {
      const errType = error?.response?.data?.message ?? '';
      const errMessage = getErrorMessage(errType);
      toast.success(t(errMessage), { containerId: TOAST_ENUM.COMMON });
    } finally {
      setIsLoading(false);
    }
  };

  const getQrCode = async () => {
    setIsLoading(true);
    try {
      const res = await api_generateQRCode();
      setQrCode(res.data.qrCodeUrl);
      setSecret(res.data.secretKey);
    } catch (error: any) {
      const errType = error?.response?.data?.message ?? '';
      const errMessage = getErrorMessage(errType);
      toast.success(t(errMessage), { containerId: TOAST_ENUM.COMMON });
    } finally {
      setIsLoading(false);
    }
  };

  const confirmQrCode = async () => {
    setIsLoading(true);
    try {
      const res = await api_confirmQRCode(otp, passwordLogin);
      toast.success(t('success:success'), { containerId: TOAST_ENUM.COMMON, toastId: 'confirm-qr' });

      dispatch(
        saveUserInfo({
          ...convertUserInfo(res.data),
        }),
      );

      setOtp('');
      setPasswordLogin('');
    } catch (error: any) {
      const errType = error.response?.data?.message ?? '';
      const errMessage = getErrorMessage(errType);
      toast.error(t(errMessage), { containerId: TOAST_ENUM.COMMON, toastId: 'confirm-qr-error' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitTwoFactor = () => {
    if (tfa) {
      disableTwoFactor();
    } else {
      confirmQrCode();
    }
    resetLoginPassword();
  };

  const disableTwoFactor = async () => {
    setIsLoading(true);
    try {
      const res = await api_disable2FA(otp, passwordLogin);
      toast.success(t('success:success'), { toastId: 'disable-2fa-error-success', containerId: TOAST_ENUM.COMMON });
      await getQrCode();
      dispatch(
        saveUserInfo({
          ...convertUserInfo(res.data),
        }),
      );

      setOtp('');
      setPasswordLogin('');
    } catch (error: any) {
      const errType = error?.response?.data?.message ?? '';
      const errMessage = getErrorMessage(errType);
      toast.error(t(errMessage), { toastId: 'disable-2fa-error-notify', containerId: TOAST_ENUM.COMMON });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (passwordBody.codeOtp?.length === 6) {
      handleSubmitPassword();
    }
  }, [passwordBody.codeOtp]);

  useEffect(() => {
    if (isRestricting) {
      handleSubmitPassword();
    }
  }, [isRestricting]);

  const onChangePassword = async () => {
    dispatch(changeIsShowAccountRestriction(true));
  };

  const handleSubmitPassword = async () => {
    if (tfa && !passwordBody.codeOtp) {
      setOpenModalCode(true);
      return;
    }
    setIsLoading(true);
    if (!passwordBody.oldPassword || !passwordBody.newPassword || !passwordBody.confirmNewPassword) {
      toast.error(t('errors:emptyFields'), { containerId: TOAST_ENUM.COMMON, toastId: 'security-error' });
      return;
    }
    try {
      const res = await api_changePassword(
        passwordBody.oldPassword,
        passwordBody.newPassword,
        passwordBody.confirmNewPassword,
        passwordBody.codeOtp,
      );
      toast.success(t('setting:passwordChanged'), { containerId: TOAST_ENUM.COMMON, toastId: 'security-success' });
      setTimeout(() => {
        setOpenModalCode(false);

        onLogout();
        dispatch(changeIsRestricting(false));
        dispatch(changeAuthenticationType(AuthenticationModeEnum.SIGN_IN));
        dispatch(changeIsShowAuthenticationModal(true));
      }, 5000);
    } catch (error: any) {
      const errType = error?.response?.data?.message ?? '';
      const errMessage = getErrorMessage(errType);
      toast.error(t(errMessage), { containerId: TOAST_ENUM.COMMON, toastId: 'security-error' });
      handleChangePassword('', 'codeOtp');
      dispatch(changeIsRestricting(false));
      if (tfa) setOpenModalCode(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangePassword = (value: string, key: string) => {
    setPasswordBody((pre) => ({
      ...pre,
      [key]: value,
    }));
  };

  return (
    <>
      {isLoading && <Loader />}
      <div className="grid grid-cols-1 lg:grid-cols-2 lg:py-4">
        {isSetLogin && (
          <form
            className={cn(
              'flex-1 flex flex-col items-start gap-[12px] w-full',
              'border border-solid border-transparent border-b-color-card-body-hover border-r-transparent lg:border-b-transparent lg:border-r-color-card-body-hover',
              {
                'p-4 pr-8': showChatType,
                'p-4 pr-8 2xl:p-[40px]': !showChatType,
              },
            )}
          >
            <Disclosure defaultOpen={true}>
              {({ open }) => (
                <div className="w-full">
                  <Disclosure.Button className="flex justify-between w-full py-2 pointer-events-auto sm:pointer-events-none">
                    <div className="mb-2 font-semibold text-default">{t('setting:changePassword')}</div>
                    <ChevronUpIcon className={`${open ? 'rotate-180 transform' : ''} h-5 w-5 sm:hidden block`} />
                  </Disclosure.Button>
                  <Transition
                    enter="transition duration-100 ease-out"
                    enterFrom="transform scale-95 opacity-0"
                    enterTo="transform scale-100 opacity-100 w-full"
                    leave="transition duration-75 ease-out"
                    leaveFrom="transform scale-100 opacity-100 w-full"
                    leaveTo="transform scale-95 opacity-0"
                  >
                    <Disclosure.Panel className={'flex flex-col gap-[20px] w-full'}>
                      <div className="flex flex-col items-start gap-[10px]">
                        <label className="dark:text-color-text-primary text-color-light-text-primary text-des">
                          {t('setting:oldPassword')}
                        </label>
                        <InputPassword
                          customClass="rounded-default w-full dark:!bg-color-input-primary !text-default placeholder:text-default placeholder:text-color-text-primary"
                          name="oldPassword"
                          placeholder={`${t('setting:oldPassword')}`}
                          value={passwordBody?.oldPassword}
                          onChange={(e) => handleChangePassword(e.target.value, 'oldPassword')}
                          control={control}
                          isAutoComplete="on"
                          isAutoFocus={true}
                        />
                      </div>
                      <div className="flex flex-col items-start gap-[10px]">
                        <label className="dark:text-color-text-primary text-color-light-text-primary text-des">
                          {t('setting:newPassword')}
                        </label>
                        <InputPassword
                          customClass="rounded-default w-full dark:!bg-color-input-primary !text-default placeholder:text-default placeholder:text-color-text-primary"
                          name="newPassword"
                          placeholder={`${t('setting:newPassword')}`}
                          value={passwordBody?.newPassword}
                          onChange={(e) => handleChangePassword(e.target.value, 'newPassword')}
                          control={control}
                        />
                      </div>
                      <div className="flex flex-col items-start gap-[10px]">
                        <label className="dark:text-color-text-primary text-color-light-text-primary text-des">
                          {t('setting:confirmNewPassword')}
                        </label>
                        <InputPassword
                          customClass="rounded-default w-full dark:!bg-color-input-primary !text-default placeholder:text-default placeholder:text-color-text-primary"
                          name="confirmNewPassword"
                          placeholder={`${t('setting:confirmNewPassword')}`}
                          value={passwordBody?.confirmNewPassword}
                          onChange={(e) => handleChangePassword(e.target.value, 'confirmNewPassword')}
                          control={control}
                        />
                      </div>
                      <div className="text-start text-[12px] text-color-primary flex gap-[5px]">
                        <InfoCircle size={16} /> {t('setting:reLoginWillBeRequiredAfterChangingThePassword')}
                      </div>
                      <div
                        onClick={onChangePassword}
                        role="button"
                        className="bg-gradient-btn-play shadow-bs-btn hover:opacity-[0.9] rounded-default text-white text-default px-[30px] py-[10px] m-auto"
                      >
                        {t('setting:saveChanges')}
                      </div>
                    </Disclosure.Panel>
                  </Transition>
                </div>
              )}
            </Disclosure>
          </form>
        )}

        {!isSetLogin && (
          <form
            className={cn(
              'flex-1 flex flex-col items-start gap-[12px] w-full',
              'border border-solid border-transparent border-b-color-card-body-hover border-r-transparent lg:border-b-transparent lg:border-r-color-card-body-hover',
              {
                'p-4 pr-8': showChatType,
                'p-4 pr-8 2xl:p-[40px]': !showChatType,
              },
            )}
          >
            <Disclosure defaultOpen={true}>
              {({ open }) => (
                <div className="w-full">
                  <Disclosure.Button className="flex justify-between w-full py-2 pointer-events-auto sm:pointer-events-none">
                    <div className="font-semibold text-default">{t('setting:setLoginPassword')}</div>
                    <ChevronUpIcon className={`${open ? 'rotate-180 transform' : ''} h-5 w-5 sm:hidden block`} />
                  </Disclosure.Button>
                  <Transition
                    enter="transition duration-100 ease-out"
                    enterFrom="transform scale-95 opacity-0"
                    enterTo="transform scale-100 opacity-100 w-full"
                    leave="transition duration-75 ease-out"
                    leaveFrom="transform scale-100 opacity-100 w-full"
                    leaveTo="transform scale-95 opacity-0"
                  >
                    <Disclosure.Panel className={'flex flex-col gap-[20px] w-full'}>
                      <div className="flex flex-col items-start gap-[10px] mt-2">
                        <InputPassword
                          customClass="rounded-default w-full dark:!bg-color-input-primary !text-default placeholder:text-default placeholder:text-color-text-primary"
                          name="oldPassword"
                          placeholder={`${t('setting:passwordPlaceholder')}`}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          control={control}
                        />
                      </div>
                      <div
                        onClick={setLoginPassword}
                        role="button"
                        className="bg-gradient-btn-play shadow-bs-btn hover:opacity-[0.9] rounded-default text-white text-default px-[30px] py-[10px] m-auto"
                      >
                        {t('setting:confirm')}
                      </div>
                    </Disclosure.Panel>
                  </Transition>
                </div>
              )}
            </Disclosure>
          </form>
        )}
        <div
          className={cn('flex-1 flex flex-col items-start gap-[12px] w-full', {
            'p-4 pl-8': showChatType,
            'p-4 pl-8 2xl:p-[40px]': !showChatType,
          })}
        >
          <Disclosure defaultOpen={true}>
            {({ open }) => (
              <div className="w-full">
                <Disclosure.Button className="flex justify-between w-full py-2 pointer-events-auto sm:pointer-events-none">
                  <div className="font-semibold text-default">{t('setting:twoFactorAuthentication')}</div>
                  <ChevronUpIcon className={`${open ? 'rotate-180 transform' : ''} h-5 w-5 sm:hidden block`} />
                </Disclosure.Button>
                <Transition
                  enter="transition duration-100 ease-out"
                  enterFrom="transform scale-95 opacity-0"
                  enterTo="transform scale-100 opacity-100 w-full"
                  leave="transition duration-75 ease-out"
                  leaveFrom="transform scale-100 opacity-100 w-full"
                  leaveTo="transform scale-95 opacity-0"
                >
                  <Disclosure.Panel className={'flex flex-col gap-[20px] w-full'}>
                    {tfa ? (
                      <>
                        <div className="text-start text-des dark:text-color-text-primary text-color-light-text-primary">
                          <p>{t('setting:disableTwoFactor')}</p>
                          <p className="mt-3">{t('setting:loginPassword')}</p>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="text-start text-des dark:text-color-text-primary text-color-light-text-primary">
                          {t('setting:downloadAndInstall')} &nbsp;
                          <a
                            className="!underline"
                            href="https://support.google.com/accounts/answer/1066447?hl=en&rd=1"
                            target="_blank"
                          >
                            {t('setting:googleAuthenticator')}
                          </a>
                          &nbsp;
                          {t('setting:enableTwoFactor')}
                        </div>
                        <div className="text-start text-des dark:text-color-text-primary text-color-light-text-primary flex gap-[5px]">
                          {t('setting:scanTheQRCode')}
                        </div>
                        <div className="flex justify-center">
                          <Image height={100} width={100} src={qrCode} alt="qrcode" />
                        </div>
                        <div className="flex items-center justify-center gap-4 align-middle sm:gap-8">
                          <Link
                            target="_blank"
                            className="flex gap-1 items-center bg-color-card-header-active rounded-[7px] pl-2 pr-5 py-[6px] w-[170px]"
                            href="https://apps.apple.com/app/google-authenticator/id388497605"
                          >
                            <Image height={48} width={48} src="/img/app_store.png" alt="app_store" />
                            <p className="text-white">App Store</p>
                          </Link>
                          <Link
                            target="_blank"
                            className="flex gap-1 items-center bg-color-card-header-active rounded-[7px] pl-2 pr-5 py-[6px] w-[170px]"
                            href="https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2"
                          >
                            <Image
                              height={40}
                              width={40}
                              src="/img/google_play.png"
                              className="w-12 h-12"
                              alt="google_play"
                            />
                            <p className="text-white">Google Play</p>
                          </Link>
                        </div>
                        <div className="flex flex-col items-start gap-[10px]">
                          <label className="dark:text-color-text-primary text-color-light-text-primary text-des">
                            {t('setting:yourSecretKey')}
                          </label>
                          <div className="dark:bg-color-input-primary bg-color-light-input-primary rounded-default flex items-center px-[10px] py-[10px] gap-[18px] text-default w-full">
                            <input
                              value={secret}
                              className={cn(
                                'w-full dark:bg-color-input-primary bg-color-light-input-primary focus:outline-none text-des dark:text-white text-black',
                              )}
                            />
                            <Copy onClick={() => copyClipBoard(String(secret))} className="text-color-text-primary" />
                          </div>
                        </div>
                        <div className="text-start text-des dark:text-color-text-primary text-color-light-text-primary flex gap-[5px]">
                          {t('setting:writeDownThisCode')}
                        </div>
                        <div className="flex justify-center dark:text-color-text-primary text-color-light-text-primary text-des">
                          {t('setting:2FAVerificationRequired')}
                        </div>
                        <div className="flex justify-center">
                          <OtpInput
                            value={otp}
                            onChange={handleChange}
                            numInputs={6}
                            inputStyle={
                              'bg-color-input-primary border border-1 border-color-border-primary focus:border-color-primary dark:!text-white !text-black !w-[48px] !h-[48px] !rounded-default focus:!outline-none'
                            }
                            shouldAutoFocus={false}
                            containerStyle={'gap-[4px]'}
                          />
                        </div>
                      </>
                    )}
                    <InputPassword
                      customClass="rounded-default w-full !text-default placeholder:text-default placeholder:text-color-text-primary"
                      name="password"
                      placeholder="Login Password"
                      value={passwordLogin}
                      onChange={(e) => setPasswordLogin(e.target.value)}
                      control={LoginPasswordControl}
                      isAutoComplete="new-password"
                    />
                    {tfa && (
                      <div>
                        <p className="mb-2 dark:text-color-text-primary text-color-light-text-primary text-des">
                          {t('setting:verificationCode')}
                        </p>
                        <div className="flex justify-center">
                          <OtpInput
                            value={otp}
                            onChange={handleChange}
                            numInputs={6}
                            inputStyle={
                              'bg-color-input-primary border border-1 border-color-border-primary focus:border-color-primary dark:!text-white !text-black !w-[48px] !h-[48px] !rounded-default focus:!outline-none'
                            }
                            shouldAutoFocus={false}
                            containerStyle={'gap-[4px]'}
                          />
                        </div>
                      </div>
                    )}
                    <div
                      onClick={handleSubmitTwoFactor}
                      role="button"
                      className="bg-gradient-btn-play shadow-bs-btn hover:opacity-[0.9] rounded-default text-white text-default px-[30px] py-[10px] m-auto"
                    >
                      {tfa ? t('setting:disable') : t('setting:enable')}
                    </div>
                  </Disclosure.Panel>
                </Transition>
              </div>
            )}
          </Disclosure>
        </div>
      </div>
      {openModalCode && (
        <ModalEnterCodeSecurity
          value={passwordBody}
          onChange={handleChangePassword}
          show={openModalCode}
          email={email}
          onClose={() => {
            setOpenModalCode(false);
            handleChangePassword('', 'codeOtp');
          }}
        />
      )}
    </>
  );
};

const SettingSecurityAuth = withAuth(SettingSecurity);

SettingSecurityAuth.getLayout = function getLayout(page: ReactElement) {
  return <SettingLayout>{page}</SettingLayout>;
};

export default SettingSecurityAuth;
