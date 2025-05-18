import React, { ReactElement, useCallback } from 'react';

import { api_getRecentGames } from '@/api/game';
import { useTranslation } from '@/base/config/i18next';
import { ROUTER } from '@/base/constants/common';
import { Breadcrumbs } from '@/components/breadcrumbs/breadcrumbs';
import GameCategory from '@/components/gameCategory/gameCategory';
import withAuth from '@/components/hoc/withAuth';
import BaseLayout from '@/components/layouts/base.layout';
import MetaHead from '@/components/metaHead/metaHead';

function RecentPage() {

  const { t } = useTranslation('');

  const getGames = useCallback(async (page: number, pageSize: number) => {
    const _res = await api_getRecentGames(page, pageSize);
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
      <MetaHead />
      <div className="py-[24px]">
        <Breadcrumbs
          data={[{ title: t('layout:casino'), href: ROUTER.Casino }]}
          endpoint={{ title: t('casino:recent'), href: ROUTER.Recent }}
        />
        <GameCategory getData={getGames} />
      </div>
    </>

  );
}

const RecentPageAuth = withAuth(RecentPage);

RecentPageAuth.getLayout = function getLayout(page: ReactElement) {
  return <BaseLayout>{page}</BaseLayout>;
};

export default RecentPageAuth;
