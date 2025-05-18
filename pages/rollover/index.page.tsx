import { Menu, Transition } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import { ColumnDef, Row } from '@tanstack/react-table';
import cn from 'classnames';
import { camelize } from 'humps';
import { ArrowRight2 } from 'iconsax-react';
import Head from 'next/head';
import Image from 'next/image';
import { useTheme } from 'next-themes';
import React, { Fragment, ReactElement, useCallback, useEffect, useMemo, useState } from 'react';
import { shallowEqual, useSelector } from 'react-redux';

import { api_getRollover } from '@/api/wallet';
import { useTranslation } from '@/base/config/i18next';
import {
  DATE_FORMAT_DEFAULT,
  TIME_SUBMIT_FORMAT_WITH_SECOND,
  TIME_SUBMIT_FORMAT_WITH_SLASH_MARKER,
} from '@/base/constants/common';
import { useExchange } from '@/base/hooks/useExchange';
import { useWidth } from '@/base/hooks/useWidth';
import { currencyFormat1, formatDate } from '@/base/libs/utils';
import { AppState } from '@/base/redux/store';
import { RolloverStatus, RolloverType } from '@/base/types/common';
import withAuth from '@/components/hoc/withAuth';
import DepositLayout from '@/components/layouts/deposit.layout';
import ModalDetailsRollover from '@/components/modal/rolloverDetail/RolloverDetail';
import Paging from '@/components/paging/paging';
import TableComponent from '@/components/table';

const LIST_FILTER_TYPE = [
  { name: 'transaction:allType', id: 1 },
  { name: 'transaction:deposit', id: 2 },
  { name: 'transaction:Bonus', id: 3 },
];

const LIST_FILTER_STATUS = [
  { name: 'transaction:allStatus', type: 'all' },
  { name: 'transaction:notStarted', type: 'not_started' },
  { name: 'transaction:onGoing', type: 'ongoing' },
  { name: 'transaction:done', type: 'done' },
];

const LIST_FILTER_EVENT_BONUS = [
  { name: 'transaction:bonusType', type: null },
  { name: 'transaction:newbieTaskRewards', type: 60 },
  { name: 'transaction:depositBonus', type: 1 },
  { name: 'transaction:freeSpinWinnings', type: 7 },
  { name: 'transaction:newbieLuckySpinBonus', type: 90 },
  { name: 'transaction:eventBonus', type: 90 },
];

