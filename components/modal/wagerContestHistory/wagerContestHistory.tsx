import { ColumnDef } from '@tanstack/react-table';
import cn from 'classnames';
import { Snapchat } from 'iconsax-react';
import Image from 'next/image';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { shallowEqual, useSelector } from 'react-redux';

import { api_wagerContestHistory } from '@/api/game';
import { API_AVATAR } from '@/base/constants/common';
import { useExchange } from '@/base/hooks/useExchange';
import { currencyFormat1, formatDate } from '@/base/libs/utils';
import {
  changeIsShowDailyContest,
  changeIsShowInformation,
  changeIsShowWagerContestHistory,
} from '@/base/redux/reducers/modal.reducer';
import { setUserData } from '@/base/redux/reducers/user.reducer';
import { AppState, useAppDispatch } from '@/base/redux/store';
import RankingTableComponent from '@/components/table/rankingTable';

import CommonModal from '../commonModal/commonModal';
import { useWidth } from '@/base/hooks/useWidth';

type ModalWagerContestHistoryProps = {
  onClose: () => void;
  show: boolean;
};

type WagerContestHistoryItemType = {
  playerId: string;
  playerName: string;
  playerAvatar: string;
  wageredUsd: number;
  prizeUsd: number;
  percent: number;
};

export default function ModalWagerContestHistory({ show, onClose }: ModalWagerContestHistoryProps) {
  const exchangeRate = useExchange();
  const { t } = useTranslation();
  const [isLoadingTable, setIsLoadingTable] = useState(false);
  const dispatch = useAppDispatch();
  const width = useWidth();
  const [wagerHistory, setWagerHistory] = useState<WagerContestHistoryItemType[]>([]);
  const [wagerData, setWagerData] = useState({
    currentTime: 0,
    endTime: 0,
  });

  const { viewInFiat, localFiat, userId, userName, isLogin } = useSelector(
    (state: AppState) => ({
      viewInFiat: state.auth.user.generalSetting.settingViewInFiat,
      localFiat: state.wallet.localFiat,
      userId: state.auth.user.userId,
      userName: state.auth.user.userName,
      isLogin: state.auth.isLogin,
    }),
    shallowEqual,
  );

  const getWagerHistory = async () => {
    try {
      setIsLoadingTable(true);
      const _res = await api_wagerContestHistory();
      const tempHistory: WagerContestHistoryItemType[] = _res.data?.contest?.map((item: any) => ({
        playerId: item?.playerId ?? '',
        playerName: item?.playerName ?? '',
        playerAvatar: item?.playerAvatar ?? '',
        wageredUsd: Number(item?.wageredAmountUsd || 0),
        prizeUsd: Number(item?.prizeAmountUsd || 0),
        percent: item?.percentage || 0,
      }));
      setWagerHistory(tempHistory);
      setWagerData({
        currentTime: _res.data?.lastContentStartTime * 1000,
        endTime: _res.data?.lastContentEndTime * 1000,
      });
    } catch (error) {
      setWagerHistory([]);
    } finally {
      setIsLoadingTable(false);
    }
  };

  const handleModalUserProfile = (user: any) => {
    dispatch(
      setUserData({
        userId: user.original.playerId,
        userName: user.original.playerName,
        avatar: user.original.playerAvatar,
      }),
    );
    dispatch(changeIsShowWagerContestHistory(false));
    dispatch(changeIsShowInformation(true));
  };

  const columns = useMemo(() => {
    const columnsDefault: ColumnDef<WagerContestHistoryItemType>[] = [
      {
        accessorKey: 'betId',
        header: () => (
          <div className="dark:text-color-text-primary text-color-light-text-primary pl-2 sm:pl-4 text-m_default sm:text-default">
            #
          </div>
        ),
        cell: ({ row }) => (
          <div className={cn('flex items-center justify-start gap-[5px] truncate pl-2 sm:pl-4 py-3 sm:py-4')}>
            {row.index === 0 && (
              <Image
                height={25}
                width={25}
                src="/img/icon/gold.png"
                alt="medal gold"
                className="object-cover sm:h-[25px] h-[16px] sm:w-[25px] w-[16px]"
              />
            )}
            {row.index === 1 && (
              <Image
                height={25}
                width={25}
                src="/img/icon/sliver.png"
                alt="medal sliver"
                className="object-cover sm:h-[25px] h-[16px] sm:w-[25px] w-[16px]"
              />
            )}
            {row.index === 2 && (
              <Image
                height={25}
                width={25}
                src="/img/icon/bronze.png"
                alt="medal bronze"
                className="object-cover sm:h-[25px] h-[16px] sm:w-[25px] w-[16px]"
              />
            )}
            {row.index !== 0 && row.index !== 1 && row.index !== 2 && (
              <div className="font-semibold truncate text-m_default md:text-default">{row.index + 1}th</div>
            )}
          </div>
        ),
      },
      {
        accessorKey: 'player',
        header: () => (
          <div className="dark:text-color-text-primary text-color-light-text-primary text-m_default sm:text-default px-2 sm:px-4">
            {t('gameTable:player')}
          </div>
        ),
        cell: ({ row }) => (
          <div
            onClick={() => handleModalUserProfile(row)}
            className={cn(
              'dark:text-white text-color-light-text-primary flex items-center justify-start gap-[5px] truncate',
              {
                'pointer-events-none cursor-text': row.original?.playerId !== userId && !row.original?.playerName,
              },
            )}
          >
            <div className="flex justify-center items-center w-[20px] h-[20px] sm:w-[32px] sm:h-[32px]">
              {row.original?.playerId !== userId && !row.original?.playerName ? (
                <Snapchat width={25} height={25} variant="Bulk" className="w-[20px] h-[20px] sm:w-[30px] sm:h-[30px]" />
              ) : (
                <Image
                  height={25}
                  width={25}
                  src={row.original.playerAvatar ? `${API_AVATAR}/${row.original.playerAvatar}` : '/img/avatar-1.png'}
                  onError={(e) => {
                    e.currentTarget.src = '/img/avatar-1.png';
                  }}
                  alt="avatar"
                  className="object-cover rounded-full w-[16px] h-[16px] sm:w-[25px] sm:h-[25px]"
                />
              )}
            </div>
            <div className="!font-extralight truncate text-m_default sm:text-default w-[100px] sm:w-auto">
              {row.original?.playerId !== userId && !row.original?.playerName
                ? t('homePage:hidden')
                : row.original.playerId === userId
                ? userName
                : row.original.playerName}
            </div>
          </div>
        ),
      },
      {
        accessorKey: 'betAmount',
        header: () => (
          <div className="dark:text-color-text-primary text-color-light-text-primary px-2 sm:px-4 text-m_default sm:text-default text-center">
            {t('gameTable:wagered')}
          </div>
        ),
        cell: ({ row }) => (
          <div className="m-auto font-semibold text-center text-m_default sm:text-default text-color-text-green w-[70px] sm:w-auto truncate">
            {viewInFiat
              ? currencyFormat1(row.original.wageredUsd * exchangeRate, 8, localFiat?.name)
              : currencyFormat1(row.original.wageredUsd, 8)}
          </div>
        ),
      },
      {
        accessorKey: 'payout',
        header: () => (
          <div className="dark:text-color-text-primary text-color-light-text-primary pr-2 sm:pr-4 text-m_default sm:text-default">
            {t('gameTable:prize')}
          </div>
        ),
        cell: ({ row }) => (
          <div
            className={cn(
              'dark:text-color-text-primary text-color-light-text-primary text-m_default sm:text-default w-full',
              'flex justify-end pr-2 sm:pr-4 font-semibold',
              'truncate w-[70px] sm:w-auto',
            )}
          >
            <span className="font-bold text-color-text-green">
              {viewInFiat
                ? currencyFormat1(row.original.prizeUsd * exchangeRate, 4, localFiat?.name)
                : currencyFormat1(row.original.prizeUsd, 4)}
            </span>
            <span className="ml-[5px] hidden sm:block font-bold text-color-text-primary/70">{`${row.original.percent}%`}</span>
          </div>
        ),
      },
    ];
    return columnsDefault;
  }, [t, localFiat, exchangeRate]);

  useEffect(() => {
    if (show) {
      getWagerHistory();
    }
  }, [show]);

  return (
    <CommonModal
      show={show}
      onClose={() => {
        onClose();
      }}
      panelClass="rounded"
      header={
        <div className="flex flex-col items-start modal-header gap-[20px]">
          <div className="flex justify-between text-default sm:text-[16px] dark:text-white text-black gap-[10px]">
            <p>{t('wagerContest:history')}</p>
            <p className="dark:text-color-text-primary text-color-light-text-primary">
              {formatDate(new Date(wagerData.currentTime), 'LL/dd/yyyy')} ~{' '}
              {formatDate(new Date(wagerData.endTime), 'LL/dd/yyyy')}
            </p>
          </div>
        </div>
      }
    >
      <div className="dark:bg-color-modal-bg-primary bg-white p-3">
        <RankingTableComponent
          containerClassName="w-full"
          isLoading={isLoadingTable}
          data={wagerHistory}
          columns={columns}
        />
      </div>
    </CommonModal>
  );
}
