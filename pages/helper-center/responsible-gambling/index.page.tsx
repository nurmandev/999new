import Head from 'next/head';
import { ReactElement } from 'react';

import { useTranslation } from '@/base/config/i18next';
import HelperLayout from '@/components/layouts/helper.layout';

const faqQuesAnsComponent = (header: string, descriptions: string[], contents: string[], type: string) => (
  <div className="mb-8">
    <div className="text-black dark:text-[#ffff] font-bold text-[14px] text-left mb-[10px]">{header}</div>
    {descriptions.map((description) => (
      <div className="text-[#31373d] dark:text-[#98A7B5] font-normal text-left pb-[9px]">{description}</div>
    ))}
    <ul className={type === 'dot' ? 'ml-6 list-disc' : type === 'number' ? 'ml-8 list-decimal' : 'list-none'}>
      {contents.map((content) => (
        <li className="text-[#31373d] dark:text-[#98A7B5] font-normal text-left pb-[9px]">{content}</li>
      ))}
    </ul>
  </div>
);

const Faq = () => {
  const { t } = useTranslation('');
  const commonItems = [
    {
      header: t('helper:responsibleAtBonenza'),
      contents: [
        t('helper:responsibleAtBonenzaContent1'),
        t('helper:responsibleAtBonenzaContent2'),
        t('helper:responsibleAtBonenzaContent3'),
        t('helper:responsibleAtBonenzaContent4'),
      ],
      descriptions: [],
      type: 'none',
    },
    {
      header: t('helper:responsibleKeepMind'),
      contents: [
        t('helper:responsibleKeepMind1'),
        t('helper:responsibleKeepMind2'),
        t('helper:responsibleKeepMind3'),
        t('helper:responsibleKeepMind4'),
        t('helper:responsibleKeepMind5'),
      ],
      descriptions: [],
      type: 'dot',
    },
    {
      header: t('helper:responsibleCompulsive'),
      contents: [
        t('helper:responsibleCompulsiveContent1'),
        t('helper:responsibleCompulsiveContent2'),
        t('helper:responsibleCompulsiveContent3'),
        t('helper:responsibleCompulsiveContent4'),
        t('helper:responsibleCompulsiveContent5'),
        t('helper:responsibleCompulsiveContent6'),
        t('helper:responsibleCompulsiveContent7'),
        t('helper:responsibleCompulsiveContent8'),
        t('helper:responsibleCompulsiveContent9'),
        t('helper:responsibleCompulsiveContent10'),
        t('helper:responsibleCompulsiveContent11'),
        t('helper:responsibleCompulsiveContent12'),
        t('helper:responsibleCompulsiveContent13'),
        t('helper:responsibleCompulsiveContent14'),
        t('helper:responsibleCompulsiveContent15'),
        t('helper:responsibleCompulsiveContent16'),
        t('helper:responsibleCompulsiveContent17'),
        t('helper:responsibleCompulsiveContent18'),
        t('helper:responsibleCompulsiveContent19'),
        t('helper:responsibleCompulsiveContent20'),
      ],
      descriptions: [t('helper:responsibleCompulsiveDescription')],
      type: 'number',
    },
    {
      header: t('helper:responsibleUnderAge'),
      contents: [
        'Gamblers Anonymous International Service Office -  https://www.gamblersanonymous.org/ga',
        'National Council On Problem Gambling - https://www.ncpgambling.org',
        'Gamcare - https://www.gamcare.org.uk',
      ],
      descriptions: [
        t('helper:responsibleUnderAgeContent1'),
        t('helper:responsibleUnderAgeContent2'),
        t('helper:responsibleUnderAgeContent3'),
        t('helper:responsibleUnderAgeContent4'),
      ],
      type: 'dot',
    },
    {
      header: t('helper:responsibleHelpWhat'),
      contents: [
        t('helper:responsibleHelpWhatContent2'),
        t('helper:responsibleHelpWhatContent3'),
        t('helper:responsibleHelpWhatContent4'),
      ],
      descriptions: [t('helper:responsibleHelpWhatContent1')],
      type: 'dot',
    },
    {
      header: t('helper:responsibleProtect'),
      contents: [],
      descriptions: [
        t('helper:responsibleProtectContent1'),
        t('helper:responsibleProtectContent2'),
        t('helper:responsibleProtectContent3'),
      ],
      type: 'dot',
    },
  ];
  return (
    <>
      <Head>
        <link
          rel="canonical"
          href="https://bonenza.com/helper-center/responsible-gambling"
          key="canonical"
        />
      </Head>
      <div className="pl-[7px] pr-[5px] pb-[15px] pt-6 text-[14px] text-left">
        {commonItems.map((item) => faqQuesAnsComponent(item.header, item.descriptions, item.contents, item.type))}
      </div>
    </>
  );
};

Faq.getLayout = function getLayout(page: ReactElement) {
  return <HelperLayout>{page}</HelperLayout>;
};

export default Faq;
