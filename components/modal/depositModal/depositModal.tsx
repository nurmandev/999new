import { DialogProps, TransitionRootProps } from '@headlessui/react';
import cn from 'classnames';
import { ElementType, useState } from 'react';

import { useTranslation } from '@/base/config/i18next';
import DepositCryptoComponent from '@/components/deposit/crypto/depositCrypto';

import CommonModal from '../commonModal/commonModal';

type ModalDepositProps = {
  onClose: () => void;
  show: boolean;
  children?: JSX.Element;
} & TransitionRootProps<ElementType> &
  DialogProps<ElementType>;

export enum DepositTabEnum {
  CRYPTO = 'CRYPTO',
  FIAT = 'FIAT',
  BUY_CRYPTO = 'BUY_CRYPTO',
}

export default function ModalDeposit({ show, onClose }: ModalDepositProps) {
  const { t } = useTranslation('');
  const [depositTab, setDepositTab] = useState<DepositTabEnum>(DepositTabEnum.CRYPTO);

  return (
    <>
      <CommonModal
        show={show}
        onClose={onClose}
        panelClass="sm:!max-w-[530px] sm:h-[90vh] sm:min-h-[90vh] sm:my-0"
        header={
          <>
            <div className="modal-header">
              <div className="text-black dark:text-white md:text-[18px] text-[16px] font-semibold">
                {t('layout:deposit')}
              </div>
            </div>
          </>
        }
      >
        <div className="overflow-y-auto pt-5 px-3 pb-[80px] sm:p-5">
          {depositTab === DepositTabEnum.CRYPTO && <DepositCryptoComponent />}
        </div>
      </CommonModal>
    </>
  );
}
