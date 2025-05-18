import { InfoCircle } from 'iconsax-react';
import Image from 'next/image';
import Link from 'next/link';

import { useTranslation } from '@/base/config/i18next';
import { ROUTER } from '@/base/constants/common';
import { GameListType } from '@/base/types/common';

import CasinoSS from '../casino/casinoSS';
import GameCard from '../gameCard/gameCard';
import { convertGameIdentifierToUrl, convertToUrlCase } from '@/base/libs/utils/convert';

type CardRecommendedProps = {
  title: string;
  imgCard: string;
};

type RecommendedGamesProps = {
  listRecommendedGame: GameListType[];
};

export function CardRecommended({ title, imgCard }: CardRecommendedProps) {
  const { t } = useTranslation('');
  return (
    <div className="rounded-[5px] bg-[#12181F]">
      <div className="rounded-[5px]">
        <Image
          height={180}
          width={180}
          src={imgCard}
          alt="recommeded game"
          className="w-full object-cover max-h-[160px] rounded-[5px]"
        />
      </div>
      <div className="p-[10px]">
        <div className="flex justify-between">
          <div className="text-white font-medium text-[12px]">{title}</div>
          <InfoCircle size={16} className="text-[#8E8E90]" />
        </div>
        <div className="flex justify-center items-center rounded-[5px] bg-second hover:opacity-[0.9] max-w-fit px-2 cursor-pointer py-[10px] gap-[10px] mt-[10px]">
          <div className="text-white font-bold text-[12px]">{String(t('homePage:playNow'))}</div>
        </div>
      </div>
    </div>
  );
}

function RecommendedGamesComponent({ listRecommendedGame }: RecommendedGamesProps) {
  const { t } = useTranslation('');

  return (
    <CasinoSS
      title={String(t('homePage:recommendedGames'))}
      data={listRecommendedGame}
      renderItem={(item) => (
        <GameCard
          gameDetail={item}
          footer={() => (
            <Link
              href={ROUTER.GameDetail(convertGameIdentifierToUrl(String(item.identifier)))}
              className="sm:flex hidden hover:opacity-[0.9] bg-gradient-btn-play shadow-bs-btn cursor-pointer py-3 text-center rounded-large"
            >
              <div className="text-white font-medium text-[16px] w-full">{String(t('homePage:playNow'))}</div>
            </Link>
          )}
        />
      )}
      viewAllUrl={ROUTER.HomeRecommend}
    />
  );
}

export default RecommendedGamesComponent;
