import { Menu, Transition } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import { ColumnDef, Row } from '@tanstack/react-table';
import cn from 'classnames';
import { ArrowRight2, Copy } from 'iconsax-react';
import Image from 'next/image';
import { Fragment, ReactElement, useCallback, useEffect, useMemo, useState } from 'react';
import { shallowEqual, useSelector } from 'react-redux';

import { api_getTransactions } from '@/api/wallet';
import { useTranslation } from '@/base/config/i18next';
import {
  billTypes,
  LIST_FILTER_DATE,
  LIST_FILTER_STATUS,
  LIST_FILTER_TYPE,
  TIME_SUBMIT_FORMAT_WITH_SLASH_MARKER,
} from '@/base/constants/common';
import { useExchange } from '@/base/hooks/useExchange';
import { useWidth } from '@/base/hooks/useWidth';
import { convertStatus, copyClipBoard, currencyFormat1, formatDate } from '@/base/libs/utils';
import { AppState } from '@/base/redux/store';
import { TRANSACTION_TYPE } from '@/base/types/requestTypes';
import withAuth from '@/components/hoc/withAuth';
import DepositLayout from '@/components/layouts/deposit.layout';
import ModalDetailTransaction from '@/components/modal/transactionDetail/transactionDetail';
import Paging from '@/components/paging/paging';
import TableComponent from '@/components/table';
import {
  TransactionBillType,
  TransactionBonusType,
  TransactionStatus,
  TransactionSwapType,
  TransactionType,
} from '@/types/common';

import styles from './index.module.scss';
import { camelize } from 'humps';

interface BillType {
  type: string;
}

const cryptoLen = 8;
const fiatLen = 4;

