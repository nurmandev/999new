import { DialogProps, TransitionRootProps } from '@headlessui/react';
import { ElementType } from 'react';

import { useTranslation } from '@/base/config/i18next';

import CommonModal from '../commonModal/commonModal';

type ModalReferralTermProps = {
  onClose: () => void;
  show: boolean;
} & TransitionRootProps<ElementType> &
  DialogProps<ElementType>;

export default function ModalReferralTerm({ show, onClose }: ModalReferralTermProps) {
  const { t } = useTranslation('');

  return (
    <>
      <CommonModal
        show={show}
        onClose={onClose}
        panelClass="sm:rounded sm:max-w-[450px]"
        header={
          <div className="modal-header">
            {t('affiliate:referralTermsConditions')}
          </div>
        }
      >
        <div className="px-[15px] py-6 overflow-y-auto text-[14px] font-[300] text-[#98a7b5]">
          <pre className="whitespace-pre-line">
            <span>{t('referralTerms:supported')}</span>
          </pre>
          <pre className="whitespace-pre-line mt-5">
            <span>{t('referralTerms:description1')}</span>
            <span>{t('referralTerms:description2')}</span>
            <span>{t('referralTerms:description3')}</span>
          </pre>
          <pre className="whitespace-pre-line mt-2">
            <ul className="list-decimal pl-6">
              <li>{t('referralTerms:agreement1')}</li>
              <li>{t('referralTerms:agreement2')}</li>
              <li>{t('referralTerms:agreement3')}</li>
            </ul>
          </pre>
          <pre className="whitespace-pre-line mt-5">
            <span>{t('referralTerms:description4')}</span>
            <span>{t('referralTerms:description5')}</span>
          </pre>
        </div>
      </CommonModal>
    </>
  );
}
