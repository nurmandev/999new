import cn from 'classnames';
import { ArrowRight2 } from 'iconsax-react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

import { useTranslation } from '@/base/config/i18next';
import { API_PROVIDER_IMAGE, ROUTER } from '@/base/constants/common';
import { GameListType, GameProviderDetail } from '@/base/types/common';

import AllBetsTableComponent from '../gameTable/allBetsTable';
import HighRollerTableComponent from '../gameTable/highRollerTable';
import MyBetsTableComponent from '../gameTable/myBetsTable';
import WagerContestComponent from '../gameTable/wagerContest';
import styles from './index.module.scss';

const GameDetailComponent = ({
  gameDetail,
  gameProvider,
}: {
  gameDetail?: GameListType;
  gameProvider?: GameProviderDetail;
}) => {
  const [openTab, setOpenTab] = useState(1);

  const { t } = useTranslation('');

  return (
    <div>
      <div className="mb-[10px] dark:text-white text-[#000] sm:text-[16px] text-[14px]">
        {t('homePage:latestBetRace')}
      </div>
      <div
        className={cn(
          'w-full h-full flex flex-col gap-4 rounded-[10px] p-1 pt-0 sm:pt-0 sm:p-4 bg-white relative',
          'dark:bg-color-card-bg-primary border border-solid border-color-card-border-primary',
        )}
      >
        <div
          className={cn(
            'flex justify-between w-full text-[13px] sm:text-default font-semibold',
            ' border border-solid border-transparent border-b-[#64748B33]',
          )}
        >
          <div
            role="button"
            onClick={() => setOpenTab(1)}
            className={cn(
              'w-1/4 font-semibold text-center px-2 sm:px-4 md:px-12 py-3 md:py-5 border-b border-solid hover:border-b-[#64748B] -mb-[1px]',
              {
                'dark:text-color-primary border-b-color-primary': openTab === 1,
                'dark:text-color-table-header-text-secondary border-transparent': openTab !== 1,
              },
            )}
          >
            {t('gameTable:allBets')}
          </div>
          <div
            role="button"
            onClick={() => setOpenTab(2)}
            className={cn(
              'w-1/4  font-semibold text-center px-2 sm:px-4 md:px-12 py-3 md:py-5 border-b border-solid hover:border-b-[#64748B] -mb-[1px]',
              {
                'dark:text-color-primary border-b-color-primary': openTab === 2,
                'dark:text-color-table-header-text-secondary border-transparent': openTab !== 2,
              },
            )}
          >
            {t('gameTable:myBets')}
          </div>
          <div
            role="button"
            onClick={() => setOpenTab(3)}
            className={cn(
              'w-1/4 font-semibold text-center px-2 sm:px-4 md:px-12 py-3 md:py-5 border-b border-solid hover:border-b-[#64748B] -mb-[1px]',
              {
                'dark:text-color-primary border-b-color-primary': openTab === 3,
                'dark:text-color-table-header-text-secondary border-transparent': openTab !== 3,
              },
            )}
          >
            {t('gameTable:highRoller')}
          </div>
          <div
            role="button"
            onClick={() => setOpenTab(4)}
            className={cn(
              'w-1/4 font-semibold text-center px-2 sm:px-4 md:px-12 py-3 md:py-5 border-b border-solid hover:border-b-[#64748B] -mb-[1px]',
              {
                'dark:text-color-primary border-b-color-primary': openTab === 4,
                'dark:text-color-table-header-text-secondary border-transparent': openTab !== 4,
              },
            )}
          >
            {t('gameTable:wagerContest')}
          </div>
        </div>
        <div className="z-[2] w-full">
          <div className="md:text-[13px] text-[12px] max-[430px]:text-[10px] text-[#939699]">
            {openTab === 1 && <AllBetsTableComponent gameDetail={gameDetail} />}
            {openTab === 2 && <MyBetsTableComponent gameDetail={gameDetail} />}
            {openTab === 3 && <HighRollerTableComponent />}
            {openTab === 4 && <WagerContestComponent />}
          </div>
        </div>
      </div>
      <div className="mt-[36px]">
        {/* <CasinoSS
          title={String(t('gameDetail:relatedGames'))}
          data={listRelatedGame}
          renderItem={(item) => <GameCard gameDetail={item} />}
          viewAllUrl={ROUTER.PicksForYou}
        /> */}
      </div>

      <div className="mt-[36px]">
        <div className=" sm:text-[16px] text-[14px] dark:text-[#FFFFFF] text-[#31373D]">
          {t('gameDetail:aboutTheProvider')}
        </div>
        <div>
          <div className="dark:bg-color-card-bg-primary border border-solid border-color-card-border-primary bg-white p-[15px] rounded-[5px] mt-[10px] mb-[30px]">
            <Image
              height={0}
              width={0}
              src={`${API_PROVIDER_IMAGE}/${gameDetail?.provider}.png`}
              alt="game logo"
              className="bg-color-card-bg-secondary border border-solid border-color-card-border-primary p-3 object-cover max-h-[80px] w-auto rounded-[5px]"
            />
            <div
              className={cn('whitespace-pre-line mb-[15px] text-gray-400 text-[12px]', styles.providerSortIntroduction)}
            >
              {gameProvider?.introduction}
            </div>
            <div className="flex items-center gap-[10px]">
              <Link
                href={ROUTER.Provider(String(gameDetail?.provider))}
                className="dark:bg-color-card-bg-secondary border border-solid border-color-card-border-primary text-black dark:text-white hover:opacity-60 p-[10px] rounded-[5px] flex justify-start items-center gap-[5px]"
                role="button"
              >
                <div className="text-[12px] sm:text-default dark:text-[#FFFFFF] text-[#31373D] hover:text-[#000]">
                  {gameDetail?.gameCnt} {t('provider:games')}
                </div>
                <ArrowRight2 size={12} />
              </Link>
              <Link
                href={ROUTER.Provider(String(gameDetail?.provider))}
                role="button"
                className="dark:bg-color-card-bg-secondary border border-solid border-color-card-border-primary text-black dark:text-white hover:opacity-60 p-[10px] rounded-[5px] gap-[5px] text-[12px] sm:text-default"
              >
                {t('gameDetail:moreInfo')}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameDetailComponent;
