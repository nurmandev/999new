import type {
    GetStaticPaths,
    InferGetStaticPropsType,
} from 'next'
import Head from 'next/head';
import React, { ReactElement, useCallback, useEffect, useState } from 'react';

import { api_getCasinoWithKey, apiSSR_getProviders, SortType } from '@/api/game';
import { useTranslation } from '@/base/config/i18next';
import { ROUTER, Tags, TagType } from '@/base/constants/common';
import { convert2Url } from '@/base/libs/utils/convert';
import { CategoryType, GameProviderDetail } from '@/base/types/common';
import { Breadcrumbs } from '@/components/breadcrumbs/breadcrumbs';
import GameCategory from '@/components/gameCategory/gameCategory';
import BaseLayout from '@/components/layouts/base.layout';
import ProviderFilter from '@/components/providerFilter/providerFilter';
import SortBy from '@/components/sortBy/sortBy';
import { SearchNormal } from 'iconsax-react';
import { changeIsShowCasinoSearch } from '@/base/redux/reducers/modal.reducer';
import cn from 'classnames';
import { useDispatch } from 'react-redux';
import GameBannerSlider from '@/components/sliders/gameSliders';

export const getStaticPaths = (async () => {
    const tags = [...Tags]
    return {
        paths: tags.map((tag: any) => ({ params: { tag } })),
        fallback: false, // false or "blocking"
    }
}) satisfies GetStaticPaths

export const getStaticProps = (async ({ params }: any) => {
    const tag = params?.tag;
    if (!tag) {
        return { notFound: true }
    } else {
        let category: CategoryType = 'all';
        switch (tag) {
            case 'slots':
                category = 'slots';
                break;
            case 'live-casino':
                category = 'live_casino';
                break;
            case 'hot-games':
                category = 'hot_games';
                break;
            case 'new-releases':
                category = 'new_releases';
                break;
            case 'blackjack':
                category = 'blackjack';
                break;
            case 'feature-buy-in':
                category = 'feature_Buy_In';
                break;
            case 'table-games':
                category = 'table_games';
                break;
            case 'racing':
                category = 'racing';
                break;
            default:
                category = 'all';
                break;
        }
        const _res = await apiSSR_getProviders(category);
        const providers: GameProviderDetail[] = _res.data.map((provider: any) => ({
            id: provider.id,
            name: provider.name,
            isSelect: false,
            totalGames: provider.gameCount,
        }));
        return { props: { params, providers } }
    }

})

