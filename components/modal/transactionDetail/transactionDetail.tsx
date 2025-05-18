import { DialogProps, TransitionRootProps } from '@headlessui/react';
import cn from 'classnames';
import { CloseCircle, Simcard2, TickCircle } from 'iconsax-react';
import Image from 'next/image';
import { ElementType, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import ReactLoading from 'react-loading';
import { shallowEqual, useSelector } from 'react-redux';

import { DATE_TIME_SUBMIT_FORMAT_WITH_SECOND, LIST_FILTER_STATUS } from '@/base/constants/common';
import {
  convertStatus,
  copyClipBoard,
  currencyFormat1,
  formatDate,
  transformUUID,
  transformWalletAddress,
} from '@/base/libs/utils';
import { AppState } from '@/base/redux/store';
import { TransactionType } from '@/base/types/common';
import { TRANSACTION_TYPE } from '@/base/types/requestTypes';

import CommonModal from '../commonModal/commonModal';

type ModalDetailTransactionProps = {
  onClose: () => void;
  show: boolean;
  transaction: TransactionType;
  titleModal?: String;
  type?: string;
} & TransitionRootProps<ElementType> &
  DialogProps<ElementType>;

export default function ModalDetailTransaction({
  show,
  onClose,
  transaction,
  titleModal,
  type,
}: ModalDetailTransactionProps) {
  const { t } = useTranslation('');

  const { activeTransactionStatus } = useSelector(
    (state: AppState) => ({
      activeTransactionStatus: state.wallet.activeTransactionStatus,
    }),
    shallowEqual,
  );

  const transactionStatus = useMemo(() => {
    if (transaction.orderId === activeTransactionStatus.id && activeTransactionStatus.status === 1) return 'complete';
    return transaction.status;
  }, [activeTransactionStatus, transaction]);

  const isProcess = useMemo(() => {
    return transactionStatus === 'processing' || transactionStatus === 'pending';
  }, [transactionStatus]);

  const isFailed = useMemo(() => {
    return transactionStatus === 'failed' || transactionStatus === 'rejected';
  }, [transactionStatus]);

  return (
    <>
      <CommonModal
        show={show}
        onClose={onClose}
        panelClass="sm:!max-w-[400px]"
        header={
          <div className="modal-header">
            <div className="text-[16px] dark:text-white text-black font-[600]">{titleModal || 'Details'}</div>
          </div>
        }
      >
        <div className=" min-h-[516px] overflow-auto h-full bg-cover p-4">
          <div className="flex flex-col items-center gap-2 py-5">
            <Image height={40} width={40} src={transaction.symbolLogo} alt="symbol" />
            <div
              className={cn('text-[22px]', {
                'text-red-500': transaction.type === TRANSACTION_TYPE.Withdraw,
                'text-color-text-green': Number(transaction?.amount) >= 0,
                'text-[#FD6E0B]': Number(transaction?.amount) < 0,
              })}
            >
              <span>
                {transaction.type === TRANSACTION_TYPE.Withdraw && (
                  <span>- {currencyFormat1(transaction.amount - transaction.fee, 6, '', false)}</span>
                )}
                {transaction.type !== TRANSACTION_TYPE.Withdraw && (
                  <span>
                    {Number(transaction?.amount) >= 0 ? '+' : ''} {currencyFormat1(transaction.amount, 6, '', false)}
                  </span>
                )}
              </span>
              <span className="ml-1 font-semibold text-black dark:text-white">{transaction.symbolName}</span>
            </div>
          </div>
          <div className="mt-5 flex flex-col gap-5  text-[14px]">
            <div className="flex items-center justify-between">
              <span className="text-color-light-text-primary dark:text-color-text-primary">
                {String(t('transaction:status'))}
              </span>
              <div className="flex items-center gap-2">
                <div
                  className={cn(`w-[8px] h-[8px] rounded-full`, {
                    'bg-color-secondary':
                      (transactionStatus?.toString() || '') === 'processing' ||
                      (transactionStatus?.toString() || '') === 'pending' ||
                      (transactionStatus?.toString() || '') === 'refunding' ||
                      (transactionStatus?.toString() || '') === 'ongoing',
                    'bg-color-red':
                      (transactionStatus?.toString() || '') === 'rejected' ||
                      (transactionStatus?.toString() || '') === 'failed' ||
                      (transactionStatus?.toString() || '') === 'not_started',
                    'bg-color-text-green':
                      (transactionStatus?.toString() || '') === 'done' ||
                      (transactionStatus?.toString() || '') === 'all' ||
                      (transactionStatus?.toString() || '') === 'complete' ||
                      (transactionStatus?.toString() || '') === 'approved',
                  })}
                />
                <div className="text-black dark:text-white">{convertStatus(transactionStatus)}</div>
              </div>
            </div>
            {transactionStatus === LIST_FILTER_STATUS[1].type && (
              <div className="flex items-center justify-between text-color-light-text-primary dark:text-color-text-primary">
                <span className="">{String(t('transaction:txid'))}</span>
                <div className="flex items-center gap-2">
                  <span className="text-black dark:text-white">{transformWalletAddress(transaction.txId)}</span>
                  <Simcard2
                    role="button"
                    onClick={() => copyClipBoard(String(transaction?.txId))}
                    className="w-[16px] h-[16px]"
                  />
                </div>
              </div>
            )}
            <div className="flex items-center justify-between">
              <span className="text-color-light-text-primary dark:text-color-text-primary">
                {String(t('transaction:orderId'))}
              </span>
              <div className="flex items-center gap-2">
                <span className="text-right text-black dark:text-white">{transformUUID(transaction.orderId)}</span>
                <Simcard2
                  role="button"
                  onClick={() => copyClipBoard(String(transaction?.orderId))}
                  className="w-[16px] h-[16px] text-color-light-text-primary dark:text-color-text-primary"
                />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-color-light-text-primary dark:text-color-text-primary">
                {String(t('transaction:time'))}
              </span>
              <span className="text-black dark:text-white">
                {formatDate(new Date(transaction.time), DATE_TIME_SUBMIT_FORMAT_WITH_SECOND)}
              </span>
            </div>
            {type === TRANSACTION_TYPE.Withdraw && (
              <>
                <div className="flex items-center justify-between">
                  <span className="dark:text-color-text-primary text-color-light-text-primary">
                    {String(t('transaction:fee'))}
                  </span>
                  <span className="text-black dark:text-white">
                    {currencyFormat1(transaction.fee, 4, '', false)} {transaction.symbolName}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="dark:text-color-text-primary text-color-light-text-primary">
                    {String(t('transaction:withdrawalAddress'))}
                  </span>
                  <span className="flex items-center gap-2 text-black dark:text-white">
                    {transformWalletAddress(transaction.withdrawalAddress)}
                    <Simcard2
                      role="button"
                      onClick={() => copyClipBoard(String(transaction?.withdrawalAddress))}
                      className="w-[16px] h-[16px] text-color-light-text-primary dark:text-color-text-primary"
                    />
                  </span>
                </div>
              </>
            )}
            {(type === TRANSACTION_TYPE.Withdraw || type === TRANSACTION_TYPE.Deposit) && (
              <>
                <div className="h-[1px] w-full dark:bg-[#98A7B5] bg-[#f5f6fa]" />
                <div className="flex items-center">
                  <span className="text-black dark:text-white">{String(t('transaction:progress'))}</span>
                </div>
                <div className="relative flex flex-col gap-3">
                  <div
                    className={cn('h-[50%] absolute top-[16px] w-[2px] left-[14px] bg-[#414346]', {
                      // 'bg-[#414346]': !isProcess,
                      // 'bg-[#3BC117]': isProcess,
                    })}
                  ></div>
                  {type === TRANSACTION_TYPE.Withdraw && (
                    <div className="flex items-center gap-2">
                      <div className="relative flex items-center jutify-center w-[32px] h-[32px]">
                        <div className="absolute bg-white w-[24px] h-[24px] left-1/2 rounded-full -translate-x-2/4	"></div>
                        <TickCircle size="32" color="green" variant="Bold" className="absolute w-[32px] h-[32px] z-1" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-black dark:text-white">
                          {String(t('transaction:sendOrderSubmitted'))}
                        </span>
                        <span className="dark:text-color-text-primary text-color-light-text-primary text-[12px]">
                          {String(t('transaction:submittedAt'))}{' '}
                          {formatDate(new Date(transaction.time), DATE_TIME_SUBMIT_FORMAT_WITH_SECOND)}
                        </span>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-2">
                    {isProcess ? (
                      <div className="relative z-1 flex items-center justify-center w-[32px] h-[32px]">
                        <div className="relative bg-color-secondary rounded-full flex items-center justify-center w-[26px] h-[26px]">
                          <ReactLoading type={'spinningBubbles'} color={'white'} width={20} height={20} />
                        </div>
                      </div>
                    ) : (
                      <div className="relative z-1 flex items-center jutify-center w-[32px] h-[32px]">
                        <div className="absolute bg-white w-[24px] h-[24px] left-1/2 rounded-full -translate-x-2/4	"></div>
                        <TickCircle size="32" color="green" variant="Bold" className="absolute w-[32px] h-[32px] z-1" />
                      </div>
                    )}
                    <div className="flex flex-col">
                      <span className="text-black dark:text-white">
                        {String(t('transaction:blockchainProcessing'))}
                      </span>
                      <span className="dark:text-color-text-primary text-color-light-text-primary text-[12px]">
                        {String(t('transaction:blockchainProcessingContent'))}
                      </span>
                    </div>
                  </div>
                  {type === TRANSACTION_TYPE.Withdraw && (
                    <div
                      className={cn('h-[50%] absolute top-[60px] w-[2px] left-[14px] bg-[#414346]', {
                        // 'bg-[#414346]': isFailed,
                        // 'bg-color-primary': !isFailed,
                      })}
                    ></div>
                  )}
                  <div className="flex items-center gap-2">
                    <div className="relative flex items-center jutify-center w-[32px] h-[32px]">
                      <div
                        className={`${
                          isProcess ? 'bg-[#898181]' : 'bg-white'
                        } absolute w-[24px] h-[24px] left-1/2 rounded-full -translate-x-2/4	`}
                      ></div>
                      {isFailed ? (
                        <CloseCircle
                          size="32"
                          color="#c31414"
                          variant="Bold"
                          className="absolute w-[32px] h-[32px] z-1"
                        />
                      ) : (
                        <TickCircle
                          size="32"
                          color={`${isProcess ? '#414346' : 'green'}`}
                          variant="Bold"
                          className="absolute w-[32px] h-[32px] z-1"
                        />
                      )}
                    </div>
                    <div className="flex flex-col">
                      <span className="dark:text-white text-color-light-text-primary">
                        {isFailed
                          ? String(t('transaction:transactionFailed'))
                          : String(t('transaction:transactionCompleted'))}
                      </span>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </CommonModal>
    </>
  );
}
