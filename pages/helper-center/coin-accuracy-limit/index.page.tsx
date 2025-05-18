import { ColumnDef } from '@tanstack/react-table';
import { ReactElement } from 'react';

import { useTranslation } from '@/base/config/i18next';
import HelperLayout from '@/components/layouts/helper.layout';
import RankingTableComponent from '@/components/table/rankingTable';
import Head from 'next/head';

interface CurrencyLimitDataType {
  currency: string;
  limit: string;
}

const faqQuesAnsComponent = (header: string, contents: string[]) => (
  <div className="mb-8">
    <div className="text-black dark:text-[#ffff] font-bold text-[14px] text-left mb-[10px]">{header}</div>
    {contents.map((content) => (
      <div className="text-[#31373d] dark:text-[#98A7B5] font-normal text-left pb-[9px]">{content}</div>
    ))}
  </div>
);

const limitData: CurrencyLimitDataType[] = [
  {
    currency: 'USDT',
    limit: '0.0001',
  },
  {
    currency: 'ETH',
    limit: '0.0000001',
  },
  {
    currency: 'BNB',
    limit: '0.000000001',
  },
  {
    currency: 'LTC',
    limit: '0.000001',
  },
  {
    currency: 'XRP',
    limit: '0.0001',
  },
  {
    currency: 'USDC',
    limit: '0.0001',
  },
  {
    currency: 'DOGE',
    limit: '0.0001',
  },
  {
    currency: 'MATIC',
    limit: '0.000000001',
  },
  {
    currency: 'DAI',
    limit: '0.00001',
  },
  {
    currency: 'SHIB',
    limit: '1',
  },
];

const CoinAccuracyLimit = () => {
  const { t } = useTranslation('');
  const commonItems = [
    {
      header: t('helper:coinAccuracyHeader1'),
      contents: [t('helper:coinAccuracyContent1')],
    },
    {
      header: t('helper:coinAccuracyHeader2'),
      contents: [t('helper:coinAccuracyContent2')],
    },
    {
      header: t('helper:coinAccuracyHeader3'),
      contents: [t('helper:coinAccuracyContent3')],
    },
    {
      header: t('helper:coinAccuracyHeader4'),
      contents: [t('helper:coinAccuracyContent4')],
    },
    {
      header: t('helper:coinAccuracyHeader5'),
      contents: [t('helper:coinAccuracyContent5')],
    },
  ];

  const limitColumns: ColumnDef<CurrencyLimitDataType>[] = [
    {
      accessorKey: 'currency',
      header: () => (
        <div className="dark:text-color-text-primary text-color-light-text-primary sm:px-2 px-[5px] text-center">
          {t('helper:coinAccuracyCurrency')}
        </div>
      ),
      cell: ({ row }) => (
        <div className="dark:text-color-text-primary text-color-light-text-primary sm:px-2 px-[5px] text-center truncate">
          {row.original?.currency || ''}
        </div>
      ),
    },
    {
      accessorKey: 'coinAccuracyLimit',
      header: () => (
        <div className="dark:text-color-text-primary text-color-light-text-primary sm:px-2 text-center px-[5px]">
          {t('helper:coinAccuracyLimit')}
        </div>
      ),
      cell: ({ row }) => (
        <div className="dark:text-color-text-primary text-color-light-text-primary sm:px-2 text-center px-[5px] truncate">
          {row.original?.limit || ''}
        </div>
      ),
    },
  ];
  return (
    <>
      <Head>
        <link
          rel="canonical"
          href="https://bonenza.com/helper-center/coin-accuracy-limit"
          key="canonical"
        />
      </Head>
      <div className="pl-[7px] pr-[5px] pb-[15px] pt-6 text-[14px] text-left">
        {commonItems.map((item) => faqQuesAnsComponent(item.header, item.contents))}
        <RankingTableComponent containerClassName="w-full" isLoading={false} data={limitData} columns={limitColumns} />
      </div>
    </>

  );
};

CoinAccuracyLimit.getLayout = function getLayout(page: ReactElement) {
  return <HelperLayout>{page}</HelperLayout>;
};

export default CoinAccuracyLimit;
