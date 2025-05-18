import { ColumnDef, Row } from '@tanstack/react-table';
import cn from 'classnames';
import { ArrowDown2, ArrowUp2, Snapchat } from 'iconsax-react';
import Image from 'next/image';
import { useEffect, useMemo, useState } from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import { toast } from 'react-toastify';

import { api_getLatestBets } from '@/api/game';
import { useTranslation } from '@/base/config/i18next';
import { API_GAME_IMAGE, TOAST_ENUM } from '@/base/constants/common';
import { useExchange } from '@/base/hooks/useExchange';
import { useWidth } from '@/base/hooks/useWidth';
import { currencyFormat1, formatLengthNumber } from '@/base/libs/utils';
import { getErrorMessage } from '@/base/libs/utils/notificationToast';
import { changeIsShowDetailBets, changeIsShowInformation, setDetailBets } from '@/base/redux/reducers/modal.reducer';
import { setUserData } from '@/base/redux/reducers/user.reducer';
import { AppState, useAppDispatch } from '@/base/redux/store';
import { BetTableDataType, GameDetail } from '@/base/types/common';

import RankingTableComponent from '../table/rankingTable';

const cryptoDecimals = 8;
const fiatDecimals = 2;

const LatestBetsTableComponent = ({ gameDetail }: { gameDetail?: GameDetail }) => {
  const [isLoadingTable, setIsLoadingTable] = useState(false);
  const [isShowMore, setIsShowMore] = useState<boolean>(false);

  const [betData, setBetData] = useState<BetTableDataType[]>([]);
  const [newBetData, setNewBetData] = useState<BetTableDataType>({
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

  const exchangeRate = useExchange();
  const innerWidth = useWidth();
  const dispatch = useAppDispatch();
  const { t } = useTranslation('');

  const { userId, localFiat, userName, viewInFiat, gameSocket } = useSelector(
    (state: AppState) => ({
      userId: state.auth.user.userId,
      userName: state.auth.user.userName,
      localFiat: state.wallet.localFiat,
      viewInFiat: state.auth.user.generalSetting.settingViewInFiat,
      gameSocket: state.socket.gameSocket,
    }),
    shallowEqual,
  );

  const betHistoryFilter = useMemo(() => {
    if (!betData.length) return betData;
    if (isShowMore) return betData.slice(0, 40);
    return betData.slice(0, 10);
  }, [betData, isShowMore]);

  const getAllBetHistory = async () => {
    try {
      setIsLoadingTable(true);
      const res = await api_getLatestBets();
      const tempBetData = res.data.map((item: any) => ({
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
        currency: item.currency ?? 'USDT',
        betId: item.id ?? '',
        time: item.time ?? new Date(),
        providerName: item.providerName || '',
      }));
      setBetData(tempBetData);
    } catch (error: any) {
      const errType = error.response?.data?.message ?? '';
      const errMessage = getErrorMessage(errType);
      toast.error(t(errMessage), { containerId: TOAST_ENUM.COMMON });
      setBetData([]);
    } finally {
      setIsLoadingTable(false);
    }
  };

  const openModalProfileUser = (row: Row<BetTableDataType>) => {
    const userData = {
      username: row.original.player,
      userId: row.original.playerId,
    };
    dispatch(setUserData(userData));
    if (row.original.player) {
      dispatch(changeIsShowInformation(true));
    }
  };

  const openModalBetDetail = (row: Row<BetTableDataType>) => {
    const betId = row?.getVisibleCells?.()[0].row.original.betId;
    dispatch(
      setDetailBets({
        betDetail: row.original,
        betId: Number(betId),
        isPublicProfile: row.original.player == '' ? false : true,
      }),
    );
    dispatch(changeIsShowDetailBets(true));
  };

  const allBetColumns = useMemo(() => {
    const allBetColumnsDefault: ColumnDef<BetTableDataType>[] = [
      {
        accessorKey: 'betId',
        header: () => <div className="pl-2 sm:pl-4 text-m_default sm:text-default">{t('gameTable:game')}</div>,
        cell: ({ row }) => (
          <div
            className={cn(
              'flex items-center gap-[5px] pl-2 sm:pl-4 py-3 sm:py-4',
              'dark:text-color-text-primary text-[#31373d] text-m_default sm:text-default',
            )}
            onClick={() => openModalBetDetail(row)}
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
            <span className="px-2 !font-medium w-[120px] sm:w-auto truncate">{row.original.game}</span>
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
            className={`flex justify-center font-bold truncate text-center text-m_default sm:text-default sm:p-2 p-0`}
            onClick={() => openModalProfileUser(row)}
          >
            {row.original.playerId !== userId && !row.original.player ? (
              <div className="dark:text-color-text-primary text-[#31373d] flex justify-center items-center gap-[5px]">
                <Snapchat width={12} height={12} variant="Bulk" className="w-5 h-5" />
                {t('homePage:hidden')}
              </div>
            ) : (
              <div className="text-black dark:text-white w-[110px] sm:w-auto truncate">
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
            onClick={() => openModalBetDetail(row)}
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
            onClick={() => openModalBetDetail(row)}
          >
            {`${formatLengthNumber(row.original.multiplier, 2)}x`}
          </div>
        ),
      },
      {
        accessorKey: 'profit',
        header: () => (
          <div className="pr-2 sm:pr-4 text-center text-m_default sm:text-default">{t('gameTable:profitAmount')}</div>
        ),
        cell: ({ row }) => (
          <div
            className={cn('flex justify-end items-center text-m_default sm:text-default gap-[5px] pr-2 sm:pr-4')}
            onClick={() => openModalBetDetail(row)}
          >
            <div
              className={cn('!font-semibold text-end truncate', {
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
              className="w-4 h-4 sm:h-[18px] sm:w-[18px]"
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
    ];
    if (innerWidth > 1024) {
      return allBetColumnsDefault;
    } else {
      allBetColumnsDefault.splice(2, 2);
      return allBetColumnsDefault;
    }
  }, [localFiat, userId, innerWidth, viewInFiat, exchangeRate]);

  useEffect(() => {
    if (gameSocket) {
      gameSocket.on(`bets`, (item: any) => {
        try {
          const data = JSON.parse(item);
          const tempData: BetTableDataType = {
            game: data?.game_name ?? '',
            gameIdenfiter: data?.game_identifier ?? '',
            player: data?.player_name ?? '',
            playerId: data?.player_id ?? '',
            playerAvatar: data?.player_avatar ?? '',
            betAmount: Number(data?.bet_amount || 0),
            betAmountUsd: Number(data?.bet_amount_usd || 0),
            multiplier: Number(data?.multiplier || 0),
            profitAmount: Number(data?.profit_amount || 0),
            profitAmountUsd: Number(data?.profit_amount_usd || 0),
            currency: data?.currency ?? 'USD',
            betId: data?.id ?? '',
            time: data?.time ?? new Date(),
            providerName: data.provider_name ?? '',
          };
          setNewBetData(tempData);
        } catch (error) {
          console.log(error, 'latest bet error');
        }
      });
    }

    return () => {
      if (gameSocket) {
        gameSocket.off(`bets`);
      }
    };
  }, [gameSocket]);

  useEffect(() => {
    if (newBetData.betId) {
      let preBetDatas = [...betData];
      if (preBetDatas.findIndex((item) => item.betId === newBetData.betId) !== -1) {
        const upBetDatas = preBetDatas.map((item) => {
          if (item.betId === newBetData.betId) {
            return { ...newBetData };
          } else {
            return { ...item };
          }
        });
        setBetData(upBetDatas);
      } else {
        setBetData((prev) => [newBetData, ...prev]);
      }
    }
  }, [newBetData]);

  useEffect(() => {
    getAllBetHistory();
  }, []);

  return (
    <>
      <div className="flex flex-col lg:gap-[20px] sm:gap-[10px] gap-[5px]">
        <RankingTableComponent
          containerClassName="w-full"
          isLoading={isLoadingTable}
          data={betHistoryFilter}
          columns={allBetColumns}
        />
        {!!betHistoryFilter.length && (
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

export default LatestBetsTableComponent;
