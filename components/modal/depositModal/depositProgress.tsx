import { DialogProps, TransitionRootProps } from '@headlessui/react';
import { CheckIcon } from '@heroicons/react/24/outline';
import cn from 'classnames';
import { ExportSquare } from 'iconsax-react';
import Image from 'next/image';
import { ElementType, useState } from 'react';
import { shallowEqual, useSelector } from 'react-redux';

import { useTranslation } from '@/base/config/i18next';
import { changeIsShowDepositProgress } from '@/base/redux/reducers/modal.reducer';
import { AppState, useAppDispatch } from '@/base/redux/store';
import { TRANSACTION_TYPE } from '@/base/types/requestTypes';

import CommonModal from '../commonModal/commonModal';
import ModalDetailTransaction from '../transactionDetail/transactionDetail';

type ModalDepositProgressProps = {
  onClose: () => void;
  show: boolean;
} & TransitionRootProps<ElementType> &
  DialogProps<ElementType>;

export default function ModalDepositProgress({ show, onClose }: ModalDepositProgressProps) {
  const { t } = useTranslation('');
  const [isShowDetailTransaction, setIsShowDetailTransaction] = useState<boolean>(false);
  const dispatch = useAppDispatch();

  const { activeTransactionStatus } = useSelector(
    (state: AppState) => ({
      activeTransactionStatus: state.wallet.activeTransactionStatus,
    }),
    shallowEqual,
  );

  const getChainUrl = (network: string, hash: string) => {
    let url = '"';
    switch (network.toLowerCase()) {
      case 'eth':
        url = `https://etherscan.com/tx/${hash}`;
        break;
      case 'bsc':
        url = `https://bscscan.com/tx/${hash}`;
        break;
      case 'polygon':
        url = `https://polygonscan.com/tx/${hash}`;
        break;

      default:
        url = `https://etherscan.com/tx/${hash}`;
        break;
    }
    return url;
  };
  return (
    <>
      <CommonModal
        show={show}
        onClose={onClose}
        panelClass="sm:!max-w-[400px]"
        header={<div className="modal-header">{t('layout:deposit')}</div>}
      >
        <div className="flex flex-col items-center p-1 sm:px-5 sm:py-10 gap-4 mt-5 relative">
          <div
            className={cn('flex justify-center items-center w-[130px] h-[130px] rounded-full text-color-primary', {
              'animate-spin border-solid border-t-2 border-t-color-primary': activeTransactionStatus.status === 0,
              'border-solid border-2 border-color-primary': activeTransactionStatus.status === 1,
            })}
          >
            <CheckIcon width={110} className={activeTransactionStatus.status === 1 ? 'block' : 'hidden'} />
          </div>
          <Image
            src={`/img/fiats/${activeTransactionStatus.symbol}.png`}
            width={70}
            height={70}
            className={`absolute top-[34px] left-[50%] sm:top-[70px] -translate-x-[35px] ${
              activeTransactionStatus.status === 0 ? 'block' : 'hidden'
            }`}
            alt="symbol"
          />
          <div className="text-2xl text-white mt-20 font-bold text-center flex justify-center items-center">
            {activeTransactionStatus.amount} {activeTransactionStatus.symbol}
          </div>
          <div className="text-xl text-white">
            {activeTransactionStatus.status === 0 ? t('deposit:depositDetected') : t('deposit:depositCompleted')}
          </div>
          <div className="text-default text-color-text-primary text-center px-10">
            {activeTransactionStatus.status === 0
              ? t('deposit:depositDetectedDescription')
              : t('deposit:depositCompletedDescription')}
          </div>
          <div className="text-color-primary flex justify-center items-center">
            {activeTransactionStatus.status === 0 ? (
              <>
                <a
                  target="_blank"
                  href={getChainUrl(activeTransactionStatus.network, activeTransactionStatus.hash)}
                  rel="noopener noreferrer"
                >
                  <div className={`mr-1`}>{t('deposit:depositDetectedView')}</div>
                </a>
              </>
            ) : (
              <div
                className="text-color-primary mr-1 hover:cursor-pointer hover:underline"
                onClick={() => {
                  setIsShowDetailTransaction(true);
                  dispatch(changeIsShowDepositProgress(false));
                }}
              >
                {t('deposit:depositCompletedView')}
              </div>
            )}
            <ExportSquare width={18} height={18} className="w-5 h-5" />
          </div>
        </div>
      </CommonModal>
      <ModalDetailTransaction
        show={isShowDetailTransaction}
        titleModal={String(t('transaction:transactionDetail'))}
        onClose={() => {
          setIsShowDetailTransaction(false);
          dispatch(changeIsShowDepositProgress(true));
        }}
        transaction={{
          amount: activeTransactionStatus.amount,
          amountUsd: activeTransactionStatus.amountUsd,
          fee: 1,
          feeUsd: 1,
          id: activeTransactionStatus.id,
          orderId: activeTransactionStatus.id,
          status: 'complete',
          symbolId: activeTransactionStatus.symbol,
          symbolName: activeTransactionStatus.symbol,
          symbolLogo: `/img/fiats/${activeTransactionStatus.symbol}.png`,
          time: activeTransactionStatus.time,
          txId: activeTransactionStatus.hash,
          unitFee: '0.1',
          userId: 1,
          username: 'name',
          value: 1,
          type: TRANSACTION_TYPE.Deposit,
          withdrawalAddress: '0x',
        }}
        type={TRANSACTION_TYPE.Deposit}
      />
    </>
  );
}
