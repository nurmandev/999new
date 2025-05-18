import { DialogProps, TransitionRootProps } from '@headlessui/react';
import Image from 'next/image';
import { ElementType } from 'react';
import { shallowEqual, useSelector } from 'react-redux';

import { useTranslation } from '@/base/config/i18next';
import { useHeight } from '@/base/hooks/useHeight';
import { AppState } from '@/base/redux/store';

import CommonModal from '../commonModal/commonModal';

type ModalAuthenticationProps = {
  onClose: () => void;
  show: boolean;
} & TransitionRootProps<ElementType> &
  DialogProps<ElementType>;

export default function ModalSelfExclusion({ show, onClose }: ModalAuthenticationProps) {
  const { t } = useTranslation('');

  const { disabledPeriod } = useSelector(
    (state: AppState) => ({
      disabledPeriod: state.common.disabledPeriod,
    }),
    shallowEqual,
  );
  const height = useHeight();

  const headers = t('exclusion:exclusionDaysLeft').split('*');

  return (
    <>
      <CommonModal show={show} onClose={onClose} isShowCloseButton>
        <div className="flex sm:flex-row flex-col overflow-y-auto dark:bg-color-modal-bg-default bg-color-light-modal-bg-primary sm:max-h-[486px] h-[100vh]">
          <div className="relative flex flex-col justify-center">
            <Image
              width={401}
              height={486}
              src="/img/exclusion.png"
              alt="exclusion"
              className="object-cover h-[301px] sm:h-full"
            />
            <div className="absolute top-[10%] bottom-[50%] text-center w-full flex flex-col justify-center">
              {disabledPeriod !== -1 && (
                <>
                  <p className="text-[24px] sm:text-[32px] text-white font-semibold leading-none">{headers[0] || ''}</p>
                  <p className="text-[48px] sm:text-[64px] text-color-light-notice-primary font-semibold leading-none">
                    {Math.floor(((disabledPeriod || Date.now() / 1000) - Date.now() / 1000) / 24 / 60 / 60)}
                  </p>
                  <p className="text-[24px] sm:text-[32px] text-white font-semibold leading-none">{headers[1] || ''}</p>
                </>
              )}

              {disabledPeriod === -1 && (
                <p className="text-[24px] sm:text-[32px] text-white font-semibold leading-none">
                  {t('exclusion:exclusionDaysLeftPermanent')}
                </p>
              )}
            </div>
          </div>
          <div
            className={`px-9 py-11 mx-auto flex-1 ${height < 640 ? 'overflow-hidden' : 'overflow-y-auto'
              } w-full flex flex-col justify-between`}
          >
            <div>
              <p className="text-[16px] sm:text-[24px] text-white font-bold text-center">
                {t('exclusion:selfExclusion')}
              </p>
              <div className="text-[12px] sm:text-[16px] text-white leading-9 text-center">
                <span className="font-extralight">{t('exclusion:exclusionHello')}, </span>
                <span className="font-extralight">{t('exclusion:exclusionNotify1').split('*')[0] || ''}</span>
                <span className="font-extralight text-color-light-notice-primary">
                  {t('exclusion:exclusionExclude')}{' '}
                </span>
                <span className="font-extralight">{t('exclusion:exclusionNotify1').split('*')[1] || ''}</span>
              </div>
              <div className="text-[12px] sm:text-[16px] text-[#FF9E4F] font-semibold text-center leading-9">
                <span>{t('exclusion:exclusionPeriod')} </span>
              </div>
              <div className="text-[12px] sm:text-[16px] text-white font-semibold text-center leading-9 mt-5">
                <span className="font-extralight">{t('exclusion:exclusionNotify2')} </span>
                <span className="font-extralight">{t('exclusion:exclusionNotify3')} </span>
                <span className="font-extralight text-color-light-notice-primary">help@bonenza.com</span>
              </div>
            </div>
            <div className="text-center rounded-default py-3 bg-gradient-btn-play shadow-bs-btn" role="button" onClick={onClose}>
              {t('exclusion:exclusionGoBack')}
            </div>
          </div>
        </div>
      </CommonModal>
    </>
  );
}
