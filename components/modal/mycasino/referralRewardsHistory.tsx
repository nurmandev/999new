import { DialogProps, TransitionRootProps } from '@headlessui/react';
import { ColumnDef } from '@tanstack/react-table';
import { useRouter } from 'next/router';
import { ElementType, useCallback, useEffect, useMemo, useState } from 'react';

import { api_referralHistory } from '@/api/bonus';
import { useTranslation } from '@/base/config/i18next';
import { DATE_TIME_SUBMIT_FORMAT_WITH_SECOND } from '@/base/constants/common';
import { useExchange } from '@/base/hooks/useExchange';
import { formatDate } from '@/base/libs/utils';
import Paging from '@/components/paging/paging';
import AdminTableComponent from '@/components/table/adminTable';

import CommonModal from '../commonModal/commonModal';

type ModalProfileProps = {
  onClose: () => void;
  show: boolean;
} & TransitionRootProps<ElementType> &
  DialogProps<ElementType>;

type RewardHistoryType = {
  amount: number;
  status: string;
  time: string;
};

export default function ModalReferralRewardsHistory({ show, onClose }: ModalProfileProps) {
  const { t } = useTranslation('');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalRows, setTotalRows] = useState(0);
  const [rewardsHistory, setRewardsHistory] = useState<RewardHistoryType[]>([]);

  const columns: ColumnDef<RewardHistoryType>[] = useMemo(() => {
    return [
      {
        accessorKey: 'amount',
        header: () => <div className="text-left dark:text-[#64748b] text-black">{String(t('transaction:amount'))}</div>,
        cell: ({ row }) => (
          <div className="dark:text-white text-black text-left truncate py-2">{row.original.amount}</div>
        ),
        minSize: 30,
      },
      {
        accessorKey: 'status',
        header: () => <div className="text-left dark:text-[#64748b] text-black">{String(t('mycasino:status'))}</div>,
        cell: ({ row }) => (
          <div className="dark:text-white text-black text-left truncate py-2">{row.original.status}</div>
        ),
        minSize: 30,
      },
      {
        accessorKey: 'time',
        header: () => <div className="text-left dark:text-[#64748b] text-black">{String(t('historyBonus:time'))}</div>,
        cell: ({ row }) => (
          <div className="dark:text-white text-black text-left truncate py-2">
            {formatDate(new Date(row.original.time), DATE_TIME_SUBMIT_FORMAT_WITH_SECOND)}
          </div>
        ),
        minSize: 30,
      },
    ];
  }, []);

  const handleChangePage = (action: string) => {
    let newPage: number;
    newPage = action === 'Next' ? page + 1 : action === 'Prev' ? page - 1 : +action;
    setPage(newPage);
  };

  const handleChangeItemPerPage = (itemPerPage: number) => {
    setLimit(itemPerPage);
    setPage(1);
  };

  const getReferralRewardsHistory = useCallback(async () => {
    try {
      const _res = await api_referralHistory(page, limit);
      const { totalCount, totalPage, rewards } = _res.data;
      const tempRewardsHistory = rewards.map((item: any) => ({
        amount: Number(item.amount || 0),
        status: item.status ?? '',
        time: item.time,
      }));
      setTotalRows(totalCount);
      setRewardsHistory(tempRewardsHistory);
    } catch (error) {}
  }, [page, limit]);

  useEffect(() => {
    getReferralRewardsHistory();
  }, []);

  return (
    <>
      <CommonModal
        show={show}
        onClose={onClose}
        panelClass="sm:!max-w-[530px]"
        header={<div className="modal-header">{t('mycasino:history')}</div>}
      >
        <div className="flex flex-col gap-[12px] overflow-y-auto sm:px-[30px] px-[20px] py-[40px] h-full bg-white">
          <AdminTableComponent columns={columns} data={rewardsHistory} />
          <Paging
            onPageChange={handleChangePage}
            itemPerPage={limit}
            totalItem={totalRows}
            currentPage={page}
            setItemPerPage={handleChangeItemPerPage}
            hiddenPerPage={true}
          />
        </div>
      </CommonModal>
    </>
  );
}
