import { ReactElement } from 'react';

import { useTranslation } from '@/base/config/i18next';
import { useCountdown } from '@/base/constants/useCountdown';
import BaseLayout from '@/components/layouts/base.layout';
import styles from '@/styles/dashboard/index.module.scss';

function NotFoundPage() {
  const [days, hours, minutes, seconds] = useCountdown('9/1/2024');
  const { t } = useTranslation('');
  return (
    <>
      <div className="bg-[#2c2f33]">
        <div className="bg-[url('/img/bg-coming-soon.png')] min-h-[600px] flex flex-col items-center gap-[45px] w-full h-[275px] ss:h-[50vh] sm:h-[65vh] md:h-[80vh] lg:h-[110vh] bg-center bg-cover">
          <div
            className={`${styles.textGradient} bg-color-primary text-[30px] sm:text-[48px] lg:text-[100px] font-semibold max-w-[678px] w-full text-center`}
          >
            {t('comingSoon:comingSoon')}
          </div>
          <div className="flex gap-5 sm:gap-[40px]">
            <div className="flex flex-col items-center gap-[15px]">
              <div className="bg-[#0DFDE4] relative w-[70px] h-[70px] flex items-center justify-center">
                <div className="w-full h-[2px] bg-[#161D26]" />
                <div className="absolute text-[#161D26] text-center font-black text-[36px]" id="days">
                  {days}
                </div>
              </div>
              <div className="uppercase text-white text-[12px]">{t('error:days')}</div>
            </div>
            <div className="flex flex-col items-center gap-[15px]">
              <div className="bg-[#0DFDE4] relative w-[70px] h-[70px] flex items-center justify-center">
                <div className="w-full h-[2px] bg-[#161D26]" />
                <div className="absolute text-[#161D26] text-center font-black text-[36px]" id="hours">
                  {hours}
                </div>
              </div>
              <div className="uppercase text-white text-[12px]">{t('error:hours')}</div>
            </div>
            <div className="flex flex-col items-center gap-[15px]">
              <div className="bg-[#0DFDE4] relative w-[70px] h-[70px] flex items-center justify-center">
                <div className="w-full h-[2px] bg-[#161D26]" />
                <div className="absolute text-[#161D26] text-center font-black text-[36px]" id="minutes">
                  {minutes}
                </div>
              </div>
              <div className="uppercase text-white text-[12px]">{t('error:minutes')}</div>
            </div>
            <div className="flex flex-col items-center gap-[15px]">
              <div className="bg-[#0DFDE4] relative w-[70px] h-[70px] flex items-center justify-center">
                <div className="w-full h-[2px] bg-[#161D26]" />
                <div className="absolute text-[#161D26] text-center font-black text-[36px]" id="seconds">
                  {seconds}
                </div>
              </div>
              <div className="uppercase text-white text-[12px]">{t('error:seconds')}</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

NotFoundPage.getLayout = function getLayout(page: ReactElement) {
  return <BaseLayout>{page}</BaseLayout>;
};

export default NotFoundPage;
