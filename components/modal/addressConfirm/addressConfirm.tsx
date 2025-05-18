import { DialogProps, TransitionRootProps } from '@headlessui/react';
import { ElementType } from 'react';

import { useTranslation } from '@/base/config/i18next';

import CommonModal from '../commonModal/commonModal';
import { Warning2 } from 'iconsax-react';

type ChatRulesProps = {
  onClose: () => void;
  show: boolean;
} & TransitionRootProps<ElementType> &
  DialogProps<ElementType>;

export default function ModalAddressConfirm({ show, onClose }: ChatRulesProps) {
  const { t } = useTranslation('');
  return (
    <CommonModal show={show} onClose={onClose} panelClass={`max-w-full sm:max-w-[350px]`}>
      <div className="flex flex-col items-center bg-gradient-card-modal h-full pt-10 p-6 gap-4">
        <Warning2 variant="Bulk" className="w-12 h-12 text-yellow-300" />
        <div className="text-default font-semibold">
          The address has been copied. Please make sure your address is correct when pasting it.
        </div>
        <div
          className="text-default font-semibold bg-gradient-btn-play shadow-bs-btn rounded text-center py-2 px-10 cursor-pointer"
          onClick={onClose}
        >
          {t('withdraw:confirm')}
        </div>
      </div>
    </CommonModal>
  );
}
