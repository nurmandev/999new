import { Disclosure, Transition } from '@headlessui/react';
import { ChevronUpIcon } from '@heroicons/react/24/outline';
import { yupResolver } from '@hookform/resolvers/yup';
import cn from 'classnames';
import { TickCircle } from 'iconsax-react';
import { useTheme } from 'next-themes';
import { ReactElement, useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import PhoneInput from 'react-phone-number-input';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import * as yup from 'yup';

import { api_sendMailToUser, api_sendSMSToUser } from '@/api/auth';
import { useTranslation } from '@/base/config/i18next';
import { TOAST_ENUM } from '@/base/constants/common';
import { COUNTRY_CALLING_CODES } from '@/base/constants/countryCallingCode';
import { isPhone } from '@/base/libs/utils';
import { getErrorMessage } from '@/base/libs/utils/notificationToast';
import { saveVerifyInfo } from '@/base/redux/reducers/auth.reducer';
import { changeIsShowVerifyMailAndPhone, changeVerifyMode } from '@/base/redux/reducers/modal.reducer';
import { AppState } from '@/base/redux/store';
import { VerifyModeEnum } from '@/base/types/common';
import Loader from '@/components/common/preloader/loader';
import withAuth from '@/components/hoc/withAuth';
import { InputPhoneNumber } from '@/components/input/typing';
import InputText from '@/components/input/typing/InputText';
import SettingLayout from '@/components/layouts/setting.layout';

import styles from './index.module.scss';

type VerificationEmailForm = {
  email: string;
};

type VerificationPhoneNumberForm = {
  phoneNumber: string;
};

type confirmCodeForm = {
  code: string;
};

const SettingEmail = () => {
  const dispatch = useDispatch();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { t } = useTranslation('');
  const { theme } = useTheme();

  const [emailInput, setEmailInut] = useState('');

  const [countryCallingCode, setCountryCallingCode] = useState<(typeof COUNTRY_CALLING_CODES)[number]>();
  const [phoneInput, setPhoneInput] = useState('');

  const { email, phone, emailVerified, phoneVerified, showChatType } = useSelector(
    (state: AppState) => ({
      phone: state.auth.user.phone,
      email: state.auth.user.email,
      emailVerified: state.auth.user.verifiedSetting.emailVerified,
      phoneVerified: state.auth.user.verifiedSetting.phoneVerified,
      showChatType: state.modal.showChatType,
    }),
    shallowEqual,
  );

  const verificationEmailSchema = yup.object().shape({
    email: yup.string().required(String(t('authentication:email&emailRequired'))),
  });

  const verificationPhoneNumberSchema = yup.object().shape({
    phoneNumber: yup.string().required(String(t('deposit:phoneRequired'))),
  });

  const confirmPhoneNumberSchema = yup.object().shape({
    code: yup.string().required(String(t('deposit:currencyRequired'))),
  });

  const { control: verificationEmailControl, setValue: setEmailValue } = useForm<VerificationEmailForm>({
    resolver: yupResolver(verificationEmailSchema),
  });

  const { control: verificationPhoneNumberControl, setValue: setPhoneValue } = useForm<VerificationPhoneNumberForm>({
    resolver: yupResolver(verificationPhoneNumberSchema),
  });

  const { control: confirmPhoneNumberControl } = useForm<confirmCodeForm>({
    resolver: yupResolver(confirmPhoneNumberSchema),
  });

  const sendVerifyCode = async (type: VerifyModeEnum) => {
    try {
      setIsLoading(true);
      if (type === VerifyModeEnum.MAIL) {
        await api_sendMailToUser(emailInput, '');
        dispatch(saveVerifyInfo({ verifyRequest: emailInput, isPhoneVerifyRequested: false }));
      }
      if (type === VerifyModeEnum.PHONE) {
        const phoneNumber = `+${countryCallingCode?.countryCallingCode}${phoneInput}`;
        if (!isPhone(phoneNumber)) {
          toast.error(t('authentication:phoneWrong'), { containerId: TOAST_ENUM.COMMON, toastId: 'verify-error' });
          return;
        }
        await api_sendSMSToUser(phoneNumber, '');
        dispatch(saveVerifyInfo({ verifyRequest: phoneNumber, isPhoneVerifyRequested: true }));
      }
      dispatch(changeVerifyMode(type));
      dispatch(changeIsShowVerifyMailAndPhone(true));
      toast.success(t('authentication:verificationSentSuccess'), { containerId: TOAST_ENUM.COMMON, toastId: 'verify-success' });
    } catch (error: any) {
      const errType = error.response?.data?.message ?? '';
      const status = error.response?.data?.statusCode ?? '';
      const errMessage = getErrorMessage(errType);
      toast.error(t(errMessage), { containerId: TOAST_ENUM.COMMON, toastId: 'verify-error' });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setEmailInut(email);
    setEmailValue('email', email);
    setPhoneInput(phone);
    setPhoneValue('phoneNumber', phone);
  }, [email, phone]);

  return (
    <>
      {isLoading && <Loader />}
      <div className="grid grid-cols-1 lg:grid-cols-2 lg:py-4">
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
          <div className="flex-1 sm:flex hidden flex-col items-start gap-[12px] w-full">
            <div className="font-semibold text-default">{t('setting:emailVerification')}</div>
            <div className="text-start text-des text-color-light-text-primary dark:text-color-text-primary">
              {t('setting:accordingToTheSecurityPolicy')}
            </div>
            <div className="relative w-full">
              <InputText
                customClass="px-[10px] h-[51px] py-[10px] my-[10px] dark:bg-color-input-primary bg-color-light-input-primary rounded-default w-full !text-default placeholder:text-default placeholder:text-color-text-primary"
                name="email"
                placeholder={`${t('setting:emailPlaceholder')}`}
                disabled={emailVerified}
                control={verificationEmailControl}
                value={emailInput}
                onChange={(e) => setEmailInut(e.target.value)}
              />
              {emailVerified && (
                <div className="absolute right-[10px] h-[calc(100%-20px)] top-[10px] flex items-center dark:bg-color-input-primary bg-color-light-input-primary">
                  <TickCircle size="16" color="#3BC117" variant="Bold" />
                  <span className="text-color-primary text-default ml-[6px] font-bold">{t('setting:verified')}</span>
                </div>
              )}
            </div>
            {!emailVerified && (
              <div
                onClick={() => sendVerifyCode(VerifyModeEnum.MAIL)}
                role="button"
                className="bg-gradient-btn-play shadow-bs-btn hover:opacity-[0.9] rounded-default text-white text-default px-[30px] py-[10px] m-auto"
              >
                {t('setting:verify')}
              </div>
            )}
          </div>
          <Disclosure>
            {({ open }) => (
              <div className="block w-full sm:hidden">
                <Disclosure.Button className="flex justify-between w-full py-2">
                  <div className="font-semibold text-default">{t('setting:emailVerification')}</div>
                  <ChevronUpIcon className={`${open ? 'rotate-180 transform' : ''} h-5 w-5`} />
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
                    <div className="text-start text-des text-color-light-text-primary dark:text-color-text-primary">
                      {t('setting:accordingToTheSecurityPolicy')}
                    </div>
                    <div className="relative w-full">
                      <InputText
                        customClass="px-[10px] py-[10px] my-[10px] dark:bg-color-input-primary bg-color-light-text-primary rounded-default w-full !text-default placeholder:text-default placeholder:text-color-text-primary"
                        name="email"
                        disabled={!emailVerified}
                        placeholder={`${t('setting:emailPlaceholder')}`}
                        control={verificationEmailControl}
                        value={emailInput}
                        onChange={(e) => setEmailInut(e.target.value)}
                      />
                      {emailVerified && (
                        <div className="absolute right-[10px] h-[calc(100%-20px)] top-[10px] flex items-center dark:bg-color-input-primary bg-color-light-bg-primary">
                          <TickCircle size="16" color="#3BC117" variant="Bold" />
                          <span className="text-color-primary text-default ml-[6px] font-bold">
                            {t('setting:verified')}
                          </span>
                        </div>
                      )}
                    </div>
                    {!emailVerified && (
                      <div
                        onClick={() => sendVerifyCode(VerifyModeEnum.MAIL)}
                        role="button"
                        className="w-fit bg-gradient-btn-play shadow-bs-btn hover:opacity-[0.9] rounded-default text-white text-default px-[30px] py-[10px] m-auto"
                      >
                        {t('setting:verify')}
                      </div>
                    )}
                  </Disclosure.Panel>
                </Transition>
              </div>
            )}
          </Disclosure>
        </form>

        <form
          className={cn('flex-1 flex flex-col items-start gap-[12px] w-full', {
            'p-4 pl-8': showChatType,
            'p-4 pl-8 2xl:p-[40px]': !showChatType,
          })}
        >
          <div className="flex-1 sm:flex hidden flex-col items-start gap-[12px] w-full">
            <div className="font-semibold text-default">{t('setting:phoneNumber')}</div>
            <div className="text-start text-des text-color-light-text-primary dark:text-color-text-primary">
              {t('setting:verifyYourPhoneNumber')}
            </div>
            <div className="flex flex-col my-[10px] relative dark:bg-color-input-primary bg-color-light-input-primary rounded-default w-full text-default placeholder:text-default">
              {phoneVerified && (
                <InputText
                  customClass="px-[10px] h-[51px] py-[10px] dark:!bg-color-input-primary !bg-color-light-input-primary rounded-default w-full !text-default placeholder:text-default placeholder:text-color-text-primary"
                  name="phoneNumber"
                  placeholder={`${t('setting:phonePlaceholder')}`}
                  disabled={phoneVerified}
                  control={verificationPhoneNumberControl}
                  value={phoneInput}
                />
              )}
              {!phoneVerified && (
                <InputPhoneNumber
                  control={verificationPhoneNumberControl}
                  onChangeCountryCallingCode={(value) => {
                    setCountryCallingCode(value);
                  }}
                  disabled={phoneVerified}
                  customClass="px-[10px] dark:!bg-color-input-primary !bg-color-light-input-primary rounded-default w-full !text-default placeholder:text-default placeholder:text-color-text-primary"
                  onChange={(e) => setPhoneInput(e.target.value)}
                  name="phoneNumber"
                  placeholder={String(t('setting:phonePlaceholder'))}
                  autoComplete="off"
                />
              )}

              {phoneVerified && (
                <div className="absolute right-[10px] h-[calc(100%-20px)] top-[10px] flex items-center dark:bg-color-input-primary bg-color-light-bg-primary">
                  <TickCircle size="16" color="#3BC117" variant="Bold" />
                  <span className="text-color-primary text-default ml-[6px] font-bold">{t('setting:verified')}</span>
                </div>
              )}
            </div>
            {!phoneVerified && (
              <div
                onClick={() => sendVerifyCode(VerifyModeEnum.PHONE)}
                role="button"
                className="w-fit bg-gradient-btn-play shadow-bs-btn hover:opacity-[0.9] rounded-default text-white text-default px-[30px] py-[10px] m-auto"
              >
                {t('setting:confirm')}
              </div>
            )}
          </div>
          <Disclosure>
            {({ open }) => (
              <div className="block w-full sm:hidden">
                <Disclosure.Button className="flex justify-between w-full py-2">
                  <div className="font-semibold text-[14px]">{t('setting:phoneNumber')}</div>
                  <ChevronUpIcon className={`${open ? 'rotate-180 transform' : ''} h-5 w-5`} />
                </Disclosure.Button>
                <Transition
                  enter="transition duration-100 ease-out"
                  enterFrom="transform scale-95 opacity-0"
                  enterTo="transform scale-100 opacity-100 w-full"
                  leave="transition duration-75 ease-out"
                  leaveFrom="transform scale-100 opacity-100 w-full"
                  leaveTo="transform scale-95 opacity-0"
                >
                  <Disclosure.Panel className={'flex flex-col gap-[20px] w-full mb-[20px]'}>
                    <div className="text-start text-[10px] text-color-light-text-primary dark:text-color-text-primary">
                      {t('setting:verifyYourPhoneNumber')}
                    </div>
                    <Controller
                      control={verificationPhoneNumberControl}
                      name={'phoneNumber'}
                      render={({ field }) => {
                        return (
                          <div className="px-[10px] py-[10px] relative my-[10px] dark:bg-color-input-primary bg-color-light-bg-primary rounded-default w-full text-default placeholder:text-default">
                            <PhoneInput
                              className={cn(
                                'rounded-default w-full',
                                styles.phoneInput,
                                theme === 'light' && styles.phoneInputLight,
                              )}
                              name="phoneNumber"
                              international
                              disabled={phoneVerified}
                              placeholder={`${t('setting:phonePlaceholder')}`}
                              control={verificationPhoneNumberControl}
                              value={phoneInput}
                              onChange={(val) => setPhoneInput(String(val))}
                            />
                            {phoneVerified && (
                              <div className="absolute right-[10px] h-[calc(100%-20px)] top-[10px] flex items-center dark:bg-color-input-primary bg-color-light-bg-primary">
                                <TickCircle size="16" color="#3BC117" variant="Bold" />
                                <span className="text-color-primary text-default ml-[6px] font-bold">
                                  {t('setting:verified')}
                                </span>
                              </div>
                            )}
                          </div>
                        );
                      }}
                    ></Controller>
                    {!phoneVerified && (
                      <div
                        onClick={() => sendVerifyCode(VerifyModeEnum.PHONE)}
                        role="button"
                        className="w-fit bg-gradient-btn-play shadow-bs-btn hover:opacity-[0.9] rounded-default text-white text-default px-[30px] py-[10px] m-auto"
                      >
                        {t('setting:confirm')}
                      </div>
                    )}
                  </Disclosure.Panel>
                </Transition>
              </div>
            )}
          </Disclosure>
        </form>
      </div>
    </>
  );
};

const SettingEmailAuth = withAuth(SettingEmail);

SettingEmailAuth.getLayout = function getLayout(page: ReactElement) {
  return <SettingLayout>{page}</SettingLayout>;
};

export default SettingEmailAuth;
