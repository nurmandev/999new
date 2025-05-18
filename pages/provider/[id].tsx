import type {
    GetStaticPaths,
    InferGetStaticPropsType,
} from 'next'
import Head from 'next/head';
import Link from 'next/link';
import React, { ReactElement, useCallback, useEffect, useMemo, useState } from 'react';

import { api_getGamesByProvider, api_getProviders, apiSSR_getPickGames, apiSSR_getProviders, SortType } from '@/api/game';
import { useTranslation } from '@/base/config/i18next';
import { ROUTER } from '@/base/constants/common';
import { titleCase } from '@/base/libs/utils';
import { GameListType } from '@/base/types/common';
import { Breadcrumbs } from '@/components/breadcrumbs/breadcrumbs';
import CasinoSS from '@/components/casino/casinoSS';
import GameCard from '@/components/gameCard/gameCard';
import GameCategory from '@/components/gameCategory/gameCategory';
import BaseLayout from '@/components/layouts/base.layout';
import MetaHead from '@/components/metaHead/metaHead';
import SortBy from '@/components/sortBy/sortBy';

export const getStaticPaths = (async () => {
    const response = await apiSSR_getProviders();
    const providers = response.data;
    return {
        paths: providers.map((provider: any) => ({ params: { id: provider.identifier } })),
        fallback: false, // false or "blocking"
    }
}) satisfies GetStaticPaths

export const getStaticProps = (async ({ params }: any) => {
    const response = await apiSSR_getPickGames(1, 20);
    const games: GameListType[] = response.data.games?.map((item: any) => ({
        id: item?.id ?? '',
        title: item?.title ?? '',
        description: item?.description ?? '',
        identifier: item?.identifier ?? '',
        payout: Number(item.payout || 0),
        multiplier: Number(item.profitMultiplier || 0),
        provider: item?.producerIdentifier || '',
        providerName: item?.producerName ?? '',
        releasedAt: '',
    }))
    return { props: { games, params } }
})

function ProviderPage({ games, params }: InferGetStaticPropsType<typeof getStaticProps>) {
    const { t } = useTranslation('');

    const sortBy: Array<{ id: number, label: string, orderValue: SortType, orderBy: string }> = [
        { id: 2, label: String(t('casino:Popular')), orderValue: 'popular', orderBy: 'total_favorite' },
        { id: 3, label: 'A-Z', orderValue: 'asc', orderBy: 'title' },
        { id: 4, label: 'Z-A', orderValue: 'desc', orderBy: 'title' },
        { id: 5, label: String(t('casino:new')), orderValue: 'new', orderBy: 'released_at' },
    ];

    const { id } = params;

    const [selectedSortBy, setSelectedSortBy] = useState(sortBy[0]);
    const [providers, setProviders] = useState<Array<{ id: string, name: string, identifier: string }>>([]);

    const getProviders = async () => {
        try {
            const _res = await api_getProviders();
            const tempProviders = _res.data.map((provider: any) => ({
                id: provider.id,
                name: provider.name,
                identifier: provider.identifier,
            }));
            setProviders(tempProviders);
        } catch (error) {
            setProviders([]);
        }
    };

    const provider = useMemo(() => {
        const selectedProvider = providers.find(provider => provider.identifier === id);
        return selectedProvider;
    }, [id, providers])

    useEffect(() => {
        getProviders();
    }, [id]);

    const getGames = useCallback(async (page: number, pageSize: number) => {
        const _res = await api_getGamesByProvider(String(id), selectedSortBy.orderValue, page, pageSize);
        return {
            data: _res.data?.data,
            page: _res.data?.page,
            pageSize: _res.data?.pageSize,
            totalPage: _res.data?.totalPage,
            totalCount: _res.data?.totalCount
        }
    }, [id, selectedSortBy]);

    return (
        <>
            <MetaHead />
            <Head>
                <link
                    rel="canonical"
                    href={`https://bonenza.com/provider/${id}`}
                    key="canonical"
                />
            </Head>
            <div className="py-[24px]">
                <Breadcrumbs
                    data={[{ title: 'Casino', href: ROUTER.Casino }]}
                    endpoint={{ title: String(provider?.name || id), href: ROUTER.Provider(String(id)) }}
                />
                <div className="sm:flex grid grid-cols-2 sm:justify-between mt-[10px] items-center justify-start gap-[30px]">
                    <p className="text-color-primary cursor-pointer sm:text-[16px] text-[14px]">
                        <Link href={ROUTER.Providers}>{`${t('gameDetail:viewAll')} ${t('layout:providers')}`}</Link>
                    </p>
                    <SortBy
                        sortBy={sortBy}
                        selectSortBy={(sort) => setSelectedSortBy(sort)}
                        selectedSortBy={selectedSortBy}
                        label={false}
                    />
                </div>
                <>
                    <h1 className="sm:text-[24px] text-[16px] mt-[24px] dark:text-white text-black">
                        {titleCase(provider?.name || id)} {t('layout:games')}
                    </h1>
                    <GameCategory getData={getGames} />
                    <div className="mt-10">
                        <CasinoSS
                            title={String(t('casino:alsoLike'))}
                            data={games}
                            renderItem={(item) => <GameCard gameDetail={item} />}
                            viewAllUrl={ROUTER.Tagname('live-casino')}
                        />
                    </div>
                </>
            </div>
        </>

    );
}

ProviderPage.getLayout = function getLayout(page: ReactElement) {
    return <BaseLayout>{page}</BaseLayout>;
};

export default ProviderPage;