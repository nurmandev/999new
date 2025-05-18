import { DialogProps, TransitionRootProps } from '@headlessui/react';
import Image from 'next/image';
import { ElementType } from 'react';

import { useTranslation } from '@/base/config/i18next';
import { changeIsRestricting } from '@/base/redux/reducers/common.reducer';
import { useAppDispatch } from '@/base/redux/store';

import CommonModal from '../commonModal/commonModal';

type AccountRestrictionProps = {
  onClose: () => void;
  show: boolean;
} & TransitionRootProps<ElementType> &
  DialogProps<ElementType>;

export default function ModalAccountRestriction({ show, onClose }: AccountRestrictionProps) {
  const { t } = useTranslation('');
  const dispatch = useAppDispatch();
  return (
    <CommonModal show={show} onClose={onClose} panelClass="sm:!max-w-[420px]">
      <div className="overflow-y-auto sm:p-5 sm:pt-6 px-3 pb-[80px]">
        <div className="flex flex-col items-center justify-center text-center">
          <Image src="/img/check-shield.png" width={301} height={277} alt="account" className="w-[150px] h-[138px]" />
          <p className="font-bold text-[24px]">{t('withdraw:accountRestriction')}</p>
          <div
            className="text-color-text-primary mt-[20px]"
            dangerouslySetInnerHTML={{ __html: String(t('withdraw:accountRestrictionDescription')) }}
          />
          <div className="grid grid-cols-2 gap-[20px] w-full mt-[20px]">
            <div
              role="button"
              className="w-full py-[10px] text-center bg-gradient-btn-play shadow-bs-btn  rounded-default"
              onClick={() => onClose()}
            >
              {t('button:cancel')}
            </div>
            <div
              role="button"
              className="w-full py-[10px] text-center bg-color-hover-primary rounded-default"
              onClick={() => {
                dispatch(changeIsRestricting(true));
                onClose();
              }}
            >
              {t('button:continue')}
            </div>
          </div>
        </div>
      </div>
    </CommonModal>
  );
}
