import { ArrowSwapVertical, Element3 } from 'iconsax-react';

import { OptionSidebarDataType } from '@/components/common/iconOption/iconOption';
import BlackjackIcon from '@/components/icons/BlackjackIcon';
import BuyInIcon from '@/components/icons/BuyInIcon';
import CasinoBoldIcon from '@/components/icons/CasinoBoldIcon';
import CupIcon from '@/components/icons/CupIcon';
import FavoriteIcon from '@/components/icons/FavoriteIcon';
import HotGameIcon from '@/components/icons/HotGameIcon';
import LiveCasinoIcon from '@/components/icons/LiveCasinoIcon';
import RacingBoldIcon from '@/components/icons/RacingBoldIcon';
import RecentIcon from '@/components/icons/RecentIcon';
import ReleaseIcon from '@/components/icons/ReleaseIcon';
import SlotIcon from '@/components/icons/SlotIcon';

import { ROUTER } from './common';

export const headerMenus: OptionSidebarDataType[] = [
  {
    title: '', //'layout:home',
    href: ROUTER.Master,
    icon: CupIcon,
    image: '',
    isMobile: true,
  },
  {
    title: 'sidebar:casino',
    href: ROUTER.Casino,
    icon: CasinoBoldIcon,
    image: 'casino.png',
    isMobile: false,
  },
  {
    title: 'casino:slot',
    href: ROUTER.CasinoTab('slots'),
    image: 'slots.png',
    icon: SlotIcon,
    isMobile: false,
  },
  {
    title: 'layout:racing',
    href: ROUTER.Tagname('racing'),
    image: 'racing.png',
    icon: RacingBoldIcon,
    isMobile: false,
  },
  {
    title: 'BitUp Game',
    href: 'https://bitup.game/trade',
    image: 'bitup.png',
    icon: ArrowSwapVertical,
    isMobile: false,
  },
];

export const casinoCategories: OptionSidebarDataType[] = [
  { title: 'casino:pickForYou', href: ROUTER.PicksForYou, icon: Element3 },
  { title: 'casino:favorite', href: ROUTER.Favorite, icon: FavoriteIcon },
  { title: 'casino:recent', href: ROUTER.Recent, icon: RecentIcon },
];

export const casinoGames: OptionSidebarDataType[] = [
  { title: 'casino:liveCasino', href: ROUTER.CasinoTab('live-casino'), icon: LiveCasinoIcon },
  { title: 'casino:hotGame', href: ROUTER.CasinoTab('hot-games'), icon: HotGameIcon },
  { title: 'casino:newReleases', href: ROUTER.CasinoTab('new-releases'), icon: ReleaseIcon },
  { title: 'casino:featureBuyIn', href: ROUTER.CasinoTab('feature-buy-in'), icon: BuyInIcon },
  { title: 'casino:blackjack', href: ROUTER.CasinoTab('blackjack'), icon: BlackjackIcon },
  { title: 'casino:tableGames', href: ROUTER.CasinoTab('table-games'), icon: LiveCasinoIcon },
];
