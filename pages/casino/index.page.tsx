import cn from 'classnames';
import { SearchNormal } from 'iconsax-react';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { ReactElement, useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

import { api_getCasinoGameData, api_getCasinoWithKey, CasinoRequest } from '@/api/game';
import { useTranslation } from '@/base/config/i18next';
import { API_PROVIDER_IMAGE, ROUTER } from '@/base/constants/common';
import { isEmpty, snakeCaseToString } from '@/base/libs/utils';
import { convert2Url, convertThemeToUrl } from '@/base/libs/utils/convert';
import { changeIsShowCasinoSearch } from '@/base/redux/reducers/modal.reducer';
import { BetDetailType, GameListType, GameProviderDetail } from '@/base/types/common';
import CasinoSS from '@/components/casino/casinoSS';
import Loader from '@/components/common/preloader/loader';
import GameCard from '@/components/gameCard/gameCard';
import GameCategory from '@/components/gameCategory/gameCategory';
import HomepageSession from '@/components/homepage/homepageSession/homepageSession';
import LatestBetRace from '@/components/homepage/latestBetRace';
import RecentBigWinComponent from '@/components/homepage/recentBigWin';
import BaseLayout from '@/components/layouts/base.layout';
import MetaHead from '@/components/metaHead/metaHead';
import GameBannerSlider from '@/components/sliders/gameSliders';
import TabGames from '@/components/tabGames/tabGames';
import SearchComponent from '@/components/modal/casinoSearch/searchComponent';

type ListGamesType = {
  games: GameListType[];
  slots: GameListType[];
  hotGames: GameListType[];
  liveCasinos: GameListType[];
  newReleases: GameListType[];
  blackjacks: GameListType[];
  tableGames: GameListType[];
};

function CasinoPage() {
  const { t } = useTranslation('');
  const dispatch = useDispatch();
  const { query } = useRouter();
  const { key } = query;
  const _key = String(key);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isShowSearch, setIsShowSearch] = useState<boolean>(false);

  const [listBigWinGame, setListBigWinGame] = useState<BetDetailType[]>([]);
  const [listProvider, setListProvider] = useState<GameProviderDetail[]>([]);
  const [listTheme, setListTheme] = useState<string[]>([]);

  const [listGames, setListGames] = useState<ListGamesType>({
    games: [],
    slots: [],
    hotGames: [],
    liveCasinos: [],
    newReleases: [],
    blackjacks: [],
    tableGames: [],
  });

  const getInitialData = async () => {
    const initGameDatas: ListGamesType = {
      games: [],
      slots: [],
      hotGames: [],
      liveCasinos: [],
      newReleases: [],
      blackjacks: [],
      tableGames: [],
    };
    try {
      setIsLoading(true);
      const _resCasino = await api_getCasinoGameData();
      const keys = ['slots', 'hotGames', 'liveCasino', 'newReleases', 'blackjacks', 'tableGames'];
      let i = 0;
      let tempGameLists: ListGamesType = { ...initGameDatas };
      for (i = 0; i < keys.length; i++) {
        const key = keys[i];
        const tempGameListData: GameListType[] = _resCasino.data[key]?.map((item: any) => ({
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
        if (i === 0) tempGameLists['slots'] = [...tempGameListData];
        if (i === 1) tempGameLists['hotGames'] = [...tempGameListData];
        if (i === 2) tempGameLists['liveCasinos'] = [...tempGameListData];
        if (i === 3) tempGameLists['newReleases'] = [...tempGameListData];
        if (i === 4) tempGameLists['blackjacks'] = [...tempGameListData];
        if (i === 5) tempGameLists['tableGames'] = [...tempGameListData];
      }
      const tempRecentBigWins: BetDetailType[] = _resCasino.data.recentBigWins?.map((item: any) => ({
        id: item?.id ?? '',
        game: item?.title ?? '',
        identifier: item?.identifier ?? '',
        amount: Number(item.betAmount || 0),
        amountUsd: Number(item.betAmountUsd || 0),
        currency: item?.currency ?? 'USD',
        currencyType: 'crypto',
        multiplier: Number(item?.multiplier || 0),
        profit: Number(item?.profitAmount || 0),
        profitUsd: Number(item?.profitAmountUsd || 0),

        userId: item?.userId ?? '',
        userName: item?.userName ?? '',
        userAvatar: item?.userAvatar ?? '',
        providerName: item?.providerName ?? '',
      }));
      tempRecentBigWins.push(...tempRecentBigWins.slice(0));
      const tempProviders = _resCasino.data.gameProviders?.map((provider: any) => ({
        id: provider.id,
        name: provider.name,
        image: provider.identifier,
        isSelect: false,
        totalGames: provider.gameCount,
      }));
      const tempThemes = [..._resCasino.data.themes];
      setListGames(tempGameLists);
      setListBigWinGame(tempRecentBigWins);
      setListProvider(tempProviders);
      setListTheme(tempThemes);
    } catch (err) {
      console.error(err);
      setListGames({ ...initGameDatas });
      setListBigWinGame([]);
      setListProvider([]);
      setListTheme([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getInitialData();
    localStorage.removeItem('tab');
  }, []);

  const getGames = useCallback(
    async (page: number, pageSize: number) => {
      let params: CasinoRequest = {
        page,
        pageSize,
        providers: JSON.stringify([]),
        sort: 'like',
      };
      const _res = await api_getCasinoWithKey(convert2Url(_key), params);
      return {
        data: _res.data?.games,
        page: _res.data?.page,
        pageSize: _res.data?.pageSize,
        totalPage: _res.data?.totalPage,
        totalCount: _res.data?.totalCount,
      };
    },
    [_key],
  );

  return (
    <>
      <MetaHead />
      <Head>
        <link rel="canonical" href="https://bonenza.com/casino" key="canonical" />
      </Head>
      <div className="py-[24px]">
        <h1 className="hidden">Casino</h1>
        {isLoading && <Loader />}

        <GameBannerSlider className="!mt-0 mb-4" />
        {/* Search */}
        <SearchComponent
          isShowSearch={isShowSearch}
          onSearchChange={(value: string) => {
            if (value !== '') {
              setIsShowSearch(true);
            } else {
              setIsShowSearch(false);
            }
          }}
          onClose={() => {
            setIsShowSearch(false);
          }}
        />
        {!isShowSearch && (
          <>
            {/* Filter Horizontal */}
            <TabGames ishome />

            {/* Game Options */}
            {isEmpty(_key) && (
              <>
                <div className="flex flex-col gap-[30px] sm:pt-0 pt-[10px]">
                  <div className="w-full sm:block hidden">
                    {listBigWinGame.length > 0 && <RecentBigWinComponent listBigWinGame={listBigWinGame} />}
                  </div>

                  <CasinoSS
                    title={String(t('casino:liveCasino'))}
                    data={listGames.liveCasinos}
                    renderItem={(item) => <GameCard gameDetail={item} />}
                    viewAllUrl={ROUTER.Tagname('live-casino')}
                  />
                  <CasinoSS
                    title={String(t('casino:hotGame'))}
                    data={listGames.hotGames}
                    renderItem={(item) => <GameCard gameDetail={item} />}
                    viewAllUrl={ROUTER.Tagname('hot-games')}
                  />
                  <CasinoSS
                    title={String(t('casino:slot'))}
                    data={listGames.slots}
                    renderItem={(item) => <GameCard gameDetail={item} />}
                    viewAllUrl={ROUTER.Tagname('slots')}
                  />
                  <CasinoSS
                    title={String(t('casino:gameProvider'))}
                    data={listProvider}
                    viewAllUrl={ROUTER.Providers}
                    renderItem={(item: GameProviderDetail) => (
                      <Link
                        href={ROUTER.Provider(String(item.image))}
                        role="button"
                        className={cn(
                          'border border-solid border-color-card-border-primary',
                          'bg-color-card-bg-primary',
                          'text-gray-300 hover:text-white text-m_default sm:text-default',
                          'rounded-lg flex flex-col justify-center items-center p-3 min-h-[100px]',
                        )}
                      >
                        <Image
                          height={0}
                          width={0}
                          src={
                            item?.image ? `${API_PROVIDER_IMAGE}/${item?.image}.png` : `/img/providers/softswiss.png`
                          }
                          alt="provider logo"
                          onError={(e) => {
                            e.currentTarget.src = `/img/providers/softswiss.png`;
                          }}
                          className="object-contain h-[40px] sm:h-[45px] w-auto"
                        />
                        <p className="text-center">{item?.name || ''}</p>
                      </Link>
                    )}
                  />
                  <CasinoSS
                    title={String(t('casino:newReleases'))}
                    data={listGames.newReleases}
                    renderItem={(item) => <GameCard gameDetail={item} />}
                    viewAllUrl={ROUTER.Tagname('new-releases')}
                  />
                  <CasinoSS
                    title={String(t('casino:blackjack'))}
                    data={listGames.blackjacks}
                    renderItem={(item) => <GameCard gameDetail={item} />}
                    viewAllUrl={ROUTER.Tagname('blackjack')}
                  />
                  <CasinoSS
                    title={String(t('casino:themes'))}
                    data={listTheme}
                    viewAllUrl={ROUTER.Themes}
                    renderItem={(item: string) => (
                      <Link
                        href={ROUTER.Theme(convertThemeToUrl(item))}
                        role="button"
                        className={cn(
                          'flex justify-center items-center h-[64px] min-w-fit p-[10px] gap-[10px] rounded-lg flex-shrink-0',
                          'xl:text-default text-default text-center text-black dark:text-white',
                          'bg-white dark:bg-color-card-bg-primary border border-solid border-color-card-border-primary hover:opacity-90',
                        )}
                      >
                        {snakeCaseToString(item)}
                      </Link>
                    )}
                  />
                  <CasinoSS
                    title={String(t('casino:tableGames'))}
                    data={listGames.tableGames}
                    renderItem={(item) => <GameCard gameDetail={item} />}
                    viewAllUrl={ROUTER.Tagname('table-games')}
                  />
                </div>

                <div className="w-full relative mt-4">
                  <HomepageSession title={String(t('homePage:latestBetRace'))} showIcon={false}>
                    <LatestBetRace />
                  </HomepageSession>
                </div>
              </>
            )}
            {!isEmpty(_key) && <GameCategory getData={getGames} />}
          </>
        )}
      </div>
    </>
  );
}

CasinoPage.getLayout = function getLayout(page: ReactElement) {
  return <BaseLayout>{page}</BaseLayout>;
};

export default CasinoPage;
