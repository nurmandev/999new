import { ReactElement } from 'react';

import { useTranslation } from '@/base/config/i18next';
import HelperLayout from '@/components/layouts/helper.layout';
import Head from 'next/head';

const DepositBonusTerms = () => {
  const { t } = useTranslation('');

  const claimHeaders = [
    '1. ' + t('helper:depositBonusHowToClaimItem1'),
    '2. ' + t('helper:depositBonusHowToClaimItem2'),
    '3. ' + t('helper:depositBonusHowToClaimItem3'),
    '4. ' + t('helper:depositBonusHowToClaimItem4'),
  ];
  const claimContents = [
    t('helper:depositBonusHowToClaimItem1Content'),
    t('helper:depositBonusHowToClaimItem2Content'),
    t('helper:depositBonusHowToClaimItem3Content'),
    t('helper:depositBonusHowToClaimItem4Content'),
  ];

  const termsDescriptions = [
    t('helper:depositBonusTermsDescription1'),
    t('helper:depositBonusTermsDescription2'),
    t('helper:depositBonusTermsDescription3'),
  ];
  const termsItems = [
    t('helper:depositBonusTermsItem1'),
    t('helper:depositBonusTermsItem2'),
    t('helper:depositBonusTermsItem3'),
    t('helper:depositBonusTermsItem4'),
  ];
  return (
    <>
      <Head>
        <link
          rel="canonical"
          href="https://bonenza.com/helper-center/deposit-bonus-terms"
          key="canonical"
        />
      </Head>
      <div className="pl-[7px] pr-[5px] pb-[15px] pt-6 text-[14px]">
        <div className="text-black dark:text-[#ffff] font-bold text-[14px] text-left mb-[10px]">
          {t('helper:depositBonusHowToClaimHeader')}
        </div>
        <div className="text-[#31373d] dark:text-[#98A7B5] font-normal text-left pb-[9px]">
          {claimHeaders.map((item, index) => (
            <div key={`how-to-claim${index}`} className="mt-2">
              <div>{item}</div>
              <div className="ml-4">{claimContents[index] || ''}</div>
            </div>
          ))}
        </div>
        <div className="text-black dark:text-[#ffff] font-bold text-[14px] text-left mb-[10px] mt-8">
          {t('helper:depositBonusTermsHeader')}
        </div>
        <div className="text-[#31373d] dark:text-[#98A7B5] font-normal text-left pb-[9px]">
          {termsDescriptions.map((item, index) => (
            <div key={`how-to-claim${index}`} className="mt-2">
              {item}
            </div>
          ))}
          <ul className="list-disc mt-6 ml-6">
            {termsItems.map((item, index) => (
              <li key={`how-to-claim${index}`} className="mt-2">
                {item}
              </li>
            ))}
          </ul>
          <div className="mt-6">{t('helper:depositBonusTermsFooter')}</div>
        </div>
      </div>
    </>

  );
};

DepositBonusTerms.getLayout = function getLayout(page: ReactElement) {
  return <HelperLayout>{page}</HelperLayout>;
};

export default DepositBonusTerms;
