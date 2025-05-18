import { InfoCircle } from 'iconsax-react';
import Image from 'next/image';
import Link from 'next/link';

import { useTranslation } from '@/base/config/i18next';
import { API_GAME_IMAGE, ROUTER } from '@/base/constants/common';
import { convertGameIdentifierToUrl, convertToUrlCase } from '@/base/libs/utils/convert';
import { GameListType } from '@/base/types/common';

import CasinoSS from '../casino/casinoSS';
import GameCard from '../gameCard/gameCard';

type CardTopRatedProps = {
  title?: string;
  provider?: string;
  identifier?: string;
};

type TopRateGameProps = {
  listRecommendedGame: GameListType[];
};

export function CardTopRated({ title, provider, identifier }: CardTopRatedProps) {
  const { t } = useTranslation('');
  return (
    <div className="rounded-[5px] bg-[#12181F]">
      <div className="rounded-[5px]">
        <Image
          height={180}
          width={180}
          src={`${API_GAME_IMAGE}/icon/${provider}/${identifier}.png`}
          alt="top rated game"
          onError={(err) => {
            err.currentTarget.src = '/img/recommended-game-3.png';
          }}
          className="w-full object-cover max-h-[160px] rounded-[5px]"
        />
      </div>
      <div className="p-[10px]">
        <div className="flex justify-between items-center">
          <div className="text-white font-medium text-[12px]">{title}</div>
          <InfoCircle size={16} className="text-[#8E8E90]" />
        </div>
        <div className="flex justify-center items-center rounded-[5px] bg-[#F61B4F] hover:opacity-[0.9] max-w-fit px-2 cursor-pointer py-[10px] gap-[10px] mt-[10px]">
          <div className="text-white font-bold text-[12px]">{String(t('homePage:playNow'))}</div>
        </div>
      </div>
    </div>
  );
}

function TopRateGameComponent({ listRecommendedGame }: TopRateGameProps) {
  const { t } = useTranslation('');

  return (
    <CasinoSS
      title={String(t('homePage:topRatedGames'))}
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
      viewAllUrl={ROUTER.HomeBest}
    />
  );
}

export default TopRateGameComponent;
