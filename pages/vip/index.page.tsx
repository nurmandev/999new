import { Disclosure, Transition } from '@headlessui/react';
import { ChevronUpIcon } from '@heroicons/react/24/outline';
import { StarIcon } from '@heroicons/react/24/solid';
import cn from 'classnames';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { ReactElement } from 'react';
import { useDispatch } from 'react-redux';

import { useTranslation } from '@/base/config/i18next';
import { changeIsShowVipClubModal } from '@/base/redux/reducers/modal.reducer';
import BaseLayout from '@/components/layouts/base.layout';
import MetaHead from '@/components/metaHead/metaHead';

import styles from './index.module.scss';
import Head from 'next/head';
function VipPage() {
  const { t } = useTranslation('');
  const dispatch = useDispatch();
  const router = useRouter();
  const cardList = [
    {
      id: 0,
      img: '/img/vip-withdraw.png',
      title: t('vipClub:noFeeWithdrawal'),
      description: t('vipClub:noFeeWithdrawalDescription'),
      key: 'cardWithdraw',
    },
    {
      id: 2,
      img: '/img/vip-reward.png',
      title: t('vipClub:rewardlucky'),
      description: t('vipClub:rewardluckyDescription'),
      key: 'cardReward',
    },
    {
      id: 1,
      img: '/img/vip-bonus.png',
      title: t('vipClub:LEVELUPBONUS'),
      description: t('vipClub:bonusContent'),
      key: 'cardBonus',
    },
  ];

  const dataMedal = [
    { img: '/img/bronze-medal.png', name: 'Bronze' },
    { img: '/img/silver-medal.png', name: 'Silver' },
    { img: '/img/gold-medal.png', name: 'Gold' },
    { img: '/img/platinum1-medal.png', name: 'Platinum I' },
    { img: '/img/platinum2-medal.png', name: 'Platinum II' },
    { img: '/img/diamond1-medal.png', name: 'Diamond I' },
    { img: '/img/diamond2-medal.png', name: 'Diamond II' },
    { img: '/img/diamond3-medal.png', name: 'Diamond III' },
  ];

  const dataReward = [
    { name: t('vipClub:levelUpBonus'), bronze: true, silver: true, gold: true, platinum: true, diamond: true },
    { name: t('vipClub:weeklyCashback'), gold: true, platinum: true, diamond: true },
    { name: t('vipClub:monthlyCashback'), gold: true, platinum: true, diamond: true },
  ];

  const faqs = [
    { title: t('vipClub:whatLevelBonus'), contents: [t('vipClub:whatLevelBonusContent')] },

    {
      title: t('vipClub:whatWeeklyCashback'),
      contents: [t('vipClub:whatWeeklyCashbackContent')],
    },
  ];

  const onOpenModalVipClub = () => {
    dispatch(changeIsShowVipClubModal(true));
  };

  return (
    <>
      <MetaHead />
      <Head>
        <link
          rel="canonical"
          href="https://bonenza.com/vip"
          key="canonical"
        />
      </Head>
      <div className="w-full mt-4 sm:mt-8">
        <div className="bg-[url('/img/vip-banner.png')] bg-cover relative w-full h-[700px] flex items-center  sm:h-[260px] px-[30px] justify-center rounded-default">
          <div className="md:max-w-[600px] max-sm:h-[650px] pl-4 flex sm:block flex-col items-center justify-between absolute left-0 max-sm:px-5 sm:left-[30px] top-[28px] sm:top-[42px] z-1">
            <div>
              <h2 className="text-[42px] leading-[1.2] max-sm:text-center sm:text-[32px] lg:text-[44px] mb-2 font-bold">
                {t('vipClub:exclusiveBenefits')}
              </h2>
              <p className="text-[16px] max-sm:text-center sm:text-[12px] lg:text-[14px]">
                {t('vipClub:exclusiveBenefitsContent')}
              </p>
            </div>
            <Image
              width={100}
              height={100}
              alt="vip"
              src="/img/vip-benefit.png"
              className="block sm:hidden object-contain w-[80%]"
            />
            <div className="flex items-center gap-6 mt-4">
              <button
                onClick={() => router.push('/casino')}
                className="bg-gradient-btn-play shadow-bs-btn py-[10px] px-[20px] hover:opacity-90 rounded-default text-[14px] sm:text-[12px] lg:text-[14px] font-bold"
              >
                {t('vipClub:startPlaying')}
              </button>
              <button
                onClick={onOpenModalVipClub}
                className="py-[10px] px-[20px] border border-solid border-[#fff] hover:bg-[#ffffff59] rounded-default text-[14px] sm:text-[12px] ld:text-[14px] font-bold"
              >
                {t('vipClub:viewBenefits')}
              </button>
            </div>
          </div>
          <Image
            width={100}
            height={100}
            alt="vip"
            src="/img/vip-benefit.png"
            className="absolute hidden sm:block max-h-[295px] w-[300px] right-[42px] object-contain"
          />
        </div>
        <div className="grid grid-cols-3 max-[1144px]:grid-cols-2 max-[864px]:grid-cols-1 gap-[24px] mt-6">
          {cardList.map((item) => (
            <div
              key={item.id}
              className={cn(
                styles[item.key],
                'px-[10px] h-[300px] rounded-[4px] sm:h-[264px] pt-4 pb-[18px] flex flex-col',
              )}
            >
              <div className="flex-1 flex item-center justify-center">
                <Image width={198} height={98} alt="card" className="w-[198px] h-[124px]" src={item.img} />
              </div>
              <div>
                <div className="text-[22px] sm:text-[16px] font-semibold mb-[6px] uppercase text-color-light-text-primary dark:text-white">
                  {item.title}
                </div>
                <p className="text-[16px] sm:text-[12px] dark:text-color-text-primary text-color-light-text-primary">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-5">
          <div className="text-[18px] mb-[18px] font-semibold dark:text-white text-color-light-text-primary">
            {t('vipClub:rewardBreakdown')}
          </div>
          <div className="p-2 pb-0 rounded-[5px] bg-color-card-bg-primary overflow-x-hidden">
            <div className="overflow-x-auto scrollbar pb-2">
              <div className="flex max-w-full">
                <div className="bg-color-card-bg-primary min-w-160px border-l-0 border-solid border-color-card-bg-secondary"></div>
                {dataMedal.map((item, index) => (
                  <div
                    key={index}
                    className="px-5 py-4 min-w-[120px] flex-1 bg-color-card-bg-secondary border border-solid border-color-card-bg-primary border-l-0 border-b-0 flex items-center justify-center gap-[5px]"
                  >
                    <Image width={18} height={18} alt="medal" src={item.img} />
                    <p className="text-[12px] font-semibold min-w-fit break-keep">{item.name}</p>
                  </div>
                ))}
              </div>
              {dataReward.map((item, index) => (
                <div key={index} className="flex">
                  <div className="min-w-[160px] flex items-center px-1 text-[14px] h-[50px] border border-l-0 border-solid border-color-card-bg-secondary">
                    <p className="truncate">{item.name}</p>
                  </div>
                  <div className="min-w-[120px] flex-1 flex items-center justify-center h-[50px] border border-solid border-color-card-bg-secondary border-l-0">
                    {item.bronze ? <StarIcon color="#E09A6A" width={16} height={16} /> : '-'}
                  </div>
                  <div className="min-w-[120px] flex-1 flex items-center justify-center h-[50px border border-solid border-color-card-bg-secondary border-l-0]">
                    {item.silver ? <StarIcon color="#E1E1E1" width={16} height={16} /> : '-'}
                  </div>
                  <div className="min-w-[120px] flex-1 flex items-center justify-center h-[50px] border border-solid border-color-card-bg-secondary border-l-0">
                    {item.gold ? <StarIcon color="#FFC329" width={16} height={16} /> : '-'}
                  </div>
                  <div className="min-w-[120px] flex-1 flex items-center justify-center h-[50px] border border-solid border-color-card-bg-secondary border-l-0">
                    {item.platinum ? <StarIcon color="#0DFDE4" width={16} height={16} /> : '-'}
                  </div>
                  <div className="min-w-[120px] flex-1 flex items-center justify-center h-[50px] border border-solid border-color-card-bg-secondary border-l-0">
                    {item.platinum ? <StarIcon color="#0DFDE4" width={16} height={16} /> : '-'}
                  </div>
                  <div className="min-w-[120px] flex-1 flex items-center justify-center h-[50px] border border-solid border-color-card-bg-secondary border-l-0">
                    <StarIcon color="#F61B4F" width={16} height={16} />
                  </div>
                  <div className="min-w-[120px] flex-1 flex items-center justify-center h-[50px] border border-solid border-color-card-bg-secondary border-l-0">
                    <StarIcon color="#F61B4F" width={16} height={16} />
                  </div>
                  <div className="min-w-[120px] flex-1 flex items-center justify-center h-[50px] border border-solid border-color-card-bg-secondary border-l-0 border-r-0">
                    <StarIcon color="#F61B4F" width={16} height={16} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-8">
          <div className="text-[18px] mb-[18px] font-semibold dark:text-white text-color-light-text-primary">
            {t('vipClub:frequentlyQuestions')}
          </div>
          <div className="p-2 rounded-[5px] dark:bg-color-card-bg-primary bg-white flex flex-col gap-2">
            {faqs.map((item, index) => (
              <Disclosure key={index}>
                {({ open }) => (
                  <div className="w-full dark:bg-color-card-bg-secondary bg-[#f5f6fa]">
                    <Disclosure.Button className="py-3 w-full flex h-[48px] justify-between">
                      <div className="font-semibold text-[14px] flex gap-2 items-center pl-[10px] dark:text-white text-color-light-text-primary">
                        {item.title}
                      </div>
                      <div className="pr-3">
                        <ChevronUpIcon className={`${open ? 'rotate-180 transform' : ''} h-5 w-5`} />
                      </div>
                    </Disclosure.Button>
                    <Transition
                      enter="transition duration-100 ease-out"
                      enterFrom="transform scale-95 opacity-0"
                      enterTo="transform scale-100 opacity-100 w-full"
                      leave="transition duration-75 ease-out"
                      leaveFrom="transform scale-100 opacity-100 w-full"
                      leaveTo="transform scale-95 opacity-0"
                    >
                      <Disclosure.Panel className={'flex flex-col gap-[20px] w-full'}>
                        <div className="dark:bg-color-card-bg-secondary bg-color-light-bg-primary dark:text-white text-black py-[13px] px-[10px] text-[14px]">
                          {item.contents.map((content, index) => content)}
                        </div>
                      </Disclosure.Panel>
                    </Transition>
                  </div>
                )}
              </Disclosure>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

VipPage.getLayout = function getLayout(page: ReactElement) {
  return <BaseLayout>{page}</BaseLayout>;
};

export default VipPage;