function CasinoTagnamePage({ params, providers }: InferGetStaticPropsType<typeof getStaticProps>) {
    const { tag } = params;
    const { t } = useTranslation('');
    const dispatch = useDispatch();

    const sortBy: Array<{ id: number, label: string, orderValue: SortType, orderBy: string }> = [
        { id: 1, label: String(t('casino:mayLike')), orderValue: 'like', orderBy: '' },
        { id: 2, label: String(t('casino:popular')), orderValue: 'popular', orderBy: 'total_favorite' },
        { id: 3, label: 'A-Z', orderValue: 'asc', orderBy: 'title' },
        { id: 4, label: 'Z-A', orderValue: 'desc', orderBy: 'title' },
        { id: 5, label: String(t('casino:new')), orderValue: 'new', orderBy: 'released_at' },
    ];

    const [listProvider, setListProvider] = useState<GameProviderDetail[]>(providers);
    const [selectedProvider, setSelectedProvider] = useState<string[]>([]);

    const [selectedSortBy, setSelectedSortBy] = useState(sortBy[0]);

    const selectSortBy = useCallback((sort: any) => {
        setSelectedSortBy(sort);
    }, []);

    const getGames = useCallback(async (page: number, pageSize: number) => {
        const query = tag === 'slots' || tag === 'live-casino' || tag === 'racing' ? { sort: selectedSortBy.orderValue } : {};
        let params: any = {
            page,
            pageSize,
            ...query,
            providers: JSON.stringify(selectedProvider)
        };
        const _res = await api_getCasinoWithKey(convert2Url(String(tag)), params);
        return {
            data: _res.data?.games,
            page: _res.data?.page,
            pageSize: _res.data?.pageSize,
            totalPage: _res.data?.totalPage,
            totalCount: _res.data?.totalCount
        }
    }, [selectedProvider, selectedSortBy, tag])

    const convertTag2Label = (tag: string) => {
        let label = '';
        switch (tag) {
            case 'slots':
                label = 'Slots';
                break;
            case 'live-casino':
                label = 'Live Casino';
                break;
            case 'hot-games':
                label = 'Hot Games';
                break;
            case 'new-releases':
                label = 'New Releases';
                break;
            case 'blackjack':
                label = 'Blackjack';
                break;
            case 'feature-buy-in':
                label = 'Feature Buy In';
                break;
            case 'table-games':
                label = 'Table Games';
                break;
            case 'racing':
                label = 'Racing';
                break;
            default:
                label = 'Slots';
                break;
        }
        return label;
    }

    const convertTag2Meta = (tag: string) => {
        let label = '';
        switch (tag) {
            case 'slots':
                label = 'Slots Games';
                break;
            case 'live-casino':
                label = 'Live Casino Games';
                break;
            case 'hot-games':
                label = 'Hot Games';
                break;
            case 'new-releases':
                label = 'New Releases Games';
                break;
            case 'blackjack':
                label = 'Blackjack Games';
                break;
            case 'feature-buy-in':
                label = 'Feature Buy In';
                break;
            case 'table-games':
                label = 'Table Games';
                break;
            case 'racing':
                label = 'Racing Games';
                break;
            default:
                label = 'Games';
                break;
        }
        return label;
    }

    const handleSelectedProvider = useCallback(
        (providerId?: string | undefined) => {
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

    useEffect(() => {
        setSelectedProvider([]);
        setListProvider(providers)
    }, [tag]);


    return (
        <>
            <Head>
                <title>{`${convertTag2Label(tag)} Online Crypto Casino Games - Bonenza`}</title>
                <meta property="og:title" content={`${convertTag2Label(tag)} Online Crypto Casino Games - Bonenza`} />

                <meta name="description" content={`Experience thrilling ${convertTag2Meta(tag)} at Bonenza Casino. Join us today and Play ${convertTag2Meta(tag)} to enjoy the ultimate gaming adventure.`} />
                <meta property="og:description" content={`Experience thrilling ${convertTag2Meta(tag)} at Bonenza Casino. Join us today and Play ${convertTag2Meta(tag)} to enjoy the ultimate gaming adventure.`} />
                <link
                    rel="canonical"
                    href={`https://bonenza.com/casino/${tag}`}
                    key="canonical"
                />
            </Head>
            <div className="py-[24px]">
                <GameBannerSlider className="!mt-0" />
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between relative gap-x-[32px] gap-y-[16px] flex-wrap">
                    <Breadcrumbs
                        data={[{ title: 'Casino', href: ROUTER.Casino }]}
                        endpoint={{ title: convertTag2Label(String(tag) || ''), href: ROUTER.Tagname((String(tag) ?? '') as TagType) }}
                    />
                    <div className="flex items-center text-[14px] text-[#98a7b5] gap-[12px] md:gap-[48px] max-sm:w-full">
                        {(tag === 'slots' || tag === 'live-casino') && (
                            <SortBy sortBy={sortBy} selectSortBy={selectSortBy} selectedSortBy={selectedSortBy} />
                        )}
                        <ProviderFilter
                            listProvider={listProvider}
                            selectedProvider={selectedProvider}
                            selectProvider={handleSelectedProvider}
                        />
                    </div>
                </div>
                <div
                    className="relative mt-[20px] h-[40px] border border-solid dark:bg-transparent bg-white dark:border-white/10 rounded-[5px] flex items-center justify-start px-[10px] gap-[20px]"
                    onClick={() => dispatch(changeIsShowCasinoSearch(true))}
                    role="button"
                >
                    <SearchNormal width={24} height={24} className="text-gray-500" />
                    <div className={cn('w-full text-default text-gray-500 outline-none')}>{t('casino:gameNameAndProvider')}</div>
                </div>
                <div className="min-h-[380px]">
                    <GameCategory getData={getGames} />
                </div>
            </div>
        </>

    );
}

CasinoTagnamePage.getLayout = function getLayout(page: ReactElement) {
    return <BaseLayout>{page}</BaseLayout>;
};

export default CasinoTagnamePage;
