import { Disclosure, Transition } from '@headlessui/react';
import cn from 'classnames';
import { Add, ArrowRight2, Minus, SmsTracking } from 'iconsax-react';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { ReactElement, useEffect, useMemo, useState } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';

import { api_affiliate } from '@/api/bonus';
import { useTranslation } from '@/base/config/i18next';
import { useExchange } from '@/base/hooks/useExchange';
import { currencyFormat1 } from '@/base/libs/utils';
import { changeAuthenticationType, changeIsShowAuthenticationModal } from '@/base/redux/reducers/modal.reducer';
import { AppState } from '@/base/redux/store';
import { AuthenticationModeEnum, LiveRewardType } from '@/base/types/common';
import CheckMarkIcon from '@/components/icons/CheckMarkIcon';
import BaseLayout from '@/components/layouts/base.layout';
import MetaHead from '@/components/metaHead/metaHead';
import CommissionReward from '@/components/modal/affiliate/commissionRewards/commissionRewards';
import ReferralRewardRules from '@/components/modal/affiliate/referralRewardRules/referralRewardRules';
import ModalReferralTerm from '@/components/modal/affiliate/referralTerm';

import AffiliateLoggedPage from '../affiliate-logged/index.module';
import styles from './index.module.scss';

function AffiliatePage() {
  const exchange = useExchange();
  const { t, i18n } = useTranslation('');
  const dispatch = useDispatch();

  const [showDetailCommissionsRewards, setShowDetailCommissionsRewards] = useState(false);
  const [showReferralRewardRules, setShowReferralRewardRules] = useState(false);
  const [showReferralTerm, setShowReferralTerm] = useState(false);
  const [liveRewardData, setLiveRewardData] = useState<LiveRewardType[]>([]);
  const [totalRewardsSent, setTotalRewardsSent] = useState<number>(0);

  const { isLogin, localFiat, viewInFiat } = useSelector(
    (state: AppState) => ({
      isLogin: state.auth.isLogin,
      localFiat: state.wallet.localFiat,
      viewInFiat: state.auth.user.generalSetting.settingViewInFiat,
    }),
    shallowEqual,
  );

  const questions = useMemo(
    () => [
      {
        id: 1,
        title: t('affiliate:howDoesTheReferralSystemWork'),
        content: t('affiliate:whenYouShareYour'),
      },
      {
        id: 2,
        title: t('affiliate:howMuchCanI'),
        content: t('affiliate:questionDescription2'),
      },
      {
        id: 3,
        title: t('affiliate:whatIsUSD'),
        content: t('affiliate:questionDescription3'),
      },
      {
        id: 4,
        title: t('affiliate:areThereAny'),
        content: t('affiliate:questionDescription4'),
      },
      {
        id: 5,
        title: t('affiliate:iHaveBig'),
        content: t('affiliate:questionDescription5'),
      },
      {
        id: 6,
        title: t('affiliate:howManyAffiliate'),
        content: t('affiliate:questionDescription6'),
      },
      {
        id: 7,
        title: t('affiliate:canISee'),
        content: t('affiliate:questionDescription7'),
      },
      {
        id: 8,
        title: t('affiliate:CanISendTip'),
        content: t('affiliate:questionDescription8'),
      },
    ],
    [i18n],
  );

  const getReferralData = async () => {
    try {
      const _res = await api_affiliate();
      setTotalRewardsSent(Number(_res.data?.totalRewardsSentToDate || 0));
      const tempRecentRewardsAcitivities: LiveRewardType[] =
        _res.data?.recentRewardsActivities?.map((item: any) => ({
          logo: item.logo ?? '',
          name: item.name ?? '',
          amountUsd: Number(item.amountUsd || 0),
        })) ?? [];
      setLiveRewardData(tempRecentRewardsAcitivities);
    } catch (error) {
    } finally {
    }
  };

  useEffect(() => {
    // getReferralData();
  }, []);
  return (
    <>
      <MetaHead />
      <Head>
        <link
          rel="canonical"
          href="https://bonenza.com/affiliate"
          key="canonical"
        />
      </Head>
      {!isLogin && (
        <>
          <div
            className={cn(
              'bg-[length:100%] lg:bg-[length:auto_100%] bg-no-repeat bg-right mb-[40px] mt-[25px] lg:pt-[25px] lg:h-[360px]',
              "lg:dark:bg-[url('/img/page/banner-affiliate.png')]",
              "lg:bg-[url('/img/page/banner-affiliate-light-mode.png')]",
            )}
          >
            <div className="flex flex-col lg:w-1/2 w-full h-full justify-center items-center">
              <div className={cn('block lg:hidden h-auto w-full mb-4')}>
                <Image
                  height={366}
                  width={130}
                  src="/img/page/mobile-banner-affiliate.png"
                  alt="affiliate-banner-mobile"
                  className="!w-full object-contain rounded-default"
                />
              </div>
              <div className="italic text-[28px] lg:text-[32px] xl:text-[42px] mb-[10px] dark:text-white text-[#141414] text-center font-bold">
                {t('affiliate:inviteFriendsToEarn')}
              </div>
              <h5
                className={`text-[30px] lg:text-[24px] xl:text-[32px] mb-[30px] text-center font-extrabold bg-clip-text text-transparent bg-gradient-to-b from-[#ffd339] to-[#f59e00]`}
              >
                {`${viewInFiat ? currencyFormat1(1000 * exchange, 2, localFiat?.name || 'USD') : currencyFormat1(1000, 2)
                  } + 25%`}{' '}
                {t('affiliate:commission')}
              </h5>
              <div
                role="button"
                className="bg-btn-sign-in rounded-large bg-gradient-btn-play shadow-bs-btn flex items-center justify-center gap-[7px] max-w-[208px] px-[20px] py-[10px] font-bold text-white mb-[10px]"
                onClick={() => {
                  dispatch(changeIsShowAuthenticationModal(true));
                  dispatch(changeAuthenticationType(AuthenticationModeEnum.SIGN_UP));
                }}
              >
                <span className="text-[14px]">{t('affiliate:signUpAndEarn')}</span>
                <div className="w-[34px] h-[35px] hidden md:flex items-center justify-center rounded-large bg-white/20">
                  <Image height={14} width={14} src="/img/icon/arrow-right.png" alt="arrow right" />
                </div>
              </div>
              <div
                className="flex w-full justify-center items-center"
                role="button"
                onClick={() => {
                  setShowReferralTerm(true);
                }}
              >
                <div className="text-[16px] text-white font-normal mr-[5px] text-right">
                  {t('affiliate:referralTermsConditions')}
                </div>
                <ArrowRight2 size={16} />
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <div className="py-7 px-5 dark:bg-color-card-bg-primary bg-[#D2CDC9] md:bg-[url('/img/banner-image-box1.png')] bg-[center_right_1rem] bg-no-repeat bg-[length:28%_auto] rounded">
              <div className="sm:w-[100%] md:w-[70%]">
                <div className="text-[26px] mb-[16px] font-bold dark:text-white text-[#141414]">
                  {t('affiliate:getYour')}
                  <span
                    className={`bg-gradient-to-b from-amber-500 to-amber-500 font-bold bg-clip-text text-transparent`}
                  >
                    {' '}
                    {viewInFiat
                      ? currencyFormat1(1000 * exchange, 2, localFiat?.name || 'USD')
                      : currencyFormat1(1000, 2)}{' '}
                  </span>
                  <span className="font-bold">{t('affiliate:referralRewards')}</span>
                </div>
                <span className={`text-[16px] dark:text-[#939699] text-[#7C7A77]`}>
                  {t('affiliate:everyFriendYouInvite', {
                    reward: viewInFiat
                      ? currencyFormat1(1000 * exchange, 2, localFiat?.name || 'USD')
                      : currencyFormat1(1000, 2),
                  })}
                </span>
                <div className="md:hidden mt-5">
                  <Image
                    width={200}
                    height={30}
                    src="/img/banner-image-box1.png"
                    className="w-[50%] h-[50%] m-auto"
                    alt="banner image"
                  />
                </div>
                <div
                  role="button"
                  className="sm:w-full md:max-w-[240px] text-[16px] hover:opacity-[0.9] text-white font-bold rounded-large bg-gradient-btn-play shadow-bs-btn py-[16px] px-[20px]  mt-4 md:mt-[40px] text-center"
                  onClick={() => setShowReferralRewardRules(true)}
                >
                  {t('affiliate:pleaseSeeTheDetails')}
                </div>
              </div>
            </div>
            <div className="py-7 px-5 dark:bg-color-card-bg-primary bg-[#D2CDC9] md:bg-[url('/img/banner-image-box2.png')] bg-[center_right_1rem] bg-no-repeat bg-[length:35%_auto] rounded">
              <div className="sm:w-[100%] md:w-[70%]">
                <div className="text-[26px] mb-[16px] font-bold dark:text-white text-[#141414]">
                  {t('affiliate:getYour')}{' '}
                  <span
                    className={`bg-gradient-to-b from-amber-500 to-amber-500 font-bold bg-clip-text text-transparent`}
                  >
                    {' '}
                    25%{' '}
                  </span>
                  <span className="font-bold">{t('affiliate:commissionRewards')}</span>
                </div>
                <span className="text-[16px] dark:text-[#939699] text-[#7C7A77]">{t('affiliate:youWillReceive')}</span>
                <div className="md:hidden mt-5">
                  <Image
                    width={200}
                    height={30}
                    src="/img/banner-image-box2.png"
                    className="w-[50%] h-[50%] m-auto"
                    alt="banner image"
                  />
                </div>
                <div
                  role="button"
                  className="sm:w-full md:max-w-[240px] text-[16px] hover:opacity-[0.9] text-white font-bold rounded-large bg-gradient-btn-play shadow-bs-btn py-[16px] px-[20px]  mt-4 md:mt-[40px] text-center"
                  onClick={() => setShowDetailCommissionsRewards(true)}
                >
                  {t('affiliate:pleaseSeeTheDetails')}
                </div>
              </div>
            </div>
          </div>
          <div className="relative w-full mt-6">
            <div className="absolute top-0 left-5 py-1 px-4 flex justify-center items-center text-black dark:text-white bg-[#31373D] rounded-[5px]">
              <div className="bg-color-text-green rounded-full w-3 h-3 mr-[10px]" />
              <div className="text-default 2xl:text-[16px] font-semibold dark:text-white text-[#141414]">
                {t('affiliate:liveRewards')}
              </div>
            </div>
            <div className="flex w-full xl:grid xl:grid-cols-4 flex-col gap-4 p-4 justify-start items-center rounded-default bg-white dark:bg-gradient-card-default mb-[40px]">
              <div className="xl:col-span-3">
                {!liveRewardData?.length && (
                  <div className="flex flex-col justify-center items-center gap-[15px] text-[#53575C] text-[14px] w-full">
                    <Image src="/img/empty-dark.png" alt="noData" width={50} height={50} />
                  </div>
                )}
                {!!liveRewardData.length && (
                  <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-4 gap-x-6 pt-6 xl:pt-4 2xl:pt-2">
                    {liveRewardData.map((reward, index) => {
                      return (
                        <div className="flex justify-center items-center py-[6px]" key={index}>
                          <div className="text-default dark:text-color-text-primary text-[#43484E] font-semibold mr-1">
                            <span className="dark:text-white text-color-light-text-primary mr-2 font-bold">{`${reward.name}`}</span>
                            <span className="text-color-text-green font-bold">
                              {viewInFiat ? (
                                <>{currencyFormat1(reward.amountUsd * exchange, 8, localFiat?.name || 'USD')}</>
                              ) : (
                                <>{currencyFormat1(reward.amountUsd, 8)}</>
                              )}
                            </span>{' '}
                          </div>
                          <Image height={16} width={16} src={reward.logo} className="w-[20px] h-[20px]" alt="reward" />
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
              <div className="bg-color-panel-bg rounded-default px-6 lg:px-3 w-full md:w-auto py-2">
                <h5 className="text-center font-bold text-m_default sm:text-[13px] dark:text-white text-black">
                  {t('affiliate:totalRewards')}
                </h5>
                <div className="flex justify-center w-full">
                  <span className={`font-bold text-[18px] 2xl:text-[22px] text-color-secondary  ${styles.textBanner}`}>
                    {viewInFiat ? (
                      <>{currencyFormat1(100 * exchange, 8, localFiat?.name || 'USD')}</>
                    ) : (
                      <>{currencyFormat1(100, 8)}</>
                    )}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="dark:bg-color-card-bg-secondary bg-white rounded-[5px] flex lg:flex-row flex-col items-center justify-center mb-[60px] p-[20px]">
            <div className="mr-[24px]">
              <Image width={210} height={198} alt="" src="/img/loudspeaker.png" />
            </div>
            <div className="w-full">
              <div className="flex gap-[5px]">
                <div className="mr-[3px] text-[20px] lg:text-[24px] dark:text-white text-[#141414] font-bold">
                  {t('affiliate:learnMoreAboutOur')}
                </div>
                <div className={`font-bold text-[20px] lg:text-[24px] bg-color-primary ${styles.textBanner}`}>
                  {t('affiliate:affiliateProgram')}
                </div>
              </div>
              <div>
                <div className="flex mb-[20px] gap-[10px]">
                  <CheckMarkIcon className="w-[24px] h-[24px] text-color-primary" />
                  <div className="text-[15px] text-gray-500">{t('affiliate:ifYouHaveA')}</div>
                </div>
              </div>
              <div>
                <div className="flex mb-[20px] gap-[10px]">
                  <CheckMarkIcon className="w-[24px] h-[24px] text-color-primary" />

                  <div className="text-[15px] text-gray-500">{t('affiliate:ifYouCanInvite')}</div>
                </div>
              </div>
              <div className="text-[16px] mb-[20px] dark:text-white text-[#141414]">
                {t('affiliate:forMoreDetails')}
              </div>
              <Link
                className="flex justify-between max-w-[309px] h-[50px] rounded-[5px] dark:bg-color-panel-bg bg-[#F6F7FA] items-center p-[10px]"
                href="mailto:business@bonenza.com"
              >
                <div className="text-[14px] text-gray-500">business@bonenza.com</div>
                <div className="flex items-center gap-[10px]">
                  <div className="text-[14px] text-color-primary">{t('affiliate:sendNow')}</div>
                  <div>
                    <SmsTracking className="w-[24px] h-[24px] text-color-primary" />
                  </div>
                </div>
              </Link>
            </div>
          </div>
          <div className="flex justify-center items-center">
            <div className="w-[95%] h-full md:w-[1067px] pt-[16px] pb-[47px] md:px-[20px] px-[20px]">
              <div className="text-center text-3xl mb-[26px]">
                <div className="text-[16px] lg:text-[36px] pt-42 dark:text-white text-[#141414] font-semibold">
                  {t('affiliate:frequentlyAskedQuestions')}
                </div>
              </div>
              {questions.map((item) => (
                <div key={item.id}>
                  <div className="h-[1px] bg-[#EAECF3] dark:bg-[#2B3139] mb-[16px]"></div>
                  <Disclosure>
                    {({ open }) => (
                      <div className="w-full">
                        <Disclosure.Button className="mb-[20px] w-full flex justify-between">
                          <div className="font-semibold text-[14px] sm:text-[16px] dark:text-white text-black">
                            {item.title}
                          </div>
                          <div
                            className={`${open
                              ? 'bg-color-primary text-white'
                              : 'dark:bg-[#ffffff33] bg-[#f5f6fa] dark:text-[#98A7B5] text-[#31373d]'
                              } w-[30px] h-[30px] rounded-full flex items-center justify-center`}
                          >
                            {open ? <Minus size="24" /> : <Add size="24" />}
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
                            <div className="flex justify-between dark:text-[#98A7B5] text-[#31373d] text-[12px] sm:text-[14px] mb-[20px]">
                              {item.content}
                            </div>
                          </Disclosure.Panel>
                        </Transition>
                      </div>
                    )}
                  </Disclosure>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
      <CommissionReward show={showDetailCommissionsRewards} onClose={() => setShowDetailCommissionsRewards(false)} />
      <ReferralRewardRules show={showReferralRewardRules} onClose={() => setShowReferralRewardRules(false)} />
      {isLogin && <AffiliateLoggedPage />}
      {showReferralTerm && <ModalReferralTerm show={showReferralTerm} onClose={() => setShowReferralTerm(false)} />}
    </>
  );
}

AffiliatePage.getLayout = function getLayout(page: ReactElement) {
  return <BaseLayout>{page}</BaseLayout>;
};

export default AffiliatePage;
