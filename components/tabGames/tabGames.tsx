import cn from 'classnames';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';

import { useTranslation } from '@/base/config/i18next';
import { ROUTER } from '@/base/constants/common';
import { setCasinoTab } from '@/base/redux/reducers/common.reducer';
import { useAppDispatch } from '@/base/redux/store';
import HotGameBoldIcon from '@/components/icons/HotGameBoldIcon';
import LiveCasinoBoldIcon from '@/components/icons/LiveCasinoBoldIcon';
import LobbyBoldIcon from '@/components/icons/LobbyBoldIcon';
import OriginalBoldIcon from '@/components/icons/OriginalBoldIcon';
import ReleaseBoldIcon from '@/components/icons/ReleaseBoldIcon';
import SlotBoldIcon from '@/components/icons/SlotBoldIcon';
import TableGameBoldIcon from '@/components/icons/TableGameBoldIcon';
import styles from '@/styles/dashboard/index.module.scss';
import BuyInIcon from '../icons/BuyInIcon';
type tabGamesProps = {
  setCurrentPage?: (page: number) => void;
  ishome?: boolean;
};

const TabGames = (props: tabGamesProps) => {
  const { setCurrentPage, ishome = false } = props;
  const { t } = useTranslation('');
  const dispatch = useAppDispatch();
  const router = useRouter();

  const filterOptions = [
    {
      icon: <LobbyBoldIcon />,
      title: t('casino:lobby'),
      link: ROUTER.Casino,
      homeLink: ROUTER.Casino,
      id: 1,
    },
    {
      icon: <OriginalBoldIcon />,
      title: t('casino:topPicks'),
      link: ROUTER.Tagname('top-picks'),
      homeLink: `?key=top-picks`,
      id: 2,
    },
    {
      icon: <LiveCasinoBoldIcon />,
      title: t('casino:liveCasino'),
      link: ROUTER.Tagname('live-casino'),
      homeLink: `?key=live-casino`,
      id: 5,
    },
    {
      icon: <HotGameBoldIcon />,
      title: t('casino:hotGame'),
      link: ROUTER.Tagname('hot-games'),
      homeLink: `?key=hot-games`,
      id: 4,
    },
    {
      icon: <SlotBoldIcon />,
      title: t('casino:slot'),
      link: ROUTER.Tagname('slots'),
      homeLink: `?key=slots`,
      id: 3,
    },
    {
      icon: <BuyInIcon />,
      title: t('casino:blackjack'),
      link: ROUTER.Tagname('blackjack'),
      homeLink: `?key=blackjack`,
      id: 9,
    },
    {
      icon: <TableGameBoldIcon />,
      title: t('casino:tableGames'),
      link: ROUTER.Tagname('table-games'),
      homeLink: `?key=table-games`,
      id: 6,
    },
    {
      icon: <ReleaseBoldIcon />,
      title: t('casino:newReleases'),
      link: ROUTER.Tagname('new-releases'),
      homeLink: `?key=new-releases`,
      id: 7,
    },
    {
      icon: <BuyInIcon />,
      title: t('casino:featureBuyIn'),
      link: ROUTER.Tagname('feature-buy-in'),
      homeLink: `?key=feature-buy-in`,
      id: 8,
    },
  ];

  return (
    <div className="relative sm:my-[20px] mt-[10px] max-w-full overflow-x-auto snap-x snap-mandatory flex sm:flex-wrap flex-nowrap gap-[8px]">
      {filterOptions.map((option, key) => {
        return (
          <Link href={ishome ? option?.homeLink : option?.link} key={key} className="min-w-fit">
            <div
              role="button"
              className={cn(
                'flex items-center px-[20px] py-[10px] bg-[#f0f1f5] dark:bg-color-hover-primary hover:bg-gray-700 gap-[10px] flex-shrink-0 rounded-default text-black/50 dark:text-white/50 dark:hover:text-white dark:hover:bg-color-hover-primary hover:text-black hover:bg-white/90',
                {
                  'bg-white text-black dark:!bg-color-input-primary dark:!text-white': (!router.query?.key ? router.asPath === option.link : (option.id !== 1 && (router.asPath.includes(option.homeLink) || router.asPath.includes(option.link)))),
                },
              )}
              onClick={() => {
                setCurrentPage?.(1);
                dispatch(setCasinoTab(true));
              }}
            >
              <div>{option.icon}</div>
              <span className={`text-[14px] `}>{option.title}</span>
            </div>
          </Link>
        );
      })}
    </div>
  );
};

export default TabGames;
