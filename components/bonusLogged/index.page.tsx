import cn from 'classnames';
import { Timer1 } from 'iconsax-react';
import Image from 'next/image';
import { useTheme } from 'next-themes';
import React, { ReactElement, useEffect, useMemo, useState } from 'react';
import Countdown from 'react-countdown';
import ReactLoading from 'react-loading';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { Tooltip } from 'react-tooltip';

import { api_bonusStatistics, api_redeem } from '@/api/bonus';
import { api_getClaims } from '@/api/wallet';
import CsrWrapper from '@/base/components/CsrWrapper';
import { useTranslation } from '@/base/config/i18next';
import { TIME_SUBMIT_FORMAT_WITH_SLASH_MARKER, TOAST_ENUM } from '@/base/constants/common';
import { useExchange } from '@/base/hooks/useExchange';
import { currencyFormat1, formatDate } from '@/base/libs/utils';
import { getErrorMessage } from '@/base/libs/utils/notificationToast';
import {
  changeIsShowBonusDetail,
  changeIsShowQuest,
  changeIsShowRakeBack,
  changeIsShowSpin,
  changeIsShowVipClubModal,
} from '@/base/redux/reducers/modal.reducer';
import { getBonusList } from '@/base/redux/reducers/wallet.reducer';
import { AppState, useAppDispatch } from '@/base/redux/store';
import BaseLayout from '@/components/layouts/base.layout';

import CardGeneralBonus from '../cards/cardGeneralBonus';
import CardVipBonus from '../cards/cardVipBonus';

const getNextDay = () => {
  let currentDate = new Date();
  return currentDate.setDate(currentDate.getDate() + 1);
};

