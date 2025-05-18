import { ColumnDef, Row } from '@tanstack/react-table';
import cn from 'classnames';
import { ArrowDown2, ArrowUp2 } from 'iconsax-react';
import Image from 'next/image';
import { useEffect, useMemo, useState } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';

import { api_getLatestBetForUser } from '@/api/game';
import { useTranslation } from '@/base/config/i18next';
import { TIME_SUBMIT_FORMAT_WITH_SECOND, TOAST_ENUM } from '@/base/constants/common';
import { useExchange } from '@/base/hooks/useExchange';
import { useWidth } from '@/base/hooks/useWidth';
import { currencyFormat1, formatDate, formatLengthNumber } from '@/base/libs/utils';
import { getErrorMessage } from '@/base/libs/utils/notificationToast';
import { changeIsShowDetailBets, setDetailBets } from '@/base/redux/reducers/modal.reducer';
import { AppState } from '@/base/redux/store';
import { BetTableDataType, GameListType } from '@/base/types/common';

import RankingTableComponent from '../table/rankingTable';

const cryptoDecimals = 8;
const fiatDecimals = 2;

const MyBetsTableComponent = ({ gameDetail }: { gameDetail?: GameListType }) => {
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
  const [myBetData, setMyBetData] = useState<BetTableDataType[]>([]);
  const [isLoadingTable, setIsLoadingTable] = useState(false);
  const [isShowMore, setIsShowMore] = useState<boolean>(false);

  const { t } = useTranslation('');
  const innerWidth = useWidth();
  const exchangeRate = useExchange();
  const dispatch = useDispatch();

  const { isLogin, userId, localFiat, gameSocket, viewInFiat } = useSelector(
    (state: AppState) => ({
      localFiat: state.wallet.localFiat,
      isLogin: state.auth.isLogin,
      userId: state.auth.user.userId,
      viewInFiat: state.auth.user.generalSetting.settingViewInFiat,
      gameSocket: state.socket.gameSocket,
    }),
    shallowEqual,
  );

  const getMyBetHistory = async () => {
    try {
      setIsLoadingTable(true);
      setMyBetData([]);
      if (!gameDetail) return;
      const res = await api_getLatestBetForUser(gameDetail.id);
      const tempBetDatas = res.data.map((item: any) => ({
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
        providerName: item.providerName ?? '',
      }));
      setMyBetData(tempBetDatas);
    } catch (error: any) {
      const errType = error.response?.data?.message ?? '';
      const errMessage = getErrorMessage(errType);
      toast.error(t(errMessage), { containerId: TOAST_ENUM.COMMON });
      setMyBetData([]);
    } finally {
      setIsLoadingTable(false);
    }
  };

  const handleClickRow = (row: Row<BetTableDataType>) => {
    const betId = row?.getVisibleCells?.()[0].row.original.betId;
    dispatch(
      setDetailBets({
        betDetail: row.original,
        betId: Number(betId),
      }),
    );
    dispatch(changeIsShowDetailBets(true));
  };

  const betHistoryFilter = useMemo(() => {
    if (!myBetData.length) return [];
    if (isShowMore) return myBetData.slice(0, 40);
    return myBetData.slice(0, 10);
  }, [myBetData, isShowMore]);

  const myBetColumns = useMemo(() => {
    const myBetColumnsDefault: ColumnDef<BetTableDataType>[] = [
      {
        accessorKey: 'betId',
        header: () => (
          <div className="text-left dark:text-color-text-primary text-color-light-text-primary pl-2 sm:pl-4 text-m_default sm:text-default">
            {t('gameTable:betId')}
          </div>
        ),
        cell: ({ row }) => (
          <div className="dark:text-color-text-primary text-color-light-text-primary truncate py-3 sm:py-4 pl-2 sm:pl-4 text-m_default sm:text-default max-w-[100px] sm:max-w-full">
            {row.original.betId}
          </div>
        ),
      },
      {
        accessorKey: 'betAmount',
        header: () => (
          <div className="text-center dark:text-color-text-primary text-color-light-text-primary text-m_default sm:text-default">
            {t('gameTable:bet')}
          </div>
        ),
        cell: ({ row }) => (
          <>
            {row.original.betAmount !== null && (
              <div className="flex items-center justify-center gap-[5px] truncate">
                <div className="font-normal text-black truncate dark:text-white">
                  {viewInFiat
                    ? `${currencyFormat1(
                        row.original.betAmountUsd * exchangeRate,
                        fiatDecimals,
                        localFiat?.name || 'USD',
                      )}`
                    : `${currencyFormat1(row.original.betAmount, cryptoDecimals, '', false)}`}
                </div>
                <Image
                  height={16}
                  width={16}
                  src={row.original.currency ? `/img/fiats/${row.original.currency}.png` : '/img/fiats/USDT.png'}
                  onError={(e) => {
                    e.currentTarget.src = '/img/fiats/USDT.png';
                  }}
                  alt="currency-usdt"
                />
              </div>
            )}
          </>
        ),
      },
      {
        accessorKey: 'time',
        header: () => (
          <div className="text-center dark:text-color-text-primary text-color-light-text-primary text-m_default sm:text-default">
            {t('gameTable:time')}
          </div>
        ),
        cell: ({ row }) => (
          <div className="text-center truncate dark:text-color-text-primary text-color-light-text-primary text-m_default sm:text-default">
            {formatDate(new Date(row.original.time), TIME_SUBMIT_FORMAT_WITH_SECOND)}
          </div>
        ),
      },
      {
        accessorKey: 'payout',
        header: () => (
          <div className="text-center dark:text-color-text-primary text-color-light-text-primary text-m_default sm:text-default">
            {t('gameTable:payout')}
          </div>
        ),
        cell: ({ row }) => (
          <div className="text-center truncate dark:text-color-text-primary text-color-light-text-primary text-m_default sm:text-default">
            {`${formatLengthNumber(row.original.multiplier, 2)}x`}
          </div>
        ),
      },
      {
        accessorKey: 'profit',
        header: () => (
          <div className="text-right dark:text-color-text-primary text-color-light-text-primary text-m_default sm:text-default pr-2 sm:pr-4">
            {t('gameTable:profit')}
          </div>
        ),
        cell: ({ row }) => (
          <div className={cn('flex items-center justify-end gap-[5px] p-2')}>
            <div
              className={cn('font-semibold text-end truncate', {
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
                : `${currencyFormat1(Math.abs(row.original.profitAmount), cryptoDecimals, '', false)}`}
            </div>
            <Image
              height={16}
              width={16}
              src={row.original.currency ? `/img/fiats/${row.original.currency}.png` : '/img/fiats/USD.png'}
              onError={(e) => {
                e.currentTarget.src = '/img/fiats/USD.png';
              }}
              alt="currency-usdt"
            />
          </div>
        ),
      },
    ];
    if (innerWidth > 961) return myBetColumnsDefault;
    else {
      myBetColumnsDefault.splice(2, 1);
      return myBetColumnsDefault;
    }
  }, [localFiat, userId, innerWidth, viewInFiat, exchangeRate]);

  useEffect(() => {
    if (isLogin) {
      getMyBetHistory();
    }
  }, [isLogin, gameDetail]);

  useEffect(() => {
    if (!userId) return;
    if (gameSocket) {
      gameSocket.on(`bets`, (item: any) => {
        try {
          const data = JSON.parse(item);
          const gameId = data.game_id;
          if (gameId !== gameDetail?.id || data.player_id !== userId) {
            return;
          }
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
            providerName: data?.provider_name ?? '',
          };
          setNewBetData(tempData);
        } catch (error) {
          console.log(error, 'my bets error');
        }
      });
    }

    return () => {
      if (gameSocket) {
        gameSocket.off(`bets`);
      }
    };
  }, [userId, gameDetail, gameSocket]);

  useEffect(() => {
    if (newBetData.betId) {
      let preBetDatas = [...myBetData];
      if (preBetDatas.findIndex((item) => item.betId === newBetData.betId) !== -1) {
        const upBetDatas = preBetDatas.map((item) => {
          if (item.betId === newBetData.betId) {
            return { ...newBetData };
          } else {
            return { ...item };
          }
        });
        setMyBetData(upBetDatas);
      } else {
        setMyBetData((prev) => [newBetData, ...prev]);
      }
    }
  }, [newBetData]);

  return (
    <>
      <div>
        <RankingTableComponent
          containerClassName="w-full"
          isLoading={isLoadingTable}
          data={betHistoryFilter}
          columns={myBetColumns}
          onRowClick={handleClickRow}
        />
        {!!betHistoryFilter.length && (
          <div className="flex justify-center mt-[20px] pb-[8px] md:pb-[23px]">
            <div
              className="flex items-center py-[9px] px-[10px] rounded-[5px]"
              role="button"
              onClick={() => {
                setIsShowMore(!isShowMore);
              }}
            >
              <div className="text-default dark:text-[#FFFFFF] text-[#000] font-normal mr-[6px]">
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

export default MyBetsTableComponent;
