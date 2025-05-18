'use client';

import { DialogProps, TransitionRootProps } from '@headlessui/react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import cn from 'classnames';
import { format } from 'date-fns';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useTheme } from 'next-themes';
import { ElementType, ReactNode, useCallback, useEffect, useState } from 'react';
import Countdown from 'react-countdown';
import { useTranslation } from 'react-i18next';
import ReactLoading from 'react-loading';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { Tooltip } from 'react-tooltip';

import { api_bonusClaim } from '@/api/bonus';
import { api_questHistory, api_questList } from '@/api/spin';
import ProgressBar from '@/base/components/common/circleProgress';
import CsrWrapper from '@/base/components/CsrWrapper';
import { ROUTER, TOAST_ENUM } from '@/base/constants/common';
import { useExchange } from '@/base/hooks/useExchange';
import { useHeight } from '@/base/hooks/useHeight';
import { currencyFormat1, formatDate } from '@/base/libs/utils';
import { getErrorMessage } from '@/base/libs/utils/notificationToast';
import { changeIsShowQuest } from '@/base/redux/reducers/modal.reducer';
import { AppState } from '@/base/redux/store';

import CommonModal from '../commonModal/commonModal';

type ModalQuest = {
  onClose: () => void;
  show: boolean;
} & TransitionRootProps<ElementType> &
  DialogProps<ElementType>;

type CategoryType = 'bigWin' | 'slotsMaster' | 'justWagerOn' | 'weeklyWager';

type QuestItemType = {
  id: string;
  category: CategoryType;
  amount: number;
  amountUsd: number;
  status: boolean;
  statusAmount: number;
  goalAmount: number;
  goalMultiplier?: number;
  claimStatus: boolean;
};

type QuestItemProps = {
  bonusId: string;
  category: string;
  header: ReactNode;
  description: string;
  status: boolean;
  extra: ReactNode;
  earn: number;
  percent: number;
  isBigWin?: boolean;
  isExpired?: boolean;
  claimStatus: boolean;
  currentAmount: number;
  goalAmount: number;
};

type QuestDataType = {
  currentTime: string | number;
  startTime: string | number;
  endTime: string | number;
  data: QuestItemType[];
};

