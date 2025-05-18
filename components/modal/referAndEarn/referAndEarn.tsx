import { DialogProps, TransitionRootProps } from '@headlessui/react';
import Image from 'next/image';
import Link from 'next/link';
import { ElementType } from 'react';
import { shallowEqual, useSelector } from 'react-redux';

import { useTranslation } from '@/base/config/i18next';
import { ROUTER } from '@/base/constants/common';
import { copyClipBoard } from '@/base/libs/utils';
import { AppState } from '@/base/redux/store';

import CommonModal from '../commonModal/commonModal';
import { ArrowRight2 } from 'iconsax-react';

type ModalProfileProps = {
  onClose: () => void;
  show: boolean;
} & TransitionRootProps<ElementType> &
  DialogProps<ElementType>;

export default function ModalReferAndEarn({ show, onClose }: ModalProfileProps) {
  const { t } = useTranslation('');

  const { referralCode } = useSelector(
    (state: AppState) => ({
      referralCode: state.auth.user.referralCode,
    }),
    shallowEqual,
  );

  return (
    <>
      <CommonModal
        show={show}
        onClose={onClose}
        panelClass={`max-w-full sm:max-w-[450px] sm:!h-[450px]`}
      >
        <div className="bg-gradient-card-modal h-full p-4">
          <div className="w-full text-center font-bold text-title py-4">
            {t('referAndEarn:referAFriend')}
          </div>
          <div className="flex flex-col justify-evenly gap-3 h-[calc(100%-60px)]">
            <div>
              <Image
                alt="refer-background"
                src={'/img/referModalBackground.png'}
                width={386}
                height={173}
                className="w-full object-contain rounded-xl"
              />
            </div>
            <Link
              href={ROUTER.Affiliate}
              onClick={onClose}
            >
              <div className="flex justify-center items-center gap-2 text-center text-default text-color-primary">
                {t('referAndEarn:learnMore')}
                <ArrowRight2 size={12} />
              </div>
            </Link>
            <div className="flex flex-col gap-2">
              <div className="text-[14px] text-black dark:text-white">
                {t('referAndEarn:shareYourReferralLink')}
              </div>
              <div className="flex justify-center items-center p-2 bg-[#f5f6fa] dark:bg-color-input-primary text-black dark:text-white rounded-lg">
                <div className="text-default text-center w-full">{ROUTER.REFERRAL_CODE(referralCode)}</div>
                <div
                  className="flex py-2 px-4 bg-color-primary rounded-lg justify-center items-center cursor-pointer"
                  onClick={() => copyClipBoard(ROUTER.REFERRAL_CODE(referralCode))}
                >
                  <div className="mr-[3px]">
                    <Image height={16} width={16} className="min-w-[16px] min-h-[16px]" src="/img/simcard-2.png" alt="copy" />
                  </div>
                  <div className="text-[12px] text-[#ffffff]"> {t('referAndEarn:copy')}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CommonModal>
    </>
  );
}
