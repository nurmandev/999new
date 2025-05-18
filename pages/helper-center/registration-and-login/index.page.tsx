import Head from 'next/head';
import { ReactElement } from 'react';

import { useTranslation } from '@/base/config/i18next';
import HelperLayout from '@/components/layouts/helper.layout';

const Registration = () => {
  const { t } = useTranslation('');

  const contents = [
    t('helper:registrationContent1'),
    t('helper:registrationContent2'),
    t('helper:registrationContent3'),
  ];
  return (
    <>
      <Head>
        <link
          rel="canonical"
          href="https://bonenza.com/helper-center/registration-and-login"
          key="canonical"
        />
      </Head>
      <div className="pl-[7px] pr-[5px] pb-[15px] pt-6 text-[14px]">
        <div>
          <div className="text-black dark:text-[#ffff] font-bold text-[14px] text-left mb-[10px]">
            {t('helper:registrationHeader')}
          </div>
          <div className="text-[#31373d] dark:text-[#98A7B5] font-normal text-left pb-[9px]">
            {contents.map((content) => (
              <div className="mb-3">{content}</div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

Registration.getLayout = function getLayout(page: ReactElement) {
  return <HelperLayout>{page}</HelperLayout>;
};

export default Registration;
