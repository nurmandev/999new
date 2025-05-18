import { Dialog, DialogProps, Transition, TransitionRootProps } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { ElementType, Fragment, useRef } from 'react';

import { useTranslation } from '@/base/config/i18next';

import CommonModal from '../commonModal/commonModal';

type ChatRulesProps = {
  onClose: () => void;
  show: boolean;
} & TransitionRootProps<ElementType> &
  DialogProps<ElementType>;

export default function ModalChatRules({ show, onClose }: ChatRulesProps) {
  const { t } = useTranslation('');
  return (
    <CommonModal
      show={show}
      onClose={onClose}
      header={
        <div className="modal-header">
          <div className="font-semibold dark:text-white text-black text-[16px] sm:text-[18px]">
            {t('chat:chatRules')}
          </div>
        </div>
      }
    >
      <div className="overflow-y-auto p-8">
        <div className="flex flex-col text-default">
          <p className="mt-3">{t('chat:chatRules1')}</p>
          <p className="mt-3">{t('chat:chatRules2')}</p>
          <p className="mt-3">{t('chat:chatRules3')}</p>
          <p className="mt-3">{t('chat:chatRules4')}</p>
          <p className="mt-3">{t('chat:chatRules5')}</p>
          <p className="mt-3">{t('chat:chatRules6')}</p>
          <p className="mt-8">{t('chat:chatNote')}</p>
        </div>
      </div>
    </CommonModal>
  );
}
