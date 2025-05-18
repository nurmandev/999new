import { DialogProps, TransitionRootProps } from '@headlessui/react';
import Image from 'next/image';
import { ElementType, useState } from 'react';
import { toast } from 'react-toastify';
import { OtpInput } from 'reactjs-otp-input';

import api from '@/api/api';
import { useTranslation } from '@/base/config/i18next';
import { TOAST_ENUM } from '@/base/constants/common';
import { getErrorMessage } from '@/base/libs/utils/notificationToast';
import Loader from '@/components/common/preloader/loader';

import CommonModal from '../commonModal/commonModal';

type ModalEnterCodeSecurityProps = {
  onClose: () => void;
  show: boolean;
  titleModal?: String;
  value: any;
  email?: string;
  onChange: (otp: string, key: string) => void;
} & TransitionRootProps<ElementType> &
  DialogProps<ElementType>;

export default function ModalEnterCodeSecurity({ show, onClose, value, onChange, email }: ModalEnterCodeSecurityProps) {
  const { t } = useTranslation('');
  const [forgotKey, setForgotKey] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const sendQrCodeToEmail = async () => {
    setIsLoading(true);
    try {
      const res = await api.post('auth/send-verify-qr-code', {
        email,
      });
      toast.success(res?.data?.msg, { containerId: TOAST_ENUM.COMMON });
    } catch (error: any) {
      const errType = error.response?.data?.message ?? '';
      const errMessage = getErrorMessage(errType);
      toast.error(t(errMessage), { containerId: TOAST_ENUM.COMMON });
    } finally {
      setIsLoading(false);
      onClose();
    }
  };

  return (
    <CommonModal
      show={show}
      onClose={onClose}
      isShowCloseButton={false}
      panelClass="sm:!max-w-[400px]"
      header={
        <div className="relative sm:px-[30px] px-[20px] py-[20px] dark:bg-[#25262B] bg-white">
          <div className="text-[16px] dark:text-white text-black font-[600]"></div>
        </div>
      }
    >
      <>
        {isLoading && <Loader />}
        {forgotKey ? (
          <div className="dark:bg-[#25262B] bg-white text-[16px]">
            <div className="flex items-center justify-center h-[140px] dark:text-[#98A7b5] text-[#31373d] px-4">
              {t('setting:2FASentEmail')}
            </div>
            <div className="flex items-center p-10 pt-0 gap-4 mt-[20px]">
              <div
                onClick={onClose}
                role="button"
                className="bg-[#F61B4F] grow hover:opacity-[0.9] rounded-[5px] text-center text-white text-[14px] px-[30px] py-[10px] m-auto"
              >
                {t('setting:cancel')}
              </div>
              <div
                onClick={sendQrCodeToEmail}
                role="button"
                className="bg-gradient-btn-play shadow-bs-btn grow hover:opacity-[0.9] text-center rounded-[5px] text-white text-[14px] px-[30px] py-[10px] m-auto"
              >
                {t('setting:confirm')}
              </div>
            </div>
          </div>
        ) : (
          <div className="dark:bg-[#25262B] bg-white p-5 text-[14px] dark:text-[#99a4b099] text-[#5f6975cc]">
            <div className="flex justify-center mb-[20px]">
              <Image width={88} height={100} src="./img/page/judge.png" className="w-[88px] h-[100px]" alt="judge" />
            </div>
            <div className="text-center">
              {t('setting:pleaseEnterGoogle')} <br /> {t('setting:secutiry2FAKey')}
            </div>
            <div className="flex flex-col items-center gap-[10px] mt-[20px]">
              <p className="mb-2">{t('setting:googleSecurity2FA')}</p>
              <OtpInput
                value={value.codeOtp || ''}
                onChange={(otp) => onChange(otp, 'codeOtp')}
                numInputs={6}
                inputStyle={
                  'bg-color-input-primary dark:text-white text-black !w-[48px] h-[48px] rounded-[5px] focus:outline-none'
                }
                containerStyle={'gap-[4px]'}
              />
            </div>
            <div
              onClick={() => setForgotKey(true)}
              className="text-center text-[#3BC117] mt-8 hover:underline cursor-pointer"
            >
              {t('setting:lostSecutiry2FAKey')}
            </div>
          </div>
        )}
      </>
    </CommonModal>
  );
}
