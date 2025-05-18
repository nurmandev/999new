import { Call } from 'iconsax-react';
import Head from 'next/head';
import Link from 'next/link';
import { ReactElement } from 'react';

import { useTranslation } from '@/base/config/i18next';
import HelperLayout from '@/components/layouts/helper.layout';

const Support = () => {
  const { t } = useTranslation('');

  return (
    <>
      <Head>
        <link
          rel="canonical"
          href="https://bonenza.com/helper-center/support"
          key="canonical"
        />
      </Head>
      <div className="pl-[7px] pr-[5px] pb-[15px] pt-6 text-[14px] text-left">
        <div className="flex justify-center my-5">
          <Call variant="Bulk" className="w-20 h-20" />
        </div>
        <span className="text-[#31373d] dark:text-[#98A7B5] font-normal text-left pb-[9px]">
          <span>{t('helper:supportContent1')} </span>
          <span className="text-color-primary">
            <Link href="https://t.me/skyearth008">{t('helper:supportContent2')}</Link>
          </span>
          <span> {t('helper:supportContent3')}</span>
        </span>
      </div>
    </>
  );
};

Support.getLayout = function getLayout(page: ReactElement) {
  return <HelperLayout>{page}</HelperLayout>;
};

export default Support;
