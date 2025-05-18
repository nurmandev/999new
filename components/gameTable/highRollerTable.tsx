import { ColumnDef, Row } from '@tanstack/react-table';
import cn from 'classnames';
import { ArrowDown2, ArrowUp2, Snapchat } from 'iconsax-react';
import Image from 'next/image';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';

import { api_highRollers } from '@/api/game';
import { useTranslation } from '@/base/config/i18next';
import { API_GAME_IMAGE, TOAST_ENUM } from '@/base/constants/common';
import { useExchange } from '@/base/hooks/useExchange';
import { currencyFormat1, formatLengthNumber } from '@/base/libs/utils';
import { getErrorMessage } from '@/base/libs/utils/notificationToast';
import { changeIsShowDetailBets, changeIsShowInformation, setDetailBets } from '@/base/redux/reducers/modal.reducer';
import { setUserData } from '@/base/redux/reducers/user.reducer';
import { AppState } from '@/base/redux/store';
import { BetTableDataType } from '@/base/types/common';

import RankingTableComponent from '../table/rankingTable';

const cryptoDecimals = 8;
const fiatDecimals = 2;

const HighRollerTableComponent = () => {
  const exchangeRate = useExchange();
  const [hightRollerData, setHightRollerData] = useState<BetTableDataType[]>([]);
  const [isLoadingTable, setIsLoadingTable] = useState(false);
  const [isShowMore, setIsShowMore] = useState<boolean>(false);
  const [betIdDetail, setBetIdDetail] = useState<number>();
  const [selBetDetail, setSelBetDetail] = useState<BetTableDataType>({
    game: '',
    gameIdenfiter: '',
    player: '',
    playerId: '',
    playerAvatar: '',
    betAmount: 0,
    betAmountUsd: 0,
    multiplier: 0,
    profitAmount: 0,
    profitAmountUsd: 0,
    currency: '',
    betId: '',
    time: new Date(),
    providerName: '',
  });
  const [isPublicProfile, setIsPublicProfile] = useState<boolean>(false);
  const [windowSize, setWindowSize] = useState(window.innerWidth);

  const { t } = useTranslation('');
  const dispatch = useDispatch();

  const { localFiat, userId, userName, viewInFiat } = useSelector(
    (state: AppState) => ({
      localFiat: state.wallet.localFiat,
      userId: state.auth.user.userId,
      userName: state.auth.user.userName,
      viewInFiat: state.auth.user.generalSetting.settingViewInFiat,
    }),
    shallowEqual,
  );

  const handleWindowResize = useCallback((event: any) => {
    setWindowSize(window.innerWidth);
  }, []);

  useEffect(() => {
    window.addEventListener('resize', handleWindowResize);
    return () => {
      window.removeEventListener('resize', handleWindowResize);
    };
  }, [handleWindowResize]);

  const handleGetHighRoller = async () => {
    try {
      setIsLoadingTable(true);
      const res = await api_highRollers();
      const tempHighRollers: BetTableDataType[] = res.data?.map((item: any) => ({
        game: item.gameName ?? '',
        gameIdenfiter: item.gameIdentifier ?? '',
        player: item.playerName || '',
        playerId: item.playerId ?? '',
        playerAvatar: item.playerAvatar ?? '',
        betAmount: Number(item.betAmount || 0),
        betAmountUsd: Number(item.betAmountUsd || 0),
        multiplier: Number(item.multiplier || 0),
        profitAmount: Number(item.profitAmount || 0),
        profitAmountUsd: Number(item.profitAmountUsd || 0),
        currency: item.currency ?? 'USD',
        betId: item.id ?? '',
        time: item.time ?? new Date(),
        providerName: item.providerName || '',
      }));
      setHightRollerData(tempHighRollers);
    } catch (error: any) {
      const errType = error.response?.data?.message ?? '';
      const errMessage = getErrorMessage(errType);
      toast.error(t(errMessage), { containerId: TOAST_ENUM.COMMON });
      setHightRollerData([]);
    } finally {
      setIsLoadingTable(false);
    }
  };

  const handleModalProfile = (row: Row<BetTableDataType>) => {
    const userData = {
      username: row.original.player,
      userId: row.original.playerId,
    };
    dispatch(setUserData(userData));
    if (row.original.player) {
      dispatch(changeIsShowInformation(true));
    }
  };

  const handleClickRow = (row: Row<BetTableDataType>) => {
    const betId = row?.getVisibleCells?.()[0].row.original.betId;
    setBetIdDetail(Number(betId));
    setSelBetDetail(row.original);

    dispatch(
      setDetailBets({
        betDetail: row.original,
        betId: Number(betId),
        isPublicProfile: isPublicProfile,
      }),
    );
    dispatch(changeIsShowDetailBets(true));
  };

  const hightRollerDataFilter = useMemo(() => {
    if (isShowMore) return hightRollerData.slice(0, 20);
    else return hightRollerData.slice(0, 10);
  }, [hightRollerData, isShowMore]);

  const highRollerColumns = useMemo(() => {
    const highRollerColumnsDefault: ColumnDef<BetTableDataType>[] = [
      {
        accessorKey: 'betId',
        header: () => <div className="px-2 sm:px-4 text-m_default sm:text-default">{t('gameTable:game')}</div>,
        cell: ({ row }) => (
          <div
            className={cn(
              'flex items-center gap-[5px] pl-2 sm:pl-4 py-3 sm:py-4',
              'dark:text-color-text-primary text-[#31373d] text-m_default sm:text-default',
            )}
            onClick={() => handleClickRow(row)}
          >
            <Image
              height={24}
              width={24}
              src={`${API_GAME_IMAGE}/icon/${row.original.gameIdenfiter?.replace(':', '_')}.png`}
              alt="game logo"
              onError={(err) => {
                err.currentTarget.src = '/img/recommended-game-3.png';
              }}
              className="object-cover max-h-auto rounded-[5px]"
            />
            <span className="px-2 !font-medium max-w-[110px] sm:max-w-full truncate">{row.original.game}</span>
          </div>
        ),
      },
      {
        accessorKey: 'player',
        header: () => (
          <div className="px-2 sm:px-4 text-center text-m_default sm:text-default">{t('gameTable:player')}</div>
        ),
        cell: ({ row }) => (
          <div
            className={`flex justify-center font-bold truncate text-center text-m_default sm:text-default sm:p-2 p-[5px]`}
            onClick={() => handleModalProfile(row)}
          >
            {row.original.playerId !== userId && !row.original.player ? (
              <div className="dark:text-color-text-primary text-[#31373d] flex justify-center items-center gap-[5px]">
                <Snapchat width={12} height={12} variant="Bulk" className="w-5 h-5" />
                {t('homePage:hidden')}
              </div>
            ) : (
              <div className="text-black dark:text-white max-w-[120px] sm:max-w-full truncate">
                {row.original.playerId === userId ? userName : row.original.player}
              </div>
            )}
          </div>
        ),
      },
      {
        accessorKey: 'betAmount',
        header: () => (
          <div className="px-2 sm:px-4 text-center text-m_default sm:text-default">{t('gameTable:betAmount')}</div>
        ),
        cell: ({ row }) => (
          <div
            className="dark:text-white text-m_default sm:text-default text-[#31373d] font-bold truncate flex items-center justify-center gap-[5px] sm:p-2 px-[5px]"
            onClick={() => handleClickRow(row)}
          >
            <span className="max-w-[90px] sm:max-w-full truncate">
              {viewInFiat
                ? `${currencyFormat1(row.original.betAmountUsd * exchangeRate, fiatDecimals, localFiat?.name || 'USD')}`
                : `${currencyFormat1(row.original.betAmount, cryptoDecimals, '', false)} `}
            </span>
            <Image
              className="w-[18px] h-[18px]"
              height={18}
              width={18}
              src={row.original.currency ? `/img/fiats/${row.original.currency}.png` : '/img/fiats/USDT.png'}
              onError={(e) => {
                e.currentTarget.src = '/img/fiats/USDT.png';
              }}
              alt="currency-usdt"
            />
          </div>
        ),
      },
      {
        accessorKey: 'multiplier',
        header: () => (
          <div className="px-2 sm:px-4 text-center text-m_default sm:text-default">{t('gameTable:multiplier')}</div>
        ),
        cell: ({ row }) => (
          <div
            className="dark:text-color-text-primary text-m_default sm:text-default text-[#31373d] truncate text-center font-bold sm:p-2 px-[5px]"
            onClick={() => handleClickRow(row)}
          >
            {`${formatLengthNumber(row.original.multiplier, 2)}x`}
          </div>
        ),
      },
      {
        accessorKey: 'profit',
        header: () => (
          <div className="px-2 sm:px-4 text-center text-m_default sm:text-default">{t('gameTable:profitAmount')}</div>
        ),
        cell: ({ row }) => (
          <div
            className={cn('flex justify-end items-center text-m_default sm:text-default gap-[5px] pr-2 sm:pr-4')}
            onClick={() => handleClickRow(row)}
          >
            <div
              className={cn('font-bold text-end truncate', {
                'text-color-text-green': row.original.profitAmount >= 0,
                'text-color-red-primary': row.original.profitAmount < 0,
              })}
            >
              {row.original.profitAmount >= 0 ? '' : '-'}
              {viewInFiat
                ? `${currencyFormat1(
                    Math.abs(row.original.profitAmountUsd * exchangeRate),
                    fiatDecimals,
                    localFiat?.name || 'USD',
                  )}`
                : `${currencyFormat1(Math.abs(row.original.profitAmount), cryptoDecimals, '', false)} `}
            </div>
            <Image
              className="h-[18px] w-[18px]"
              height={15}
              width={15}
              src={row.original.currency ? `/img/fiats/${row.original.currency}.png` : '/img/fiats/USDT.png'}
              onError={(e) => {
                e.currentTarget.src = '/img/fiats/USDT.png';
              }}
              alt="currency-usdt"
            />
          </div>
        ),
      },
    ];
    if (innerWidth > 1024) {
      return highRollerColumnsDefault;
    } else {
      highRollerColumnsDefault.splice(2, 2);
      return highRollerColumnsDefault;
    }
  }, [localFiat, userId, innerWidth, viewInFiat, exchangeRate]);

  useEffect(() => {
    handleGetHighRoller();
  }, []);

  return (
    <>
      <div className="flex flex-col lg:gap-[20px] sm:gap-[10px] gap-[5px]">
        <RankingTableComponent
          containerClassName="w-full"
          isLoading={isLoadingTable}
          data={hightRollerDataFilter}
          columns={highRollerColumns}
        />
        {!!hightRollerDataFilter.length && (
          <div className="flex justify-center">
            <div
              className="flex items-center py-4 px-[10px] rounded-[5px]"
              role="button"
              onClick={() => {
                setIsShowMore(!isShowMore);
              }}
            >
              <div className="text-m_default sm:text-default dark:text-[#FFFFFF] text-[#000] font-normal mr-[6px]">
                {!isShowMore ? t('homePage:showMore') : t('homePage:showLess')}
              </div>
              {!isShowMore ? (
                <ArrowDown2 size={12} className="dark:text-[#FFFFFF] text-[#000]" />
              ) : (
                <ArrowUp2 size={12} className="dark:text-[#FFFFFF] text-[#000]" />
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default HighRollerTableComponent;
