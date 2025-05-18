import { DialogProps, TransitionRootProps } from '@headlessui/react';
import { ElementType } from 'react';

import { useTranslation } from '@/base/config/i18next';
import RolloverPageAuth from '@/base/pages/rollover/index.page';

import CommonModal from '../commonModal/commonModal';

type RolloverProps = {
  onClose: () => void;
  show: boolean;
} & TransitionRootProps<ElementType> &
  DialogProps<ElementType>;

export default function ModalRollover({ show, onClose }: RolloverProps) {
  const { t } = useTranslation('');
  return (
    <CommonModal
      show={show}
      onClose={onClose}
      panelClass="sm:w-[90%] max-w-[900px] sm:!h-[90vh] sm:min-h-[90vh] sm:my-0"
      header={
        <>
          <div className="flex flex-col items-start modal-header gap-[20px]">
            <div className="text-black dark:text-white md:text-[18px] text-[16px] sm:mb-0 mb-[10px] font-bold">
              {t('sidebar:rolloverOverview')}
            </div>
          </div>
        </>
      }
    >
      <div className="overflow-y-auto sm:p-5 sm:pt-6 px-3 pb-[80px] max-h-full">
        <RolloverPageAuth />
      </div>
    </CommonModal>
  );
}