const RolloverPage = () => {
  const exchange = useExchange();
  const { theme } = useTheme();
  const { t, i18n } = useTranslation('');
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [totalTable, setTotalTable] = useState<number>(0);
  const [dataTable, setDataTable] = useState<RolloverType[]>([]);
  const [isShowDetailTransaction, setIsShowDetailTransaction] = useState<boolean>(false);
  const width = useWidth();

  const [transaction, setTransaction] = useState<RolloverType>({
    id: '',
    type: '',
    amount: 0,
    amountUsd: 0,
    pendingWagerRequiredAmount: 0,
    pendingWagerRequiredUsdAmount: 0,
    wagerCompletedAmount: 0,
    wagerCompletedUsdAmount: 0,
    withdrawableFundsAmount: 0,
    withdrawableFundsUsdAmount: 0,
    currency: '',
    currencyLogo: '',
    status: 'not_started',
    times: 0,
    createdAt: new Date(),
  });

  const { localFiat, viewInFiat } = useSelector(
    (state: AppState) => ({
      localFiat: state.wallet.localFiat,
      viewInFiat: state.auth.user.generalSetting.settingViewInFiat,
    }),
    shallowEqual,
  );

  const [optionFilter, setOptionFilter] = useState({
    type: LIST_FILTER_TYPE[0],
    bonusEvent: LIST_FILTER_EVENT_BONUS[0],
    status: LIST_FILTER_STATUS[0],
  });

  const replaceStatus = (status: string) => {
    return status.split('_').join(' ');
  };

  const columns: ColumnDef<RolloverType>[] = useMemo(() => {
    if (width > 1024) {
      return [
        {
          accessorKey: 'type',
          header: () => (
            <div className="text-left text-black dark:text-color-text-primary">{String(t('transaction:type'))}</div>
          ),
          cell: ({ row }) => (
            <div className="py-2 text-left text-black truncate dark:text-white">
              {String(t(`transaction:${row.original?.type.indexOf('_') >= 0 ? camelize(row.original?.type || '') : row.original.type.toLowerCase()}`))}{' '}
            </div>
          ),
          minSize: 20,
        },
        {
          accessorKey: 'amount',
          header: () => (
            <div className="text-center text-black dark:text-color-text-primary">{String(t('transaction:amount'))}</div>
          ),
          cell: ({ row }) => (
            <div
              className={`${optionFilter.type.name === 'Withdraw' ? 'text-red-500' : 'text-color-text-green'
                } flex items-center justify-center gap-1`}
            >
              {optionFilter.type.name === 'Withdraw' ? '-' : ''}
              {viewInFiat ? (
                <>{currencyFormat1(Math.abs(row.original.amountUsd) * exchange, 2, localFiat?.name || 'USD')}</>
              ) : (
                currencyFormat1(Math.abs(row.original.amount), 4, '', false)
              )}

              <Image height={20} width={20} src={`${row.original?.currencyLogo}`} alt="symbol" />
            </div>
          ),
          minSize: 150,
        },
        {
          accessorKey: 'time',
          header: () => (
            <div className="text-center text-black dark:text-color-text-primary">{String(t('transaction:time'))}</div>
          ),
          cell: ({ row }) => (
            <div className="flex flex-col text-center text-black dark:text-white sm:flex-row">
              <div className="flex flex-col sm:hidden">
                <span>{formatDate(new Date(row.original.createdAt), TIME_SUBMIT_FORMAT_WITH_SECOND)}</span>
                <span>{formatDate(new Date(row.original.createdAt), DATE_FORMAT_DEFAULT)}</span>
              </div>
              <div className="hidden sm:block">
                {formatDate(new Date(row.original.createdAt), TIME_SUBMIT_FORMAT_WITH_SLASH_MARKER)}
              </div>
            </div>
          ),
          minSize: 100,
        },
        {
          accessorKey: 'status',
          header: () => (
            <div className="text-right text-black dark:text-color-text-primary">{String(t('transaction:status'))}</div>
          ),
          cell: ({ row }) => (
            <div className="flex items-center justify-end gap-2 cursor-pointer">
              <div
                className={cn('w-[8px] h-[8px] rounded-full', {
                  'bg-color-secondary':
                    row.original.status.toString() === 'processing' ||
                    row.original.status.toString() === 'pending' ||
                    row.original.status.toString() === 'refunding' ||
                    row.original.status.toString() === 'ongoing',
                  'bg-color-red':
                    row.original.status.toString() === 'rejected' ||
                    row.original.status.toString() === 'failed' ||
                    row.original.status.toString() === 'not_started',
                  'bg-color-text-green':
                    row.original.status.toString() === 'done' ||
                    row.original.status.toString() === 'all' ||
                    row.original.status.toString() === 'complete' ||
                    row.original.status.toString() === 'approved',
                })}
              ></div>
              <div className="text-black dark:text-white break-keep ">
                {String(t(`transaction:${row.original.status.indexOf('_') >= 0 ? camelize(row.original.status || '') : row.original.status.toLowerCase()}`))}{' '}
              </div>
              <ArrowRight2 className="h-[16px] w-[16px] dark:text-color-text-primary text-[#31373d]" />
            </div>
          ),
          maxSize: 30,
          minSize: 30,
        },
      ];
    }
    return [
      {
        accessorKey: 'type',
        header: () => (
          <div className="pl-2 text-left text-black dark:text-color-text-primary">{String(t('transaction:type'))}</div>
        ),
        cell: ({ row }) => (
          <div className="min-w-[120px]">
            <div className="py-2 text-left text-black truncate dark:text-white">{row.original.type}</div>
            <div className="text-left text-black dark:text-white">
              {formatDate(new Date(row.original.createdAt), TIME_SUBMIT_FORMAT_WITH_SLASH_MARKER)}
            </div>
          </div>
        ),
      },
      {
        accessorKey: 'amount',
        header: () => (
          <div className="text-center text-black dark:text-color-text-primary">{String(t('transaction:amount'))}</div>
        ),
        cell: ({ row }) => (
          <div
            className={`${optionFilter.type.name === 'Withdraw' ? 'text-red-500' : 'text-color-text-green'
              } flex items-center justify-center gap-1`}
          >
            {optionFilter.type.name === 'Withdraw' ? '-' : ''}
            {viewInFiat ? (
              <>{currencyFormat1(Math.abs(row.original.amountUsd) * exchange, 2, localFiat?.name || 'USD')}</>
            ) : (
              currencyFormat1(Math.abs(row.original.amount), 4, '', false)
            )}

            <Image height={20} width={20} src={`${row.original?.currencyLogo}`} alt="symbol" />
          </div>
        ),
      },
      {
        accessorKey: 'status',
        header: () => (
          <div className="pr-2 text-right text-black dark:text-color-text-primary">
            {String(t('transaction:status'))}
          </div>
        ),
        cell: ({ row }) => (
          <div className="flex items-center justify-end gap-2 cursor-pointer">
            <div
              className={cn('w-[8px] h-[8px] rounded-full', {
                'bg-color-secondary':
                  row.original.status.toString() === 'processing' ||
                  row.original.status.toString() === 'pending' ||
                  row.original.status.toString() === 'refunding' ||
                  row.original.status.toString() === 'ongoing',
                'bg-color-red':
                  row.original.status.toString() === 'rejected' ||
                  row.original.status.toString() === 'failed' ||
                  row.original.status.toString() === 'not_started',
                'bg-color-text-green':
                  row.original.status.toString() === 'done' ||
                  row.original.status.toString() === 'all' ||
                  row.original.status.toString() === 'complete' ||
                  row.original.status.toString() === 'approved',
              })}
            ></div>
            <div className="text-black dark:text-white break-keep ">
              {replaceStatus(row.original.status)?.charAt(0).toUpperCase() +
                replaceStatus(row.original.status)?.slice(1)}
            </div>
            <ArrowRight2 className="h-[16px] w-[16px] dark:text-color-text-primary text-[#31373d]" />
          </div>
        ),
      },
    ];
  }, [localFiat, i18n.language, exchange, viewInFiat, width]);

  const getRolloverOverview = useCallback(
    async (page: number) => {
      if (optionFilter.type.name === LIST_FILTER_TYPE[2].name) {
        setDataTable([]);
        setTotalTable(0);
        return;
      }
      try {
        setIsLoading(true);
        const _res = await api_getRollover({
          page,
          pageSize: limit,
          status: optionFilter.status.type as RolloverStatus,
        });
        const totalCount = _res.data?.totalCount;
        const tempRollovers: RolloverType[] = _res.data?.transactions?.map((item: any) => ({
          id: item?.id ?? '',
          type: item.type,
          amount: Number(item?.amount || 0),
          amountUsd: Number(item?.amountUsd || 0),
          pendingWagerRequiredAmount: Number(item?.pendingWagerRequiredAmount || 0),
          pendingWagerRequiredUsdAmount: Number(item?.pendingWagerRequiredAmountUsd || 0),
          wagerCompletedAmount: Number(item?.wagerCompletedAmount || 0),
          wagerCompletedUsdAmount: Number(item?.wagerCompletedAmountUsd || 0),
          withdrawableFundsAmount: Number(item?.withdrawableFundsAmount || 0),
          withdrawableFundsUsdAmount: Number(item?.withdrawableFundsAmountUsd || 0),
          currency: item?.currencySymbol ?? 'USD',
          currencyLogo: item?.currencyLogo ?? '/image/fiats/USD.png',
          status: item?.rollover ?? 'not_started',
          times: item?.times ?? 0,
          createdAt: new Date(item?.time ?? ''),
        }));
        setDataTable(tempRollovers);
        setTotalTable(totalCount);
      } catch (error) {
        setDataTable([]);
        setTotalTable(0);
      } finally {
        setIsLoading(false);
      }
    },
    [limit, optionFilter],
  );

  const handleClickRow = (row: Row<any>) => {
    setIsShowDetailTransaction(true);
    setTransaction(row.original);
  };

  const handleChangePage = (action: string) => {
    let newPage: number;
    newPage = action === 'Next' ? page + 1 : action === 'Prev' ? page - 1 : +action;
    setPage(newPage);
    getRolloverOverview(newPage);
  };

  const handleChangeItemPerPage = (itemPerPage: number) => {
    setLimit(itemPerPage);
    setPage(1);
  };

  useEffect(() => {
    setPage(1);
    getRolloverOverview(1);
  }, [optionFilter, limit]);

  return (
    <>
      <div>
        <div className="w-full h-1/3 sm:min-h-[400px]">
          <div className="flex items-center flex-wrap mb-[20px] sm:mb-[40px] sm:gap-[20px] gap-[10px]">
            <Menu
              as="div"
              className="relative flex py-[10px] px-[20px] min-w-[150px] sm:min-w-[165px] dark:bg-color-select-bg-primary bg-color-light-select-bg-primary rounded-default"
            >
              <Menu.Button className="flex-1">
                <div className="flex items-center justify-between w-full" role="button">
                  <div className="flex-1 flex items-center justify-start gap-[10px] sm:text-[14px] text-[12px]">
                    <div className="flex-1 text-black text-start dark:text-white">{t(optionFilter.status.name)}</div>
                  </div>
                  <div className="flex items-center justify-start gap-[10px]">
                    <ChevronDownIcon className="text-black  dark:text-white" width={15} />
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
                    {LIST_FILTER_STATUS.map((item, index) => (
                      <Menu.Item key={index}>
                        {({ active }) => (
                          <div
                            className="flex items-center justify-start py-[10px] px-[16px] w-full dark:hover:bg-[#FFFFFF11] dark:hover:rounded-default hover:bg-[#f5f6fa]"
                            role="button"
                            onClick={() => setOptionFilter({ ...optionFilter, status: item })}
                          >
                            <div className="flex-1 flex items-center justify-start gap-[10px] sm:text-[14px] text-[12px]">
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
          </div>
          <TableComponent isLoading={isLoading} handleClickRow={handleClickRow} data={dataTable} columns={columns} />
          <Paging
            onPageChange={handleChangePage}
            itemPerPage={limit}
            totalItem={totalTable}
            currentPage={page}
            setItemPerPage={handleChangeItemPerPage}
            hiddenPerPage={true}
          />
          <ModalDetailsRollover
            show={isShowDetailTransaction}
            titleModal={String(t('transaction:transactionDetail'))}
            onClose={() => {
              setIsShowDetailTransaction(false);
            }}
            transaction={transaction}
            type={optionFilter.type.name}
          />
        </div>
      </div>
    </>
  );
};

const RolloverPageAuth = withAuth(RolloverPage);

RolloverPageAuth.getLayout = function getLayout(page: ReactElement) {
  return <DepositLayout>{page}</DepositLayout>;
};

export default RolloverPageAuth;
