import { Crown, Timer1 } from 'iconsax-react';
import Image from 'next/image';
import { useTheme } from 'next-themes';

import { useTranslation } from '@/base/config/i18next';
import { Tooltip } from 'react-tooltip';
import { AppState } from '@/base/redux/store';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { api_getProfile } from '@/api/user';
import cn from 'classnames';
import CsrWrapper from '../CsrWrapper';
import Countdown from 'react-countdown';
import { formatDate } from '@/base/libs/utils';

type CardVipBonusProps = {
  background: string;
  name: string;
  description: string;
  wagerRequired: string;
  currentTier: string;
  rechargeRate: string;
  readyToClaim: string;
  lastWeeklyBonus: string;
  wagerValue: string;
  tierValue: string;
  rechargeRateValue: string;
  readyToClaimValue: string;
  lastWeekBonusValue: string;
  showHour: boolean;
  showDescription: boolean;
  tooltip: string[];
  expiration: number;
  currentWager: string;
};

export default function CardVipBonus({
  background,
  name,
  description,
  wagerRequired,
  currentTier,
  rechargeRate,
  readyToClaim,
  lastWeeklyBonus,
  wagerValue,
  tierValue,
  rechargeRateValue,
  readyToClaimValue,
  lastWeekBonusValue,
  showHour,
  showDescription,
  tooltip,
  expiration,
  currentWager,
}: CardVipBonusProps) {
  const { t } = useTranslation('');
  const { theme, setTheme } = useTheme();

  const [vipLevel, setVipLevel] = useState<number>(0);
  const { userId } = useSelector(
    (state: AppState) => ({
      userId: state.auth.user.userId,
    }),
    shallowEqual,
  );

  const getUserProfile = async (selectedUserId: string) => {
    try {
      const res = await api_getProfile(selectedUserId);
      setVipLevel(res.data.currentVipLevel || 0);
    } catch (error) {
    } finally {
    }
  };

  useEffect(() => {
    getUserProfile(userId);
  }, [userId]);
  return (
    <div className="relative rounded-default 2xl:max-w-[400px] min-h-[180px] max-h-[180px] sm:min-h-[230px] sm:max-h-[230px] dark:bg-color-card-bg-default bg-white">
      <div className="rounded-default max-h-[180px] sm:max-h-[230px] overflow-hidden flex justify-end items-center">
        <Image src={background} width={339} height={192} alt="vip bonus" className="w-[150px] object-contain" />
      </div>
      <div className="absolute top-3 bottom-3 sm:top-5 sm:bottom-5 left-5 right-5 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-[10px]">
            <div className="text-default sm:text-[16px] dark:text-white text-[#141414] font-bold">{name}</div>
            {showHour && (
              <div className="bg-color-primary/15 text-[12px] font-bold text-color-primary px-[7px]">
                {t('bonus:hourly')}
              </div>
            )}
            <Image
              src={theme === 'dark' ? '/img/icon/icon-question.png' : '/img/icon/icon-question-light.png'}
              width={16}
              height={16}
              alt="question"
              data-tooltip-id={`${name}-bonus-tooltip`}
              className='cursor-pointer'
            />
            <Tooltip
              id={`${name}-bonus-tooltip`}
              place="bottom"
              className="dark:bg-black/0 bg-white z-[30]"
              opacity={100}
            >
              <div className="max-w-[300px] bg-color-card-header-primary p-4 rounded-large">
                {tooltip.map((item, index) => (
                  <div key={index} className="w-full flex gap-2">
                    <div className="min-w-[6px] h-[6px] mt-2 rounded-full bg-color-text-primary"></div>
                    <div>{item}</div>
                  </div>
                ))}
              </div>
            </Tooltip>
          </div>
          {showDescription && (
            <div className="dark:text-color-text-primary text-color-light-text-primary text-m_default sm:text-[14px] mt-[5px]">
              {description}
            </div>
          )}
        </div>
        <div className="mt-[10px] flex justify-between mr-[100px]">
          <div>
            <div className="dark:text-color-text-primary text-color-light-text-primary text-m_default sm:text-[14px]">
              {wagerRequired}
            </div>
            <div className="dark:text-color-text-primary text-color-light-text-primary text-m_default sm:text-[14px]">
              {currentTier}
            </div>
            <div className="dark:text-color-text-primary text-color-light-text-primary text-m_default sm:text-[14px]">
              {rechargeRate}
            </div>
            <div className="dark:text-color-text-primary text-color-light-text-primary text-m_default sm:text-[14px]">
              {readyToClaim}
            </div>
            <div className="dark:text-color-text-primary text-color-light-text-primary text-m_default sm:text-[14px]">
              {lastWeeklyBonus}
            </div>
          </div>
          <div className="max-w-[60%]">
            <div className="dark:text-white font-semibold text-color-light-text-primary text-m_default sm:text-[14px] text-right truncate">
              {vipLevel >= 22 && (
                <>
                  <span className="font-semibold text-white">{currentWager}</span>
                  <span> /</span>
                </>
              )}{' '}
              {vipLevel >= 22 ? wagerValue.slice(2) : wagerValue}
            </div>
            <div className="dark:text-white text-color-light-text-primary text-m_default sm:text-[14px] text-right truncate">
              {tierValue}
            </div>
            <div className="dark:text-white text-color-light-text-primary text-m_default sm:text-[14px] text-right truncate">
              {rechargeRateValue}
            </div>
            <div className="dark:text-white text-color-light-text-primary text-m_default sm:text-[14px] text-right truncate">
              {readyToClaimValue}
            </div>
            <div className="dark:text-white text-color-light-text-primary text-m_default sm:text-[14px] text-right truncate">
              {lastWeekBonusValue}
            </div>
          </div>
        </div>
        <div
          role="button"
          className={cn('flex gap-[10px] items-center justify-center rounded-[5px] h-[30px] sm:h-[38px]', {
            'dark:bg-color-panel-bg bg-color-light-bg-primary': vipLevel < 22,
            'dark:bg-color-panel-bg text-white': vipLevel >= 22,
          })}
        >
          {vipLevel < 22 && (
            <>
              <Crown size={20} className="text-[#8D8D8D]" variant='Bold' />
              <div className="text-[#8D8D8D] text-m_default sm:text-[14px]">{t('bonus:availableAt')} VIP 22</div>
            </>
          )}
          {vipLevel >= 22 && (
            <div className="text-[#8D8D8D] flex justify-start items-center gap-1 text-m_default sm:text-default">
              <Timer1 variant="Bulk" width={16} height={16} className="w-5 h-5" />
              {t('promotion:endIn')}
              <CsrWrapper>
                <Countdown
                  date={new Date(Number(expiration))}
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
      </div>
    </div>
  );
}
