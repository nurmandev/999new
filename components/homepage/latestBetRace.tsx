import cn from 'classnames';
import { useState } from 'react';

import { useTranslation } from '@/base/config/i18next';

import HighRollerTableComponent from '../gameTable/highRollerTable';
import LatestBetsTableComponent from '../gameTable/latestBetsTable';
import WagerContestComponent from '../gameTable/wagerContest';

const LatestBetRace = () => {
  const [openTab, setOpenTab] = useState(1);
  const { t } = useTranslation('');

  return (
    <div className="overflow-hidden rounded-[10px] bg-color-card-bg-primary  border border-solid border-color-card-border-primary">
      <div className="text-[13px] sm:text-default w-full px-6 sm:px-10 flex justify-between md:justify-start md:gap-10 border border-solid border-transparent border-b-[#64748B33]">
        <div
          role="button"
          onClick={() => setOpenTab(1)}
          className={cn('font-semibold px-1 pt-5 pb-3 md:pt-7 md:pb-5 border-b border-solid hover:border-b-[#64748B] -mb-[1px]', {
            'dark:text-color-primary border-b-color-primary': openTab === 1,
            'dark:text-color-table-header-text-secondary border-transparent': openTab !== 1,
          })}
        >
          {t('homePage:latestBets')}
        </div>
        <div
          role="button"
          onClick={() => setOpenTab(2)}
          className={cn('font-semibold px-1 pt-5 pb-3 md:pt-7 md:pb-5 border-b border-solid hover:border-b-[#64748B] -mb-[1px]', {
            'dark:text-color-primary border-b-color-primary': openTab === 2,
            'dark:text-color-table-header-text-secondary border-transparent': openTab !== 2,
          })}
        >
          {t('homePage:highRollers')}
        </div>
        <div
          role="button"
          onClick={() => setOpenTab(3)}
          className={cn('font-semibold px-1 pt-5 pb-3 md:pt-7 md:pb-5 border-b border-solid hover:border-b-[#64748B] -mb-[1px]', {
            'dark:text-color-primary border-b-color-primary': openTab === 3,
            'dark:text-color-table-header-text-secondary border-transparent': openTab !== 3,
          })}
        >
          {t('homePage:wagerContest')}
        </div>
      </div>
      <div className="w-full h-full rounded-[5px] relative">
        <div className="lg:p-[20px] sm:p-[10px] p-[5px] z-[2] w-full">
          <div className="text-[#939699]">
            {openTab === 1 && <LatestBetsTableComponent />}
            {openTab === 2 && <HighRollerTableComponent />}
            {openTab === 3 && <WagerContestComponent />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LatestBetRace;