const TransactionPage = () => {
  const { t, i18n } = useTranslation('');
  const exchangeRate = useExchange();
  const width = useWidth();

  const { localFiat, viewInFiat, cryptoSymbols, userId, username, activeTransaction } = useSelector(
    (state: AppState) => ({
      viewInFiat: state.auth.user.generalSetting.settingViewInFiat,
      localFiat: state.wallet.localFiat,
      cryptoSymbols: state.wallet.symbols,
      userId: state.user.userId,
      username: state.user.userName,
      activeTransaction: state.wallet.activeTransactionStatus,
    }),
    shallowEqual,
  );

  const [isShowDetailTransaction, setIsShowDetailTransaction] = useState<boolean>(false);
  const [transaction, setTransaction] = useState<any>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [dataTable, setDataTable] = useState<
    TransactionType[] | TransactionSwapType[] | TransactionBillType[] | TransactionBonusType[]
  >([]);
  const [typeBill, setTypeBill] = useState<(typeof billTypes)[0]>(billTypes[0]);

  const [optionFilter, setOptionFilter] = useState({
    type: LIST_FILTER_TYPE[0],
    currency: '',
    dayPast: LIST_FILTER_DATE[0],
    filterStatus: LIST_FILTER_STATUS[0],
  });
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [totalRows, setTotalRows] = useState<number>(0);
  const [columnType, setColumnType] = useState<TRANSACTION_TYPE>(TRANSACTION_TYPE.Deposit);

  const depositColumns: ColumnDef<TransactionType>[] = useMemo(() => {
    if (width > 1024) {
      return [
        {
          accessorKey: 'transactionType',
          header: () => <div className="text-left dark:text-[#64748b] text-black">{String(t('transaction:type'))}</div>,
          cell: ({ row }) => (
            <div className="py-2 text-left text-black truncate dark:text-white">{t(optionFilter.type.name)}</div>
          ),
          minSize: 30,
        },
        {
          accessorKey: 'amount',
          header: () => (
            <div className="text-center dark:text-[#64748b] text-black">{String(t('transaction:amount'))}</div>
          ),
          cell: ({ row }) => (
            <div
              className={`${
                t(optionFilter.type.type) === TRANSACTION_TYPE.Withdraw ? 'text-red-500' : 'text-color-text-green'
              } flex items-center justify-center gap-1`}
            >
              {t(optionFilter.type.type) === TRANSACTION_TYPE.Withdraw ? '-' : ''}
              {viewInFiat ? (
                <>{currencyFormat1(row.original.amountUsd * exchangeRate, fiatLen, String(localFiat?.name || 'USD'))}</>
              ) : (
                currencyFormat1(row.original.amount, cryptoLen, '', false)
              )}

              <Image
                height={20}
                width={20}
                src={row.original.symbolLogo || `/img/fiats/USDT.png`}
                onError={(e) => {
                  e.currentTarget.src = `/img/fiats/USDT.png`;
                }}
                alt="symbol"
              />
            </div>
          ),
          minSize: 20,
        },
        {
          accessorKey: 'time',
          header: () => (
            <div className="text-center dark:text-[#64748b] text-black">{String(t('transaction:timeTransfer'))}</div>
          ),
          cell: ({ row }) => (
            <div className="text-black dark:text-white">
              {formatDate(new Date(row.original.time), TIME_SUBMIT_FORMAT_WITH_SLASH_MARKER)}
            </div>
          ),
          maxSize: 30,
        },
        {
          accessorKey: 'status',
          header: () => (
            <div className="text-right dark:text-[#64748b] text-black">{String(t('transaction:status'))}</div>
          ),
          cell: ({ row }) => (
            <div className="flex items-center justify-end gap-2">
              <div
                className={cn(`w-[8px] h-[8px] rounded-full`, {
                  'bg-color-secondary':
                    row.original.status === 'processing' ||
                    row.original.status === 'pending' ||
                    row.original.status === 'refunding',
                  // row.original.status === 'ongoing',
                  'bg-color-red': row.original.status === 'rejected' || row.original.status === 'failed',
                  // row.original.status === 'not_started',
                  'bg-color-text-green':
                    // row.original.status === 'done' ||
                    // row.original.status === 'all' ||
                    row.original.status === 'complete' || row.original.status === 'approved',
                })}
              />
              <div className="text-black dark:text-white break-keep ">{convertStatus(row.original.status)}</div>
              <ArrowRight2 className="h-[16px] w-[16px] dark:text-[#64748b] text-color-light-text-primary" />
            </div>
          ),
          maxSize: 30,
          minSize: 30,
        },
      ];
    }
    return [
      {
        accessorKey: 'amount',
        header: () => (
          <div className="text-center dark:text-[#64748b] text-black">{String(t('transaction:amount'))}</div>
        ),
        cell: ({ row }) => (
          <div
            className={`${
              t(optionFilter.type.type) === TRANSACTION_TYPE.Withdraw ? 'text-red-500' : 'text-color-text-green'
            } flex items-center justify-center gap-1 min-w-[100px]`}
          >
            {t(optionFilter.type.type) === TRANSACTION_TYPE.Withdraw ? '-' : ''}
            {viewInFiat ? (
              <>{currencyFormat1(row.original.amountUsd * exchangeRate, fiatLen, String(localFiat?.name || 'USD'))}</>
            ) : (
              currencyFormat1(row.original.amount, cryptoLen, '', false)
            )}

            <Image
              height={20}
              width={20}
              src={row.original.symbolLogo || `/img/fiats/USDT.png`}
              onError={(e) => {
                e.currentTarget.src = `/img/fiats/USDT.png`;
              }}
              alt="symbol"
            />
          </div>
        ),
        minSize: 20,
      },
      {
        accessorKey: 'time',
        header: () => (
          <div className="text-center dark:text-[#64748b] text-black">{String(t('transaction:timeTransfer'))}</div>
        ),
        cell: ({ row }) => (
          <div className="text-black dark:text-white">
            {formatDate(new Date(row.original.time), TIME_SUBMIT_FORMAT_WITH_SLASH_MARKER)}
          </div>
        ),
        maxSize: 30,
      },
      {
        accessorKey: 'status',
        header: () => (
          <div className="text-right dark:text-[#64748b] text-black">{String(t('transaction:status'))}</div>
        ),
        cell: ({ row }) => (
          <div className="flex items-center justify-end gap-2">
            <div
              className={cn(`w-[8px] h-[8px] rounded-full`, {
                'bg-color-secondary':
                  row.original.status === 'processing' ||
                  row.original.status === 'pending' ||
                  row.original.status === 'refunding',
                // row.original.status === 'ongoing',
                'bg-color-red': row.original.status === 'rejected' || row.original.status === 'failed',
                // row.original.status === 'not_started',
                'bg-color-text-green':
                  // row.original.status === 'done' ||
                  // row.original.status === 'all' ||
                  row.original.status === 'complete' || row.original.status === 'approved',
              })}
            />
            <div className="text-black dark:text-white break-keep ">{convertStatus(row.original.status)}</div>
            <ArrowRight2 className="h-[16px] w-[16px] dark:text-[#64748b] text-color-light-text-primary" />
          </div>
        ),
        maxSize: 30,
        minSize: 30,
      },
    ];
  }, [localFiat, viewInFiat, optionFilter.type, i18n, exchangeRate]);

  const swapColumns: ColumnDef<TransactionSwapType>[] = useMemo(() => {
    if (width > 1024) {
      return [
        {
          accessorKey: 'swapFrom + swapTo',
          header: () => <div className="text-left capitalize">{String(t('transaction:type'))}</div>,
          cell: ({ row }) => (
            <div className="flex items-center gap-1 text-white truncate">{t(optionFilter.type.name)}</div>
          ),
          minSize: 30,
        },
        {
          accessorKey: 'swapFrom',
          header: () => <div className="text-center">{String(t('transaction:swapFrom'))}</div>,
          cell: ({ row }) => (
            <div className="text-[#FF053B] flex items-center justify-center gap-1 truncate py-2">
              <span>
                -
                {viewInFiat ? (
                  <>
                    {currencyFormat1(
                      row.original?.swapFromUsd * exchangeRate,
                      fiatLen,
                      String(localFiat?.name || 'USD'),
                    )}
                  </>
                ) : (
                  currencyFormat1(row.original.swapFrom, cryptoLen, '', false)
                )}
              </span>
              <Image
                height={20}
                width={20}
                src={row.original?.swapFromLogo || `/img/fiats/USDT.png`}
                alt="symbol"
                onError={(e) => {
                  e.currentTarget.src = `/img/fiats/USDT.png`;
                }}
              />
            </div>
          ),
          minSize: 120,
        },
        {
          accessorKey: 'swapTo',
          header: () => <div className="text-center">{String(t('transaction:swapTo'))}</div>,
          cell: ({ row }) => (
            <div className="flex items-center justify-center gap-1 truncate text-color-text-green">
              <span>
                {viewInFiat ? (
                  <>
                    {currencyFormat1(row.original?.swapToUsd * exchangeRate, fiatLen, String(localFiat?.name || 'USD'))}
                  </>
                ) : (
                  currencyFormat1(row.original.swapTo, cryptoLen, '', false)
                )}
              </span>
              <Image
                height={20}
                width={20}
                src={row.original?.swapToLogo || `/img/fiats/USDT.png`}
                alt="symbol"
                onError={(e) => {
                  e.currentTarget.src = '/img/fiats/USDT.png';
                }}
              />
            </div>
          ),
          minSize: 120,
        },
        {
          accessorKey: 'timeTransfer',
          header: () => <div className="text-right">{String(t('transaction:time'))}</div>,
          cell: ({ row }) => (
            <div className="text-right text-color-text-primary">
              {formatDate(new Date(row.original.timeTransfer), TIME_SUBMIT_FORMAT_WITH_SLASH_MARKER)}
            </div>
          ),
          minSize: 150,
        },
      ];
    }
    return [
      {
        accessorKey: 'swapFrom',
        header: () => <div className="text-left capitalize">{String(t('transaction:swapFrom'))}</div>,
        cell: ({ row }) => (
          <div className="text-[#FF053B] flex items-center justify-start gap-1 truncate py-2">
            <span>
              -
              {viewInFiat ? (
                <>
                  {currencyFormat1(row.original?.swapFromUsd * exchangeRate, fiatLen, String(localFiat?.name || 'USD'))}
                </>
              ) : (
                currencyFormat1(row.original.swapFrom, cryptoLen, '', false)
              )}
            </span>
            <Image
              height={20}
              width={20}
              src={row.original?.swapFromLogo || `/img/fiats/USDT.png`}
              alt="symbol"
              onError={(e) => {
                e.currentTarget.src = `/img/fiats/USDT.png`;
              }}
            />
          </div>
        ),
      },
      {
        accessorKey: 'swapTo',
        header: () => <div className="text-center">{String(t('transaction:swapTo'))}</div>,
        cell: ({ row }) => (
          <div className="flex items-center justify-center gap-1 truncate text-color-text-green">
            <span>
              {viewInFiat ? (
                <>
                  {currencyFormat1(row.original?.swapToUsd * exchangeRate, fiatLen, String(localFiat?.name || 'USD'))}
                </>
              ) : (
                currencyFormat1(row.original.swapTo, cryptoLen, '', false)
              )}
            </span>
            <Image
              height={20}
              width={20}
              src={row.original?.swapToLogo || `/img/fiats/USDT.png`}
              alt="symbol"
              onError={(e) => {
                e.currentTarget.src = '/img/fiats/USDT.png';
              }}
            />
          </div>
        ),
      },
      {
        accessorKey: 'timeTransfer',
        header: () => <div className="text-right">{String(t('transaction:time'))}</div>,
        cell: ({ row }) => (
          <div className="text-color-text-primary text-right text-[11px]">
            {formatDate(new Date(row.original.timeTransfer), TIME_SUBMIT_FORMAT_WITH_SLASH_MARKER)}
          </div>
        ),
        minSize: 70,
      },
    ];
  }, [localFiat, viewInFiat, optionFilter, i18n, exchangeRate]);

  const billColumns: ColumnDef<TransactionBillType>[] = useMemo(() => {
    if (width > 1024) {
      return [
        {
          accessorKey: 'actionType',
          header: () => (
            <div className="text-left dark:text-color-text-primary text-color-light-text-primary capitalize">
              {String(t('transaction:type'))}
            </div>
          ),
          cell: ({ row }) => (
            <>
              <div className="flex items-center gap-1 text-black truncate dark:text-white">
                {String(
                  t(
                    `transaction:${
                      row.original?.type.indexOf('_') >= 0
                        ? camelize(row.original?.type || '')
                        : row.original.type.toLowerCase()
                    }`,
                  ),
                )}{' '}
                {row.original?.type && row.original?.gameName && (
                  <span className="text-[10px] text-gray-400 flex gap-[5px]">
                    ({row.original?.gameName})
                    {/* <Link href={ROUTER.GameDetail(convertToUrlCase(row.original.gameName || ''))}>
                      <LinkIcon width={12} role="button" className="hover:text-amber-500" />
                    </Link> */}
                  </span>
                )}
              </div>
              {row.original?.gameId && (
                <div className="text-[10px] dark:text-gray-500 text-black text-left flex items-center gap-1">
                  Game ID: {row.original?.gameId}
                  <span role="button">
                    <Copy
                      size={12}
                      className="hover:text-amber-500"
                      onClick={() => copyClipBoard(String(row.original?.gameId))}
                    />
                  </span>
                </div>
              )}
            </>
          ),
        },
        {
          accessorKey: 'amount',
          header: () => (
            <div className="text-center dark:text-color-text-primary text-color-light-text-primary">
              {String(t('transaction:amount'))}
            </div>
          ),
          cell: ({ row }) => (
            <div
              className={cn('flex items-center justify-center gap-1 truncate', {
                'text-color-red':
                  row.original?.type?.toLowerCase() == 'bet' ||
                  row.original?.type?.toLowerCase() == 'game_bet' ||
                  row.original.type.toLowerCase() === 'withdraw' ||
                  row.original.type.toLowerCase() === 'tip_send' ||
                  row.original.type.toLocaleLowerCase() === 'swap_send',
                'text-color-text-green': !(
                  row.original?.type?.toLowerCase() == 'bet' ||
                  row.original?.type?.toLowerCase() == 'game_bet' ||
                  row.original.type.toLowerCase() === 'withdraw' ||
                  row.original.type.toLowerCase() === 'tip_send' ||
                  row.original.type.toLocaleLowerCase() === 'swap_send'
                ),
              })}
            >
              {row.original?.type?.toLowerCase() == 'bet' ||
              row.original?.type?.toLowerCase() == 'game_bet' ||
              row.original.type.toLowerCase() === 'withdraw' ||
              row.original.type.toLowerCase() === 'tip_send' ||
              row.original.type.toLocaleLowerCase() === 'swap_send'
                ? '-'
                : ''}
              {viewInFiat ? (
                <>
                  {currencyFormat1(Math.abs(row.original.amountUsd * exchangeRate), fiatLen, localFiat?.name || 'USD')}
                </>
              ) : (
                currencyFormat1(Math.abs(row.original?.amount), cryptoLen, '', false)
              )}

              <Image
                height={20}
                width={20}
                src={row.original.currency ? `/img/fiats/${row.original.currency}.png` : `/img/fiats/USDT.png`}
                alt="currency"
                onError={(e) => {
                  e.currentTarget.src = '/img/fiats/USDT.png';
                }}
              />
            </div>
          ),
        },
        {
          accessorKey: 'createdAt',
          header: () => (
            <div className="text-center dark:text-color-text-primary text-color-light-text-primary ">
              {String(t('transaction:time'))}
            </div>
          ),
          cell: ({ row }) => (
            <div className="dark:text-color-text-primary text-color-light-text-primary">
              {formatDate(new Date(row.original.time), TIME_SUBMIT_FORMAT_WITH_SLASH_MARKER)}
            </div>
          ),
        },
        {
          accessorKey: 'balance',
          header: () => (
            <div className="text-right dark:text-color-text-primary text-color-light-text-primary ">
              {String(t('transaction:balance'))}
            </div>
          ),
          cell: ({ row }) => (
            <div
              className={`dark:text-white text-color-light-text-primary text-left flex items-center justify-end gap-1`}
            >
              <span className="flex-1 text-right">
                {viewInFiat
                  ? currencyFormat1(row.original.balanceUsd * exchangeRate, fiatLen, localFiat?.name)
                  : currencyFormat1(row.original.balance, cryptoLen, '', false)}
              </span>

              <Image
                height={20}
                width={20}
                src={row.original?.currency ? `/img/fiats/${row.original?.currency}.png` : `/img/fiats/USDT.png`}
                onError={(e) => {
                  e.currentTarget.src = '/img/fiats/USDT.png';
                }}
                alt="currency"
              />
            </div>
          ),
        },
      ];
    }
    return [
      {
        accessorKey: 'actionType',
        header: () => (
          <div className="text-left dark:text-color-text-primary text-color-light-text-primary capitalize">
            {String(t('transaction:type'))}/{String(t('transaction:time'))}
          </div>
        ),
        cell: ({ row }) => (
          <div className="">
            <div className="flex items-center gap-1 text-black truncate dark:text-white">
              {String(
                t(
                  `transaction:${
                    row.original?.type.indexOf('_') >= 0
                      ? camelize(row.original?.type || '')
                      : row.original.type.toLowerCase()
                  }`,
                ),
              )}{' '}
              {row.original?.type && row.original?.gameName && (
                <span className="text-[10px] text-gray-400 flex gap-[5px]">
                  ({row.original?.gameName})
                  {/* <Link href={ROUTER.GameDetail(convertToUrlCase(row.original.gameName || ''))}>
                    <LinkIcon width={12} role="button" className="hover:text-amber-500" />
                  </Link> */}
                </span>
              )}
            </div>
            <div className="text-left dark:text-white text-color-light-text-primary">
              {formatDate(new Date(row.original.time), TIME_SUBMIT_FORMAT_WITH_SLASH_MARKER)}
            </div>
            {row.original?.gameId && (
              <div className="text-[10px] dark:text-gray-500 text-black text-left flex items-center gap-1">
                Game ID: {row.original?.gameId}
                <span role="button">
                  <Copy
                    size={12}
                    className="hover:text-amber-500"
                    onClick={() => copyClipBoard(String(row.original?.gameId))}
                  />
                </span>
              </div>
            )}
          </div>
        ),
      },
      {
        accessorKey: 'balance',
        header: () => (
          <div className="text-right dark:text-color-text-primary text-color-light-text-primary ">
            {String(t('transaction:amount'))}/{String(t('transaction:balance'))}
          </div>
        ),
        cell: ({ row }) => (
          <div className="min-w-[100px]">
            <div
              className={cn('flex items-center justify-end gap-1 truncate font-bold', {
                'text-color-red':
                  row.original?.type?.toLowerCase() == 'bet' ||
                  row.original?.type?.toLowerCase() == 'game_bet' ||
                  row.original.type.toLowerCase() === 'withdraw' ||
                  row.original.type.toLowerCase() === 'tip_send' ||
                  row.original.type.toLocaleLowerCase() === 'swap_send',
                'text-color-text-green': !(
                  row.original?.type?.toLowerCase() == 'bet' ||
                  row.original?.type?.toLowerCase() == 'game_bet' ||
                  row.original.type.toLowerCase() === 'withdraw' ||
                  row.original.type.toLowerCase() === 'tip_send' ||
                  row.original.type.toLocaleLowerCase() === 'swap_send'
                ),
              })}
            >
              {row.original?.type?.toLowerCase() == 'bet' ||
              row.original?.type?.toLowerCase() == 'game_bet' ||
              row.original.type.toLowerCase() === 'withdraw' ||
              row.original.type.toLowerCase() === 'tip_send' ||
              row.original.type.toLocaleLowerCase() === 'swap_send'
                ? '-'
                : ''}
              {viewInFiat ? (
                <>
                  {currencyFormat1(Math.abs(row.original.amountUsd * exchangeRate), fiatLen, localFiat?.name || 'USD')}
                </>
              ) : (
                currencyFormat1(Math.abs(row.original?.amount), cryptoLen, '', false)
              )}

              <Image
                height={14}
                width={14}
                src={row.original.currency ? `/img/fiats/${row.original.currency}.png` : `/img/fiats/USDT.png`}
                alt="currency"
                onError={(e) => {
                  e.currentTarget.src = '/img/fiats/USDT.png';
                }}
              />
            </div>
            <div
              className={`dark:text-white text-color-light-text-primary text-left flex items-center justify-end gap-1`}
            >
              <span className="flex-1 text-right text-[12px]">
                {viewInFiat
                  ? currencyFormat1(row.original.balanceUsd * exchangeRate, fiatLen, localFiat?.name)
                  : currencyFormat1(row.original.balance, cryptoLen, '', false)}
              </span>

              <Image
                height={14}
                width={14}
                src={row.original?.currency ? `/img/fiats/${row.original?.currency}.png` : `/img/fiats/USDT.png`}
                onError={(e) => {
                  e.currentTarget.src = '/img/fiats/USDT.png';
                }}
                alt="currency"
              />
            </div>
          </div>
        ),
      },
    ];
  }, [localFiat, viewInFiat, optionFilter, i18n, exchangeRate, width]);

  const withdrawColumns: ColumnDef<TransactionType>[] = useMemo(() => {
    if (width > 1024) {
      return [
        {
          accessorKey: 'transactionType',
          header: () => <div className="text-left dark:text-[#64748b] text-black">{String(t('transaction:type'))}</div>,
          cell: ({ row }) => (
            <div className="py-2 text-left text-black truncate dark:text-white">{t(optionFilter.type.name)}</div>
          ),
        },
        {
          accessorKey: 'amount',
          header: () => (
            <div className="text-center dark:text-[#64748b] text-black">{String(t('transaction:amount'))}</div>
          ),
          cell: ({ row }) => (
            <div
              className={`min-w-[100px] ${
                t(optionFilter.type.type) === TRANSACTION_TYPE.Withdraw ? 'text-red-500' : 'text-color-text-green'
              } flex items-center justify-center gap-1`}
            >
              {t(optionFilter.type.type) === TRANSACTION_TYPE.Withdraw ? '-' : ''}
              {viewInFiat ? (
                <>{currencyFormat1(row.original.amountUsd * exchangeRate, fiatLen, String(localFiat?.name || 'USD'))}</>
              ) : (
                currencyFormat1(row.original.amount, cryptoLen, '', false)
              )}

              <Image
                height={20}
                width={20}
                src={row.original.symbolLogo || `/img/fiats/USDT.png`}
                onError={(e) => {
                  e.currentTarget.src = `/img/fiats/USDT.png`;
                }}
                alt="symbol"
              />
            </div>
          ),
        },
        {
          accessorKey: 'time',
          header: () => (
            <div className="text-center dark:text-[#64748b] text-black">{String(t('transaction:timeTransfer'))}</div>
          ),
          cell: ({ row }) => (
            <div className="min-w-[130px] dark:text-white text-black">
              {formatDate(new Date(row.original.time), TIME_SUBMIT_FORMAT_WITH_SLASH_MARKER)}
            </div>
          ),
        },
        {
          accessorKey: 'status',
          header: () => (
            <div className="text-right dark:text-[#64748b] text-black">{String(t('transaction:status'))}</div>
          ),
          cell: ({ row }) => (
            <div className="flex items-center justify-end gap-2">
              <div
                className={cn(`w-[8px] h-[8px] rounded-full`, {
                  'bg-color-secondary':
                    row.original.status === 'processing' ||
                    row.original.status === 'pending' ||
                    row.original.status === 'refunding',
                  // row.original.status === 'ongoing',
                  'bg-color-red': row.original.status === 'rejected' || row.original.status === 'failed',
                  // row.original.status === 'not_started',
                  'bg-color-text-green':
                    // row.original.status === 'done' ||
                    // row.original.status === 'all' ||
                    row.original.status === 'complete' || row.original.status === 'approved',
                })}
              />
              <div className="text-black dark:text-white break-keep ">{convertStatus(row.original.status)}</div>
              <ArrowRight2 className="h-[16px] w-[16px] dark:text-[#64748b] text-color-light-text-primary" />
            </div>
          ),
        },
      ];
    }
    return [
      {
        accessorKey: 'amount',
        header: () => <div className="text-left dark:text-[#64748b] text-black">{String(t('transaction:amount'))}</div>,
        cell: ({ row }) => (
          <div
            className={`min-w-[100px] ${
              t(optionFilter.type.type) === TRANSACTION_TYPE.Withdraw ? 'text-red-500' : 'text-color-text-green'
            } flex items-center justify-start gap-1`}
          >
            {t(optionFilter.type.type) === TRANSACTION_TYPE.Withdraw ? '-' : ''}
            {viewInFiat ? (
              <>{currencyFormat1(row.original.amountUsd * exchangeRate, fiatLen, String(localFiat?.name || 'USD'))}</>
            ) : (
              currencyFormat1(row.original.amount, cryptoLen, '', false)
            )}

            <Image
              height={20}
              width={20}
              src={row.original.symbolLogo || `/img/fiats/USDT.png`}
              onError={(e) => {
                e.currentTarget.src = `/img/fiats/USDT.png`;
              }}
              className="w-4 h-4"
              alt="currency"
            />
          </div>
        ),
        minSize: 80,
      },
      {
        accessorKey: 'time',
        header: () => (
          <div className="text-center dark:text-[#64748b] text-black">{String(t('transaction:timeTransfer'))}</div>
        ),
        cell: ({ row }) => (
          <div className="text-black dark:text-white">
            {formatDate(new Date(row.original.time), TIME_SUBMIT_FORMAT_WITH_SLASH_MARKER)}
          </div>
        ),
        maxSize: 30,
      },
      {
        accessorKey: 'status',
        header: () => (
          <div className="text-right dark:text-[#64748b] text-black">{String(t('transaction:status'))}</div>
        ),
        cell: ({ row }) => (
          <div className="flex items-center justify-end gap-2">
            <div
              className={cn(`w-[8px] h-[8px] rounded-full`, {
                'bg-color-secondary':
                  row.original.status === 'processing' ||
                  row.original.status === 'pending' ||
                  row.original.status === 'refunding',
                // row.original.status === 'ongoing',
                'bg-color-red': row.original.status === 'rejected' || row.original.status === 'failed',
                // row.original.status === 'not_started',
                'bg-color-text-green':
                  // row.original.status === 'done' ||
                  // row.original.status === 'all' ||
                  row.original.status === 'complete' || row.original.status === 'approved',
              })}
            />
            <div className="text-black dark:text-white break-keep ">{convertStatus(row.original.status)}</div>
          </div>
        ),
        maxSize: 30,
        minSize: 30,
      },
    ];
  }, [localFiat, viewInFiat, optionFilter.type, i18n, exchangeRate]);

  const bonusColumns: ColumnDef<TransactionBonusType>[] = useMemo(() => {
    if (width > 1024) {
      return [
        {
          accessorKey: 'actionType',
          header: () => (
            <div className="text-left dark:text-color-text-primary text-color-light-text-primary">
              {String(t('transaction:type'))}
            </div>
          ),
          cell: ({ row }) => (
            <div className="flex items-center gap-1 py-2 text-black truncate dark:text-white">
              {String(t(`transaction:${camelize(row.original?.type || '')}`))}
            </div>
          ),
          minSize: 30,
        },
        {
          accessorKey: 'amountClaimed',
          header: () => (
            <div className="text-center dark:text-color-text-primary text-color-light-text-primary">
              {String(t('transaction:amount'))}
            </div>
          ),
          cell: ({ row }) => (
            <div
              className={`${
                row.original.amount < 0 ? 'text-red-500' : 'text-color-text-green'
              } flex items-center justify-center gap-1`}
            >
              <span>{row.original.amount < 0 ? '-' : ''}</span>
              <span className="min-w-fit break-keep">
                {viewInFiat
                  ? currencyFormat1(row.original.amountUsd * exchangeRate, fiatLen, localFiat?.name)
                  : currencyFormat1(row.original.amount, cryptoLen, '', false)}
              </span>
              <Image
                height={20}
                width={20}
                src={row.original.currency ? `/img/fiats/${row.original.currency}.png` : `/img/fiats/USDT.png`}
                alt="currency"
                onError={(e) => {
                  e.currentTarget.src = '/img/fiats/USDT.png';
                }}
              />
            </div>
          ),
          minSize: 120,
        },
        {
          accessorKey: 'createdAt',
          header: () => (
            <div className="text-center dark:text-color-text-primary text-color-light-text-primary ">
              {String(t('transaction:time'))}
            </div>
          ),
          cell: ({ row }) => (
            <div className="dark:text-color-text-primary text-color-light-text-primary">
              {formatDate(new Date(row.original.time), TIME_SUBMIT_FORMAT_WITH_SLASH_MARKER)}
            </div>
          ),
          minSize: 100,
          maxSize: 100,
        },
        {
          accessorKey: 'balance',
          header: () => (
            <div className="text-right dark:text-color-text-primary text-color-light-text-primary ">
              {String(t('transaction:balance'))}
            </div>
          ),
          cell: ({ row }) => (
            <div
              className={`dark:text-white text-color-light-text-primary text-left truncate flex items-center justify-end gap-1`}
            >
              {viewInFiat
                ? currencyFormat1(row.original.balanceUsd * exchangeRate, fiatLen, localFiat?.name)
                : currencyFormat1(row.original.balance, cryptoLen, '', false)}

              <Image
                height={20}
                width={20}
                src={row.original.currency ? `/img/fiats/${row.original.currency}.png` : `/img/fiats/USDT.png`}
                alt="currency"
                onError={(e) => {
                  e.currentTarget.src = '/img/fiats/USDT.png';
                }}
              />
            </div>
          ),
          minSize: 120,
        },
      ];
    }
    return [
      {
        accessorKey: 'actionType',
        header: () => (
          <div className="text-left dark:text-color-text-primary text-color-light-text-primary">
            {String(t('transaction:type'))}
          </div>
        ),
        cell: ({ row }) => (
          <div>
            <div className="flex items-center gap-1 py-2 text-black truncate dark:text-white">
              {String(t(`transaction:${camelize(row.original?.type || '')}`))}
            </div>
            <div className="text-left dark:text-color-text-primary text-color-light-text-primary">
              {formatDate(new Date(row.original.time), TIME_SUBMIT_FORMAT_WITH_SLASH_MARKER)}
            </div>
          </div>
        ),
        minSize: 30,
      },
      {
        accessorKey: 'amountClaimed',
        header: () => (
          <div className="text-right dark:text-color-text-primary text-color-light-text-primary">
            {String(t('transaction:balance'))}
          </div>
        ),
        cell: ({ row }) => (
          <div className="flex flex-col gap-1">
            <div
              className={`${
                row.original.amount < 0 ? 'text-red-500' : 'text-color-text-green'
              } flex items-center justify-end gap-1`}
            >
              <span>{row.original.amount < 0 ? '-' : ''}</span>
              <span className="min-w-fit break-keep">
                {viewInFiat
                  ? currencyFormat1(row.original.amountUsd * exchangeRate, fiatLen, localFiat?.name)
                  : currencyFormat1(row.original.amount, cryptoLen, '', false)}
              </span>
              <Image
                height={20}
                width={20}
                src={row.original.currency ? `/img/fiats/${row.original.currency}.png` : `/img/fiats/USDT.png`}
                alt="currency"
                onError={(e) => {
                  e.currentTarget.src = '/img/fiats/USDT.png';
                }}
              />
            </div>
            <div
              className={`dark:text-white text-color-light-text-primary text-left truncate flex items-center justify-end gap-1`}
            >
              {viewInFiat
                ? currencyFormat1(row.original.balanceUsd * exchangeRate, fiatLen, localFiat?.name)
                : currencyFormat1(row.original.balance, cryptoLen, '', false)}

              <Image
                height={20}
                width={20}
                src={row.original.currency ? `/img/fiats/${row.original.currency}.png` : `/img/fiats/USDT.png`}
                alt="currency"
                onError={(e) => {
                  e.currentTarget.src = '/img/fiats/USDT.png';
                }}
              />
            </div>
          </div>
        ),
        minSize: 120,
      },
    ];
  }, [localFiat, viewInFiat, optionFilter, i18n, exchangeRate]);

  const handleChangePage = (action: string) => {
    let newPage: number;
    newPage = action === 'Next' ? page + 1 : action === 'Prev' ? page - 1 : +action;
    setPage(newPage);
    getTransactions(newPage);
  };

  const handleChangeItemPerPage = (itemPerPage: number) => {
    setLimit(itemPerPage);
    setPage(1);
  };

  const getStatusByIdDeposit = (statusId: number) => {
    let status: TransactionStatus = 'pending';
    switch (statusId) {
      case 0:
        status = 'processing';
        break;
      case 1:
        status = 'complete';
        break;
      case 2:
        status = 'failed';
        break;
      default:
        status = 'processing';
        break;
    }
    return status;
  };

  const getStatusByIdWidthdraw = (statusId: number) => {
    let status: TransactionStatus = 'pending';
    switch (statusId) {
      case 0:
        status = 'pending';
        break;
      case 1:
        status = 'processing';
        break;
      case 2:
        status = 'complete';
        break;
      case 3:
        status = 'failed';
        break;
      case 4:
        status = 'approved';
        break;
      case 5:
        status = 'rejected';
        break;

      default:
        status = 'processing';
        break;
    }
    return status;
  };

  const getStatusId = (status: TransactionStatus | string) => {
    let statusId = -1;
    switch (status) {
      case 'success':
        statusId = 1;
        break;
      case 'processing':
        statusId = 1;
        break;
      case 'complete':
        statusId = 2;
        break;
      case 'pending':
        statusId = 5;
        break;
      case 'failed':
        statusId = 5;
        break;
      case 'rejected':
        statusId = 4;
        break;
      case 'approve':
        statusId = 3;
        break;
      default:
        statusId = -1;
        break;
    }
    return statusId;
  };

  const getTransactions = useCallback(
    async (page: number) => {
      setDataTable([]);
      setTotalRows(0);
      try {
        setIsLoading(true);
        const endDateTimeStamp = Math.floor(Date.now() / 1000);
        const startDateTimeStamp = Math.floor((Date.now() - 24 * 60 * 60 * 1000 * optionFilter.dayPast.type) / 1000);
        const res = await api_getTransactions({
          type: optionFilter.type.type,
          symbolId: optionFilter.currency,
          startDate: startDateTimeStamp,
          endDate: endDateTimeStamp,
          page,
          pageSize: limit,
          status:
            optionFilter.type.type === TRANSACTION_TYPE.Withdraw
              ? getStatusId(optionFilter.filterStatus.type)
              : optionFilter.type.type === TRANSACTION_TYPE.Bill
              ? typeBill.value
              : -1,
        });

        const { data, totalCount, totalPage } = res.data;
        switch (optionFilter.type.type) {
          case TRANSACTION_TYPE.Swap:
            const tempSwapData: TransactionSwapType[] = data?.map((item: any) => ({
              symbolFrom: item.fromSymbol,
              swapFrom: item.fromAmount,
              swapFromLogo: item.fromSymbolLogo,
              swapFromUsd: Number(item.fromAmountUsd || 0),
              symbolTo: item.toSymbol,
              swapTo: Number(item.toAmount || 0),
              swapToUsd: Number(item.toAmountUsd || 0),
              swapToLogo: item.toSymbolLogo,
              timeTransfer: item.time,
            }));
            setDataTable(tempSwapData);
            break;

          case TRANSACTION_TYPE.Deposit:
            const tempDepositData: TransactionType[] = data?.map((item: any) => {
              return {
                amount: Number(item.amount || 0),
                amountUsd: Number(item.amountUsd || 0),
                fee: 0,
                feeUsd: 0,
                id: item.id,
                orderId: item.id,
                status: getStatusByIdDeposit(item.status),
                symbolId: item.currencyId,
                symbolName: item.currencyName,
                symbolLogo: item.currencyLogo,
                time: item.time,
                txId: item.hash,
                unitFee: '',
                userId: userId,
                username: username,
                value: 0,
                withdrawalAddress: item.fromAddress,
                type: TRANSACTION_TYPE.Deposit,
              };
            });
            setDataTable(tempDepositData);
            break;

          case TRANSACTION_TYPE.Withdraw:
            const tempWithdrawData: TransactionType[] = data?.map((item: any) => ({
              amount: Number(item.amountWithFee || 0),
              amountUsd: Number(item.amountWithFeeUsd || 0),
              fee: Number(item.amountWithFee || 0) - Number(item.amount || 0),
              feeUsd: Number(item.amountWithFeeUsd || 0) - Number(item.amountUsd || 0),
              id: item.id,
              orderId: item.id,
              status: getStatusByIdWidthdraw(item.status),
              symbolId: item.currencyId,
              symbolName: item.currencyName,
              symbolLogo: item.currencyLogo,
              time: item.time,
              txId: item.hash,
              unitFee: '',
              userId: userId,
              username: username,
              value: 0,
              type: TRANSACTION_TYPE.Withdraw,
              withdrawalAddress: item.toAddress,
            }));
            setDataTable(tempWithdrawData);
            break;

          case TRANSACTION_TYPE.Bill:
            const tempBillData = data?.map((item: any) => ({
              type: item.type ?? '',
              amount: Number(item.amount || 0),
              amountUsd: Number(item.amountUsd || 0),
              currency: item.currencyName ?? 'USDT',
              currencyType: item.currencyType ?? 'crypto',
              time: item.time,
              balance: Number(item.walletBalance || 0),
              balanceUsd: Number(item.walletBalanceUsd || 0),
              gameId: item.gameId ?? '',
              gameName: item.gameTitle ?? '',
            }));
            setDataTable(tempBillData);
            break;
          case TRANSACTION_TYPE.Bonus:
            const tempBonusData: TransactionBonusType[] = data?.map((item: any) => ({
              type: item.type ?? '',
              balance: Number(item.walletBalance || 0),
              balanceUsd: Number(item.walletBalanceUsd || 0),
              amount: Number(item.amount || 0),
              amountUsd: Number(item.amountUsd || 0),
              currency: item.currency,
              currencyType: item.currencyType === 'crypto' ? 'crypto' : 'fiat',
              time: item.time,
            }));
            setDataTable(tempBonusData);
            break;
          default:
            break;
        }
        setColumnType(optionFilter.type.type);
        setTotalRows(totalCount);
      } catch (error) {
        setDataTable([]);
      } finally {
        setIsLoading(false);
      }
    },
    [optionFilter, limit, typeBill],
  );

  const getSymbolNameById = (symbolId: string) => {
    const symbol = cryptoSymbols.find((item: any) => item.id === symbolId);
    return symbol ? symbol.name : t('transaction:allAssets');
  };

  const handleClickRow = (row: Row<any>) => {
    if (
      optionFilter.type.type !== TRANSACTION_TYPE.Bill &&
      optionFilter.type.type !== TRANSACTION_TYPE.Bonus &&
      optionFilter.type.type !== TRANSACTION_TYPE.Swap
    ) {
      setIsShowDetailTransaction(true);
      setTransaction({ ...row.original });
    }
  };

  useEffect(() => {
    setPage(1);
    getTransactions(1);
  }, [optionFilter, limit, typeBill]);

  const columns = useMemo(() => {
    switch (columnType) {
      case TRANSACTION_TYPE.Swap:
        return swapColumns;
      case TRANSACTION_TYPE.Bill:
        return billColumns;
      case TRANSACTION_TYPE.Withdraw:
        return withdrawColumns;
      default:
        if (t(optionFilter.type.type) === TRANSACTION_TYPE.Bonus) {
          return bonusColumns;
        }
        return depositColumns;
    }
  }, [columnType, viewInFiat, localFiat, optionFilter, t]);

  useEffect(() => {
    if (activeTransaction.id) {
      if (activeTransaction.status == 0) {
        getTransactions(1);
        return;
      }
      const tempTransactions = [...dataTable];
      if (optionFilter.type.type === TRANSACTION_TYPE.Deposit || optionFilter.type.type === TRANSACTION_TYPE.Withdraw) {
        if (tempTransactions.findIndex((item: any) => item.id === activeTransaction.id) !== -1) {
          const _updatedTransactions = tempTransactions.map((item: any) => {
            if (item.id === activeTransaction.id) {
              item.status = getStatusByIdDeposit(activeTransaction.status);
            }
            return item;
          });
          setDataTable(_updatedTransactions);
        }
      }
    }
  }, [activeTransaction, optionFilter]);

  return (
    <div className={`${styles.cardContent}`}>
      <div className="w-full">
        <div className="flex items-center flex-wrap mb-[20px] sm:mb-[40px] sm:gap-[20px] gap-[10px]">
          <Menu
            as="div"
            className="relative flex py-[10px] px-[20px] min-w-[150px] sm:min-w-[165px] dark:bg-color-select-bg-primary bg-color-light-select-bg-primary rounded-default"
          >
            <Menu.Button className="flex-1">
              <div className="flex items-center justify-between w-full" role="button">
                <div className="flex-1 flex items-center justify-start gap-[10px] text-default">
                  <div className="flex-1 text-black text-start dark:text-white">{t(optionFilter.type.name)}</div>
                </div>
                <div className="flex items-center justify-start gap-[10px]">
                  <ChevronDownIcon className="text-black dark:text-white" width={15} />
                </div>
              </div>
            </Menu.Button>

            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items className="absolute dark:bg-color-select-bg-primary bg-color-light-select-bg-primary shadow-bs-default w-full origin-top-right right-0 top-[50px] z-[10] cursor-pointer rounded-default">
                <div>
                  {LIST_FILTER_TYPE.map((item, index) => (
                    <Menu.Item key={index}>
                      {({ active }) => (
                        <div
                          className="flex items-center justify-start py-[10px] px-[20px] w-full dark:hover:bg-[#FFFFFF11] dark:hover:rounded-default hover:bg-color-light-hover-primary"
                          role="button"
                          onClick={() => setOptionFilter({ ...optionFilter, type: item })}
                        >
                          <div className="flex-1 flex items-center justify-start gap-[10px] text-default">
                            <div className="flex-1 text-black text-start dark:text-white">{t(item.name)}</div>
                          </div>
                        </div>
                      )}
                    </Menu.Item>
                  ))}
                </div>
              </Menu.Items>
            </Transition>
          </Menu>
          <Menu
            as="div"
            className="relative flex py-[10px] px-[20px] min-w-[150px] sm:min-w-[165px] dark:bg-color-select-bg-primary bg-color-light-select-bg-primary rounded-default"
          >
            <Menu.Button className="flex-1">
              <div className="flex items-center justify-between w-full" role="button">
                <div className="flex-1 flex items-center justify-start gap-[10px] text-default">
                  <div className="flex-1 text-black text-start dark:text-white">
                    {getSymbolNameById(optionFilter.currency)}
                  </div>
                </div>
                <div className="flex items-center justify-start gap-[10px]">
                  <ChevronDownIcon className="text-black dark:text-white" width={15} />
                </div>
              </div>
            </Menu.Button>

            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items className="absolute dark:bg-color-select-bg-primary bg-color-light-select-bg-primary shadow-bs-default w-full origin-top-right right-0 top-[50px] z-[10] cursor-pointer rounded-default">
                <div className="py-1">
                  <Menu.Item>
                    {({ active }) => (
                      <div
                        className="flex items-center justify-start py-[10px] px-[20px] w-full dark:hover:bg-[#FFFFFF11] dark:hover:rounded-default hover:bg-color-light-hover-primary"
                        role="button"
                        onClick={() => setOptionFilter({ ...optionFilter, currency: '' })}
                      >
                        <div className="flex-1 flex items-center justify-start gap-[10px] text-default">
                          <div className="flex-1 text-black text-start dark:text-white">{getSymbolNameById('')}</div>
                        </div>
                      </div>
                    )}
                  </Menu.Item>
                  {cryptoSymbols.map((coin: any, index: number) => (
                    <Menu.Item key={index}>
                      {({ active }) => (
                        <div
                          className="flex items-center justify-start py-[10px] px-[20px] w-full dark:hover:bg-[#FFFFFF11] dark:hover:rounded-default hover:bg-color-light-hover-primary"
                          role="button"
                          onClick={() => setOptionFilter({ ...optionFilter, currency: coin.id })}
                        >
                          <div className="flex-1 flex items-center justify-start gap-[10px] text-default">
                            <div className="flex-1 text-black text-start dark:text-white">
                              {getSymbolNameById(coin.id)}
                            </div>
                          </div>
                        </div>
                      )}
                    </Menu.Item>
                  ))}
                </div>
              </Menu.Items>
            </Transition>
          </Menu>
          <Menu
            as="div"
            className="relative flex py-[10px] px-[20px] min-w-[150px] sm:min-w-[165px] dark:bg-color-select-bg-primary bg-color-light-select-bg-primary rounded-default"
          >
            <Menu.Button className="flex-1">
              <div className="flex items-center justify-between w-full" role="button">
                <div className="flex-1 flex items-center justify-start gap-[10px] text-default">
                  <div className="flex-1 text-black text-start dark:text-white">{t(optionFilter.dayPast.name)}</div>
                </div>
                <div className="flex items-center justify-start gap-[10px]">
                  <ChevronDownIcon className="text-black dark:text-white" width={15} />
                </div>
              </div>
            </Menu.Button>

            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items className="absolute dark:bg-color-select-bg-primary bg-color-light-select-bg-primary shadow-bs-default w-full origin-top-right right-0 top-[50px] z-[10] cursor-pointer rounded-default">
                <div className="py-1">
                  {LIST_FILTER_DATE.map((item, index) => (
                    <Menu.Item key={index}>
                      {({ active }) => (
                        <div
                          className="flex items-center justify-start py-[10px] px-[20px] w-full dark:hover:bg-[#FFFFFF11] dark:hover:rounded-default hover:bg-color-light-hover-primary"
                          role="button"
                          onClick={() => setOptionFilter({ ...optionFilter, dayPast: item })}
                        >
                          <div className="flex-1 flex items-center justify-start gap-[10px] text-default">
                            <div className="flex-1 text-black text-start dark:text-white">{t(item.name)}</div>
                          </div>
                        </div>
                      )}
                    </Menu.Item>
                  ))}
                </div>
              </Menu.Items>
            </Transition>
          </Menu>
          {t(optionFilter.type.type) === TRANSACTION_TYPE.Bill && (
            <Menu
              as="div"
              className="relative flex py-[10px] px-[20px] min-w-[150px] sm:min-w-[165px] dark:bg-color-select-bg-primary bg-white rounded-default"
            >
              <Menu.Button className="flex-1">
                <div className="flex items-center justify-between w-full" role="button">
                  <div className="flex-1 flex items-center justify-start gap-[10px] text-default">
                    <div className="flex-1 text-black capitalize text-start dark:text-white">{t(typeBill.name)}</div>
                  </div>
                  <div className="flex items-center justify-start gap-[10px]">
                    <ChevronDownIcon className="text-black dark:text-white" width={15} />
                  </div>
                </div>
              </Menu.Button>

              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="absolute dark:bg-color-select-bg-primary bg-white shadow-bs-default w-full origin-top-right right-0 top-[50px] z-[10] cursor-pointer rounded-default">
                  <div className="py-1">
                    {billTypes.map((item: any, index: number) => (
                      <Menu.Item key={index}>
                        {({ active }) => (
                          <div
                            className="flex items-center justify-start py-[10px] px-[20px] w-full dark:hover:bg-[#FFFFFF11] dark:hover:rounded-default hover:bg-color-light-bg-primary"
                            role="button"
                            onClick={() => setTypeBill(item)}
                          >
                            <div className="flex-1 flex items-center justify-start gap-[10px] text-default">
                              <div className="flex-1 text-black capitalize text-start dark:text-white">
                                {t(item.name)}
                              </div>
                            </div>
                          </div>
                        )}
                      </Menu.Item>
                    ))}
                  </div>
                </Menu.Items>
              </Transition>
            </Menu>
          )}
          {t(optionFilter.type.type) === TRANSACTION_TYPE.Withdraw && (
            <Menu
              as="div"
              className="relative flex py-[10px] px-[20px] min-w-[150px] sm:min-w-[165px] dark:bg-color-select-bg-primary bg-color-light-select-bg-primary rounded-default"
            >
              <Menu.Button className="flex-1">
                <div className="flex items-center justify-between w-full" role="button">
                  <div className="flex-1 flex items-center justify-start gap-[10px] text-default">
                    <div className="flex-1 text-black text-start dark:text-white">
                      {t(optionFilter?.filterStatus.name)}
                    </div>
                  </div>
                  <div className="flex items-center justify-start gap-[10px]">
                    <ChevronDownIcon className="text-black dark:text-white" width={15} />
                  </div>
                </div>
              </Menu.Button>

              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="absolute dark:bg-color-select-bg-primary bg-color-light-select-bg-primary shadow-bs-default w-full origin-top-right right-0 top-[50px] z-[10] cursor-pointer rounded-default">
                  <div className="py-1">
                    {LIST_FILTER_STATUS.filter((status) => status.flag).map((item, index) => (
                      <Menu.Item key={index}>
                        {({ active }) => (
                          <div
                            className="flex items-center justify-start py-[10px] px-[20px] w-full dark:hover:bg-[#FFFFFF11] dark:hover:rounded-default hover:bg-color-light-bg-primary"
                            role="button"
                            onClick={() => setOptionFilter({ ...optionFilter, filterStatus: item })}
                          >
                            <div className="flex-1 flex items-center justify-start gap-[10px] text-default">
                              <div className="flex-1 text-black text-start dark:text-white">{t(item.name)}</div>
                            </div>
                          </div>
                        )}
                      </Menu.Item>
                    ))}
                  </div>
                </Menu.Items>
              </Transition>
            </Menu>
          )}
        </div>
        <div className="rounded-lg overflow-hidden border border-solid border-color-card-border-primary">
          <TableComponent isLoading={isLoading} handleClickRow={handleClickRow} data={dataTable} columns={columns} />
        </div>
        <Paging
          onPageChange={handleChangePage}
          itemPerPage={limit}
          totalItem={totalRows}
          currentPage={page}
          setItemPerPage={handleChangeItemPerPage}
          hiddenPerPage={true}
        />
        {isShowDetailTransaction && (
          <ModalDetailTransaction
            show={isShowDetailTransaction}
            titleModal={String(t('transaction:transactionDetail'))}
            onClose={() => {
              setIsShowDetailTransaction(false);
            }}
            transaction={transaction}
            type={optionFilter.type.type}
          />
        )}
      </div>
    </div>
  );
};

const TransactionPageAuth = withAuth(TransactionPage);

TransactionPageAuth.getLayout = function getLayout(page: ReactElement) {
  return <DepositLayout>{page}</DepositLayout>;
};

export default TransactionPageAuth;
