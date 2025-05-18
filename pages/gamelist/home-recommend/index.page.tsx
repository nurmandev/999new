import cn from 'classnames';
import { SearchNormal } from 'iconsax-react';
import Head from 'next/head';
import { ReactElement, useCallback } from 'react';
import { useDispatch } from 'react-redux';

import { api_getPickGames } from '@/api/game';
import { useTranslation } from '@/base/config/i18next';
import { ROUTER } from '@/base/constants/common';
import { changeIsShowCasinoSearch } from '@/base/redux/reducers/modal.reducer';
import { Breadcrumbs } from '@/components/breadcrumbs/breadcrumbs';
import GameCategory from '@/components/gameCategory/gameCategory';
import BaseLayout from '@/components/layouts/base.layout';

function CasinoTagnamePage() {
  const { t } = useTranslation('');
  const dispatch = useDispatch();

  const getGames = useCallback(async (page: number, pageSize: number) => {
    const _res = await api_getPickGames(page, pageSize);
    return {
      data: _res.data?.games,
      page: _res.data?.page,
      pageSize: _res.data?.pageSize,
      totalPage: _res.data?.totalPage,
      totalCount: _res.data?.totalCount
    }
  }, [])

  return (
    <>
      <Head>
        <title>{`Top Game List - Picks for You | Bonenza`}</title>
        <meta property="og:title" content={`Top Game List - Picks for You | Bonenza`} />

        <meta name="description" content={`Play Crypto casino games like Blackjack, Hot Games, Live Casino, Table Games & more with leading online casino Bonenza. Participate in an exciting Baccarat tournament and win big!`} />
        <meta property="og:description" content={`Play Crypto casino games like Blackjack, Hot Games, Live Casino, Table Games & more with leading online casino Bonenza. Participate in an exciting Baccarat tournament and win big!`} />
        <link
          rel="canonical"
          href="https://bonenza.com/gamelist/home-recommend"
          key="canonical"
        />
      </Head>

      <div className="py-[24px]">

        <div
          className="relative mt-[20px] h-[40px] mb-[10px] border border-solid dark:bg-transparent bg-white dark:border-white/10 rounded-[5px] flex items-center justify-start px-[10px] gap-[20px]"
          onClick={() => dispatch(changeIsShowCasinoSearch(true))}
          role="button"
        >
          <SearchNormal width={24} height={24} className="text-gray-500" />
          <div className={cn('w-full text-default text-gray-500 outline-none')}>{t('casino:gameNameAndProvider')}</div>
        </div>

        <Breadcrumbs
          data={[{ title: t('layout:casino'), href: ROUTER.Casino }]}
          endpoint={{ title: String(t('homePage:recommendedGames')), href: ROUTER.HomeBest }}
        />

        <GameCategory getData={getGames} />
      </div>
    </>

  );
}

CasinoTagnamePage.getLayout = function getLayout(page: ReactElement) {
  return <BaseLayout>{page}</BaseLayout>;
};

export default CasinoTagnamePage;
