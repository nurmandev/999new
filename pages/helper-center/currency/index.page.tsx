import Link from 'next/link';
import { ReactElement } from 'react';

import { useTranslation } from '@/base/config/i18next';
import HelperLayout from '@/components/layouts/helper.layout';
import Head from 'next/head';

const currencyQuesAnsComponent = (header: string, contents: string[]) => (
  <div className="mb-8">
    <div className="text-black dark:text-[#ffff] font-bold text-[14px] text-left mb-[10px]">{header}</div>
    {contents.map((content) => (
      <div className="text-[#31373d] dark:text-[#98A7B5] font-normal text-left pb-[9px]">{content}</div>
    ))}
  </div>
);

const Currency = () => {
  const { t } = useTranslation('');
  const commonItems = [
    {
      header: t('helper:currencyWhatIs'),
      contents: [t('helper:currencyWhatIsContent1'), t('helper:currencyWhatIsContent2')],
    },
    {
      header: t('helper:currencyWhyUsing'),
      contents: [t('helper:currencyWhyUsingContent')],
    },
    {
      header: t('helper:currencyHowWork'),
      contents: [t('helper:currencyHowWorkContent')],
    },
    {
      header: t('helper:currencyHowPurchase'),
      contents: [
        t('helper:currencyHowPurcahseContent1'),
        t('helper:currencyHowPurcahseContent2'),
        t('helper:currencyHowPurcahseContent3'),
        t('helper:currencyHowPurcahseContent4'),
      ],
    },
    {
      header: t('helper:currencyLegal'),
      contents: [t('helper:currencyLegalContent1'), t('helper:currencyLegalContent2')],
    },
    {
      header: t('helper:currencyBitCoinWallet'),
      contents: [t('helper:currencyBitCoinWalletContent')],
    },
    {
      header: t('helper:currencyProtectWallet'),
      contents: [
        t('helper:currencyProtectWalletContent1'),
        t('helper:currencyProtectWalletContent2'),
        t('helper:currencyProtectWalletContent3'),
        t('helper:currencyProtectWalletContent4'),
        t('helper:currencyProtectWalletContent5'),
        t('helper:currencyProtectWalletContent6'),
        t('helper:currencyProtectWalletContent7'),
        t('helper:currencyProtectWalletContent8'),
      ],
    },
  ];
  return (
    <>
      <Head>
        <link
          rel="canonical"
          href="https://bonenza.com/helper-center/currency"
          key="canonical"
        />
      </Head>
      <div className="pl-[7px] pr-[5px] pb-[15px] pt-6 text-[14px] text-left">
        {commonItems.map((item) => currencyQuesAnsComponent(item.header, item.contents))}
      </div>
    </>

  );
};

Currency.getLayout = function getLayout(page: ReactElement) {
  return <HelperLayout>{page}</HelperLayout>;
};

export default Currency;
