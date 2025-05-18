import cn from 'classnames';
import { ArrowRight2, DollarCircle, InfoCircle, User } from 'iconsax-react';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { ReactElement, useState } from 'react';
import Countdown from 'react-countdown';
import { shallowEqual, useSelector } from 'react-redux';
import { Tooltip } from 'react-tooltip';

import { useTranslation } from '@/base/config/i18next';
import { currencyFormat1 } from '@/base/libs/utils';
import { AppState } from '@/base/redux/store';
import CsrWrapper from '@/components/CsrWrapper';
import BaseLayout from '@/components/layouts/base.layout';
import MetaHead from '@/components/metaHead/metaHead';
import CommonModal from '@/components/modal/commonModal/commonModal';

import styles from './index.module.scss';

const prizes = [
  { img: '/img/tournament/prize-1.png', percent: 50 },
  { img: '/img/tournament/prize-2.png', percent: 15 },
  { img: '/img/tournament/prize-3.png', percent: 10 },
  { img: '/img/tournament/prize-4.png', percent: 7 },
  { img: '/img/tournament/prize-5.png', percent: 6 },
  { img: '/img/tournament/prize-6.png', percent: 4 },
  { img: '/img/tournament/prize-7.png', percent: 3 },
  { img: '/img/tournament/prize-8.png', percent: 2 },
  { img: '/img/tournament/prize-9.png', percent: 1.5 },
  { img: '/img/tournament/prize-10.png', percent: 1 },
  { img: '/img/tournament/prize-11.png', percent: 0.5 },
];

const prizeDetail = [
  { rank: 1, participants: 1000, prize: 10000, participantText: '1,000', prizeText: '$ 10K' },
  { rank: 2, participants: 3000, prize: 30000, participantText: '3000', prizeText: '$ 30K' },
  { rank: 3, participants: 5000, prize: 50000, participantText: '5000', prizeText: '$ 50K' },
  { rank: 4, participants: 10000, prize: 100000, participantText: '10000', prizeText: '$ 100K' },
  { rank: 5, participants: 25000, prize: 250000, participantText: '25000', prizeText: '$ 250K' },
  { rank: 6, participants: 50000, prize: 500000, participantText: '50000', prizeText: '$ 500K' },
  { rank: 7, participants: 100000, prize: 1000000, participantText: '100K', prizeText: '$ 1M' },
  { rank: 8, participants: 150000, prize: 3000000, participantText: '150K', prizeText: '$ 3M' },
  { rank: 9, participants: 200000, prize: 4000000, participantText: '200K', prizeText: '$ 4M' },
  { rank: 10, participants: 250000, prize: 5000000, participantText: '250K', prizeText: '$ 5M' },
  { rank: 11, participants: 500000, prize: 10000000, participantText: '500K', prizeText: '$ 10M' },
];

