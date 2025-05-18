import cn from 'classnames';
import classNames from 'classnames';
import { InfoCircle } from 'iconsax-react';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { useDispatch } from 'react-redux';
import { Tooltip } from 'react-tooltip';

import { useTranslation } from '@/base/config/i18next';
import { API_GAME_IMAGE, ROUTER } from '@/base/constants/common';
import { convertGameIdentifierToUrl, convertToUrlCase } from '@/base/libs/utils/convert';
import { changeIsShowCasinoSearch } from '@/base/redux/reducers/modal.reducer';
import { GameListType } from '@/base/types/common';

type GameCardProps = {
  gameDetail: GameListType;
  listView?: boolean;
  footer?: () => React.ReactNode;
};

const convertImage = (w: number, h: number) => `
  <svg width="${w}" height="${h}" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
    <defs>
      <linearGradient id="g">
        <stop stop-color="#333" offset="20%" />
        <stop stop-color="#222" offset="50%" />
        <stop stop-color="#333" offset="70%" />
      </linearGradient>
    </defs>
    <rect width="${w}" height="${h}" fill="#333" />
    <rect id="r" width="${w}" height="${h}" fill="url(#g)" />
    <animate xlink:href="#r" attributeName="x" from="-${w}" to="${w}" dur="1s" repeatCount="indefinite"  />
  </svg>`;

const toBase64 = (str: string) =>
  typeof window === 'undefined' ? Buffer.from(str).toString('base64') : window.btoa(str);

function GameCard(props: GameCardProps) {
  const { gameDetail, footer, listView = false } = props;
  const { t } = useTranslation('');
  const dispatch = useDispatch();
  const uuid = Math.random();

  return (
    <>
      <div
        className="pointer-events-auto flex justify-center items-center max-w-[150px] sm:max-w-game-card will-change-transform"
        onClick={() => dispatch(changeIsShowCasinoSearch(false))}
      >
        <div
          className={classNames(
            'bg-color-card-bg-primary border border-solid border-color-card-border-primary rounded-large overflow-hidden p-2 mt-2 w-full',
            'transition-all translate-y-0 hover:-translate-y-2 ease-in-out',
            {
              'flex items-center': listView,
              'flex flex-col justify-center': !listView,
            },
          )}
        >
          <Link
            href={ROUTER.GameDetail(convertGameIdentifierToUrl(gameDetail.identifier || ''))}
            className="rounded-default"
          >
            <Image
              height={160}
              width={160}
              src={`${API_GAME_IMAGE}/icon/${(gameDetail.identifier || '').replace(':', '_')}.png`}
              alt="game logo"
              onError={(err) => {
                err.currentTarget.src = '/img/recommended-game-3.png';
              }}
              className="max-w-[150px] sm:max-w-game-card w-full object-cover rounded-default"
              placeholder="blur"
              blurDataURL={`data:image/svg+xml;base64,${toBase64(convertImage(160, 160))}`}
            />
          </Link>
          <div className="flex justify-center items-center gap-1 py-2 px-1 sm:px-2">
            <Link
              href={ROUTER.Provider(String(gameDetail.provider))}
              className="dark:text-white text-black text-m_default md:text-default truncate capitalize hover:!underline hover:!underline-offset-4"
            >
              {gameDetail.providerName.toLowerCase()}
            </Link>
            <InfoCircle
              data-tooltip-id={`${gameDetail.identifier} ${uuid}`}
              size={20}
              className="text-[#8E8E90] sm:!min-w-[20px] sm:!min-h-[20px] sm:!max-w-[20px] sm:!max-h-[20px] !min-w-[16px] !min-h-[16px] !max-w-[1px] !max-h-[16px] focus:!outline-none"
              role="button"
            />
          </div>
        </div>
      </div>
      <Tooltip
        className="max-w-[50vw] z-[50] !text-[14px] min-w-[270px] !p-3 !bg-color-light-bg-primary dark:!bg-[#161D3D] mt-3"
        opacity={100}
        id={`${gameDetail?.identifier} ${uuid}`}
        place="bottom"
        // content={String(gameDetail?.description)}
      >
        <div className="rounded p-2 dark:bg-color-bg-primary bg-gray-200 flex items-center justify-between px-3">
          <span className="font-bold dark:text-gray-300 text-gray-700">RPT:</span>
          <span
            className={cn('font-bold', {
              'text-[#0C0]': gameDetail.payout > 90,
              'dark:text-gray-300 text-gray-700': gameDetail.payout < 90,
            })}
          >
            {gameDetail.payout ?? 0}%
          </span>
        </div>
        <div className="rounded p-2 dark:bg-color-bg-primary bg-gray-200 flex items-center justify-between px-3 mt-3">
          <span className="font-bold dark:text-gray-300 text-gray-700">{t('homePage:recentBigWins')}:</span>
          <span className="font-bold dark:text-gray-300 text-gray-700">{`${
            gameDetail?.multiplier.toFixed(2) || '0'
          } x`}</span>
        </div>
      </Tooltip>
    </>
  );
}

export default GameCard;
