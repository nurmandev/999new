import { DialogProps, TransitionRootProps } from '@headlessui/react';
import { ColumnDef } from '@tanstack/react-table';
import cn from 'classnames';
import { ElementType, useCallback, useEffect, useMemo, useState } from 'react';

import { api_referralRule } from '@/api/bonus';
import { useTranslation } from '@/base/config/i18next';
import AdminTableComponent from '@/components/table/adminTable';

import CommonModal from '../commonModal/commonModal';

type ModalReferralRewardsRuleProps = {
  onClose: () => void;
  show: boolean;
} & TransitionRootProps<ElementType> &
  DialogProps<ElementType>;

type RewardRuleType = {
  level: number;
  xp: number;
  earned: number;
};

export default function ModalReferralRewardsRule({ show, onClose }: ModalReferralRewardsRuleProps) {
  const { t } = useTranslation('');
  const [rewardsHistory, setRewardsHistory] = useState<RewardRuleType[]>([]);

  const columns: ColumnDef<RewardRuleType>[] = useMemo(() => {
    return [
      {
        accessorKey: 'level',
        header: () => <div className="text-center text-white">{String(t('mycasino:vipLevel'))}</div>,
        cell: ({ row }) => (
          <div
            className={cn('flex items-center justify-center text-black gap-[5px] truncate text-default font-bold')}
          >{`VIP ${row.original.level}`}</div>
        ),
        minSize: 30,
      },
      {
        accessorKey: 'xp',
        header: () => <div className="text-center text-white">XP</div>,
        cell: ({ row }) => (
          <div className={cn('flex items-center justify-center text-black gap-[5px] truncate text-default font-bold')}>
            {row.original.xp}
          </div>
        ),
        minSize: 30,
      },
      {
        accessorKey: 'earned',
        header: () => <div className="text-center text-white">{String(t('mycasino:earned', { symbol: 'USDT ' }))}</div>,
        cell: ({ row }) => (
          <div
            className={cn(
              'flex items-center justify-center text-color-secondary font-bold gap-[5px] truncate text-default font-bold',
            )}
          >
            {row.original.earned}
          </div>
        ),
        minSize: 30,
      },
    ];
  }, []);

  const getReferralRewardsRule = useCallback(async () => {
    try {
      const _res = await api_referralRule();
      const data = _res.data;
      const tempRewardsHistory = data.map((item: any) => ({
        level: Number(item.level || 0),
        xp: Number(item.xp || 0),
        earned: Number(item.earned || 0),
      }));
      setRewardsHistory(tempRewardsHistory);
    } catch (error) {}
  }, []);

  useEffect(() => {
    getReferralRewardsRule();
  }, []);

  return (
    <>
      <CommonModal
        show={show}
        onClose={onClose}
        panelClass="sm:!max-w-[530px]"
        header={<div className="modal-header">{t('mycasino:abountReward')}</div>}
      >
        <div className="flex flex-col gap-[12px] overflow-y-auto sm:px-[30px] px-[20px] py-[40px] h-full bg-white">
          <div className="text-color-light-text-primary">{t('mycasino:aboutRewardDescription')}</div>
          <AdminTableComponent columns={columns} data={rewardsHistory} />
        </div>
      </CommonModal>
    </>
  );
}
