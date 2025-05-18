import { DialogProps, TransitionRootProps } from '@headlessui/react';
import { ColumnDef } from '@tanstack/react-table';
import cn from 'classnames';
import { ArrowLeft2 } from 'iconsax-react';
import Image from 'next/image';
import { ElementType, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { shallowEqual, useSelector } from 'react-redux';

import { api_getSpinLatest } from '@/api/spin';
import { AppState } from '@/base/redux/store';
import RankingTableComponent from '@/components/table/rankingTable';

import CommonModal from '../commonModal/commonModal';

type SpinDataType = {
  userName: string;
  userAvatar: string;
  amount: number;
  amountUsd: number;
  symbol: string;
  symbolLogo: string;
  type: string;
};

type ModalLatestSpinsProps = {
  onClose: () => void;
  show: boolean;
} & TransitionRootProps<ElementType> &
  DialogProps<ElementType>;

export default function ModalLatestSpins({ show, onClose }: ModalLatestSpinsProps) {
  const { t } = useTranslation('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [latestSpins, setLatestSpins] = useState<SpinDataType[]>([]);
  const { isLogin } = useSelector(
    (state: AppState) => ({
      isLogin: state.auth.isLogin,
    }),
    shallowEqual,
  );
  const getLatestSpin = async () => {
    try {
      setIsLoading(true);
      const res = await api_getSpinLatest();
      const tempLatestSpin = res.data.map((item: any) => ({
        amount: item?.amount || 0,
        amountUsd: item?.amountUsd || 0,
        symbol: item?.symbol || '',
        symbolLogo: item?.symbolLogo || '',
        type: item?.type || '',
        userAvatar: item?.userAvatar || '',
        userName: item?.userName || '',
      }));
      setLatestSpins(tempLatestSpin.slice(0, 20));
    } catch (error) {
      setLatestSpins([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (show) {
      getLatestSpin();
    }
  }, [show, isLogin]);

  const spinColumns: ColumnDef<SpinDataType>[] = [
    {
      accessorKey: 'username',
      header: () => (
        <div className="dark:text-color-text-primary text-color-light-text-primary sm:px-2 px-[5px]">
          {t('profile:username')}
        </div>
      ),
      minSize: 30,
      cell: ({ row }) => (
        <div className="dark:text-color-text-primary text-color-light-text-primary sm:px-2 px-[5px] text-[10px] sm:text-m_default truncate max-w-[100px]">
          {row.original?.userName || ''}
        </div>
      ),
    },
    {
      accessorKey: 'spinLevel',
      header: () => (
        <div className="dark:text-color-text-primary text-color-light-text-primary sm:px-2 px-[5px]">
          {t('bonus:spinLevel')}
        </div>
      ),
      minSize: 30,
      cell: ({ row }) => (
        <div className="dark:text-color-text-primary text-color-light-text-primary sm:px-2 px-[5px] text-[10px] sm:text-m_default truncate">
          {row.original?.type || ''}
        </div>
      ),
    },
    {
      accessorKey: 'prize',
      header: () => (
        <div className="dark:text-color-text-primary text-color-light-text-primary sm:px-2 px-[5px]">
          {t('profile:prize')}
        </div>
      ),
      minSize: 30,
      cell: ({ row }) => (
        <div className="dark:text-color-text-primary text-color-light-text-primary min-w-[120px] sm:pr-2 pr-[5px] text-[10px] sm:text-m_default font-bold truncate flex gap-1 items-center justify-end">
          {row.original?.amount || ''}
          <Image
            width={25}
            height={25}
            className="ml-2 w-[16px] h-[16px]"
            src={row.original?.symbolLogo || '/img/fiats/USD.png'}
            alt="currency"
          />
        </div>
      ),
    },
  ];
  return (
    <>
      <CommonModal
        show={show}
        onClose={onClose}
        panelClass="sm:rounded max-w-full sm:!h-auto sm:max-w-[400px] !bg-transparent"
        position="flex-col justify-center items-center"
      >
        <div className="sm:rounded-large h-full overflow-hidden bg-[url('/img/spin/lucky-bg.png')] bg-cover relative">
          <div
            className={cn(
              'absolute top-[20px] left-[20px]',
              'dark:text-color-text-primary dark:hover:text-white text-color-light-text-primary hover:text-black',
            )}
            role="button"
            onClick={onClose}
          >
            <ArrowLeft2 width={16} className="stroke-[3]" />
          </div>
          <div className="w-[60%] object-cover m-auto py-4">
            <Image width={230} height={233} alt="spin" src="/img/spin/spin-winners.png" />
          </div>
          <div
            className={cn(
              'bg-black mx-4 mb-4 rounded-large overflow-hidden overflow-y-scroll ',
              'max-h-[calc(100vh-202px)] sm:max-h-[calc(100vh-162px)]',
            )}
          >
            <RankingTableComponent
              containerClassName="w-full"
              isLoading={isLoading}
              data={latestSpins}
              columns={spinColumns}
              isHeadInvisible
            />
          </div>
        </div>
      </CommonModal>
    </>
  );
}
