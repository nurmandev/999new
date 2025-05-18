import cn from 'classnames';
import { ArchiveTick, ArrowRight, Clock } from 'iconsax-react';
import Image from 'next/image';
import { useTheme } from 'next-themes';
import { ReactNode } from 'react';
import { shallowEqual, useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { Tooltip } from 'react-tooltip';

import { useTranslation } from '@/base/config/i18next';
import { changeIsShowDepositModal, changeIsShowDepositRule } from '@/base/redux/reducers/modal.reducer';
import { AppState } from '@/base/redux/store';

type CardGeneralBonusProps = {
  background: string;
  name: string;
  description: string;
  descriptionValue?: string;
  title: ReactNode;
  total: string;
  titleValue: ReactNode;
  totalValue: string;
  nameButton: string;
  showDeposit: boolean;
  tooltip: string[];
  onClick: () => void;
};

export default function CardGeneralBonus({
  background,
  name,
  description,
  descriptionValue,
  title,
  total,
  titleValue,
  totalValue,
  nameButton,
  showDeposit,
  tooltip,
  onClick,
}: CardGeneralBonusProps) {
  const { theme, setTheme } = useTheme();
  const { t } = useTranslation('');
  const dispatch = useDispatch();

  const { currentDepositTime } = useSelector(
    (state: AppState) => ({
      currentDepositTime: state.wallet.depositTime,
    }),
    shallowEqual,
  );

  return (
    <div className="relative h-full">
      {!showDeposit && (
        <div className="relative rounded-default dark:bg-color-card-bg-default bg-white h-full 2xl:max-w-[400px] min-h-[180px] max-h-[180px] sm:min-h-[230px] sm:max-h-[230px]">
          <div className="rounded-default max-h-[180px] sm:max-h-[230px] overflow-hidden flex justify-end items-center">
            <Image
              src={background}
              width={339}
              height={192}
              alt="background"
              className="w-[150px] object-contain"
            />
          </div>
          <div className="absolute top-3 bottom-3 sm:top-5 sm:bottom-5 left-5 right-5 flex flex-col justify-between">
            <div className="flex items-center gap-[10px] p-0">
              <div className="text-default sm:text-[16px] dark:text-white text-color-light-text-primary font-bold">
                {name}
              </div>
              <Image
                src={theme === 'dark' ? '/img/icon/icon-question.png' : '/img/icon/icon-question-light.png'}
                width={16}
                height={16}
                alt="question"
                data-tooltip-id={`${title}-bonus-tooltip`}
                className='cursor-pointer'
              />
              {tooltip.length > 0 && (
                <Tooltip
                  id={`${title}-bonus-tooltip`}
                  place="bottom"
                  className="dark:bg-black/0 bg-white z-[30]"
                  opacity={100}
                >
                  <div className="max-w-[300px] bg-color-card-header-primary p-4 rounded-large shadow-bs-default">
                    {tooltip.length > 1 &&
                      tooltip.map((item, index) => (
                        <div key={index} className="w-full flex gap-2">
                          <div className="min-w-[6px] h-[6px] mt-2 rounded-full bg-color-text-primary"></div>
                          <div>{item}</div>
                        </div>
                      ))}
                    {tooltip.length === 1 && tooltip[0]}
                  </div>
                </Tooltip>
              )}
            </div>
            <div className="mr-[100px]">
              <div className="flex justify-between w-full">
                <div className="dark:text-color-text-primary text-color-light-text-primary text-m_default sm:text-[14px]">
                  {description}
                </div>
                <div className="dark:text-white text-color-light-text-primary text-m_default sm:text-[14px]">
                  {descriptionValue}
                </div>
              </div>
              <div className="mt-[10px] flex justify-between w-full">
                <div>
                  <div className="dark:text-color-text-primary text-color-light-text-primary text-m_default sm:text-[14px]">
                    {title}
                  </div>
                  <div className="dark:text-color-text-primary text-color-light-text-primary text-m_default sm:text-[14px]">
                    {total}
                  </div>
                </div>
                <div>
                  <div className="dark:text-white text-color-light-text-primary text-m_default sm:text-[14px] text-right font-semibold">
                    {titleValue}
                  </div>
                  <div className="dark:text-white text-color-light-text-primary text-m_default sm:text-[14px] text-right font-semibold">
                    {totalValue}
                  </div>
                </div>
              </div>
            </div>
            {nameButton == t('bonus:unlockRakeBack') && (
              <div
                role="button"
                className={cn("flex gap-[10px] items-center justify-center",
                  "dark:bg-color-panel-bg dark:hover:bg-color-hover-default bg-color-light-bg-primary",
                  "text-color-primary",
                  "rounded-large h-[30px] sm:h-[38px] text-m_default sm:text-default")}
                onClick={onClick}
              >
                {nameButton}
              </div>
            )}
            {(nameButton == t('bonus:questButton') || nameButton == t('bonus:spinButton')) && (
              <div
                role="button"
                className={cn("flex gap-[10px] items-center justify-center",
                  "dark:bg-color-panel-bg dark:hover:bg-color-hover-default bg-color-light-bg-primary",
                  "text-color-primary",
                  "rounded-large h-[30px] sm:h-[38px] text-m_default sm:text-default")}
                onClick={onClick}
              >
                {nameButton}
              </div>
            )}
            {name == t('bonus:rollCompetition') && (
              <div
                role="button"
                className={`dark:bg-color-btn-primary bg-color-light-bg-primary hover:dark:opacity-80 hover:bg-color-light-hover-primary rounded-large w-full text-[12px] font-bold text-center py-[11px] flex items-center justify-center gap-[10px]`}
              >
                <Clock size={16} className="text-color-text-primary" />
                <div className="text-color-text-primary text-[12px]">{t('bonus:readyIn')}</div>
                <div className="text-[12px] dark:text-white text-color-light-text-primary font-bold">18h:56m:26s</div>
              </div>
            )}
          </div>
        </div>
      )
      }
      {
        showDeposit && (
          <div className="relative rounded-default 2xl:max-w-[400px] min-h-[180px] max-h-[180px] sm:min-h-[230px] sm:max-h-[230px] dark:bg-color-card-bg-default bg-white">
            <div className="absolute top-3 bottom-3 sm:top-5 sm:bottom-5 left-5 right-5 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-[10px]">
                  <div className="text-default sm:text-[16px] dark:text-white text-color-light-text-primary font-bold">
                    {name}
                  </div>
                  <Image
                    src={'/img/icon/icon-question.png'}
                    width={16}
                    height={16}
                    alt="question"
                    data-tooltip-id={'deposit-bonus-tooltip'}
                    className='cursor-pointer'
                  />
                  <Tooltip
                    id={'deposit-bonus-tooltip'}
                    place="bottom"
                    className="dark:bg-black/0 bg-white z-[30]"
                    opacity={100}
                    offset={2}
                  >
                    <div className="max-w-[300px] bg-color-card-header-primary p-4 rounded-large">
                      {tooltip.length > 1 &&
                        tooltip.map((item, index) => (
                          <div key={index} className="w-full flex gap-2">
                            <div className="min-w-[6px] h-[6px] mt-2 rounded-full bg-color-text-primary"></div>
                            <div>{item}</div>
                          </div>
                        ))}
                      {tooltip.length === 1 && tooltip[0]}
                    </div>
                  </Tooltip>
                </div>
                <div className="flex items-center gap-[7px]">
                  <div
                    className="text-color-primary text-m_default sm:text-[14px] hover:underline cursor-pointer"
                    onClick={() => dispatch(changeIsShowDepositRule(true))}
                  >
                    {t('bonus:viewDetails')}
                  </div>
                  <ArrowRight size={10} className="text-color-primary" />
                </div>
              </div>
              <div className="flex flex-col text-m_default sm:text-[14px]">
                <div className="flex justify-between text-color-primary">
                  <div className="text-color-text-primary">1st Bonus</div>
                  {currentDepositTime < 1 ? (
                    <div className="text-white py-[2px] font-semibold text-m_default sm:text-default">180%</div>
                  ) : (
                    <ArchiveTick className="w-5 h-5" />
                  )}
                </div>
                <div className="flex justify-between text-color-primary">
                  <div className="text-color-text-primary">2nd Bonus</div>
                  {currentDepositTime < 2 ? (
                    <div className="text-white py-[2px] font-semibold text-m_default sm:text-default">240%</div>
                  ) : (
                    <ArchiveTick className="w-5 h-5" />
                  )}
                </div>
                <div className="flex justify-between text-color-primary">
                  <div className="text-color-text-primary">3rd Bonus</div>
                  {currentDepositTime < 3 ? (
                    <div className="text-white py-[2px] font-semibold text-m_default sm:text-default">300%</div>
                  ) : (
                    <ArchiveTick className="w-5 h-5" />
                  )}
                </div>
                <div className="flex justify-between text-color-primary">
                  <div className="text-color-text-primary">4th Bonus</div>
                  {currentDepositTime < 4 ? (
                    <div className="text-white py-[2px] font-semibold text-m_default sm:text-default">360%</div>
                  ) : (
                    <ArchiveTick className="w-5 h-5" />
                  )}
                </div>
              </div>
              <div
                role="button"
                onClick={() => dispatch(changeIsShowDepositModal(true))}
                className="dark:bg-gradient-btn-play shadow-bs-btn hover:opacity-80 flex gap-[10px] items-center justify-center rounded-large h-[30px] sm:h-[38px] text-m_default sm:text-default"
              >
                {currentDepositTime == 0 && t('bonus:firstDesposit')}
                {currentDepositTime == 1 && t('promotion:secondDeposit')}
                {currentDepositTime == 2 && t('promotion:thirdDeposit')}
                {currentDepositTime > 2 && t('promotion:depositNow')}
              </div>
            </div>
          </div>
        )
      }
    </div >
  );
}
