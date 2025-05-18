import Head from 'next/head';
import { ReactElement, useCallback } from 'react';

import { api_getPickGames } from '@/api/game';
import { useTranslation } from '@/base/config/i18next';
import { ROUTER } from '@/base/constants/common';
import { Breadcrumbs } from '@/components/breadcrumbs/breadcrumbs';
import GameCategory from '@/components/gameCategory/gameCategory';
import BaseLayout from '@/components/layouts/base.layout';

function PickForYouPage() {
  const { t } = useTranslation('');

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
          href="https://bonenza.com/gamelist/picks-for-you"
          key="canonical"
        />
      </Head>
      <div className="py-[24px]">

        <Breadcrumbs
          data={[{ title: t('layout:casino'), href: ROUTER.Casino }]}
          endpoint={{ title: String(t('casino:pickForYou')), href: ROUTER.PicksForYou }}
        />

        <GameCategory getData={getGames} />

      </div>
    </>

  );
}

PickForYouPage.getLayout = function getLayout(page: ReactElement) {
  return <BaseLayout>{page}</BaseLayout>;
};

export default PickForYouPage;
