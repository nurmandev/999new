import { ExportSquare } from 'iconsax-react';
import Head from 'next/head';
import Link from 'next/link';
import { ReactElement } from 'react';

import { useTranslation } from '@/base/config/i18next';
import HelperLayout from '@/components/layouts/helper.layout';

const GoogleAuthenticator = () => {
  const { t } = useTranslation('');

  const contents = [
    t('helper:googleAuthenticatorContent1'),
    t('helper:googleAuthenticatorContent2'),
    t('helper:googleAuthenticatorContent3'),
    t('helper:googleAuthenticatorContent4'),
  ];
  return (
    <>
      <Head>
        <link
          rel="canonical"
          href="https://bonenza.com/helper-center/google-authenticator"
          key="canonical"
        />
      </Head>
      <div className="pl-[7px] pr-[5px] pb-[15px] pt-6 text-[14px]">
        <div>
          <div className="text-black dark:text-[#ffff] font-bold text-[14px] text-left mb-[10px]">
            {t('helper:googleAuthenticatorHeader')}
          </div>
          <div className="text-[#31373d] dark:text-[#98A7B5] font-normal text-left pb-[9px]">
            {contents.map((content, index) => (
              <div key={`content-${index}`} className="mb-4">
                {content}
              </div>
            ))}
            <div className="flex gap-4">
              {t('helper:googleAuthenticatorContent5')}
              <span className="text-color-primary flex gap-2 mb-1">
                <Link href="https://support.google.com/accounts/answer/1066447">
                  {t('helper:googleAuthenticatorHeader')}
                </Link>
                <ExportSquare className="w-5 h-5" />
              </span>
            </div>
          </div>
        </div>
      </div>
    </>

  );
};

GoogleAuthenticator.getLayout = function getLayout(page: ReactElement) {
  return <HelperLayout>{page}</HelperLayout>;
};

export default GoogleAuthenticator;