function BonusLoggedPage() {
  const exchangeRate = useExchange();
  const { t, i18n } = useTranslation('');
  const { theme } = useTheme();
  const dispatch = useAppDispatch();

  const [redeemCode, setRedeemCode] = useState<string>('');
  const [isRedeemLoading, setIsRedeemLoading] = useState(false);
  const [totalData, setTotalData] = useState({
    bonusClaimedUsd: 0,
    vipBonusUsd: 0,
    specialBonusUsd: 0,
    generalBonusUsd: 0,
  });
  const [spinLogs, setSpinLogs] = useState<Array<{ type: string; time: string }>>([]);
  const [bonusData, setBonusData] = useState<any>({
    general: {
      depositTime: 0,
      dailyCompleteQuest: 0,
      weeklyCompleteQuest: 0,
      availableSpin: 0,
      wagerAmountForDailySpin: 1600,
      currentWagerAmountForDailySpin: 0,
      levelForSpin: 8,
      dailySpinStartTime: formatDate(formatDate(new Date(), 'LL/dd/yyyy')),
      dailySpinEndTime: formatDate(getNextDay(), 'LL/dd/yyyy'),
      weeklyCashBack: {
        lastBonus: 0,
        currentWagerAmount: 0,
        requiredWagerAmount: 0,
        expireDate: formatDate(getNextDay(), 'LL/dd/yyyy'),
      },
      monthlyCashBack: {
        lastBonus: 0,
        currentWagerAmount: 0,
        requiredWagerAmount: 0,
        expireDate: formatDate(getNextDay(), 'LL/dd/yyyy'),
      },
    },
    vip: {
      levelUp: {
        currentVipXP: 0,
        currentVipName: '',
        nextVipXP: 0,
        bonus: 0,
      },
    },
  });
  const [lockedAmount, setLockedAmount] = useState<number>(0);
  const [isShowSpinLog, setIsShowSpinLog] = useState<boolean>(false);

  const { localFiat, viewInFiat, isLogin, isShowSpinClaim, showChatType } = useSelector(
    (state: AppState) => ({
      localFiat: state.wallet.localFiat,
      viewInFiat: state.auth.user.generalSetting.settingViewInFiat,
      isLogin: state.auth.isLogin,
      isShowSpinClaim: state.modal.isShowSpinClaim,
      showChatType: state.modal.showChatType,
    }),
    shallowEqual,
  );

  const dataGeneralBonus = useMemo(
    () => [
      {
        backgroundDark: '',
        backgroundLight: '',
        name: t('bonus:depositBonus'),
        description: '',
        title: '',
        total: '',
        titleValue: '',
        totalValue: '',
        nameButton: '',
        showDeposit: true,
        tooltip: [t('bonus:depositBonusRulesContent')],
        action: () => { },
      },
      {
        backgroundDark: '/img/bg-rakeback.png',
        backgroundLight: '/img/bg-rakeback-light.png',
        name: t('bonus:BNZRakeback'),
        description: t('bonus:BNZDescription'),
        title: t('bonus:BNZTitle'),
        total: t('bonus:BNZTotal'),
        titleValue: '5.00 USDT',
        totalValue: `${currencyFormat1(lockedAmount, 2, '', false)} USDT`,
        nameButton: t('bonus:unlockRakeBack'),
        showDeposit: false,
        action: () => {
          dispatch(changeIsShowRakeBack(true));
        },
        tooltip: [t('bonus:rakebackTooltip1'), t('bonus:rakebackTooltip2')],
      },
      {
        backgroundDark: '/img/bg-quest.png',
        backgroundLight: '/img/bg-quest-light.png',
        name: t('bonus:quest'),
        description: t('bonus:questDescription'),
        title: t('bonus:questTitle'),
        total: t('bonus:questTotal'),
        titleValue: `${bonusData.general.dailyCompleteQuest}/3`,
        totalValue: `${bonusData.general.weeklyCompleteQuest}/1`,
        nameButton: t('bonus:questButton'),
        showDeposit: false,
        tooltip: [t('bonus:questToolTip')],
        action: () => {
          dispatch(changeIsShowQuest(true));
        },
      },
    ],
    [i18n.language, lockedAmount, bonusData, viewInFiat, localFiat],
  );
  const dataCardVipBonus = useMemo(
    () => [
      {
        backgroundDark: '/img/bg-weekly-cashback.png',
        backgroundLight: '/img/bg-weekly-cashback-light.png',
        name: t('bonus:weekCashback'),
        description: t('bonus:receiveEveryFriday'),
        wagerRequired: t('bonus:wagerRequired'),
        currentTier: '',
        rechargeRate: '',
        readyToClaim: '',
        lastWeeklyBonus: t('bonus:lastWeeklyBonus'),
        wagerValue: viewInFiat
          ? currencyFormat1(
            bonusData.general.weeklyCashBack.requiredWagerAmount * exchangeRate,
            2,
            localFiat?.name || 'USD',
            true,
          )
          : currencyFormat1(bonusData.general.weeklyCashBack.requiredWagerAmount, 2, '', true),
        tierValue: '',
        rechargeRateValue: '',
        readyToClaimValue: '',
        lastWeekBonusValue:
          bonusData.general.weeklyCashBack.lastBonus === 0
            ? '-'
            : viewInFiat
              ? currencyFormat1(
                bonusData.general.weeklyCashBack.lastBonus * exchangeRate,
                2,
                localFiat?.name || 'USD',
                true,
              )
              : currencyFormat1(bonusData.general.weeklyCashBack.lastBonus, 2, '', true),
        showHour: false,
        showDescription: true,
        tooltip: [t('bonus:weeklyCashBackTooltip1'), t('bonus:weeklyCashBackTooltip2')],
        expiration: bonusData.general.weeklyCashBack.expireDate,
        currentWager: viewInFiat
          ? currencyFormat1(
            bonusData.general.weeklyCashBack.currentWagerAmount * exchangeRate,
            2,
            localFiat?.name || 'USD',
          )
          : currencyFormat1(bonusData.general.weeklyCashBack.currentWagerAmount, 2),
      },
      {
        backgroundDark: '/img/bg-weekly-cashback2.png',
        backgroundLight: '/img/bg-weekly-cashback2-light.png',
        name: t('bonus:monthlyCashback'),
        description: t('bonus:weekCashbackDescription'),
        wagerRequired: t('bonus:wagerRequired'),
        currentTier: '',
        rechargeRate: '',
        readyToClaim: '',
        lastWeeklyBonus: t('bonus:lastMonthlyBonus'),
        wagerValue: viewInFiat
          ? currencyFormat1(
            bonusData.general.monthlyCashBack.requiredWagerAmount * exchangeRate,
            2,
            localFiat?.name || 'USD',
            true,
          )
          : currencyFormat1(bonusData.general.monthlyCashBack.requiredWagerAmount, 2, '', true),
        tierValue: '',
        rechargeRateValue: '',
        readyToClaimValue: '',
        lastWeekBonusValue:
          bonusData.general.monthlyCashBack.lastBonus === 0
            ? '-'
            : viewInFiat
              ? currencyFormat1(
                bonusData.general.monthlyCashBack.lastBonus * exchangeRate,
                2,
                localFiat?.name || 'USD',
                true,
              )
              : currencyFormat1(bonusData.general.monthlyCashBack.lastBonus, 2, '', true),
        showHour: false,
        showDescription: true,
        tooltip: [t('bonus:monthlyCashBackTooltip1'), t('bonus:monthlyCashBackTooltip2')],
        expiration: bonusData.general.monthlyCashBack.expireDate,
        currentWager: viewInFiat
          ? currencyFormat1(
            bonusData.general.monthlyCashBack.currentWagerAmount * exchangeRate,
            2,
            localFiat?.name || 'USD',
            true,
          )
          : currencyFormat1(bonusData.general.monthlyCashBack.currentWagerAmount, 2, '', true),
      },
    ],
    [i18n.language, bonusData, viewInFiat, localFiat, exchangeRate],
  );

  const getBonusStatistics = async () => {
    try {
      const _res = await api_bonusStatistics();

      const tempTotalData = {
        bonusClaimedUsd: Number(_res.data?.totalBonusClaimedUsd || 0),
        vipBonusUsd: Number(_res.data?.totalVipBonusUsd || 0),
        specialBonusUsd: Number(_res.data?.totalSpecialBonusUsd || 0),
        generalBonusUsd: Number(_res.data?.totalGeneralBonusUsd || 0),
      };
      setTotalData(tempTotalData);
      const tempSpinLogs = _res.data?.generalBonus?.spin?.logs?.map((item: any) => ({
        type: item.type ?? '',
        time: item.time ?? '',
      }));
      setSpinLogs(tempSpinLogs);
      const tempBonusData = {
        general: {
          depositTime: Number(_res.data?.generalBonus?.deposit?.depositTimes || 0),
          availableSpin: Number(_res.data?.generalBonus?.spin?.availableCount || 0),
          levelForSpin: Number(_res.data?.generalBonus?.spin?.reachVipLevel || 0),
          wagerAmountForDailySpin: Number(_res.data?.generalBonus?.spin?.requiredWagerAmountUsd || 0),
          dailySpinStartTime: Number(_res.data?.generalBonus?.spin?.startTime || 0) * 1000,
          dailySpinEndTime: Number(_res.data?.generalBonus?.spin?.endTime || 0) * 1000,
          currentWagerAmountForDailySpin: Number(_res.data?.generalBonus?.spin?.currentWagerAmountUsd || 0),
          dailyCompleteQuest: Number(_res.data?.generalBonus?.quest?.dailyCompleteCount || 0),
          weeklyCompleteQuest: Number(_res.data?.generalBonus?.quest?.weeklyCompleteCount || 0),
          weeklyCashBack: {
            lastBonus: Number(_res.data?.generalBonus?.cashback?.weekly?.lastBonusAmountUsd || 0),
            expireDate: Number(_res.data?.generalBonus?.cashback?.weekly?.endTime || 0) * 1000,
            currentWagerAmount: Number(_res.data?.generalBonus?.cashback?.weekly?.currentWagerAmountUsd || 0),
            requiredWagerAmount: Number(_res.data?.generalBonus?.cashback?.weekly?.requiredWagerAmountUsd || 0),
          },
          monthlyCashBack: {
            lastBonus: Number(_res.data?.generalBonus?.cashback?.monthly?.lastBonusAmountUsd || 0),
            expireDate: Number(_res.data?.generalBonus?.cashback?.monthly?.endTime || 0) * 1000,
            currentWagerAmount: Number(_res.data?.generalBonus?.cashback?.monthly?.currentWagerAmountUsd || 0),
            requiredWagerAmount: Number(_res.data?.generalBonus?.cashback?.monthly?.requiredWagerAmountUsd || 0),
          },
        },
        vip: {
          levelUp: {
            currentVipXP: Number(_res.data?.vipBonus?.levelUpRewards?.currentVipXp || 0),
            currentVipName: _res.data?.vipBonus?.levelUpRewards?.currentVipName || '',
            nextVipXP: Number(_res.data?.vipBonus?.levelUpRewards?.nextVipXp || 0),
            bonus: Number(_res.data?.vipBonus?.levelUpRewards?.bonusAmountUsd || 0),
          },
        },
      };
      setBonusData(tempBonusData);
      const claimRes = await api_getClaims();
      const tempUnlockedAmount = Number(claimRes.data?.unlockedAmount ?? 0);
      setLockedAmount(tempUnlockedAmount);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (isLogin) {
      getBonusStatistics();
    }
  }, [isLogin, isShowSpinClaim]);

  const onRedeemClick = async () => {
    if (!redeemCode) {
      toast.error(t('bonus:redeemEmpty'), {
        toastId: 'redeemEmpty',
        containerId: TOAST_ENUM.COMMON,
      });
      return;
    }
    try {
      setIsRedeemLoading(true);
      const result = await api_redeem(redeemCode);
      if (result.data.status) {
        dispatch(getBonusList());
        toast.success(t('bonus:redeemSuccess'), {
          toastId: 'redeemCode',
          containerId: TOAST_ENUM.COMMON,
        })
      } else {
        toast.error(t('bonus:redeemNoCode'), {
          toastId: 'redeemNoCode',
          containerId: TOAST_ENUM.COMMON,
        });
      }
      setRedeemCode('');
    } catch (error: any) {
      const errType = error.response?.data?.message ?? '';
      const errMessage = getErrorMessage(errType);
      toast.error(t(errMessage), { containerId: TOAST_ENUM.COMMON, toastId: 'redeemErrorCode' });
    } finally {
      setIsRedeemLoading(false);
    }
  };

  return (
    <>
      <div className="mb-[50px]">
        <div className="flex items-center justify-between max-sm:flex-wrap">
          <div className="text-[16px] md:text-[24px] dark:text-white text-color-light-text-primary font-semibold my-[16px] md:my-0">
            {t('bonus:bonus')}
          </div>
          <div className="flex h-[48px] justify-end">
            <input
              className={cn("focus:outline-none text-white font-semibold dark:bg-color-input-primary bg-white text-[12px] sm:text-[14px] rounded-l-large placeholder:text-color-text-primary min-w-[100px] flex-1 md:w-[265px] sm:max-w-[265px] pl-[15px]", {
                'pointer-events-none': isRedeemLoading
              })}
              placeholder={String(t('bonus:redeemBonusCodeHere'))}
              type="text"
              value={redeemCode}
              onChange={(e) => setRedeemCode(e.target.value)}
            />
            <div
              onClick={onRedeemClick}
              role="button"
              className={cn(
                'active:scale-105 scale-100 transition-all',
                'hover:opacity-[0.9] bg-gradient-btn-play shadow-bs-btn text-[12px] sm:text-[14px] text-white font-medium rounded-r-large ',
                'px-2 sm:px-4 justify-center flex items-center',
                {
                  'cursor-not-allowed opacity-80 justify-center w-[100px] h-full': isRedeemLoading
                }
              )}
            >
              {isRedeemLoading ? <ReactLoading type="bubbles" color="#00AAE6" height={36} width={36} /> : t('bonus:redeemBonusCode')}
            </div>
          </div>
        </div>
        <div
          className={cn(
            'dark:bg-color-modal-bg-default bg-white rounded-default max-[923px]', // Color & Border-radius
            'w-full gap-4 flex flex-col lg:flex-row lg:justify-between', // Layout
            'mt-[24px] px-[16px] py-[20px]', // Margin & Padding
          )}
        >
          <div
            className={cn(
              'flex justify-center items-center gap-[18px] max-[414px] pr-0 pb-[20px] lg:pr-[40px] lg:pb-0',
              'border-solid border-b-[1px] border-b-gray-300 dark:border-b-gray-700 lg:border-r-[1px] lg:border-r-gray-300 dark:lg:border-r-gray-700 lg:border-b-0',
            )}
          >
            <Image
              src={'/img/gold-coin.png'}
              width={93}
              height={76}
              alt="currency-gold"
              className="pl-4 object-contain w-[93px] 2xl:w-[70px] min-[1800px]:w-[93px]"
            />
            <div className="flex flex-col items-center">
              <div className="text-[14px] dark:text-white text-color-light-text-primary min-w-[155px]">
                {t('bonus:totalBonusClaimed')}
              </div>
              <div className={`font-bold text-color-primary text-[24px]`}>
                {viewInFiat
                  ? currencyFormat1(totalData.bonusClaimedUsd * exchangeRate, 2, localFiat?.name)
                  : currencyFormat1(totalData.bonusClaimedUsd, 2)}
              </div>
            </div>
          </div>
          <div className="sm:px-10 2xl:px-0 min-[1800px]:px-10 grid gap-4 grid-cols-2 lg:grid-cols-4 lg:gap-[40px] items-center">
            {/* VIP Bonus */}
            <div className="min-w-[155px]">
              <div className="text-[14px] text-color-text-primary">{t('bonus:totalVIPBonus')}</div>
              <div className="text-[16px] dark:text-white text-color-light-text-primary font-bold">
                {viewInFiat
                  ? currencyFormat1(totalData.vipBonusUsd * exchangeRate, 2, localFiat?.name)
                  : currencyFormat1(totalData.vipBonusUsd, 2)}
              </div>
            </div>
            {/* General Bonus */}
            <div className="min-w-[155px]">
              <div className="text-[14px] text-color-text-primary">{t('bonus:totalGeneralBonus')}</div>
              <div className="text-[16px] dark:text-white text-color-light-text-primary font-bold">
                {viewInFiat
                  ? currencyFormat1(totalData.generalBonusUsd * exchangeRate, 2, localFiat?.name)
                  : currencyFormat1(totalData.generalBonusUsd, 2)}
              </div>
            </div>
            {/* Special Bonus */}
            <div className="min-w-[155px]">
              {/* <div className="text-[14px] text-color-text-primary">{t('bonus:totalSpecialBonus')}</div>
              <div className="text-[16px] dark:text-white text-color-light-text-primary font-bold">
                {viewInFiat
                  ? currencyFormat1(totalData.specialBonusUsd * exchangeRate, 2, localFiat?.name)
                  : currencyFormat1(totalData.specialBonusUsd, 2)}
              </div> */}
            </div>
            {/* Claim & Details Button */}
            <div
              onClick={() => dispatch(changeIsShowBonusDetail(true))}
              role="button"
              className="hover:opacity-[0.9] dark:bg-gradient-btn-play shadow-bs-btn rounded-large text-white text-[14px] font-medium px-[24px] py-[12px] h-[48px] text-center max-[923px]:min-w-[114px] max-[923px]:text-center"
            >
              {t('bonus:details')}
            </div>
          </div>
        </div>
        <div className="mt-5">
          <div className="flex items-center gap-[10px] mb-[16px]">
            <div className="text-[16px] md:text-[20px] dark:text-white text-color-light-text-primary font-medium">
              {t('bonus:generalBonus')} & VIP{' '}
              <span className="text-[16px] md:text-[20px] font-medium dark:text-white text-color-light-text-primary">
                {t('bonus:Bonus')}
              </span>
            </div>
          </div>
          <div className={cn(
            "p-0 sm:p-0 grid grid-cols-1 min-[840px]:grid-cols-2 gap-3 sm:gap-[16px] 2xl:gap-6",
            {
              "2xl:grid-cols-2 min-[1800px]:grid-cols-3": showChatType,
              "2xl:grid-cols-3": !showChatType
            })}
          >
            <div className="relative rounded-default 2xl:max-w-[400px] min-h-[180px] max-h-[180px] sm:min-h-[230px] sm:max-h-[230px] dark:bg-color-card-bg-default bg-white">
              <div className="rounded-default max-h-[180px] sm:max-h-[230px] overflow-hidden flex justify-end items-center">
                <Image
                  src="/img/bg-levelup.png"
                  width={339}
                  height={192}
                  alt="bg-levelup"
                  className="w-[150px] object-contain"
                />
              </div>
              <div className="absolute flex flex-col justify-between top-3 bottom-3 sm:top-5 sm:bottom-5 left-5 right-5">
                <div>
                  <div className="flex items-center gap-[10px]">
                    <div className="text-default sm:text-[16px] dark:text-white text-color-light-text-primary font-bold">
                      {t('bonus:levelUpRewards')}
                    </div>
                  </div>
                  <div className="dark:text-color-text-primary text-color-light-text-primary text-m_default sm:text-[14px] mt-[5px]">
                    {t('bonus:levelUpRewardsDescription')}
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mr-[100px]">
                    <div>
                      <div className="dark:text-color-text-primary text-color-light-text-primary text-m_default sm:text-[14px]">
                        {t('bonus:currentVIP')}
                      </div>
                      <div className="dark:text-color-text-primary text-color-light-text-primary text-m_default sm:text-[14px]">
                        {t('bonus:xPNextLevel')}
                      </div>
                      <div className="dark:text-color-text-primary text-color-light-text-primary text-m_default sm:text-[14px]">
                        {t('bonus:readyToClaim')}
                      </div>
                    </div>
                    <div className="flex flex-col items-end">
                      <div className="dark:text-[#fff] text-color-light-text-primary font-semibold text-m_default sm:text-[14px] text-right">
                        {bonusData.vip.levelUp.currentVipName}
                      </div>
                      <div className="dark:text-color-text-primary text-color-light-text-primary text-m_default sm:text-[14px] text-right flex">
                        <span className="font-semibold text-black dark:text-white">
                          {bonusData.vip.levelUp.currentVipXP}
                        </span>
                        <span className="px-1">/</span>
                        <span className="font-semibold text-white">{bonusData.vip.levelUp.nextVipXP}</span>
                      </div>
                      <div className="dark:text-white text-color-light-text-primary  text-m_default sm:text-[14px] text-right font-semibold">
                        {bonusData.vip.levelUp.bonus === 0
                          ? '-'
                          : viewInFiat
                            ? currencyFormat1(bonusData.vip.levelUp.bonus * exchangeRate, 2, localFiat?.name)
                            : currencyFormat1(bonusData.vip.levelUp.bonus, 2)}
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  role="button"
                  onClick={() => dispatch(changeIsShowVipClubModal(true))}
                  className="text-color-primary dark:bg-color-panel-bg hover:opacity-80 bg-color-light-bg-primary flex gap-[10px] items-center justify-center rounded-[5px] h-[30px] sm:h-[38px] text-m_default sm:text-default"
                >
                  <div className="font-medium text-m_default sm:text-[14px]">{t('bonus:viewVIPClub')}</div>
                </div>
              </div>
            </div>
            {dataGeneralBonus.map((item, index) => (
              <CardGeneralBonus
                key={index}
                background={theme === 'dark' ? item.backgroundDark : item.backgroundLight}
                name={item.name}
                description={item.description}
                descriptionValue={''}
                title={item.title}
                total={item.total}
                titleValue={item.titleValue}
                totalValue={item.totalValue}
                nameButton={item.nameButton}
                showDeposit={item.showDeposit}
                tooltip={item.tooltip || []}
                onClick={item.action}
              />
            ))}
            <div className="relative rounded-default 2xl:max-w-[400px] min-h-[180px] max-h-[180px] sm:min-h-[230px] sm:max-h-[230px] dark:bg-color-card-bg-default bg-white">
              <div className="rounded-default max-h-[180px] sm:max-h-[230px] overflow-hidden flex justify-end items-center">
                <Image
                  src="/img/bg-lucky-spin.png"
                  width={339}
                  height={192}
                  alt="bg-lucky-spin"
                  className="w-[150px] object-contain"
                />
              </div>
              <div className="absolute flex flex-col justify-between top-3 bottom-3 sm:top-5 sm:bottom-5 left-5 right-5">
                <div className="flex justify-between p-0">
                  <div className="flex items-center gap-2">
                    <div className="text-default sm:text-[16px] dark:text-white text-color-light-text-primary font-bold">
                      {t('bonus:spin')}
                    </div>
                    <div
                      className="bg-color-primary-1 py-[2px] px-2 rounded-full flex items-center gap-2 leading-4 text-center text-white cursor-pointer text-[10px] sm:text-m_default"
                      onClick={() => setIsShowSpinLog(!isShowSpinLog)}
                    >
                      {t('bonus:spin')}
                    </div>
                    <Image
                      src={theme === 'dark' ? '/img/icon/icon-question.png' : '/img/icon/icon-question-light.png'}
                      width={16}
                      height={16}
                      alt="question"
                      data-tooltip-id={`$spin-bonus-tooltip`}
                      className='cursor-pointer'
                    />
                    <Tooltip
                      id={`$spin-bonus-tooltip`}
                      place="bottom"
                      className="dark:bg-black/0 bg-white z-[30]"
                      opacity={100}
                    >
                      <div className="max-w-[300px] bg-color-card-header-primary p-4 rounded-large shadow-bs-default">
                        {[t('bonus:luckySpinToolTip1'), t('bonus:luckySpinToolTip2')].map((item, index) => (
                          <div key={index} className="flex w-full gap-2">
                            <div className="min-w-[6px] h-[6px] mt-2 rounded-full bg-color-text-primary"></div>
                            <div>{item}</div>
                          </div>
                        ))}
                      </div>
                    </Tooltip>
                  </div>
                </div>
                {isShowSpinLog ? (
                  <div className="flex flex-col h-full text-default gap-4 mt-4 overflow-y-auto">
                    {spinLogs.map((spin, index) => (
                      <div key={`bonus-spin-log-${index}`} className="flex justify-start w-full text-[13px]">
                        {spin?.type || ''} ({formatDate(new Date(Number(spin?.time || 0) * 1000), TIME_SUBMIT_FORMAT_WITH_SLASH_MARKER)})
                      </div>
                    ))}
                    {spinLogs.length === 0 && <div className="w-full m-auto text-center">{t('bonus:noData')}</div>}
                  </div>
                ) : (
                  <>
                    <div className="flex flex-col gap-1 mr-[100px]">
                      <div className="flex justify-between w-full">
                        <div className="dark:text-color-text-primary text-color-light-text-primary text-m_default sm:text-[14px]">
                          {t('bonus:spinDescription')}
                        </div>
                        <div className="dark:text-white text-color-light-text-primary text-m_default sm:text-[14px] font-semibold">
                          {bonusData.general.availableSpin}
                        </div>
                      </div>
                      <div className="flex items-center justify-between w-full">
                        <div className="dark:text-color-text-primary text-color-light-text-primary text-m_default sm:text-[14px]">
                          {t('bonus:spinTitle')}
                        </div>
                        <div className="dark:text-white text-color-light-text-primary text-m_default sm:text-[14px] font-semibold">
                          <div className="text-[10px] text-left">{t('bonus:wagerRequired')}</div>
                          <span className="font-semibold text-white">
                            {viewInFiat ? (
                              <>
                                {currencyFormat1(
                                  bonusData.general.currentWagerAmountForDailySpin * exchangeRate,
                                  2,
                                  localFiat?.name || 'USD',
                                )}
                              </>
                            ) : (
                              <>{currencyFormat1(bonusData.general.currentWagerAmountForDailySpin, 2)}</>
                            )}
                          </span>
                          {` / `}
                          {viewInFiat ? (
                            <>
                              {currencyFormat1(
                                bonusData.general.wagerAmountForDailySpin * exchangeRate,
                                2,
                                localFiat?.name || 'USD',
                                true,
                              )}
                            </>
                          ) : (
                            <>{currencyFormat1(bonusData.general.wagerAmountForDailySpin, 2)}</>
                          )}
                        </div>
                      </div>
                      <div className="flex justify-between w-full">
                        <div className="dark:text-color-text-primary text-color-light-text-primary text-m_default sm:text-[14px]">
                          {t('bonus:spinTotal')}
                        </div>
                        <div className="dark:text-white text-color-light-text-primary text-m_default sm:text-[14px] text-right font-semibold">
                          {`${t('bonus:spinTotalDescription')} VIP ${bonusData.general.levelForSpin}`}
                        </div>
                      </div>
                    </div>
                    <div
                      role="button"
                      className="dark:bg-color-panel-bg hover:opacity-80 bg-color-light-bg-primary text-[#8D8D8D] font-semibold flex gap-[10px] items-center justify-center rounded-[5px] h-[30px] sm:h-[38px] text-default"
                      onClick={() => dispatch(changeIsShowSpin(true))}
                    >
                      <div className="flex items-center justify-start gap-1 text-m_default sm:text-default">
                        <Timer1 width={16} height={16} className="w-5 h-5" />
                        {t('promotion:endIn')}
                        <CsrWrapper>
                          {bonusData.general.dailySpinEndTime && (
                            <Countdown
                              key={'lucky-spin'}
                              date={new Date(bonusData.general.dailySpinEndTime)}
                              renderer={({ days, hours, minutes, seconds }) => {
                                return (
                                  <div className="text-white font-semibold text-center text-m_default sm:text-default">
                                    {formatDate(new Date(0, 0, 0, hours, minutes, seconds), 'HH:mm:ss')}
                                  </div>
                                );
                              }}
                            />
                          )}
                        </CsrWrapper>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
            {dataCardVipBonus.map((item, index) => (
              <CardVipBonus
                key={index}
                background={theme === 'dark' ? item.backgroundDark : item.backgroundLight}
                name={item.name}
                description={item.description}
                wagerRequired={item.wagerRequired}
                currentTier={item.currentTier}
                rechargeRate={item.rechargeRate}
                readyToClaim={item.readyToClaim}
                lastWeeklyBonus={item.lastWeeklyBonus}
                wagerValue={String(item.wagerValue)}
                tierValue={item.tierValue}
                rechargeRateValue={item.rechargeRateValue}
                readyToClaimValue={item.readyToClaimValue}
                lastWeekBonusValue={item.lastWeekBonusValue}
                showHour={item.showHour}
                showDescription={item.showDescription}
                tooltip={item.tooltip}
                expiration={item.expiration}
                currentWager={item.currentWager}
              />
            ))}
          </div>
        </div>
        {/* <div className="mt-5">
          <div className="text-[16px] md:text-[20px] dark:text-white text-color-light-text-primary font-medium mb-[18px]">
            {t('bonus:specialBonus')}
          </div>
          <div className="dark:bg-color-card-bg-primary bg-white rounded-[5px] w-full h-[250px] flex flex-col items-center justify-center gap-[12px]">
            <Image
              src={theme === 'dark' ? '/img/empty-dark.png' : '/img/empty-light.png'}
              width={90}
              height={90}
              alt="noData"
            />
            <div className="dark:text-gray-400 text-color-text-primary text-[13px]">{t('bonus:noData')}</div>
          </div>
        </div> */}
      </div>
    </>
  );
}

BonusLoggedPage.getLayout = function getLayout(page: ReactElement) {
  return <BaseLayout>{page}</BaseLayout>;
};

export default BonusLoggedPage;
