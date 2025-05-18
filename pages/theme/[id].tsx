import { GetStaticPaths, InferGetStaticPropsType } from 'next';
import { ReactElement, useCallback, useEffect, useState } from 'react';

import { api_getGamesByTheme, apiSSR_getProviders, apiSSR_getThemes } from '@/api/game';
import { useTranslation } from '@/base/config/i18next';
import { ROUTER } from '@/base/constants/common';
import { snakeCaseToString } from '@/base/libs/utils';
import { convertThemeToUrl, convertUrlToTheme } from '@/base/libs/utils/convert';
import { GameProviderDetail } from '@/base/types/common';
import { Breadcrumbs } from '@/components/breadcrumbs/breadcrumbs';
import GameCategory from '@/components/gameCategory/gameCategory';
import BaseLayout from '@/components/layouts/base.layout';
import MetaHead from '@/components/metaHead/metaHead';
import ProviderFilter from '@/components/providerFilter/providerFilter';
import Head from 'next/head';


export const getStaticPaths = (async () => {
  const response = await apiSSR_getThemes();
  const themes = response.data;
  return {
    paths: themes.map((theme: any) => ({ params: { id: convertThemeToUrl(theme) } })),
    fallback: false, // false or "blocking"
  }
}) satisfies GetStaticPaths

export const getStaticProps = (async ({ params }: any) => {
  const response = await apiSSR_getProviders();
  const providers: GameProviderDetail[] = response.data?.map((provider: any) => ({
    id: provider.id,
    name: provider.name,
    isSelect: false,
    totalGames: provider.gameCount,
  }))
  return { props: { providers, params } }
})

function CasinoCategoryPage({ providers, params }: InferGetStaticPropsType<typeof getStaticProps>) {
  const { t } = useTranslation('');
  const { id } = params;

  const [listProvider, setListProvider] = useState<GameProviderDetail[]>(providers);
  const [selectedProvider, setSelectedProvider] = useState<string[]>([]);
  const [isClearAll, setIsClearAll] = useState<boolean>(false);

  const handleSelectedProvider = useCallback(
    (providerId?: string | undefined) => {
      if (selectedProvider.length > 0) {
        setIsClearAll(true);
      }
      if (providerId) {
        const newListProvider = listProvider.map((provider) =>
          provider.id === providerId ? { ...provider, isSelect: !provider.isSelect } : provider,
        );
        const listProviderSelect = newListProvider.filter((provider) => provider.isSelect === true);
        const listProviderSelectId = listProviderSelect.map((provider) => provider.id);
        setSelectedProvider(listProviderSelectId);
        setListProvider(newListProvider);
      } else {
        setSelectedProvider([]);
        const newListProvider = listProvider.map((provider) => ({ ...provider, isSelect: false }));
        setListProvider(newListProvider);
      }
    },
    [listProvider],
  );

  const getGames = useCallback(async (page: number, pageSize: number) => {
    const theme = convertUrlToTheme(id);
    const _res = await api_getGamesByTheme(JSON.stringify(selectedProvider), page, pageSize, theme);
    return {
      data: _res.data?.games,
      page: _res.data?.page,
      pageSize: _res.data?.pageSize,
      totalPage: _res.data?.totalPage,
      totalCount: _res.data?.totalCount
    }
  }, [id, selectedProvider]);

  useEffect(() => {
    setListProvider(providers);
    setSelectedProvider([])
  }, [id])


  return (
    <>
      <MetaHead />
      <Head>
        <link
          rel="canonical"
          href={`https://bonenza.com/theme/${id}`}
          key="canonical"
        />
      </Head>
      <div className="py-[24px]">

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between relative gap-x-[32px] gap-y-[16px] flex-wrap">
          <Breadcrumbs
            data={[{ title: 'Casino', href: ROUTER.Casino }]}
            endpoint={{ title: snakeCaseToString(id ?? ''), href: ROUTER.Tagname(id ?? '') }}
          />
          <div className="flex items-center text-[14px] text-[#98a7b5] gap-[12px] md:gap-[48px] max-sm:w-full">
            <ProviderFilter
              listProvider={listProvider}
              selectedProvider={selectedProvider}
              selectProvider={handleSelectedProvider}
              viewCount={false}
            />
          </div>
        </div>

        <GameCategory getData={getGames} />
      </div>
    </>

  );
}

CasinoCategoryPage.getLayout = function getLayout(page: ReactElement) {
  return <BaseLayout>{page}</BaseLayout>;
};

export default CasinoCategoryPage;
