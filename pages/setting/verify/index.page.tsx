import cn from 'classnames';
import { Clock, Edit } from 'iconsax-react';
import Image from 'next/image';
import { ReactElement, useRef, useState } from 'react';
import { shallowEqual, useSelector } from 'react-redux';

import { useTranslation } from '@/base/config/i18next';
import { KYC_ENUM } from '@/base/constants/common';
import { AppState } from '@/base/redux/store';
import Loader from '@/components/common/preloader/loader';
import withAuth from '@/components/hoc/withAuth';
import FaceIdIcon from '@/components/icons/FaceIdIcon';
import GovernmentCardIcon from '@/components/icons/GovernmentCardIcon';
import SettingLayout from '@/components/layouts/setting.layout';
import ModalVerificationUploadCard from '@/components/modal/verification/verificationUpload';

const SettingVerify = () => {
  const { t } = useTranslation('');
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [accessTokenFacia, setAccessTokenFacia] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [iframeData, setIframeData] = useState({
    liveness_url: '',
    reference_id: '',
    callback_url: '',
    customer_id: '',
    customer_email: '',
    redirect_url: '',
  });
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const iframeRef = useRef();

  const { isKyc } = useSelector(
    (state: AppState) => ({
      userId: state.auth.user.userId,
      email: state.auth.user.email,
      isKyc: state.auth.user.isKyc,
    }),
    shallowEqual,
  );

  return (
    <>
      {isLoading && <Loader />}
      <div className="flex flex-col md:gap-[20px] gap-[10px] text-color-light-text-primary dark:text-[#C2C2C2] md:mt-0 mt-[30px]">
        <div className="text-start border-b border-solid border-gray-600 pb-2">
          <div className="dark:text-white text-black font-[500] mb-1">{t('setting:verifySetup')}</div>
          <div className="dark:text-color-text-primary text-gray-500 text-[14px] font-[300]">
            {t('setting:toServeYouBetter')}
          </div>
        </div>

        {isKyc === KYC_ENUM.REJECT && (
          <div className="dark:text-red-500 text-red-500">{t('setting:verificationRejected')}</div>
        )}

        <div className="flex sm:flex-row flex-col items-start gap-[20px] text-color-text-primary">
          <div className="rounded-lg flex flex-col items-center flex-1 p-[20px] gap-[12px] w-full bg-color-card-bg-default">
            {(isKyc === KYC_ENUM.REQUIRED || isKyc === KYC_ENUM.REJECT) && (
              <>
                <div className="dark:text-white text-black">{t('setting:basicVerification')}</div>
                <div className="flex flex-col items-start justify-start w-full gap-[10px] font-[300] text-[14px] dark:text-color-text-primary text-gray-500 ">
                  <div className="flex items-center gap-2">
                    <Edit size={16} />
                    {t('setting:personalInformation')}
                  </div>
                  <div className="flex items-center gap-2">
                    <FaceIdIcon width={16} />
                    {t('setting:facialVerification')}
                  </div>
                  <div className="flex items-center gap-2">
                    <GovernmentCardIcon width={16} />
                    {t('setting:governmentID')}
                  </div>
                </div>
                <button
                  className={cn(
                    'bg-gradient-btn-play shadow-bs-btn w-full p-2 rounded-default dark:text-white text-black text-[14px] mt-2',
                  )}
                  onClick={() => setShowVerificationModal(true)}
                >
                  {t('setting:verifyNow')}
                </button>
                <div className="flex items-center justify-center w-full gap-1 text-[12px] font-[300]">
                  <Clock size={15} />
                  {t('setting:reviewTime')}
                </div>
              </>
            )}
            {isKyc === KYC_ENUM.APPROVE && (
              <>
                <div className="dark:text-white text-black">{t('setting:verificationVerified')}</div>
                <Image src={'/img/APPROVE.png'} alt="APPROVE" width={100} height={116} />
              </>
            )}
            {isKyc === KYC_ENUM.PENDING && (
              <>
                <div className="dark:text-white text-black">{t('setting:verificationPending')}</div>
                <Image src={'/img/PENDING.png'} alt="PENDING" width={100} height={116} />
              </>
            )}
          </div>
        </div>
      </div>
      {showVerificationModal && (
        <ModalVerificationUploadCard show={showVerificationModal} onClose={() => setShowVerificationModal(false)} />
      )}
      {/* {modalIsOpen && (
        <CommonModal
          show={modalIsOpen}
          onClose={() => {
            setModalIsOpen(false);
            handleGetLivenessStatus();
          }}
          panelClass={'!h-[80vh]'}
        >
          <iframe
            className="h-full rounded"
            title="Verification Modal Iframe"
            src={iframeData.liveness_url}
            allow="camera;microphone"
          />
        </CommonModal>
      )} */}
    </>
  );
};

const SettingVerifyAuth = withAuth(SettingVerify);

SettingVerifyAuth.getLayout = function getLayout(page: ReactElement) {
  return <SettingLayout>{page}</SettingLayout>;
};

export default SettingVerifyAuth;
