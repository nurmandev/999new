import cn from 'classnames';
import { ReactElement } from 'react';

import { useTranslation } from '@/base/config/i18next';
import { useCountdown } from '@/base/constants/useCountdown';
import BaseLayout from '@/components/layouts/base.layout';
import styles from '@/styles/dashboard/index.module.scss';

function NotFoundPage() {
  const [days, hours, minutes, seconds] = useCountdown('9/1/2024');
  const { t } = useTranslation('');
  const detailsValue: number[] = [days, hours, minutes, seconds];
  const detailsTitle: string[] = [t('error:days'), t('error:hours'), t('error:minutes'), t('error:seconds')];

  return (
    <>
      <div className="bg-[#2c2f33] w-full">
        <div className="bg-[url('/img/bg-coming-soon.png')] min-h-[600px] flex flex-col items-center gap-[28px] w-full h-[275px] ss:h-[50vh] sm:h-[65vh] md:h-[80vh] lg:h-[110vh] bg-center bg-cover pt-12">
          <div
            className={`${styles.textGradient} bg-color-primary text-[40px] sm:text-[36px] lg:text-[54px] font-semibold max-w-[900px] w-full text-center px-10`}
          >
            {t('error:comingSoon')}
          </div>
          <div className="text-center flex flex-col gap-2">
            <div className="text-color-primary sm:text-[18px] lg:text-[32px]">{t('error:seeyou')}</div>
            <div className="flex justify-center gap-0">
              {detailsValue.map((_, index) => (
                <div
                  className={cn('text-center text-color-primary flex flex-col gap-2 w-20', {
                    'border-solid border-l-[1px] border-color-primary': index !== 0,
                  })}
                >
                  <p className="font-bold text-[26px] sm:text-[20px] lg:text-[32px]">{detailsValue[index]}</p>
                  <p>{detailsTitle[index]}</p>
                </div>
              ))}
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
