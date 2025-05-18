import Head from 'next/head';
import { ReactElement } from 'react';

import { useTranslation } from '@/base/config/i18next';
import HelperLayout from '@/components/layouts/helper.layout';

const Fee = () => {
  const { t } = useTranslation('');

  return (
    <>
      <Head>
        <link
          rel="canonical"
          href="https://bonenza.com/helper-center/fee"
          key="canonical"
        />
      </Head>
      <div className="pl-[7px] pr-[5px] pb-[15px] pt-6 text-[14px]">
        <div>
          <div className="text-black dark:text-[#ffff] font-bold text-[14px] text-left mb-[10px]">
            {t('helper:feeNecessaryHeader')}
          </div>
          <div className="text-[#31373d] dark:text-[#98A7B5] font-normal text-left pb-[9px]">
            {t('helper:feeNecessaryContent')}
          </div>
        </div>
        <div className="mt-8">
          <div className="text-black dark:text-[#ffff] font-bold text-[14px] text-left mb-[10px]">
            {t('helper:feeRoleHeader')}
          </div>
          <div className="text-[#31373d] dark:text-[#98A7B5] font-normal text-left pb-[9px]">
            {t('helper:feeRoleItem1')}
          </div>
        </div>
        <div className="mt-8">
          <div className="text-black dark:text-[#ffff] font-bold text-[14px] text-left mb-[10px]">
            {t('helper:feePercentageHeader')}
          </div>
          <div className="text-[#31373d] dark:text-[#98A7B5] font-normal text-left pb-[9px]">
            {t('helper:feePercentageContent')}
          </div>
        </div>
      </div>
    </>

  );
};

Fee.getLayout = function getLayout(page: ReactElement) {
  return <HelperLayout>{page}</HelperLayout>;
};

export default Fee;