function TournamentPage() {
  const { t } = useTranslation('');
  const [isRegistered, setIsRegistered] = useState<boolean>(false);
  const [isShowComing, setIsShowComing] = useState<boolean>(false);
  const { showChatType } = useSelector(
    (state: AppState) => ({
      showChatType: state.modal.showChatType,
    }),
    shallowEqual,
  );

  return (
    <>
      <MetaHead />
      <Head>
        <link
          rel="canonical"
          href="https://bonenza.com/tournament"
          key="canonical"
        />
      </Head>
      <div className="py-[24px]">
        <div className="relative">
          <Image
            src="/img/tournament/logo-back.png"
            width={1340}
            height={500}
            alt="tournament logo"
            className="w-full object-contain rounded-default hidden lg:block"
          />
          <Image
            src="/img/tournament/logo-back-mobile.png"
            width={1340}
            height={500}
            alt="tournament logo"
            className="w-[full] object-contain rounded-default block lg:hidden"
          />
          <div className="absolute top-0 left-0 right-0 bottom-0 p-4 lg:p-0">
            <div className="flex justify-between flex-col-reverse lg:flex-row items-center h-full w-full">
              <div
                className={cn(
                  'flex flex-col items-center lg:items-start m-auto w-full lg:w-[42%] gap-3 sm:gap-7 lg:gap-2 xl:gap-7',
                  {
                    '2xl:w-[37%] 2xl:gap-7': !showChatType,
                    '2xl:w-[50%] 2xl:gap-2 min-[1720px]:gap-6': showChatType,
                  },
                )}
              >
                <div className="flex gap-2 border-solid border border-white rounded-full">
                  <span
                    className={cn('font-semibold px-5 py-2 rounded-full', {
                      'bg-white text-black': isRegistered,
                      'bg-transparent text-white': !isRegistered,
                    })}
                  >
                    {t('tournament:registered')}
                  </span>
                  <span
                    className={cn('font-semibold px-5 py-2 rounded-full', {
                      'bg-white text-black': !isRegistered,
                      'bg-transparent text-white': isRegistered,
                    })}
                  >
                    {t('tournament:nonRegistered')}
                  </span>
                </div>
                <div className="font-bold text-[20px] sm:text-[24px] text-white">{t('tournament:tournamentTitle')}</div>
                <div className="font-light text-[13px] 2xl:text-[16px] text-white">
                  {t('tournament:tournamentDescription')}
                </div>
                <div className="flex flex-col gap-2 w-full text-center lg:text-start">
                  <div className="font-normal text-default sm:text-[16px]">{t('tournament:tournamentEndsIn')}:</div>
                  <div className="flex flex-col lg:flex-row justify-start items-center gap-4">
                    <CsrWrapper>
                      <Countdown
                        date={isRegistered ? new Date() : new Date(2024, 6, 3)}
                        renderer={({ hours, minutes, seconds }) => (
                          <div className="flex items-start gap-2">
                            <div className="min-w-[50px]">
                              <div className="text-center text-white text-[32px] font-bold leading-8">
                                {0 < 10 ? '0' : ''}
                                {0}
                              </div>
                              <div className="text-center text-gray-400 text-[10px] font-light">
                                {t('tournament:hours')}
                              </div>
                            </div>
                            <div className="text-center text-white text-[32px] font-normal leading-8">:</div>
                            <div className="min-w-[50px]">
                              <div className="text-center text-white text-[32px] font-bold leading-8">
                                {0 < 10 ? '0' : ''}
                                {0}
                              </div>
                              <div className="text-center text-gray-400 text-[10px] font-light">
                                {t('tournament:minutes')}
                              </div>
                            </div>
                            <div className="text-center text-white text-[32px] font-normal leading-8">:</div>
                            <div className="min-w-[50px]">
                              <div className="text-center text-white text-[32px] font-bold leading-8">
                                {0 < 10 ? '0' : ''}
                                {0}
                              </div>
                              <div className="text-center text-gray-400 text-[10px] font-light">
                                {t('tournament:seconds')}
                              </div>
                            </div>
                          </div>
                        )}
                      />
                    </CsrWrapper>
                    <div
                      className={cn(
                        'px-16 lg:px-3 2xl:px-10 py-3 rounded-default cursor-pointer uppercase font-semibold text-default sm:text-[16px]',
                        {
                          'bg-gradient-btn-secondary': isRegistered,
                          'bg-gradient-btn-play shadow-bs-btn': !isRegistered,
                        },
                      )}
                      onClick={() => {
                        if (isRegistered === false) setIsShowComing(true);
                      }}
                    >
                      {isRegistered ? t('tournament:playNow') : t('tournament:registerNow')}
                    </div>
                  </div>
                </div>
              </div>
              <Image
                src="/img/tournament/logo.webp"
                width={650}
                height={600}
                alt="tournament logo"
                className={cn('w-[80%] lg:w-auto lg:h-[360px] object-contain', {
                  'xl:h-[400px] 2xl:h-[540px] mr-[6%]': !showChatType,
                  '2xl:h-[360px] min-[1800px]:h-[450px]': showChatType,
                })}
              />
            </div>
          </div>
        </div>
        <div className="p-6 mt-8 bg-gradient-card-default rounded-default">
          <div className="text-center sm:text-left text-[20px] sm:text-[22px] font-bold w-full">
            {t('tournament:introduction')}
          </div>
          <div className=" mt-2 pb-2 grid grid-cols-11 gap-0 sm:gap-4 lg:gap-2">
            <div className="col-span-11 lg:col-span-3 flex gap-3 justify-center items-center">
              <div className="text-[48px] text-color-primary font-bold mr-6">1</div>
              <div className="flex flex-col">
                <div className="font-bold text-color-primary text-[16px] sm:text-[18px]">
                  {t('tournament:registration')}
                </div>
                <div className="mt-3 text-default">{t('tournament:descriptionRegistration')}</div>
              </div>
            </div>
            <div className="col-span-11 lg:col-span-1 flex justify-center items-center rotate-90 lg:rotate-0 text-color-primary">
              <ArrowRight2 className="w-10 h-10 font-extrabold" />
            </div>
            <div className="col-span-11 lg:col-span-3 flex gap-3 justify-center items-center">
              <div className="text-[48px] text-color-primary font-bold mr-6">2</div>
              <div className="flex flex-col">
                <div className="font-bold text-color-primary text-[16px] sm:text-[18px]">
                  {t('tournament:competition')}
                </div>
                <div className="mt-3 text-default">{t('tournament:descriptionCompetition')}</div>
              </div>
            </div>
            <div className="col-span-11 lg:col-span-1 flex justify-center items-center rotate-90 lg:rotate-0 text-color-primary">
              <ArrowRight2 className="w-10 h-10 font-extrabold" />
            </div>
            <div className="col-span-11 lg:col-span-3 flex gap-3 justify-center items-center">
              <div className="text-[48px] text-color-primary font-bold mr-6">3</div>
              <div className="flex flex-col">
                <div className="font-bold text-color-primary text-[16px] sm:text-[18px]">
                  {t('tournament:distribution')}
                </div>
                <div className="mt-3 text-default">{t('tournament:descriptiondistribution')}</div>
              </div>
            </div>
          </div>
        </div>
        <div
          className={cn('mt-10 uppercase text-[32px] md:text[48px] xl:text-[64px] w-full text-center', styles.goldText)}
          dangerouslySetInnerHTML={{
            __html: String(
              t('tournament:prizePool', {
                value: '10,000,000 USDT',
              }),
            ),
          }}
        ></div>
        <div className="flex flex-col mt-8 gap-6">
          <div className="flex flex-col md:flex-row justify-evenly items-center uppercase gap-4">
            <div>
              <div className="text-title font-semibold">Current Eligible Participants</div>
              <div className="text-[20px] md:text-[28px] font-extrabold text-[#FBFF4B] text-center">0</div>
            </div>
            <div className="flex justify-center items-center gap-4">
              <div>
                <div className="text-title font-semibold">Current Prize Pool</div>
                <div className="text-[20px] md:text-[28px] font-extrabold text-[#FBFF4B] text-center">
                  {currencyFormat1(10000.0, 2)}
                </div>
              </div>
              <InfoCircle className="text-white cursor-pointer" variant="Bulk" />
            </div>
          </div>
          <div
            className={cn(
              'grid grid-cols-11 gap-[2px] sm:gap-2 w-[95%] sm:w-[80%] lg:w-[55%] m-auto min-h-[160px] md:min-h-[240px] max-h-[160px] md:max-h-[240px]',
              styles['bar_chart'],
            )}
          >
            {prizeDetail.map((prize) => (
              <div
                key={`prize-${prize.rank}`}
                className="w-full relative"
                data-tooltip-id={`bar-tooltip-${prize.rank}`}
              >
                <div className={cn('absolute top-0 right-0 bottom-0 left-0 !min-h-full', styles['bar_parent'])}>
                  <div className={cn('!min-h-full', styles['bar'], styles['normal_bar'])}></div>
                  <Tooltip
                    id={`bar-tooltip-${prize.rank}`}
                    place="top"
                    className="dark:bg-black/0 bg-white z-[10]"
                    opacity={100}
                    offset={60}
                  >
                    <div
                      className={cn(
                        'flex flex-col justify-start items-start gap-2',
                        'max-w-[300px] p-3 rounded-md',
                        styles['tooltip'],
                      )}
                    >
                      <div className="flex justify-center items-center gap-4 text-black font-bold">
                        <User variant="Bold" className="w-5 h-5" /> {prize.participantText}
                      </div>
                      <div className="flex justify-center items-center gap-4 text-black font-bold">
                        <DollarCircle variant="Bold" className="w-5 h-5" /> {prize.prizeText}
                      </div>
                    </div>
                  </Tooltip>
                  <svg className={styles['flt_svg']} xmlns="http://www.w3.org/2000/svg">
                    <defs>
                      <filter id="flt_tag">
                        <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur" />
                        <feColorMatrix
                          in="blur"
                          mode="matrix"
                          values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -9"
                          result="flt_tag"
                        />
                        <feComposite in="SourceGraphic" in2="flt_tag" operator="atop" />
                      </filter>
                    </defs>
                  </svg>
                </div>
                {prize.rank <= 1 && (
                  <div
                    className={cn('absolute right-0 bottom-0 left-0 !max-h-full', styles['bar_parent'], {
                      'top-0': prize.rank !== 1,
                      'top-[100%] !min-h-0': prize.rank === 1,
                    })}
                  >
                    <div className={cn('!min-h-full', styles['bar'], styles['gold_bar'])}></div>
                    <svg className={styles['flt_svg']} xmlns="http://www.w3.org/2000/svg">
                      <defs>
                        <filter id="flt_tag">
                          <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur" />
                          <feColorMatrix
                            in="blur"
                            mode="matrix"
                            values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -9"
                            result="flt_tag"
                          />
                          <feComposite in="SourceGraphic" in2="flt_tag" operator="atop" />
                        </filter>
                      </defs>
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="flex flex-col md:flex-row justify-evenly items-center gap-4 text-default">
            <div className="flex gap-2 text-white text-default font-bold">
              <div>{t('deposit:min')}</div>
              <div className="flex justify-center items-center gap-2">
                <User variant="Bold" className="w-5 h-5" /> {prizeDetail?.at(0)?.participantText || ''}
              </div>
              -
              <div className="flex justify-center items-center gap-2">
                <DollarCircle variant="Bold" className="w-5 h-5" /> {prizeDetail?.at(0)?.prizeText || ''}
              </div>
            </div>
            <div className="flex gap-2 text-white text-default font-bold">
              <div>{t('deposit:min')}</div>
              <div className="flex justify-center items-center gap-2">
                <User variant="Bold" className="w-5 h-5" />{' '}
                {prizeDetail?.at(prizeDetail.length - 1)?.participantText || ''}
              </div>
              -
              <div className="flex justify-center items-center gap-2">
                <DollarCircle variant="Bold" className="w-5 h-5" />{' '}
                {prizeDetail?.at(prizeDetail.length - 1)?.prizeText || ''}
              </div>
            </div>
          </div>
        </div>
        <div className="mt-4 2xl:w-[70%] flex flex-wrap justify-center m-auto">
          {prizes.map((prize) => (
            <div key={prize.img} className="flex flex-col items-center font-bold text-default sm:text-m_title">
              <Image
                src={prize.img}
                width={150}
                height={150}
                alt="prize"
                className="w-[90px] h-[90px] lg:w-[150px] lg:h-[150px] object-contain"
              />
              {`${prize.percent}%`}
            </div>
          ))}
        </div>
        <div className="bg-gradient-card-violet mt-8 rounded-default p-5 lg:py-10 lg:px-16 shadow-inner shadow-white">
          <div className="text-title sm:text-m_title font-bold text-white">{t('tournament:eventRules')}</div>
          <div className="mt-4 text-default font-normal">
            <div className="text-[16px] font-semibold text-color-primary">{t('tournament:eligibility')}</div>
            <div className="mt-4 pl-4 flex flex-col gap-2">
              <div>1. {t('tournament:eligibilityDescription1')}</div>
              <div>2. {t('tournament:eligibilityDescription2')}</div>
            </div>
          </div>
          <div className="mt-4 text-default font-normal">
            <div className="text-[16px] font-semibold text-color-primary">{t('tournament:termsAndConditions')}</div>
            <div className="mt-4 pl-4 flex flex-col gap-2">
              {new Array(16).fill(0).map((_, index) => (
                <div key={`terms-conditions-${index}`} className="mb-2">
                  <span className="font-semibold text-[#FFC700]">{`${index + 1}. ${t(
                    'tournament:terms' + (index + 1).toString(),
                  )}: `}</span>
                  <span className="font-light">{`${t('tournament:conditions' + (index + 1).toString())}`}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <CommonModal
        show={isShowComing}
        onClose={() => setIsShowComing(false)}
        panelClass="rounded-default sm:!max-w-[420px] !max-w-[300px] !mx-[10px] !h-[auto]"
        position="flex-col justify-center items-center"
        isCongrat
      >
        <div className="bg-gradient-card-modal relative flex flex-col items-center justify-center p-8 md:p-10 overflow-y-auto">
          <div className="text-[24px] md:text-[32px] text-white font-extrabold mb-4">{t('tournament:welcome')}</div>
          <Image width={80} height={41} className="w-[80px] object-contain" src="/img/logo-mobile.png" alt="logo" />
          <div className="mt-6 text-[16px] md:text-[18px] text-white text-center font-extralight">
            {t('tournament:announce')}
          </div>
          <Link
            className="mt-6 text-[16px] md:text-[18px] text-color-text-mailto text-center font-semibold"
            href={`mailto:support@bonenza.com`}
          >
            Bonenza Team
          </Link>
        </div>
      </CommonModal>
    </>
  );
}

TournamentPage.getLayout = function getLayout(page: ReactElement) {
  return <BaseLayout>{page}</BaseLayout>;
};

export default TournamentPage;
