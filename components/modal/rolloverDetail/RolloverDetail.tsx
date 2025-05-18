import { DialogProps, TransitionRootProps } from '@headlessui/react';
import cn from 'classnames';
import Image from 'next/image';
import { ElementType } from 'react';
import { useTranslation } from 'react-i18next';
import { shallowEqual, useSelector } from 'react-redux';

import { TIME_DATE_SUBMIT_FORMAT, TIME_SUBMIT_FORMAT_WITH_SLASH_MARKER } from '@/base/constants/common';
import { useExchange } from '@/base/hooks/useExchange';
import { currencyFormat1, formatDate, getColorByStatus } from '@/base/libs/utils';
import { AppState } from '@/base/redux/store';
import { RolloverType } from '@/base/types/common';

import CommonModal from '../commonModal/commonModal';
import { camelize } from 'humps';

type ModalDetailTransactionProps = {
  onClose: () => void;
  show: boolean;
  transaction: RolloverType;
  titleModal?: String;
  type?: string;
} & TransitionRootProps<ElementType> &
  DialogProps<ElementType>;

const cryptoDecimals = 8;
const fiatDecimals = 4;

export default function ModalDetailsRollover({ show, onClose, transaction }: ModalDetailTransactionProps) {
  const { t } = useTranslation('');
  const exchange = useExchange();

  const { localFiat, viewInFiat } = useSelector(
    (state: AppState) => ({
      localFiat: state.wallet.localFiat,
      viewInFiat: state.auth.user.generalSetting.settingViewInFiat,
    }),
    shallowEqual,
  );

  const replaceStatus = (status: string) => {
    return status.split('_').join(' ');
  };

  return (
    <>
      <CommonModal
        show={show}
        onClose={onClose}
        panelClass="sm:!max-w-[400px]"
        header={
          <div className="modal-header">
            <div className="text-[16px] dark:text-white text-black font-[600]">
              {String(t('transaction:rolloverDetails'))}
            </div>
          </div>
        }
      >
        <div className=" min-h-[516px] overflow-auto h-full bg-cover p-4">
          <div className="flex flex-col items-center py-0 gap-2">
            <Image height={40} width={40} src={transaction.currencyLogo} alt="symbol" />
            <div
              className={cn('text-[22px]', {
                'text-red-500': transaction.type === 'Withdraw',
                'text-color-text-green': Number(transaction.amount) >= 0,
                'text-[#FD6E0B]': Number(transaction.amount) < 0,
              })}
            >
              <span>
                {transaction.type === 'Withdraw' && (
                  <span>- {currencyFormat1(transaction.amount, cryptoDecimals)}</span>
                )}
                {transaction.type !== 'Withdraw' && (
                  <span>
                    {Number(transaction.amount) >= 0 ? '+' : ''}{' '}
                    {currencyFormat1(transaction.amount, cryptoDecimals, '', false)}
                  </span>
                )}
              </span>
              <span className="font-semibold dark:text-white text-black ml-1">{transaction.currency}</span>
            </div>
          </div>
          <div className="mt-5 flex flex-col gap-4 text-[14px]">
            <div className="flex items-center justify-between">
              <span className="text-color-light-text-primary dark:text-color-text-primary">
                {String(t('transaction:status'))}
              </span>
              <div className="flex gap-2 items-center">
                <div
                  className={cn('w-[8px] h-[8px] rounded-full', {
                    'bg-[#efef19]':
                      transaction.status.toString() === 'processing' ||
                      transaction.status.toString() === 'pending' ||
                      transaction.status.toString() === 'refunding' ||
                      transaction.status.toString() === 'ongoing',
                    'bg-[#c31414]':
                      transaction.status.toString() === 'rejected' ||
                      transaction.status.toString() === 'failed' ||
                      transaction.status.toString() === 'not_started',
                    'bg-[#3BC117]':
                      transaction.status.toString() === 'done' ||
                      transaction.status.toString() === 'all' ||
                      transaction.status.toString() === 'complete' ||
                      transaction.status.toString() === 'approved',
                  })}
                />
                <div className="dark:text-white text-black text-[14px] break-keep	">
                  {String(
                    t(
                      `transaction:${
                        transaction.status.indexOf('_') >= 0
                          ? camelize(transaction.status || '')
                          : transaction.status.toLowerCase()
                      }`,
                    ),
                  )}{' '}
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between text-color-light-text-primary dark:text-color-text-primary">
              <span className="">{String(t('transaction:type'))}</span>
              <div className="flex gap-2 items-center">
                <span className="text-black dark:text-white">
                  {String(
                    t(
                      `transaction:${
                        transaction.type.indexOf('_') >= 0
                          ? camelize(transaction.type || '')
                          : transaction.type.toLowerCase()
                      }`,
                    ),
                  )}{' '}
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-color-light-text-primary dark:text-color-text-primary">
                {String(t('transaction:createdOn'))}
              </span>
              <span className="text-black dark:text-white">
                {formatDate(new Date(transaction.createdAt), TIME_SUBMIT_FORMAT_WITH_SLASH_MARKER)}
              </span>
            </div>
            <div className="h-[1px] w-full dark:bg-[#98A7B5] bg-[#f5f6fa]" />
            <div className="flex items-center justify-between">
              <span className="text-color-light-text-primary dark:text-color-text-primary">
                {String(t('transaction:rolloverTimes'))}
              </span>
              <span className="text-black dark:text-white">{`${transaction.times} x`}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-color-light-text-primary dark:text-color-text-primary">
                {String(t('transaction:totalWagerRequired'))}
              </span>
              <span className="text-black dark:text-white">
                {viewInFiat ? (
                  <>{currencyFormat1(transaction.amountUsd * exchange, fiatDecimals, localFiat?.name || 'USD')}</>
                ) : (
                  currencyFormat1(transaction.amount, cryptoDecimals, '', false)
                )}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-color-light-text-primary dark:text-color-text-primary">
                {String(t('transaction:wagerComplete'))}
              </span>
              <span className="text-black dark:text-white">
                {viewInFiat ? (
                  <>
                    {currencyFormat1(
                      transaction.wagerCompletedUsdAmount * exchange,
                      fiatDecimals,
                      localFiat?.name || 'USD',
                    )}
                  </>
                ) : (
                  currencyFormat1(transaction.wagerCompletedAmount, cryptoDecimals, '', false)
                )}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-color-light-text-primary dark:text-color-text-primary">
                {String(t('transaction:pendingWagerRequired'))}
              </span>
              <span className="text-black dark:text-white">
                {viewInFiat ? (
                  <>
                    {currencyFormat1(
                      transaction.pendingWagerRequiredUsdAmount * exchange,
                      fiatDecimals,
                      localFiat?.name || 'USD',
                    )}
                  </>
                ) : (
                  currencyFormat1(transaction.pendingWagerRequiredAmount, cryptoDecimals, '', false)
                )}
              </span>
            </div>
            {/* <div className="flex items-center justify-between">
              <span className="text-color-light-text-primary dark:text-color-text-primary">
                {String(t('transaction:withdrawableFunds'))}
              </span>
              <span className="text-black dark:text-white">
                {viewInFiat ? (
                  <>
                    {currencyFormat1(
                      transaction.withdrawableFundsUsdAmount * exchange,
                      fiatDecimals,
                      localFiat?.name || 'USD',
                    )}
                  </>
                ) : (
                  currencyFormat1(transaction.withdrawableFundsAmount, cryptoDecimals, '', false)
                )}
              </span>
            </div> */}
            {/* <div className="flex items-center justify-between">
              <span className="text-color-light-text-primary dark:text-color-text-primary underline cursor-pointer">
                {String(t('transaction:cancelBonus'))}
              </span>
            </div> */}
          </div>
        </div>
      </CommonModal>
    </>
  );
}
