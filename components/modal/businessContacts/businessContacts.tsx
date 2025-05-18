import { DialogProps, TransitionRootProps } from '@headlessui/react';
import { EnvelopeOpenIcon } from '@heroicons/react/24/outline';
import { ElementType, useRef } from 'react';

import { useTranslation } from '@/base/config/i18next';

import CommonModal from '../commonModal/commonModal';
import styles from './index.module.scss';
type ModalBusinessContactsProps = {
  onClose: () => void;
  show: boolean;
} & TransitionRootProps<ElementType> &
  DialogProps<ElementType>;

export default function ModalBusinessContacts({ show, onClose }: ModalBusinessContactsProps) {
  const { t } = useTranslation('');

  return (
    <>
      <CommonModal
        show={show}
        onClose={onClose}
        panelClass="sm:max-w-[464px] max-w-full sm:h-[40vh] sm:min-h-[40vh] sm:my-0"
        header={
          <div className="modal-header">
            <p className="text-[16px] dark:text-white text-black font-bold mb-2">{t('footer:getInTouch')}</p>
            <p>{t('footer:contactUs')}</p>
          </div>
        }
      >
        <div className="overflow-y-auto pt-6 px-3 pb-[80px]">
          <div>{t('footer:emailUs')}</div>
          <div
            className={`rounded-default overflow-hidden h-[52px] px-3 cursor-pointer dark:bg-color-card-bg-primary hover:bg-white bg-color-light-bg-primary flex justify-between items-center mt-3 relative`}
          >
            <div className="dark:text-white text-black">business@bonenza.com</div>
            <div className="flex items-center gap-2 text-color-primary">
              <a href="mailto:business@bonenza">{t('footer:sendNow')}</a>
              <EnvelopeOpenIcon width={16} height={14} className="" />
            </div>
          </div>
        </div>
      </CommonModal>
    </>
  );
}
