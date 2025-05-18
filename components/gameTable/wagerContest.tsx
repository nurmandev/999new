import { QuestionMarkCircleIcon } from '@heroicons/react/24/outline';
import { ColumnDef } from '@tanstack/react-table';
import cn from 'classnames';
import { ArrowRight2, Snapchat } from 'iconsax-react';
import Image from 'next/image';
import { useEffect, useMemo, useState } from 'react';
import Countdown from 'react-countdown';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';

import { api_wagerContestHistory, api_wagerContestList, api_wagerContestPosition } from '@/api/game';
import { useTranslation } from '@/base/config/i18next';
import { API_AVATAR, DATE_TIME_SUBMIT_FORMAT_WITH_SECOND } from '@/base/constants/common';
import { useExchange } from '@/base/hooks/useExchange';
import { useUSDTPrice } from '@/base/hooks/useUSDTPrice';
import { currencyFormat1, formatDate } from '@/base/libs/utils';
import {
  changeAuthenticationType,
  changeIsShowAuthenticationModal,
  changeIsShowDailyContest,
  changeIsShowInformation,
  changeIsShowWagerContestHistory,
  changeIsShowWagerRules,
} from '@/base/redux/reducers/modal.reducer';
import { setUserData } from '@/base/redux/reducers/user.reducer';
import { AppState } from '@/base/redux/store';
import { AuthenticationModeEnum } from '@/base/types/common';

import RankingTableComponent from '../table/rankingTable';
import styles from './index.module.scss';

type ContesterType = {
  playerId: string;
  playerName: string;
  playerAvatar: string;
  wageredAmountUsd: number;
  prizeAmountUsd: number;
  percentage: number;
};

type WagerContestType = {
  startTime: number;
  currentTime: number;
  endTime: number;
  totalPrizePoolAmountUsd: number;
  contesters: ContesterType[];
};

