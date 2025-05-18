import { DialogProps, TransitionRootProps } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import cn from 'classnames';
import { SearchNormal, Trash } from 'iconsax-react';
import Image from 'next/image';
import { useTheme } from 'next-themes';
import { ElementType, useEffect, useMemo, useRef, useState } from 'react';
import { isMobile } from 'react-device-detect';
import ReactLoading from 'react-loading';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { useDebounce } from 'use-debounce';

import { api_getDashboardData, api_getGamesByNameAndProvider } from '@/api/game';
import { useTranslation } from '@/base/config/i18next';
import { CookiesStorage } from '@/base/libs/storage/cookie';
import { setRecommandGames } from '@/base/redux/reducers/game.reducer';
import { AppState } from '@/base/redux/store';
import { GameListType } from '@/base/types/common';
import CasinoSwiper from '@/components/casino/casinoSwiper';
import GameCard from '@/components/gameCard/gameCard';
import { NoDataComponent } from '@/components/noData/noData';

import styles from './index.module.scss';

type SearchComponentProps = {
  isShowSearch: boolean;
  onSearchChange: (value: string) => void;
  onClose: () => void;
};

export default function SearchComponent({ isShowSearch, onSearchChange, onClose }: SearchComponentProps) {
  const { t } = useTranslation('');
  const dispatch = useDispatch();
  const { theme } = useTheme();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [searchValue, setSearchValue] = useState('');
  const [debouncedSearchValue] = useDebounce(searchValue, 500);
  const [listSearchGame, setListSearchGame] = useState<GameListType[]>([]);
  const [history, sethistory] = useState<string[]>([]);

  const onSearchGames = async (search: string) => {
    try {
      if (!search) return;
      setIsLoading(true);
      const _res = await api_getGamesByNameAndProvider(search);
      const tempGameLists = _res.data.data.map((item: any) => ({
        id: item?.id ?? '',
        title: item?.title ?? '',
        description: item?.description ?? '',
        identifier: item?.identifier ?? '',
        payout: Number(item?.payout ?? 0),
        multiplier: Number(item?.profitMultiplier ?? 0),
        provider: item?.producerIdentifier || '',
        providerName: item?.producerName ?? '',
        releasedAt: item?.releasedAt ?? '',
      }));
      setListSearchGame(tempGameLists);
    } catch (error) {
      setListSearchGame([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (debouncedSearchValue.length >= 3) {
      onSearchGames(debouncedSearchValue);

      const casinoSearchHistories = CookiesStorage.getCookieData('casinoSearch');
      if (!casinoSearchHistories) {
        const value = [debouncedSearchValue];
        CookiesStorage.setCookieData('casinoSearch', JSON.stringify(value));
        sethistory(value);
      } else {
        let existValues = JSON.parse(casinoSearchHistories);
        if (existValues?.indexOf(debouncedSearchValue) == -1) existValues = [debouncedSearchValue, ...existValues];
        CookiesStorage.setCookieData('casinoSearch', JSON.stringify(existValues));
        sethistory(existValues);
      }
    }
    return () => {};
  }, [debouncedSearchValue]);

  useEffect(() => {
    const casinoSearchHistories = CookiesStorage.getCookieData('casinoSearch');
    if (casinoSearchHistories) {
      const value = JSON.parse(casinoSearchHistories);
      sethistory(value);
    }
  }, [isMobile]);

  const handleClickHistory = (val: string) => {
    setSearchValue(val);
  };

  const handleDeletehistory = (index: number) => {
    const tempHistory = [...history];
    tempHistory.splice(index, 1);
    CookiesStorage.setCookieData('casinoSearch', JSON.stringify(tempHistory));

    sethistory(tempHistory);
  };

  const handleDeleteAllHistory = () => {
    CookiesStorage.setCookieData('casinoSearch', '[]');
    sethistory([]);
  };

  const searchResult = useMemo(() => {
    return (
      <>
        {debouncedSearchValue.length >= 3 && !!listSearchGame.length && (
          <div className="flex flex-col sm:mb-[20px] mb-0 h-full">
            <div className="flex justify-between">
              <div className="font-[600] dark:text-white text-black sm:text-[18px] text-[16px]">
                {t('casino:searchResult')}
              </div>
              <div
                className="font-[600] dark:text-white text-black sm:text-[18px] text-[16px]"
                dangerouslySetInnerHTML={{
                  __html: String(t('casino:searchNum', { length: listSearchGame.length })),
                }}
              />
            </div>

            <div className="game-grid-parent mt-[10px]">
              {listSearchGame.map((game, index) => {
                return (
                  <div key={index} className="max-w-[185px]">
                    <GameCard gameDetail={game} />
                  </div>
                );
              })}
            </div>
          </div>
        )}
        {debouncedSearchValue.length >= 3 && !listSearchGame.length && (
          <div className="py-[10px]">
            <NoDataComponent />
          </div>
        )}
      </>
    );
  }, [listSearchGame, debouncedSearchValue]);

  return (
    <div>
      <div className="relative">
        <input
          className={cn(
            'p-[18px] pr-[70px] pl-[50px] dark:text-white text-color-light-text-primary w-full text-default h-[40px] rounded-default bg-transparent border border-solid border-color-card-body-primary focus-within:border-color-primary placeholder:text-color-text-primary outline-none pointer-events-auto',
          )}
          value={searchValue}
          onChange={(e) => {
            onSearchChange(e.target.value);
            setSearchValue(e.target.value);
          }}
          placeholder={String(t('casino:gameNameAndProvider'))}
        />
        <SearchNormal
          width={22}
          height={22}
          className="absolute top-1/2 left-[20px] transform -translate-x-1/2 -translate-y-1/2 dark:text-color-text-primary text-color-light-text-primary"
        />
        {debouncedSearchValue.length > 0 && (
          <div
            role="button"
            className="absolute top-1/2 right-[65px] w-[14px] h-[14px] transform -translate-x-1/2 text-default -translate-y-1/2 text-white cursor-pointer"
            onClick={() => setSearchValue('')}
          >
            <XMarkIcon className="w-[14px] h-[14px] text-color-text-primary font-bold" />
          </div>
        )}
        <div
          role="button"
          className="absolute top-1/2 right-[-10px] transform -translate-x-1/2 text-default -translate-y-1/2 dark:text-white text-black"
          onClick={() => {
            setSearchValue('');
            onClose();
          }}
        >
          {t('setting:cancel')}
        </div>
      </div>
      {isShowSearch && (
        <>
          <div className="flex flex-col items-center justify-center mt-[20px] ">
            {debouncedSearchValue && debouncedSearchValue.length < 3 && (
              <Image
                src={theme === 'dark' ? '/img/empty-dark.png' : '/img/empty-light.png'}
                alt="noData"
                width={150}
                height={150}
              />
            )}
            {debouncedSearchValue.length < 3 && (
              <div
                className={cn(
                  'dark:text-gray-500 text-color-light-text-primary',
                  'transition-all duration-500 overflow-hidden',
                  {
                    'max-h-0': debouncedSearchValue.length >= 3,
                    'max-h-80': debouncedSearchValue.length < 3,
                  },
                )}
              >
                {t('casino:searchRequires')}
              </div>
            )}
            {history.length && debouncedSearchValue.length < 3 ? (
              <>
                <div className="flex justify-between w-full my-[10px]">
                  <div className="font-[600] dark:text-white text-black sm:text-[16px] text-default">
                    {t('casino:searchHistory')}
                  </div>
                  <div className="cursor-pointer text-color-text-primary" onClick={handleDeleteAllHistory}>
                    <Trash className="w-[20px] h-[20px]" />
                  </div>
                </div>
                <div className="flex gap-[10px] justify-start w-full mb-[20px] flex-nowrap relative max-w-full overflow-x-auto snap-x snap-mandatory">
                  {history.map((item, index) => (
                    <div
                      key={index}
                      className={cn(
                        styles.search_history_box,
                        'bg-white dark:bg-color-card-bg-default dark:text-color-text-primary ',
                        'flex-shrink-0',
                      )}
                    >
                      {item}
                      <div className={styles.close} onClick={() => handleDeletehistory(index)}>
                        <XMarkIcon className="text-color-text-primary w-[14px] hover:text-white font-bold" />
                      </div>
                      <div
                        className="left-0 top-0 w-full h-full z-[6] bg-transparent absolute"
                        onClick={() => handleClickHistory(item)}
                      />
                    </div>
                  ))}
                </div>
              </>
            ) : (
              ''
            )}
          </div>
          {isLoading ? (
            <div className="flex justify-center items-center min-h-[100px]">
              <ReactLoading type="bubbles" color="#00AAE6" delay={50} />
            </div>
          ) : (
            searchResult
          )}
        </>
      )}
    </div>
  );
}
