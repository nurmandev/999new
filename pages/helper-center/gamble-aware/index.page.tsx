import { ExportSquare } from 'iconsax-react';
import Head from 'next/head';
import Link from 'next/link';
import { ReactElement } from 'react';

import { useTranslation } from '@/base/config/i18next';
import HelperLayout from '@/components/layouts/helper.layout';

const AmlPage = () => {
  const { t } = useTranslation('');
  const referenceLinks = ['http://www.cyberpatrol.com', 'http://www.gamblock.com'];
  return (
    <>
      <Head>
        <link
          rel="canonical"
          href="https://bonenza.com/helper-center/gamble-aware"
          key="canonical"
        />
      </Head>
      <div className="pl-[7px] pr-[5px] pb-[15px] text-[14px] pt-4 md:pb-0">
        <div className="">
          <div className="text-black dark:text-[#ffff] font-bold text-[14px] text-left mb-[10px]">
            {t('helper:gambleWare')} & {t('helper:protectingMinors')}
          </div>
          <div className="">
            <div className="text-[#31373d] dark:text-[#98A7B5] font-normal text-left pb-[9px]">
              <div>{t('helper:gambleWareContent1')}</div>
              <div className="mt-4 mb-4">{t('helper:gambleWareContent2')}</div>
              {referenceLinks.map((link) => (
                <div key={link} className="flex items-center text-center text-color-primary gap-2 mb-1">
                  <Link href={link}>{link}</Link>
                  <ExportSquare className="w-5 h-5" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

AmlPage.getLayout = function getLayout(page: ReactElement) {
  return <HelperLayout>{page}</HelperLayout>;
};

export default AmlPage;