const WagerContestComponent = () => {
  const exchangeRate = useExchange();
  const usdtPrice = useUSDTPrice();
  const dispatch = useDispatch();
  const [wagerContestData, setWagerContestData] = useState<WagerContestType>({
    startTime: 0,
    currentTime: 0,
    endTime: 0,
    totalPrizePoolAmountUsd: 0,
    contesters: [],
  });
  const [wagerHistory, setWagerHistory] = useState<ContesterType>({
    playerId: '',
    playerName: '',
    playerAvatar: '',
    wageredAmountUsd: 0,
    percentage: 0,
    prizeAmountUsd: 0,
  });
  const [positionData, setPositionData] = useState({
    position: 1,
    wageredAmountUsd: 0,
  });
  const [isLoadingTable, setIsLoadingTable] = useState<boolean>(false);

  const { t } = useTranslation('');

  const { userName, avatar, userId, viewInFiat, localFiat, isLogin, showChatType } = useSelector(
    (state: AppState) => ({
      localFiat: state.wallet.localFiat,
      userName: state.auth.user.userName,
      avatar: state.auth.user.avatar,
      userId: state.auth.user.userId,
      viewInFiat: state.auth.user.generalSetting.settingViewInFiat,
      isLogin: state.auth.isLogin,
      cryptoPrices: state.wallet.symbols,
      showChatType: state.modal.showChatType,
    }),
    shallowEqual,
  );

  const getNextDay = () => {
    let currentDate = new Date();
    return currentDate.setDate(currentDate.getDate() + 1);
  };

  const [timeCoundown, setTimeCount] = useState(formatDate(getNextDay(), 'LL/dd/yyyy'));

  const getRank = (rank: number) => {
    let rankReturn = '';
    if (rank >= 50) {
      rankReturn = '50th+';
    } else if (rank > 10) {
      rankReturn = '10th+';
    } else if (rank > 3) {
      rankReturn = rank + 'th';
    } else {
      switch (rank) {
        case 1:
          rankReturn = '1st';
          break;
        case 2:
          rankReturn = '2nd';
          break;
        case 3:
          rankReturn = '3rd';
          break;
      }
    }
    return rankReturn;
  };

  const getWagerContestData = async () => {
    try {
      setIsLoadingTable(true);
      const [wagerContestList, wagerContestHistory] = await Promise.all([
        api_wagerContestList(),
        api_wagerContestHistory(),
      ]);
      const tempContestData: WagerContestType = {
        startTime: Number(wagerContestList?.data.startTime * 1000 ?? 0),
        currentTime: Number(wagerContestList?.data.currentTime * 1000 ?? 0),
        endTime: Number(wagerContestList?.data.endTime * 1000 ?? 0),
        totalPrizePoolAmountUsd: Number(wagerContestList?.data.totalPrizePoolAmountUsd ?? 0),
        contesters: wagerContestList?.data?.contesters?.map((item: any) => ({
          playerId: item?.playerId ?? '',
          playerName: item?.playerName ?? '',
          playerAvatar: item?.playerAvatar ?? '',
          wageredAmountUsd: Number(item?.wageredAmountUsd ?? 0),
          prizeAmountUsd: Number(item?.prizeAmountUsd ?? 0),
          percentage: Number(item?.percentage ?? 0),
        })),
      };

      if (wagerContestHistory?.data?.contest?.length > 0) {
        const tempTopContester = wagerContestHistory?.data?.contest[0];
        setWagerHistory({
          playerId: tempTopContester.playerId,
          playerName: tempTopContester.playerName,
          playerAvatar: tempTopContester.playerAvatar,
          wageredAmountUsd: tempTopContester.wageredAmountUsd,
          prizeAmountUsd: tempTopContester.prizeAmountUsd,
          percentage: tempTopContester.percentage,
        });
      }

      const timeCnt = wagerContestList.data.endTime - wagerContestList.data.currentTime;
      const currentDate = new Date();
      currentDate.setTime(currentDate.getTime() + timeCnt * 1000);
      setTimeCount(formatDate(currentDate, DATE_TIME_SUBMIT_FORMAT_WITH_SECOND));
      // reset(updatedValue);
      setWagerContestData(tempContestData);
    } catch (error) {
      setWagerContestData({
        startTime: 0,
        currentTime: 0,
        endTime: 0,
        totalPrizePoolAmountUsd: 0,
        contesters: [],
      });
    } finally {
      setIsLoadingTable(false);
    }
  };

  const getUserPosition = async () => {
    try {
      const res = await api_wagerContestPosition();
      setPositionData({
        position: Number(res.data.position ?? 1),
        wageredAmountUsd: Number(res.data.wageredAmountUsd ?? 0),
      });
    } catch (error) { }
  };

  const wagerAndPostion = useMemo(() => {
    const position = positionData.position;
    const numberOfContesters = wagerContestData.contesters.length;
    let wagerAmount = 0;
    let nextPosition = '';
    if (position > 10) {
      nextPosition = '10';
      if (wagerContestData.contesters.length >= 10) wagerAmount = wagerContestData.contesters[9]?.wageredAmountUsd ?? 0;
      else wagerAmount = wagerContestData.contesters[numberOfContesters - 1]?.wageredAmountUsd ?? 0;
    } else if (position > 5) {
      nextPosition = '5';
      if (wagerContestData.contesters.length >= 5) wagerAmount = wagerContestData.contesters[4]?.wageredAmountUsd ?? 0;
      else wagerAmount = wagerContestData.contesters[numberOfContesters - 1]?.wageredAmountUsd ?? 0;
    } else if (position > 1) {
      nextPosition = '1';
      wagerAmount = wagerContestData.contesters[0]?.wageredAmountUsd ?? 0;
    }
    return { position: nextPosition, wagerAmount };
  }, [positionData, wagerContestData]);

  const handleModalUserProfile = (user: any) => {
    dispatch(
      setUserData({
        userId: user.playerId || user.original.playerId || '',
        userName: user.playerName || user.original.playerName || '',
        avatar: user?.playerAvatar || user?.original?.playerAvatar || '',
      }),
    );
    dispatch(changeIsShowInformation(true));
  };

  const WagerContestColumns = useMemo(() => {
    const columnsDefault: ColumnDef<ContesterType>[] = [
      {
        accessorKey: 'betId',
        header: () => (
          <div className="dark:text-color-text-primary text-color-light-text-primary pl-2 sm:pl-4 text-m_default sm:text-default">
            #
          </div>
        ),
        cell: ({ row }) => (
          <div className={cn('flex items-center justify-start gap-[5px] truncate pl-2 sm:pl-4 py-3 sm:py-4')}>
            {row.index === 0 && (
              <Image
                height={25}
                width={25}
                src="/img/icon/gold.png"
                alt="medal gold"
                className="object-cover sm:h-[25px] h-[16px] sm:w-[25px] w-[16px]"
              />
            )}
            {row.index === 1 && (
              <Image
                height={25}
                width={25}
                src="/img/icon/sliver.png"
                alt="medal sliver"
                className="object-cover sm:h-[25px] h-[16px] sm:w-[25px] w-[16px]"
              />
            )}
            {row.index === 2 && (
              <Image
                height={25}
                width={25}
                src="/img/icon/bronze.png"
                alt="medal bronze"
                className="object-cover sm:h-[25px] h-[16px] sm:w-[25px] w-[16px]"
              />
            )}
            {row.index !== 0 && row.index !== 1 && row.index !== 2 && (
              <div className="font-semibold truncate text-m_default md:text-default">{row.index + 1}th</div>
            )}
          </div>
        ),
      },
      {
        accessorKey: 'player',
        header: () => (
          <div className="dark:text-color-text-primary text-color-light-text-primary text-m_default sm:text-default px-2 sm:px-4">
            {t('gameTable:player')}
          </div>
        ),
        cell: ({ row }) => (
          <div
            onClick={() => handleModalUserProfile(row)}
            className={cn(
              'dark:text-white text-color-light-text-primary flex items-center justify-start gap-[5px] truncate',
              {
                'pointer-events-none cursor-text': row.original?.playerId !== userId && !row.original?.playerName,
              },
            )}
          >
            <div className="flex justify-center items-center w-[20px] h-[20px] sm:w-[32px] sm:h-[32px]">
              {row.original?.playerId !== userId && !row.original?.playerName ? (
                <Snapchat width={25} height={25} variant="Bulk" className="w-[20px] h-[20px] sm:w-[30px] sm:h-[30px]" />
              ) : (
                <Image
                  height={25}
                  width={25}
                  src={row.original.playerAvatar ? `${API_AVATAR}/${row.original.playerAvatar}` : '/img/avatar-1.png'}
                  onError={(e) => {
                    e.currentTarget.src = '/img/avatar-1.png';
                  }}
                  alt="avatar"
                  className="object-cover rounded-full w-[16px] h-[16px] sm:w-[25px] sm:h-[25px]"
                />
              )}
            </div>
            <div className="!font-extralight truncate text-m_default sm:text-default w-[100px] sm:w-auto">
              {row.original?.playerId !== userId && !row.original?.playerName
                ? t('homePage:hidden')
                : row.original.playerId === userId
                  ? userName
                  : row.original.playerName}
            </div>
          </div>
        ),
      },
      {
        accessorKey: 'betAmount',
        header: () => (
          <div className="dark:text-color-text-primary text-color-light-text-primary px-2 sm:px-4 text-m_default sm:text-default text-center">
            {t('gameTable:wagered')}
          </div>
        ),
        cell: ({ row }) => (
          <div className="m-auto font-semibold text-center text-m_default sm:text-default text-color-text-green w-[70px] sm:w-auto truncate">
            {viewInFiat
              ? currencyFormat1(row.original.wageredAmountUsd * exchangeRate, 8, localFiat?.name)
              : currencyFormat1(row.original.wageredAmountUsd, 8)}
          </div>
        ),
      },
      {
        accessorKey: 'payout',
        header: () => (
          <div className="dark:text-color-text-primary text-color-light-text-primary pr-2 sm:pr-4 text-m_default sm:text-default">
            {t('gameTable:prize')}
          </div>
        ),
        cell: ({ row }) => (
          <div
            className={cn(
              'dark:text-color-text-primary text-color-light-text-primary text-m_default sm:text-default w-full',
              'flex justify-end pr-2 sm:pr-4 font-semibold',
              'truncate w-[70px] sm:w-auto',
            )}
          >
            <span className="font-bold text-color-text-green">
              {viewInFiat
                ? currencyFormat1(row.original.prizeAmountUsd * exchangeRate, 4, localFiat?.name)
                : currencyFormat1(row.original.prizeAmountUsd, 4)}
            </span>
            <span className="ml-[5px] hidden sm:block font-bold text-color-text-primary/70">{`${row.original.percentage}%`}</span>
          </div>
        ),
      },
    ];
    return columnsDefault;
  }, [localFiat, exchangeRate]);

  useEffect(() => {
    getWagerContestData();
  }, []);

  useEffect(() => {
    if (isLogin) {
      getUserPosition();
    }
  }, [isLogin]);

  return (
    <>
      <div className="grid flex-wrap grid-cols-12 gap-2 mb-3">
        <div className="col-span-12 lg:col-span-4 rounded-[5px] dark:bg-color-card-bg-secondary border border-solid border-color-card-border-primary bg-color-light-bg-primary p-3 pt-0 h-[8.313rem] justify-evenly items-center flex gap-[12px] sm:gap-[0.5rem] lg:gap-[1rem] min-w-fit grow">
          <Image
            width={125}
            height={110}
            className="object-contain h-[80%] md:ml-3"
            src="/img/cup.png"
            alt="medal cup"
          />
          <div className="flex">
            <div className="flex flex-col justify-end gap-2">
              <span className="text-[14px] text-color-primary font-bold">{t('wagerContest:daily')}</span>
              <span className="text-[12px] dark:text-color-text-primary text-color-light-text-primary">
                {t('wagerContest:contestPrizePool')}
              </span>
              <div className="rounded-[5px] dark:bg-color-card-body-secondary bg-white font-black h-[37px] px-2 flex items-center justify-center">
                <p
                  className={cn('font-bold text-color-secondary text-default lg:text-m_title', {
                    '2xl:text-[16px]': showChatType,
                    '2xl:text-m_title': !showChatType,
                  })}
                >
                  {viewInFiat
                    ? currencyFormat1(wagerContestData.totalPrizePoolAmountUsd * exchangeRate, 2, localFiat?.name)
                    : currencyFormat1(wagerContestData.totalPrizePoolAmountUsd, 2)}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-11 col-span-12 gap-2 lg:col-span-8 ">
          <div
            className={`col-span-5 min-[830px]:max-w-[380px] rounded-[5px] dark:bg-color-card-bg-secondary border border-solid border-color-card-border-primary ${styles.boxCenter}  h-[8.313rem] flex-col gap-4 px-3 grow`}
          >
            <p
              className={cn('text-color-text-primary text-center', {
                'text-m_default sm:text-[14px] font-light': userId,
                'text-[10px] sm:text-[12px]': !userId,
              })}
            >
              {userId ? t('wagerContest:timeRemaining') : t('wagerContest:timeRemainingBeforeLogin')}
            </p>
            {userId ? (
              <>
                {new Date(timeCoundown).getTime() - new Date().getTime() > 0 && (
                  <div className="flex gap-[2px] sm:gap-2">
                    <Countdown
                      date={timeCoundown}
                      renderer={({ days, hours, minutes, seconds, completed }) => (
                        <>
                          <div
                            className={cn(
                              'p-1 w-[36px] h-[36px] md:w-[40px] md:h-[40px] lg:w-[54px] lg:h-[54px]',
                              'dark:bg-color-card-bg-primary dark:border-0 bg-white border border-solid border-[#d3d3d366] rounded-[8px]',
                              styles.boxTime,
                            )}
                          >
                            <p className="font-bold text-[16px] sm:text-[18px] lg:text-[22px] 2xl:text-[24px] dark:text-white text-[#000]">
                              {Number(hours)}
                            </p>
                            <p className="text-color-text-primary text-[8px] 2xl:text-[10px]">
                              {t('wagerContest:hours')}
                            </p>
                          </div>
                          <div
                            className={cn(
                              'p-1 w-[36px] h-[36px] md:w-[40px] md:h-[40px] lg:w-[54px] lg:h-[54px]',
                              'dark:bg-color-card-bg-primary dark:border-0 bg-white border border-solid border-[#d3d3d366] rounded-[8px]',
                              styles.boxTime,
                            )}
                          >
                            <p className="font-bold text-[16px] sm:text-[18px] lg:text-[22px] 2xl:text-[24px] dark:text-white text-[#000]">
                              {Number(minutes)}
                            </p>
                            <p className="text-color-text-primary text-[8px] 2xl:text-[10px]">
                              {t('wagerContest:minute')}
                            </p>
                          </div>
                          <div
                            className={cn(
                              'p-1 w-[36px] h-[36px] md:w-[40px] md:h-[40px] lg:w-[54px] lg:h-[54px]',
                              'dark:bg-color-card-bg-primary dark:border-0 bg-white border border-solid border-[#d3d3d366] rounded-[8px]',
                              styles.boxTime,
                            )}
                          >
                            <p className="font-bold text-[16px] sm:text-[18px] lg:text-[22px] 2xl:text-[24px] dark:text-white text-[#000]">
                              {Number(seconds)}
                            </p>
                            <p className="text-color-text-primary text-[8px] 2xl:text-[10px]">
                              {t('wagerContest:second')}
                            </p>
                          </div>
                        </>
                      )}
                    />
                  </div>
                )}
                {new Date(timeCoundown).getTime() - new Date().getTime() < 0 && (
                  <div className="flex gap-2 text-color-primary font-bold text-[16px]">
                    <p>{t('wagerContest:nextWagerComingSoon')}</p>
                  </div>
                )}
              </>
            ) : (
              <div
                className="bg-[#F61B4F] h-[24px] sm:h-[36px] hover:opacity-90 cursor-pointer max-w-[280px] rounded-[4px] text-white font-bold text-[11px] sm:text-[14px] w-full flex items-center justify-center"
                onClick={() => {
                  dispatch(changeIsShowDailyContest(false));
                  dispatch(changeAuthenticationType(AuthenticationModeEnum.SIGN_IN));
                  dispatch(changeIsShowAuthenticationModal(true));
                }}
              >
                {t('wagerContest:participateNow')}
              </div>
            )}
          </div>
          <div
            className={`col-span-6 sm:w-auto rounded-[5px] relative ${styles.boxCenter} h-[8.313rem] flex-col gap-4 grow`}
          >
            <Image
              width={48}
              height={48}
              className="object-cover h-[3rem] w-[3rem] absolute left-0 top-0 rounded-full"
              src="/img/icon/winner.png"
              alt="medal winner"
            />
            <div
              className={`rounded dark:bg-color-card-bg-secondary border border-solid border-color-card-border-primary h-full w-full ${styles.boxCenter} px-3`}
            >
              <div className="flex flex-col items-center w-full">
                <div className="flex items-center gap-2 mb-[14px] w-full justify-center">
                  <Image
                    width={16}
                    height={13}
                    className="object-cover h-[13px] w-[16px]"
                    src="/img/icon/crown.png"
                    alt="medal crown"
                  />
                  <span className="text-[12px] text-color-text-primary leading-[18px]">
                    {t('wagerContest:lastChampion')}
                  </span>
                </div>
                <div className="flex items-center justify-center w-full gap-2 sm:gap-5">
                  <div className="relative border-2 border-solid rounded-full border-color-secondary">
                    <Image
                      width={16}
                      height={13}
                      className="absolute -top-[13px] -translate-x-2/4 left-1/2 object-cover h-[13px] w-[16px]"
                      src="/img/icon/crown.png"
                      alt="medal crown"
                    />
                    {wagerHistory.playerId !== userId && !wagerHistory.playerName ? (
                      <Image
                        width={46}
                        height={59}
                        className="max-w-[30px] max-h-[30px] rounded-full grayscale brightness-50"
                        src="/img/avatar-hidden.png"
                        alt="avatar hidden"
                      />
                    ) : (
                      <Image
                        width={46}
                        height={59}
                        className="max-w-[40px] max-h-[40px] object-cover rounded-full"
                        src={
                          wagerHistory.playerAvatar ? `${API_AVATAR}/${wagerHistory.playerAvatar}` : '/img/avatar-1.png'
                        }
                        alt="avatar"
                        onError={(e) => {
                          e.currentTarget.src = '/img/avatar-1.png';
                        }}
                      />
                    )}
                  </div>
                  <div className="">
                    <p
                      className={cn('dark:text-white text-[#000] text-m_default sm:text-default', {
                        'pointer-events-none': wagerHistory.playerId !== userId && !wagerHistory.playerName,
                        'hover:underline cursor-pointer': !(
                          wagerHistory.playerId !== userId && !wagerHistory.playerName
                        ),
                      })}
                      onClick={() => handleModalUserProfile(wagerHistory)}
                    >
                      {wagerHistory.playerId !== userId && !wagerHistory.playerName
                        ? t('homePage:hidden')
                        : wagerHistory.playerId === userId
                          ? userName
                          : wagerHistory.playerName}
                    </p>
                    <div className="flex flex-col sm:flex-row text-[12px] leading-[18px] text-color-text-primary mt-3 gap-2">
                      <div>
                        <span>{t('wagerContest:profit')}</span>
                        <span className="dark:text-white text-[#000]">{`(${wagerHistory.percentage}%)`}</span>
                      </div>
                      <div className="flex justify-start items-center gap-[2px]">
                        <span className="text-color-text-green ml-1 font-bold text-[11px] sm:text-m_default">
                          {viewInFiat
                            ? currencyFormat1(wagerHistory.prizeAmountUsd * exchangeRate, 4, localFiat?.name)
                            : currencyFormat1(wagerHistory.prizeAmountUsd / usdtPrice, 4, '', false)}
                        </span>
                        <Image
                          width={16}
                          height={16}
                          className="object-cover w-[1rem] h-[1rem]"
                          src={`/img/fiats/USDT.png`}
                          onError={(e) => {
                            e.currentTarget.src = '/img/fiats/USDT.png';
                          }}
                          alt="currency-usdt"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <QuestionMarkCircleIcon
                  width={24}
                  className="text-color-primary cursor-pointer object-cover h-[18px] sm:h-[24px] mt-3 w-[18px] sm:w-[24px] absolute top-0 right-[8px] sm:right-[16px]"
                  role="button"
                  data-tooltip-id={'fee-tooltip'}
                  onClick={() => dispatch(changeIsShowWagerRules(true))}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      {userId && (
        <div className="flex rounded md:items-center flex-col md:flex-row md:px-4 p-2 md:h-[3.5rem] bg-color-card-bg-secondary border border-solid border-color-card-border-primary gap-y-4 text-color-text-primary text-[0.625rem]">
          <div
            className={`flex ${styles.boxBorder} bg-transparent gap-3 w-full md:w-auto grow-[3] border-r items-center dark:border-color-border-primary border-color-light-border-primary`}
          >
            <Image
              width={28}
              height={28}
              className="object-cover h-[1.75rem] w-[1.75rem] rounded-full"
              src={avatar ? `${API_AVATAR}/${avatar}` : '/img/avatar-1.png'}
              alt="avatar"
              onError={(e) => {
                e.currentTarget.src = '/img/avatar-1.png';
              }}
            />
            <span className="text-[12px] sm:text-[14px] dark:text-[#fff] text-[#000] font-bold">{userName}</span>
          </div>
          <div
            className={`grow-[8] flex max-md:mx-auto max-md:gap-[8.5rem] pb-3 md:p-0 border-b md:border-b-0 border-solid dark:border-color-border-primary border-color-light-border-primary ${styles.boxBorderCenter}`}
          >
            <div className={`grow ${styles.boxBorder}`}>
              <p>{t('wagerContest:myPosition')}</p>
              <p className="text-color-secondary text-[12px] sm:text-[14px] font-bold">
                {getRank(positionData.position)}
              </p>
            </div>
            <div className={`grow ${styles.boxBorder}`}>
              <p>{t('wagerContest:wagered')}</p>
              <p className="text-color-secondary text-[12px] sm:text-[14px] font-bold">
                {viewInFiat
                  ? currencyFormat1(positionData.wageredAmountUsd * exchangeRate, 4, localFiat?.name)
                  : currencyFormat1(positionData.wageredAmountUsd, 4)}
              </p>
            </div>
          </div>
          <div
            className={cn(
              'grow-[2] flex gap-[0.313rem] min-w-fit justify-center md:justify-start items-center text-[12px]',
              {
                'text-color-secondary': wagerAndPostion.position === '1',
              },
            )}
          >
            {positionData.position === 1 ? (
              t('wagerContest:youAreTop')
            ) : (
              <>
                <span className="dark:text-color-text-primary text-color-light-text-primary">
                  {t('wagerContest:wager')}
                </span>
                <span className="text-white">
                  {viewInFiat
                    ? currencyFormat1(
                      (wagerAndPostion.wagerAmount - positionData.wageredAmountUsd) * exchangeRate,
                      4,
                      localFiat?.name,
                    )
                    : currencyFormat1(wagerAndPostion.wagerAmount - positionData.wageredAmountUsd, 4)}
                </span>
                <span className="dark:text-color-text-primary text-color-light-text-primary">
                  {t('wagerContest:toReach')}
                </span>
                <span className="bg-color-secondary/20 text-color-secondary text-[10px] rounded-[2px] p-[5px]">
                  {`Top ${wagerAndPostion.position}`}
                </span>
              </>
            )}
          </div>
        </div>
      )}
      <div className="text-[0.813rem] my-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <p className="dark:text-[#fff] text-[#000]">{t('wagerContest:active')}</p>
          <p className="dark:text-color-text-primary text-color-light-text-primary">
            {formatDate(new Date(wagerContestData.startTime), 'LL/dd/yyyy')} ~{' '}
            {formatDate(new Date(wagerContestData.endTime), 'LL/dd/yyyy')}
          </p>
        </div>
        <div
          className="flex items-center gap-2 dark:bg-color-card-bg-secondary cursor-pointer bg-color-light-bg-primary dark:text-white text-black text-[11px] sm:text-[13px] font-normal px-[10px] py-[6px] rounded-[5px]"
          onClick={() => {
            dispatch(changeIsShowDailyContest(false));
            dispatch(changeIsShowWagerContestHistory(true));
          }}
        >
          {t('wagerContest:history')}
          <ArrowRight2 size={12} />
        </div>
      </div>
      <div>
        <RankingTableComponent
          containerClassName="w-full"
          isLoading={isLoadingTable}
          data={wagerContestData.contesters}
          columns={WagerContestColumns}
        />
      </div>
    </>
  );
};

export default WagerContestComponent;
