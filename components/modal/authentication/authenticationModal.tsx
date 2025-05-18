import { DialogProps, TransitionRootProps } from '@headlessui/react';
import cn from 'classnames';
import { ArrowLeft2 } from 'iconsax-react';
import Image from 'next/image';
import { ElementType, useCallback, useState } from 'react';
import { shallowEqual, useSelector } from 'react-redux';

import { useTranslation } from '@/base/config/i18next';
import { useHeight } from '@/base/hooks/useHeight';
import { AppState } from '@/base/redux/store';
import { AuthenticationModeEnum } from '@/base/types/common';
import LoginWallet from '@/components/loginWallet/loginWallet';

import CommonModal from '../commonModal/commonModal';
import ModalForgotPassword from '../forgotPassword/forgotPassword';
import SignInTab from './signInTab/signInTab';
import SignUpTab from './signUpTab/signUpTab';
import VerificationTab from './verificationTab/verificationTab';

type ModalAuthenticationProps = {
  onClose: () => void;
  show: boolean;
} & TransitionRootProps<ElementType> &
  DialogProps<ElementType>;

export default function ModalAuthentication({ show, onClose }: ModalAuthenticationProps) {
  const { t } = useTranslation('');
  const [isLoginTwoFactor, setIsLoginTwoFactor] = useState<boolean>(false);
  const [forgotKey, setForgotKey] = useState<boolean>(false);
  const height = useHeight();

  const { authenticationType, email } = useSelector(
    (state: AppState) => ({
      authenticationType: state.modal.authenticationType,
      email: state.auth.user.email,
    }),
    shallowEqual,
  );

  const returnForm = useCallback(() => {
    switch (authenticationType) {
      case AuthenticationModeEnum.SIGN_IN:
        return (
          <div>
            {forgotKey ? null : isLoginTwoFactor ? (
              <div className="flex gap-3 items-center text-color-light-text-primary dark:text-white font-bold text-[16px] ">
                <ArrowLeft2 className="cursor-pointer" onClick={() => setIsLoginTwoFactor(false)} size="16" />
                <div className="">{t('authentication:googleSecurity2FA')}</div>
              </div>
            ) : (
              <div className="font-semibold text-[14px] sm:text-[16px] text-color-light-text-primary dark:text-white">
                {t('authentication:welcomeBack')}
              </div>
            )}
            <SignInTab
              setForgotKey={setForgotKey}
              forgotKey={forgotKey}
              isLoginTwoFactor={isLoginTwoFactor}
              setIsLoginTwoFactor={setIsLoginTwoFactor}
              email={email}
            />
          </div>
        );

      case AuthenticationModeEnum.SIGN_UP:
        return (
          <div>
            <div className="font-bold text-[14px] sm:text-[16px] text-color-light-text-primary dark:text-white">
              {t('authentication:signUp')}
            </div>
            <SignUpTab onClose={onClose} />
          </div>
        );
      case AuthenticationModeEnum.FORGOT_PASS:
        return (
          <>
            <ModalForgotPassword />
          </>
        );
      case AuthenticationModeEnum.VERIFY:
        return <VerificationTab />;
      default:
        break;
    }
  }, [authenticationType, forgotKey, isLoginTwoFactor, email]);

  return (
    <>
      <CommonModal show={show} onClose={onClose} isShowCloseButton={forgotKey ? false : true}>
        <div className="flex sm:flex-row flex-col overflow-y-auto dark:bg-color-modal-bg-primary bg-color-light-modal-bg-primary sm:max-h-[650px] h-[100vh]">
          <div
            className={cn(
              'sm:flex-1 relative pt-[30px] flex flex-col justify-center',
              'bg-[#1B1C20] sm:bg-[#000] sm:bg-gradient-to-b sm:from-[#000] sm:via-[#1F1F22] sm:to-[#000] sm:from-0% sm:via-50% sm:to-75%',
            )}
          >
            <Image
              width={401}
              height={600}
              src="/img/auth/background.png"
              alt="background"
              className="sm:w-[400px] sm:brightness-75 object-cover w-full"
            />
            <div className="absolute sm:bottom-[50px] bottom-[10px] top-[30px] text-center w-full flex flex-col gap-[10px] sm:justify-between">
              <p className="text-[15px] sm:text-[24px] text-color-primary font-semibold">{t('homePage:welcomeTo')}</p>
              <Image
                width={401}
                height={600}
                src="/img/auth/logo.png"
                alt="logo"
                className="w-[100px] sm:w-[160px] md:w-[264px] object-cover m-auto"
              />
              <p
                className={`${height < 640 ? 'hidden' : ''
                  } px-5 text-[15px] sm:text-[28px] text-color-primary font-semibold`}
              >
                {t('homePage:startJourney')}
              </p>
            </div>
          </div>
          <div
            className={`sm:py-[20px] pt-[10px] pb-[20px] sm:pb-[75px] sm:px-[30px] px-[10px] mx-auto flex-1 ${height < 640 ? 'overflow-hidden' : 'overflow-y-auto'
              } w-full flex flex-col ${forgotKey ? 'justify-start' : 'justify-start'}`}
          >
            {returnForm()}
            {!isLoginTwoFactor && authenticationType != AuthenticationModeEnum.VERIFY && (
              <LoginWallet onClose={onClose} />
            )}
          </div>
        </div>
      </CommonModal>
    </>
  );
}