const QuestItem = ({
  bonusId,
  category,
  header,
  description,
  status,
  extra,
  earn,
  percent,
  isBigWin = false,
  isExpired = false,
  claimStatus,
  currentAmount,
  goalAmount,
}: QuestItemProps) => {
  const { t } = useTranslation();
  const router = useRouter();
  const dispatch = useDispatch();
  const [isClaiming, setIsClaiming] = useState<boolean>(false);

  const onClickClaim = async () => {
    if (claimStatus) return;
    try {
      setIsClaiming(true);
      const bonusType = 'quest';
      await api_bonusClaim(bonusId, bonusType);

      toast.success(t('success:bonusClaimed'), { containerId: TOAST_ENUM.COMMON });
    } catch (error: any) {
      const errType = error.response?.data?.message ?? '';
      const errMessage = getErrorMessage(errType);
      toast.error(t(errMessage), { containerId: TOAST_ENUM.COMMON });
    } finally {
      setIsClaiming(false);
    }
  };
  return (
    <>
      <div className="flex p-[15px] justify-between bg-color-active-primary rounded-default w-full items-center gap-2">
        <div className="flex items-center gap-[15px]">
          <div className="flex items-center h-[70px] w-[70px]">
            {isBigWin &&
              (status ? (
                <Image width={124} height={124} src={'/img/big-wins-done.png'} alt="big win" />
              ) : (
                <Image width={124} height={124} src={'/img/big-wins.png'} alt="big win" />
              ))}
            {!isBigWin && <ProgressBar goalAmount={goalAmount} currentAmount={currentAmount} status={status} />}
          </div>
          <div className="flex flex-col gap-[5px] text-m_default sm:text-[16px]">
            {header}
            <p className="dark:text-color-text-primary text-color-light-text-primary text-[12px]">{description}</p>
            <div className="flex gap-[5px] items-center">
              <Image width={50} height={50} className="w-[16px] h-[16px]" src="/img/fiats/USDT.png" alt="currency-usdt" />
              <p className="text-color-secondary font-bold text-m_default sm:text-[16px] italic">{`Earn ${currencyFormat1(earn, 8, '', false)} USDT`}</p>
            </div>
          </div>
        </div>
        {!isExpired && !isBigWin && !status && (
          <div
            className={cn(
              'rounded-large px-4 sm:px-6 text-m_default sm:text-[16px] bg-gradient-btn-play shadow-bs-btn',
              'h-[42px] min-w-[64px] sm:min-w-[90px] flex justify-center items-center hover:cursor-pointer hover:opacity-90',
            )}
            onClick={() => {
              dispatch(changeIsShowQuest(false));
              if (category === 'justWagerOn') router.push(ROUTER.Casino);
              else if (category === 'slotsMaster') router.push(ROUTER.Tagname('slots'));
            }}
          >
            {t('quest:go')}
          </div>
        )}
        {!isExpired && status && (
          <div
            className={cn(
              'rounded-large px-4 sm:px-6 text-m_default sm:text-[16px] bg-gradient-btn-play shadow-bs-btn',
              'h-[42px] min-w-[64px] sm:min-w-[90px] flex justify-center items-center',
              { 'hover:cursor-pointer hover:opacity-90': !claimStatus, 'opacity-50': claimStatus },
            )}
            onClick={onClickClaim}
          >
            {isClaiming ? (
              <ReactLoading type="bubbles" color="#FFF" delay={50} className="!w-6 !h-6" />
            ) : claimStatus ? (
              t('quest:claimed')
            ) : (
              t('bonus:claim')
            )}
          </div>
        )}
        {isExpired && (
          <div className="text-m_default sm:text-[16px] font-bold flex items-center text-color-text-primary">
            {t('quest:expired')}
          </div>
        )}
        {extra}
      </div>
    </>
  );
};

const getNextDay = () => {
  let currentDate = new Date();
  return currentDate.setDate(currentDate.getDate() + 1);
};

const getCategoryType = (reqCategory: string) => {
  let category: CategoryType = 'justWagerOn';
  switch (reqCategory) {
    case 'Big_Win':
      category = 'bigWin';
      break;
    case 'Slots_Master':
      category = 'slotsMaster';
      break;
    case 'Just_Wager_On':
      category = 'justWagerOn';
      break;
    case 'Wager_Week':
      category = 'weeklyWager';
      break;

    default:
      category = 'justWagerOn';
      break;
  }
  return category;
};

const getTopicByCategory = (category: CategoryType) => {
  let title = '';
  switch (category) {
    case 'bigWin':
      title = 'Big Win';
      break;
    case 'justWagerOn':
      title = 'Just Wager On';
      break;
    case 'slotsMaster':
      title = 'Slots Master';
      break;

    default:
      title = 'Just Wager On';
      break;
  }
  return title;
};

const getContentByCategory = (category: CategoryType) => {
  let content = 'quest:justWager';
  switch (category) {
    case 'bigWin':
      content = 'quest:bigWin';
      break;
    case 'justWagerOn':
      content = 'quest:justWager';
      break;
    case 'slotsMaster':
      content = 'quest:slotMaster';
      break;
    case 'weeklyWager':
      content = 'quest:weeklyWager';
      break;
    default:
      content = 'quest:justWager';
      break;
  }
  return content;
};

const initQuestData: QuestDataType = {
  currentTime: formatDate(formatDate(new Date(), 'LL/dd/yyyy')),
  startTime: formatDate(formatDate(new Date(), 'LL/dd/yyyy')),
  endTime: formatDate(getNextDay(), 'LL/dd/yyyy'),
  data: [],
};

