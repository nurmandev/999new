import Link from 'next/link';
import { ReactElement } from 'react';

import { useTranslation } from '@/base/config/i18next';
import HelperLayout from '@/components/layouts/helper.layout';
import Head from 'next/head';

const faqQuesAnsComponent = (header: string, contents: string[]) => (
  <div className="mb-8">
    <div className="text-black dark:text-[#ffff] font-bold text-[14px] text-left mb-[10px]">{header}</div>
    {contents.map((content) => (
      <div className="text-[#31373d] dark:text-[#98A7B5] font-normal text-left pb-[9px]">{content}</div>
    ))}
  </div>
);

const faqQuesAnsListComponent = (header: string, questions: string[], contents: string[]) => (
  <div className="mb-8">
    <div className="text-black dark:text-[#ffff] font-bold text-[14px] text-left mb-[10px]">{header}</div>
    {contents.map((content, index) => (
      <>
        {questions.length > 0 && (
          <div className="text-black dark:text-[#FFF] font-normal text-left pb-[9px]">
            {`${index + 1}. `}
            {questions.length <= index ? '' : questions?.at(index)}
          </div>
        )}
        <div className="text-[#31373d] dark:text-[#98A7B5] font-normal text-left pb-[9px]">
          {questions.length === 0 ? `${index + 1}. ` : ''}
          {content}
        </div>
      </>
    ))}
  </div>
);

const Faq = () => {
  const { t } = useTranslation('');
  const commonItems = [
    {
      header: t('helper:faqConfirmHeader'),
      contents: [t('helper:faqConfirmContent')],
    },
    {
      header: t('helper:faqTransactionConfirmHeader'),
      contents: [t('helper:faqTransactionConfirmContent')],
    },
    {
      header: t('helper:faqTransactiionConfirmPeriodHeader'),
      contents: [t('helper:faqTransactiionConfirmPeriodContent')],
    },
    {
      header: t('helper:faqFairHeader'),
      contents: [t('helper:faqFairContent')],
    },
    {
      header: t('helper:faqWhenProblemOccursHeader'),
      contents: [t('helper:faqWhenProblemOccursContent')],
    },
  ];
  return (
    <>
      <Head>
        <link
          rel="canonical"
          href="https://bonenza.com/helper-center/faq"
          key="canonical"
        />
      </Head>
      <div className="pl-[7px] pr-[5px] pb-[15px] pt-6 text-[14px] text-left">
        {faqQuesAnsComponent(t('helper:faqJourneyHeader'), [
          t('helper:faqJourneyContent1'),
          t('helper:faqJourneyContent2'),
          t('helper:faqJourneyContent3'),
        ])}
        {faqQuesAnsListComponent(
          t('helper:faqAccountHeader'),
          [t('helper:faqAccountQuestion1'), t('helper:faqAccountQuestion2'), t('helper:faqAccountQuestion3')],
          [t('helper:faqAccountAnswer1'), t('helper:faqAccountAnswer2'), t('helper:faqAccountAnswer3')],
        )}
        {faqQuesAnsComponent(t('helper:faqWalletHeader'), [t('helper:faqWalletContent')])}
        {faqQuesAnsListComponent(
          t('helper:faqDepositHeader'),
          [],
          [t('helper:faqDepositContent1'), t('helper:faqDepositContent2'), t('helper:faqDepositContent3')],
        )}
        {faqQuesAnsComponent(t('helper:faqSwapHeader'), [t('helper:faqSwapContent')])}
        {faqQuesAnsComponent(t('helper:faqWithdrawHeader'), [t('helper:faqWithdrawContent')])}
        {faqQuesAnsComponent(t('helper:faqMinimumWithdrawHeader'), [t('helper:faqMinimumWithdrawContent')])}
        {faqQuesAnsComponent(t('helper:faqPeriodHeader'), [t('helper:faqPeriodContent1'), t('helper:faqPeriodContent2')])}
        <div className="-mt-8 mb-8">
          <span className="text-[#31373d] dark:text-[#98A7B5]">
            {t('helper:faqPeriodContent3')}
            <span className="text-color-primary">
              <Link href="https://support.google.com/accounts/answer/1066447">{t('helper:faqPeriodContent4')}</Link>
            </span>
            {t('helper:faqPeriodContent5')}
          </span>
        </div>
        {commonItems.map((item) => faqQuesAnsComponent(item.header, item.contents))}
      </div>
    </>

  );
};

Faq.getLayout = function getLayout(page: ReactElement) {
  return <HelperLayout>{page}</HelperLayout>;
};

export default Faq;
