import { ColumnDef } from '@tanstack/react-table';
import Image from 'next/image';
import { useTheme } from 'next-themes';
import { useEffect, useMemo, useState } from 'react';
import { shallowEqual, useSelector } from 'react-redux';

import { api_getContestHistory } from '@/api/user';
import { useTranslation } from '@/base/config/i18next';
import { useExchange } from '@/base/hooks/useExchange';
import { currencyFormat1, formatDate } from '@/base/libs/utils';
import { AppState } from '@/base/redux/store';
import { UserDetail, WagerDetail } from '@/base/types/common';
import Paging from '@/components/paging/paging';
import RankingTableComponent from '@/components/table/rankingTable';

type WagerContestProps = {
  userData?: UserDetail;
};

const fiatDecimals = 4;
const cryptoDecimals = 8;

export default function WagerContest({ userData }: WagerContestProps) {
  const exchangeRate = useExchange();
  const { t } = useTranslation('');
  const { theme } = useTheme();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [page, setPage] = useState(1);
  const [limit] = useState(5);
  const [totalRows, setTotalRows] = useState(0);
  const [listWager, setListWager] = useState<WagerDetail[]>([]);

  const { localFiat, viewInFiat } = useSelector(
    (state: AppState) => ({
      localFiat: state.wallet.localFiat,
      viewInFiat: state.auth.user.generalSetting.settingViewInFiat,
      userId: state.auth.user.userId,
    }),
    shallowEqual,
  );

  const wagerColumns = useMemo(() => {
    const wagerColumnsDefault: ColumnDef<WagerDetail>[] = [
      {
        accessorKey: 'date',
        header: () => <div className="text-left text-[14px] font-normal pl-2 sm:pl-4">{t('profile:date')}</div>,
        cell: ({ row }) => (
          <div className="font-medium text-[12px] sm:text-[14px] text-left dark:text-[#98a7b5] text-[#000] truncate pl-2 sm:pl-4 py-2 sm:py-3">
            {formatDate(new Date(row.original?.date || ''), 'L/dd/yyyy')} {t('profile:daily')}
          </div>
        ),
      },
      {
        accessorKey: 'position',
        header: () => <div className="text-center text-[14px] font-normal">{t('profile:position')}</div>,
        cell: ({ row }) => (
          <div className="font-medium text-[12px] sm:text-[14px] dark:text-white text-[#000] truncate text-center">
            {row.original.position}
            {row.original.position === 1
              ? 'st'
              : row.original.position === 2
              ? 'nd'
              : row.original.position === 3
              ? 'rd'
              : 'th'}
          </div>
        ),
      },
      {
        accessorKey: 'prize',
        header: () => <div className="text-right text-[14px] font-normal pr-2">{t('profile:prize')}</div>,
        cell: ({ row }) => (
          <div className="text-[#98A7B5] truncate flex items-center justify-end gap-[5px] pr-2">
            <span className="dark:text-white text-black font-bold text-[12px] sm:text-[14px]">
              {viewInFiat
                ? currencyFormat1(row.original.prizeUsd * exchangeRate, fiatDecimals, localFiat?.name)
                : currencyFormat1(row.original?.prize, cryptoDecimals, '', false)}
            </span>
            <Image height={20} width={20} src={row.original?.currencyLogo} alt="symbol" />
          </div>
        ),
      },
    ];
    return wagerColumnsDefault;
  }, [t]);

  useEffect(() => {
    if (userData) getUserWagerContestList();
  }, [page, userData]);

  const getUserWagerContestList = async () => {
    try {
      setIsLoading(true);
      setListWager([]);
      const wager = await api_getContestHistory(userData?.userId || '', page, limit);
      const wagerContestLength = wager.data.totalCount;
      const wagerContests = wager.data.contest.map((contest: WagerDetail) => ({
        date: contest.date || '',
        position: contest.position || 1,
        prize: contest.prize || 0,
        prizeUsd: contest.prizeUsd || 0,
        currencyLogo: contest.currencyLogo || '',
      }));
      setListWager(wagerContests);
      setTotalRows(wagerContestLength);
    } catch (error) {
      setListWager([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangePage = (action: string) => {
    let newPage: number;
    newPage = action === 'Next' ? page + 1 : action === 'Prev' ? page - 1 : +action;
    setPage(newPage);
  };

  return (
    <div className="px-2 sm:px-4">
      <div className="mt-[24px] w-full">
        <RankingTableComponent
          isLoading={isLoading}
          containerClassName="w-full"
          data={listWager}
          columns={wagerColumns}
        />
      </div>
      {totalRows > 0 && (
        <Paging onPageChange={handleChangePage} itemPerPage={limit} totalItem={totalRows} currentPage={page} />
      )}
    </div>
  );
}