export default function ModalQuest({ show, onClose }: ModalQuest) {
  const exchangeRate = useExchange();
  const { t, i18n } = useTranslation();
  const height = useHeight();
  const [isHistory, setIsHistory] = useState(false);

  const { theme } = useTheme();
  const { isLogin, viewInFiat, localFiat } = useSelector(
    (state: AppState) => ({
      isLogin: state.auth.isLogin,
      viewInFiat: state.auth.user.generalSetting.settingViewInFiat,
      localFiat: state.wallet.localFiat,
    }),
    shallowEqual,
  );

  const [selectedType, setSelectedType] = useState('daily');

  const [accumulated, setAccumulated] = useState(0);
  const [dailyQuest, setDailyQuest] = useState<QuestDataType>({
    ...initQuestData,
  });

  const [weeklyQuest, setWeeklyQuest] = useState<QuestDataType>({
    ...initQuestData,
  });

  const [prevQuest, setPrevQuest] = useState<{
    startTime: string | number;
    endTime: string | number;
    unClaimed: { daily: QuestItemType[]; weekly: QuestItemType[] };
    unFinished: { daily: QuestItemType[]; weekly: QuestItemType[] };
    claimed: { daily: QuestItemType[]; weekly: QuestItemType[] };
  }>({
    startTime: formatDate(formatDate(new Date(), 'LL/dd/yyyy')),
    endTime: formatDate(getNextDay(), 'LL/dd/yyyy'),
    unClaimed: { daily: [], weekly: [] },
    unFinished: { daily: [], weekly: [] },
    claimed: { daily: [], weekly: [] },
  });

  const getQuestList = useCallback(async () => {
    try {
      const _res = await api_questList();
      const { accumulatedRewards, daily, weekly } = _res.data;
      // daily Quest
      const dailyQuestStartTime = daily?.startTime * 1000;
      const dailyQuestEndTime = daily?.endTime * 1000;
      const dailyQuestCurrentTime = daily?.currentTime * 1000;
      const tempDailyQuest: QuestItemType[] = daily?.quests?.map((item: any) => ({
        id: item?.id || '',
        category: getCategoryType(item?.category || ''),
        amount: Number(item?.amount || 0),
        amountUsd: Number(item?.amountUsd || 0),
        status: item?.status,
        statusAmount: Number(item?.statusAmount || 0),
        goalMultiplier: Number(item?.goalMultiplier || 0),
        goalAmount: Number(item?.goalAmount || 0),
        claimStatus: item?.claimStatus || false,
      }));
      // weekly Quest
      const weeklyQuestStartTime = weekly?.startTime * 1000;
      const weeklyQuestEndTime = weekly?.endTime * 1000;
      const weeklyQuestCurrentTime = daily?.currentTime * 1000;
      const tempWeeklyQuest: QuestItemType[] = weekly?.quests?.map((item: any) => ({
        id: item?.id || '',
        category: getCategoryType(item?.category || ''),
        amount: Number(item?.amount || 0),
        amountUsd: Number(item?.amountUsd || 0),
        status: item?.status,
        statusAmount: Number(item?.statusAmount || 0),
        goalMultiplier: Number(item?.goalMultiplier || 0),
        goalAmount: Number(item?.goalAmount || 0),
        claimStatus: item?.claimStatus || false,
      }));
      setAccumulated(accumulatedRewards);

      setDailyQuest({
        currentTime: dailyQuestCurrentTime,
        startTime: dailyQuestStartTime,
        endTime: dailyQuestEndTime,
        data: tempDailyQuest,
      });
      setWeeklyQuest({
        currentTime: weeklyQuestCurrentTime,
        startTime: weeklyQuestStartTime,
        endTime: weeklyQuestEndTime,
        data: tempWeeklyQuest,
      });
    } catch (error) {
      console.log(error);
      setAccumulated(0);

      setDailyQuest({
        currentTime: new Date().getTime(),
        startTime: new Date().getTime(),
        endTime: new Date().getTime(),
        data: [],
      });
      setWeeklyQuest({
        currentTime: new Date().getTime(),
        startTime: new Date().getTime(),
        endTime: new Date().getTime(),
        data: [],
      });
    }
  }, []);

  const getQuestHistory = async () => {
    try {
      const _res = await api_questHistory();
      const { startTime, endTime, unClaimed, unFinished, claimed } = _res.data;
      const tempUnClaimedDaily: QuestItemType[] =
        unClaimed?.daily?.map((item: any) => ({
          id: '',
          category: getCategoryType(item?.category || ''),
          amount: Number(item?.amount || 0),
          amountUsd: Number(item?.amountUsd || 0),
          status: item?.status,
          statusAmount: Number(item?.statusAmount || 0),
          goalMultiplier: Number(item?.goalMultiplier || 0),
          goalAmount: Number(item?.goalAmount || 0),
          claimStatus: false,
        })) || [];

      const tempUnClaimedWeekly: QuestItemType[] =
        unClaimed?.weekly?.map((item: any) => ({
          id: '',
          claimStatus: false,
          category: getCategoryType(item?.category || ''),
          amount: Number(item?.amount || 0),
          amountUsd: Number(item?.amountUsd || 0),
          status: item?.status,
          statusAmount: Number(item?.statusAmount || 0),
          goalMultiplier: Number(item?.goalMultiplier || 0),
          goalAmount: Number(item?.goalAmount || 0),
        })) || [];
      const tempUnFinishedDaily: QuestItemType[] =
        unFinished?.daily?.map((item: any) => ({
          id: '',
          claimStatus: false,
          category: getCategoryType(item?.category || ''),
          amount: Number(item?.amount || 0),
          amountUsd: Number(item?.amountUsd || 0),
          status: item?.status,
          statusAmount: Number(item?.statusAmount || 0),
          goalMultiplier: Number(item?.goalMultiplier || 0),
          goalAmount: Number(item?.goalAmount || 0),
        })) || [];

      const tempUnFinishedWeekly: QuestItemType[] =
        unFinished?.weekly?.map((item: any) => ({
          id: '',
          claimStatus: false,
          category: getCategoryType(item?.category || ''),
          amount: Number(item?.amount || 0),
          amountUsd: Number(item?.amountUsd || 0),
          status: item?.status,
          statusAmount: Number(item?.statusAmount || 0),
          goalMultiplier: Number(item?.goalMultiplier || 0),
          goalAmount: Number(item?.goalAmount || 0),
        })) || [];

      const tempClaimedDaily: QuestItemType[] =
        claimed?.daily?.map((item: any) => ({
          id: '',
          claimStatus: false,
          category: getCategoryType(item?.category || ''),
          amount: Number(item?.amount || 0),
          amountUsd: Number(item?.amountUsd || 0),
          status: item?.status,
          statusAmount: Number(item?.statusAmount || 0),
          goalMultiplier: Number(item?.goalMultiplier || 0),
          goalAmount: Number(item?.goalAmount || 0),
        })) || [];

      const tempClaimedWeekly: QuestItemType[] =
        claimed?.weekly?.map((item: any) => ({
          id: '',
          claimStatus: false,
          category: getCategoryType(item?.category || ''),
          amount: Number(item?.amount || 0),
          amountUsd: Number(item?.amountUsd || 0),
          status: item?.status,
          statusAmount: Number(item?.statusAmount || 0),
          goalMultiplier: Number(item?.goalMultiplier || 0),
          goalAmount: Number(item?.goalAmount || 0),
        })) || [];

      setPrevQuest({
        startTime: startTime * 1000,
        endTime: endTime * 1000,
        unClaimed: {
          daily: tempUnClaimedDaily,
          weekly: tempUnClaimedWeekly,
        },
        unFinished: {
          daily: tempUnFinishedDaily,
          weekly: tempUnFinishedWeekly,
        },
        claimed: {
          daily: tempClaimedDaily,
          weekly: tempClaimedWeekly,
        },
      });
    } catch (error) {
      console.log(error);
      setPrevQuest({
        startTime: new Date().getTime(),
        endTime: new Date().getTime(),
        unClaimed: {
          daily: [],
          weekly: [],
        },
        unFinished: {
          daily: [],
          weekly: [],
        },
        claimed: {
          daily: [],
          weekly: [],
        },
      });
    }
  };

  const returnBody = useCallback(
    (data: QuestItemType[], type: boolean = false) => {
      return (
        <>
          {data.map((item) => (
            <QuestItem
              category={item.category}
              header={
                <div className="flex text-default sm:text-[16px] font-bold">{getTopicByCategory(item.category)}</div>
              }
              description={String(
                t(getContentByCategory(item.category), {
                  amount: viewInFiat
                    ? currencyFormat1(item.goalAmount * exchangeRate, 2, localFiat?.name)
                    : currencyFormat1(item.goalAmount, 2, localFiat?.name),
                  multi: item.goalMultiplier,
                }),
              )}
              bonusId={item.id}
              extra={<></>}
              goalAmount={item.goalAmount}
              currentAmount={item.statusAmount}
              percent={(item.statusAmount / item.goalAmount) * 100}
              isBigWin={item.category === 'bigWin'}
              status={item.status}
              earn={
                item.amount
                // viewInFiat
                //   ? currencyFormat1(item.amountUsd * exchangeRate, 2, localFiat?.name)
                //   : currencyFormat1(item.amount, 2, '', false)
              }
              isExpired={type}
              claimStatus={item.claimStatus}
            />
          ))}
        </>
      );
    },
    [i18n.language, localFiat, exchangeRate],
  );

  useEffect(() => {
    if (isLogin && show) {
      getQuestList();
    }
  }, [isLogin, show]);

  return (
    <>
      <CommonModal
        show={show}
        panelClass={cn(`max-w-full sm:max-w-[600px]`, {
          'sm:!h-[90vh]': height <= 768,
          'sm:!h-[80vh]': height > 768,
        })}
        onClose={onClose}
        header={
          <>
            <div className="flex flex-col items-start dark:bg-color-header-primary bg-color-light-bg-primary px-[20px] py-[20px] gap-[20px]">
              <div className="text-black dark:text-white md:text-[18px] text-[16px] sm:mb-0 mb-[10px] font-bold">
                {t('quest:questHub')}
              </div>
            </div>
          </>
        }
      >
        <div className="flex flex-col px-5 pt-1 items-center gap-[10px] overflow-y-auto relative">
          <div className="flex justify-start w-full pt-4 font-bold text-color-primary text-default">
            {format(new Date(), 'eeee')}
          </div>
          <div className="flex justify-between w-full">
            <div className="flex flex-col gap-[10px] text-white w-full">
              <div className="flex justify-between w-full text-default">
                <div>
                  <span>{t('quest:accumulateRewards')}</span>
                  <div className="flex gap-[10px] items-center">
                    <Image width={50} height={50} className="w-[25px] h-[25px]" src={'/img/fiats/USDT.png'} alt="currency-usdt" />
                    <span className="text-[20px] font-bold italic">{`${currencyFormat1(accumulated, 8, '', false)} USDT`}</span>
                  </div>
                </div>
                <div
                  className="flex items-center bg-color-bg-primary px-[15px] py-[5px] rounded-default gap-[5px] max-h-[35px]"
                  role="button"
                  onClick={() => {
                    getQuestHistory();
                    setIsHistory(true);
                  }}
                >
                  {t('mycasino:history')}
                  <ChevronRightIcon width={16} role="button" />
                </div>
              </div>
            </div>
          </div>
          <div className="relative grid grid-cols-2 w-full max-h-[45px]">
            <div
              className={cn(
                'flex-1 flex items-center hover:opacity-[0.9] justify-center border-b-2 border-solid pb-[10px] text-default',
                { 'bg-gradient-to-t from-color-primary/20 border-color-primary': selectedType === 'daily' },
                { 'dark:border-[#272C33] border-[#ccc]': selectedType !== 'daily' },
              )}
              onClick={() => setSelectedType('daily')}
              role="button"
            >
              {t('quest:dailyQuest')}
            </div>
            <div
              className={cn(
                'flex-1 flex items-center hover:opacity-[0.9] justify-center border-b-2 border-solid pb-[10px] text-default',
                { 'bg-gradient-to-t from-color-primary/20 border-color-primary': selectedType === 'weekly' },
                { 'dark:border-[#272C33] border-[#ccc]': selectedType !== 'weekly' },
              )}
              onClick={() => setSelectedType('weekly')}
              role="button"
            >
              {t('quest:weeklyQuest')}
            </div>
          </div>

          <div className="flex flex-col w-full gap-[10px]">
            <div className="flex items-center gap-[10px] text-color-text-primary">
              <div>{t('quest:expiredIn')}</div>
              <CsrWrapper>
                <Countdown
                  date={
                    selectedType === 'daily'
                      ? new Date(Number(dailyQuest.endTime))
                      : new Date(Number(weeklyQuest.endTime))
                  }
                  renderer={({ days, hours, minutes, seconds }) => (
                    <div className="text-white">
                      {selectedType === 'daily'
                        ? formatDate(new Date(0, 0, 0, hours, minutes, seconds), 'HH : mm : ss')
                        : `${days} Days ` + formatDate(new Date(0, 0, 0, hours, minutes, seconds), 'HH : mm : ss')}
                    </div>
                  )}
                />
              </CsrWrapper>
            </div>
            {returnBody(selectedType === 'daily' ? dailyQuest.data : weeklyQuest.data)}
          </div>
        </div>
      </CommonModal>

      <CommonModal
        show={isHistory}
        onClose={() => setIsHistory(false)}
        panelClass={`max-w-full sm:max-w-[600px] sm:!h-[${height < 768 ? 90 : 80}vh]`}
        header={
          <div className="relative p-[20px] bg-[#f5f6fa] dark:bg-color-header-primary">
            <div className="flex items-center dark:text-white text-black gap-[10px] justify-between pr-[40px]">
              <div className="flex items-center gap-[10px]" role="button" onClick={() => setIsHistory(false)}>
                <ChevronLeftIcon width={20} role="button" />
                <div className="text-[18px] font-[600]">{t('mycasino:history')}</div>
              </div>

              <div className="flex items-center text-color-text-primary text-default">
                {formatDate(new Date(prevQuest.startTime), 'LL/dd/yyyy')}-
                {formatDate(new Date(prevQuest.endTime), 'LL/dd/yyyy')}
              </div>
            </div>
          </div>
        }
      >
        <div className="!h-full sm:h-[720px] flex flex-col px-5 py-5 items-center gap-8 overflow-y-auto">
          {prevQuest.unClaimed.daily.length === 0 &&
            prevQuest.unFinished.daily.length === 0 &&
            prevQuest.claimed.daily.length === 0 ? (
            <div className="h-full flex flex-col justify-center min-h-[150px] text-color-text-primary text-default w-full items-center pb-16">
              <CsrWrapper>
                <Image
                  src={theme === 'dark' ? '/img/empty-dark.png' : '/img/empty-light.png'}
                  alt="noData"
                  width={150}
                  height={150}
                />
              </CsrWrapper>

              {t('table:noData')}
            </div>
          ) : (
            <>
              <div className="flex flex-col items-center w-full gap-[5px]">
                <div className="flex flex-row justify-between w-full">
                  <div className="flex text-white text-default sm:text-[16px]">{t('quest:unClaimedQuest')}</div>
                  {prevQuest.unClaimed.daily.length > 0 && (
                    <div className="flex items-center justify-start gap-1 text-gray-400 text-default">
                      {t('quest:expiredIn')}
                      <CsrWrapper>
                        <Countdown
                          date={new Date(Number(weeklyQuest.endTime))}
                          renderer={({ days, hours, minutes, seconds }) => (
                            <div className="text-center text-white text-default">
                              {`${days} Days ` + formatDate(new Date(0, 0, 0, hours, minutes, seconds), 'HH:mm:ss')}
                            </div>
                          )}
                        />
                      </CsrWrapper>
                    </div>
                  )}
                </div>
                {prevQuest.unClaimed.daily.length === 0 && prevQuest.unClaimed.weekly.length === 0 && (
                  <div className="flex flex-col min-h-[150px] text-color-text-primary text-default w-full items-center">
                    <CsrWrapper>
                      <Image
                        src={theme === 'dark' ? '/img/empty-dark.png' : '/img/empty-light.png'}
                        alt="noData"
                        width={150}
                        height={150}
                      />
                    </CsrWrapper>

                    {t('table:noData')}
                  </div>
                )}
                {(prevQuest.unClaimed.daily.length !== 0 || prevQuest.unClaimed.weekly.length !== 0) && (
                  <>
                    <div className="flex w-full text-color-text-primary text-[12px]"> {t('quest:dailyQuest')}</div>
                    {returnBody(prevQuest.unClaimed.daily, true)}
                    <div className="flex w-full text-color-text-primary text-[12px]"> {t('quest:weeklyQuest')}</div>
                    {returnBody(prevQuest.unClaimed.weekly, true)}
                  </>
                )}
              </div>
              <div className="flex flex-col items-center w-full gap-[5px]">
                <div className="flex justify-between w-full">
                  <div className="flex text-white text-default sm:text-[16px]">{t('quest:unFinishedQuest')}</div>
                  <div className="flex items-center justify-end gap-1 text-right text-gray-400 text-m_default">
                    {t('quest:onlyLatestWeek')}
                    <Image
                      src={'/img/icon/icon-question-light.png'}
                      width={16}
                      height={16}
                      alt="question"
                      className="w-4 h-4"
                      data-tooltip-id={`unfinished-quest-tooltip`}
                    />
                    <Tooltip
                      id={`unfinished-quest-tooltip`}
                      place="bottom"
                      className="dark:bg-black/0 bg-white z-[30]"
                      offset={2}
                      opacity={100}
                    >
                      <div className="text-left text-m_default sm:text-[13px] max-w-[300px] bg-color-card-bg-primary p-4 rounded-large">
                        {t('quest:onlyLatestWeekDescription')}
                      </div>
                    </Tooltip>
                  </div>
                </div>
                {prevQuest.unFinished.daily.length === 0 && prevQuest.unFinished.weekly.length === 0 && (
                  <div className="flex flex-col min-h-[150px] text-color-text-primary text-default w-full items-center">
                    <CsrWrapper>
                      <Image
                        src={theme === 'dark' ? '/img/empty-dark.png' : '/img/empty-light.png'}
                        alt="noData"
                        width={150}
                        height={150}
                      />
                    </CsrWrapper>

                    {t('table:noData')}
                  </div>
                )}
                {(prevQuest.unFinished.daily.length !== 0 || prevQuest.unFinished.weekly.length !== 0) && (
                  <>
                    <div className="flex w-full text-color-text-primary text-[12px]"> {t('quest:dailyQuest')}</div>
                    {returnBody(prevQuest.unFinished.daily, true)}
                    <div className="flex w-full text-color-text-primary text-[12px]"> {t('quest:weeklyQuest')}</div>
                    {returnBody(prevQuest.unFinished.weekly, true)}
                  </>
                )}
              </div>
              <div className="flex flex-col items-center w-full gap-[5px]">
                <div className="flex text-white text-default sm:text-[16px] w-full">{t('quest:claimed')}</div>

                {prevQuest.claimed.daily.length === 0 && prevQuest.claimed.weekly.length === 0 && (
                  <div className="flex flex-col min-h-[150px] text-color-text-primary text-default w-full items-center">
                    <CsrWrapper>
                      <Image
                        src={theme === 'dark' ? '/img/empty-dark.png' : '/img/empty-light.png'}
                        alt="noData"
                        width={150}
                        height={150}
                      />
                    </CsrWrapper>

                    {t('table:noData')}
                  </div>
                )}
                {(prevQuest.claimed.daily.length !== 0 || prevQuest.claimed.weekly.length !== 0) && (
                  <>
                    <div className="flex w-full text-color-text-primary text-[12px]"> {t('quest:dailyQuest')}</div>
                    {returnBody(prevQuest.claimed.daily, true)}
                    <div className="flex w-full text-color-text-primary text-[12px]"> {t('quest:weeklyQuest')}</div>
                    {returnBody(prevQuest.claimed.weekly, true)}
                  </>
                )}
              </div>
            </>
          )}
        </div>
      </CommonModal>
    </>
  );
}
