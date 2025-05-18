import { DialogProps, TransitionRootProps } from '@headlessui/react';
import { ColumnDef } from '@tanstack/react-table';
import cn from 'classnames';
import { ArrowLeft2 } from 'iconsax-react';
import Image from 'next/image';
import { ElementType, useCallback, useEffect, useMemo, useState } from 'react';
import { shallowEqual, useSelector } from 'react-redux';

import { api_bonusUsdtHistory } from '@/api/bonus';
import { useTranslation } from '@/base/config/i18next';
import { DATE_FORMAT_DEFAULT, TIME_SUBMIT_FORMAT_WITH_SECOND } from '@/base/constants/common';
import { useExchange } from '@/base/hooks/useExchange';
import { currencyFormat1, formatDate } from '@/base/libs/utils';
import { AppState } from '@/base/redux/store';
import { BonusTransactionType, FiatType } from '@/base/types/common';
import Paging from '@/components/paging/paging';
import TableComponent from '@/components/table';

import CommonModal from '../../commonModal/commonModal';

type ModalBonusHistory = {
  cryptoLocked?: FiatType;
  onClose: () => void;
  show: boolean;
  setShowModalRakeBack: () => void;
} & TransitionRootProps<ElementType> &
  DialogProps<ElementType>;

export default function ModalBonusHistory({ show, onClose, setShowModalRakeBack }: ModalBonusHistory) {
  const exchangeRate = useExchange();
  const { t } = useTranslation('');
  const [isLoadingTable, setIsLoadingTable] = useState<boolean>(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [listTransactions, setListTransactions] = useState<BonusTransactionType[]>([]);
  const [totalRows, setTotalRows] = useState<number>(0);
  const { localFiat, viewInFiat, isLogin } = useSelector(
    (state: AppState) => ({
      isLogin: state.auth.isLogin,
      localFiat: state.wallet.localFiat,
      viewInFiat: state.auth.user.generalSetting.settingViewInFiat,
    }),
    shallowEqual,
  );

  const handleChangePage = async (action: string) => {
    let newPage: number;
    newPage = action === 'Next' ? page + 1 : action === 'Prev' ? page - 1 : +action;
    setPage(newPage);
    await getListBonusTransaction();
  };

  const handleChangeItemPerPage = async (itemPerPage: number) => {
    setLimit(itemPerPage);
    setPage(1);
    await getListBonusTransaction();
  };

  const getListBonusTransaction = useCallback(async () => {
    try {
      setIsLoadingTable(true);
      const _res = await api_bonusUsdtHistory(page, limit);
      const tempListTransactionData: BonusTransactionType[] = _res.data.bonuses?.map((item: any) => ({
        amount: Number(item?.amount || 0),
        amountUsd: Number(item?.amountUsd || 0),
        type: item?.type ?? '',
        time: item.date,
        symbol: item?.symbol ?? 'USDT',
        symbolLogo: item?.symbolLogo ?? '',
      }));
      const totalCounts = Number(_res.data?.totalCount || 0);
      setListTransactions(tempListTransactionData);
      setTotalRows(totalCounts);
    } catch (error) {
    } finally {
      setIsLoadingTable(false);
    }
  }, [page, limit]);

  const columns = useMemo(() => {
    const columnsDefault: ColumnDef<BonusTransactionType>[] = [
      {
        accessorKey: 'createdAt',
        header: () => (
          <div className="font-normal text-left text-default text-color-text">{t('historyBonus:time')}</div>
        ),
        cell: ({ row }) => (
          <div className="text-color-text-primary truncate flex flex-col items-start justify-start gap-[5px] text-default">
            <span>{formatDate(new Date(row.original.time), TIME_SUBMIT_FORMAT_WITH_SECOND)}</span>
            <span>{formatDate(new Date(row.original.time), DATE_FORMAT_DEFAULT)}</span>
          </div>
        ),
        maxSize: 150,
      },
      {
        accessorKey: 'actionType',
        header: () => (
          <div className="font-normal text-center text-default text-color-text">{t('historyBonus:bonusType')}</div>
        ),
        cell: ({ row }) => (
          <div className="text-default dark:text-color-text-primary text-[#000] truncate text-center">
            {row.original.type}
          </div>
        ),
        minSize: 50,
        maxSize: 80,
      },
      {
        accessorKey: 'amountClaimed',
        header: () => (
          <div className="font-normal text-right text-default text-color-text">{t('transaction:amount')}</div>
        ),
        cell: ({ row }) => (
          <div
            className={cn('font-bold text-[14px] flex justify-end gap-1 truncate text-center', {
              'text-color-text-green': row.original.amount >= 0,
              'text-color-red': row.original.amount < 0,
            })}
          >
            {row.original.amount < 0 ? '-' : '+'}
            {viewInFiat ? (
              <>{currencyFormat1(Math.abs(row.original.amountUsd * exchangeRate), 4, localFiat?.name || 'USD')}</>
            ) : (
              currencyFormat1(Math.abs(row.original?.amount), 4, '', false)
            )}
            <Image
              height={20}
              width={20}
              src={row.original.symbolLogo ? row.original.symbolLogo : `/img/fiats/USDT.png`}
              onError={(e) => {
                e.currentTarget.src = `/img/fiats/USDT.png`;
              }}
              alt="currency"
            />
          </div>
        ),
      },
    ];
    return columnsDefault;
  }, [t, localFiat, exchangeRate, viewInFiat]);

  const handleCloseModal = () => {
    onClose();
    setShowModalRakeBack();
  };
  useEffect(() => {
    if (isLogin && show) {
      getListBonusTransaction();
    }
  }, [isLogin, show]);

  return (
    <>
      <CommonModal
        show={show}
        onClose={handleCloseModal}
        panelClass="sm:max-w-[464px] sm:!h-[640px] sm:!max-h-[90vh] sm:my-0"
        header={
          <div
            className="modal-header flex !flex-row items-start gap-[10px] hover:cursor-pointer"
            onClick={handleCloseModal}
          >
            <ArrowLeft2 className="w-[16px] text-[#67707B] stroke-4" />
            <div className="text-[16px] dark:text-white text-black">USDT {t('deposit:bonusHistory')}</div>
          </div>
        }
      >
        <div className="h-full relative dark:bg-color-modal-bg-primary bg-white p-3 pb-[60px] sm:pb-3 overflow-hidden overflow-y-scroll">
          <TableComponent
            isLoading={isLoadingTable}
            handleClickRow={() => {}}
            data={listTransactions}
            columns={columns}
            isExpanding={false}
          />
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
