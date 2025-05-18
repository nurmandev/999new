import { DialogProps, TransitionRootProps } from '@headlessui/react';
import { Mobile } from 'iconsax-react';
import { ElementType, useState } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { OtpInput } from 'reactjs-otp-input';

import { api_sendMailToUser, api_sendSMSToUser, api_verifyCodeToUser } from '@/api/auth';
import { useTranslation } from '@/base/config/i18next';
import { TOAST_ENUM } from '@/base/constants/common';
import { CookiesStorage } from '@/base/libs/storage/cookie';
import { convertUserInfo } from '@/base/libs/utils';
import { getErrorMessage } from '@/base/libs/utils/notificationToast';
import { saveUserInfo } from '@/base/redux/reducers/auth.reducer';
import { changeIsShowVerifyMailAndPhone } from '@/base/redux/reducers/modal.reducer';
import { AppState } from '@/base/redux/store';
import { VerifyModeEnum } from '@/base/types/common';
import { VerifyCodeRequest } from '@/base/types/requestTypes';
import Loader from '@/components/common/preloader/loader';

import CommonModal from '../commonModal/commonModal';

type ModalVerificationMailAndPhoneProps = {
  onClose: () => void;
  show: boolean;
} & TransitionRootProps<ElementType> &
  DialogProps<ElementType>;

export default function ModalVerificationMailAndPhone({ show, onClose }: ModalVerificationMailAndPhoneProps) {
  const { t } = useTranslation('');
  const dispatch = useDispatch();

  const { verifyMode, verifyRequest, isPhoneVerifyRequested } = useSelector(
    (state: AppState) => ({
      verifyMode: state.modal.verifyModeType,
      verifyRequest: state.auth.verifyRequest,
      isPhoneVerifyRequested: state.auth.isPhoneVerifyRequested,
    }),
    shallowEqual,
  );

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [otp, setOtp] = useState('');

  const handleChange = (otp: string) => setOtp(otp);

  const sendVerifyCode = async () => {
    try {
      setIsLoading(true);
      if (isPhoneVerifyRequested) {
        await api_sendSMSToUser(verifyRequest, '');
      } else {
        await api_sendMailToUser(verifyRequest, '');
      }
      toast.success(t('authentication:verificationSentSuccess'), { containerId: TOAST_ENUM.MODAL });
    } catch (error: any) {
      const errType = error?.response?.data?.message ?? '';
      const errMessage = getErrorMessage(errType);
      toast.success(t(errMessage), { containerId: TOAST_ENUM.COMMON });
    } finally {
      setIsLoading(false);
    }
  };

  const confirmCode = async () => {
    try {
      setIsLoading(true);
      const request: VerifyCodeRequest = {
        email: !isPhoneVerifyRequested ? verifyRequest : '',
        phone: isPhoneVerifyRequested ? verifyRequest : '',
        code: otp,
        request: '',
      };
      const _res = await api_verifyCodeToUser(request);
      CookiesStorage.setAccessToken(_res.data.token);
      dispatch(
        saveUserInfo({
          ...convertUserInfo(_res.data.user),
        }),
      );
      toast.success(t('authentication:verificationSuccess', { request: isPhoneVerifyRequested ? 'Phone' : 'Email' }), {
        containerId: TOAST_ENUM.COMMON,
      });
      dispatch(changeIsShowVerifyMailAndPhone(false));
    } catch (error: any) {
      const errType = error.response?.data?.message ?? '';
      const errMessge = getErrorMessage(errType);
      toast.error(String(t(errMessge)), { containerId: TOAST_ENUM.COMMON });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <CommonModal
        show={show}
        onClose={onClose}
        panelClass="rounded !max-w-[464px] min-h-[550px]"
        header={<div className="modal-header h-[50px]"></div>}
      >
        <div className="relative px-[20px] my-[10px] bg-[#f5f6fa] dark:bg-color-modal-bg-primary">
          {isLoading && <Loader />}
          <div className="flex flex-col items-center w-full gap-[20px]">
            <div className="relative flex flex-col items-center gap-[10px] w-full">
              <Mobile className="w-[36px] h-[36px] text-color-primary/80" variant="Bold" />
              <span className="text-white text-[16px] font-bold">
                {verifyMode === VerifyModeEnum.MAIL ? t('setting:emailVerification') : t('setting:phoneVerification')}
              </span>
            </div>

            <div className="text-color-text-primary text-[14px] text-center">
              {t('setting:verifyCodeHeader', { code: verifyRequest })}
            </div>

            <div>
              <OtpInput
                isDisabled={!show}
                value={otp}
                onChange={handleChange}
                numInputs={6}
                inputStyle={
                  'dark:bg-color-input-primary border border-solid border-color-border-primary bg-[#f5f6fa] dark:!text-white !text-black !w-[44px] !h-[54px] !rounded-[5px] focus:!outline-none'
                }
                containerStyle={'gap-[10px]'}
              />
            </div>

            <div className="text-center text-color-primary">
              <div
                className="items-start text-[14px] !text-white text-start font-[400] cursor-pointer hover:underline"
                onClick={sendVerifyCode}
              >
                {t('setting:noVerifyCode')}
              </div>
            </div>

            <div className="relative w-full">
              <button
                className="w-full rounded-default bg-gradient-btn-play shadow-bs-btn py-[10px]"
                onClick={confirmCode}
              >
                {t('setting:verify')}
              </button>
            </div>
          </div>
        </div>
      </CommonModal>
    </>
  );
}
