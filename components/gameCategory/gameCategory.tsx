import React, { useCallback, useEffect, useMemo, useState } from 'react';
import ReactLoading from "react-loading";

import { useTranslation } from '@/base/config/i18next';
import { GameListType } from '@/base/types/common';
import GameCard from '@/components/gameCard/gameCard';
import { NoDataComponent } from '@/components/noData/noData';

import Loader from '../common/preloader/loader';

interface GameCategoryProps {
  getData: Function
}

function GameCategory({ getData }: GameCategoryProps) {

  const { t } = useTranslation('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(40);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [listGame, setListGame] = useState<GameListType[]>([]);
  const [totalGameCnt, setTotalGameCnt] = useState<number>(0);

  const status = useMemo(() => {
    const percent = totalGameCnt === 0 ? 0 : Number((listGame.length / totalGameCnt) * 100).toFixed(0);
    const isShowMore = listGame.length < totalGameCnt;
    return { percent, isShowMore }
  }, [listGame, totalGameCnt]);

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      const { data, page: currentPage, pageSize: CurrentPageSize, totalPage, totalCount } = await getData(page, pageSize);
      const tempGameLists: GameListType[] = data?.map((item: any) => ({
        id: item?.id ?? '',
        title: item?.title ?? '',
        description: '',
        identifier: item?.identifier ?? '',
        payout: Number(item.payout || 0),
        multiplier: Number(item.profitMultiplier || 0),
        provider: item.producerIdentifier || '',
        providerName: item?.producerName || '',
        releasedAt: new Date(),
      }));
      if (currentPage === 1) {
        setListGame(tempGameLists)
      } else {
        setListGame((current) => [...current, ...tempGameLists]);
      }

      setPage(currentPage);
      setTotalGameCnt(totalCount || 0);
      setIsLoading(false)
    } catch (error) {
      setListGame([]);
      setPage(1);
      setTotalGameCnt(0)
    } finally {
      setIsLoading(false)
    }
  }, [page, pageSize, getData])


  useEffect(() => {
    fetchData()
  }, [fetchData])

  return (
    <>
      {isLoading ? <Loader isFullMode={false} />
        : !!listGame.length ? (
          <>
            <div className="game-grid-parent mt-[20px]">
              {listGame.map((game, index) => {
                return (
                  <div key={index} className="max-w-game-card">
                    <GameCard gameDetail={game} />
                  </div>
                );
              })}
            </div>
            {!!totalGameCnt && (
              <div className="text-[12px] text-gray-400 flex items-center justify-center gap-[10px] mt-[20px]">
                <div>
                  {listGame.length}/{totalGameCnt}
                </div>
                <div className="max-w-[80px] w-full rounded-[5px] h-[5px] bg-gray-500">
                  <div
                    className="h-full max-w-[80px] bg-color-primary rounded-[5px]"
                    style={{ width: `${status.percent}%` }}
                  ></div>
                </div>
                <div>{status.percent}%</div>
              </div>
            )}
            {status.isShowMore && (
              <div className="flex justify-center mt-[20px] pb-[8px] md:pb-[23px]">
                <button
                  className="flex items-center dark:bg-[#2D3035] bg-white py-[9px] px-[16px] rounded-[5px]"
                  disabled={isLoading}
                  onClick={() => {
                    setPage(page + 1);
                  }}
                >
                  {isLoading && <ReactLoading type='bubbles' width={20} height={20} />}
                  <div className="text-[12px] sm:text-[16px] dark:text-white text-black font-bold">{t('casino:loadMore')}</div>
                </button>
              </div>
            )}
          </>
        ) :
          (
            <div className="py-[100px]">
              <NoDataComponent />
            </div>
          )}
    </>
  );
}
export default GameCategory;
