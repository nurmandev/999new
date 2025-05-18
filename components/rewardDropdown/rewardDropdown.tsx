import { Popover, Transition } from '@headlessui/react';
import cn from 'classnames';
import { ArrowRight2, Gift } from 'iconsax-react';
import Image from 'next/image';
import Link from 'next/link';
import { Fragment, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ReactLoading from 'react-loading';
import { shallowEqual, useSelector } from 'react-redux';
import { toast } from 'react-toastify';

import { api_bonusClaim, api_bonusClaimList } from '@/api/bonus';
import { api_getClaims } from '@/api/wallet';
import { ROUTER, TOAST_ENUM } from '@/base/constants/common';
import { useExchange } from '@/base/hooks/useExchange';
import { currencyFormat1 } from '@/base/libs/utils';
import { getErrorMessage } from '@/base/libs/utils/notificationToast';
import { changeIsShowDepositRule } from '@/base/redux/reducers/modal.reducer';
import { getBalance, getBonusList, setLockedAmount } from '@/base/redux/reducers/wallet.reducer';
import { AppState, useAppDispatch } from '@/base/redux/store';

type BonusType = {
  id: string;
  amount: number;
  amountUsd: number;
  type: string;
  typeName: string;
  allow: boolean;
  symbolName: string;
  symbolLogo: string;
};

const fiatDecimals = 8;

export default function RewardDropdown() {
  const exchangeRate = useExchange();
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const [claimingBonus, setClaimingBonus] = useState<string>('');
  const { viewInFiat, localFiat, isLogin, isShowSpinClaim, bonuses } = useSelector(
    (state: AppState) => ({
      viewInFiat: state.auth.user.generalSetting.settingViewInFiat,
      localFiat: state.wallet.localFiat,
      lockedAmount: state.wallet.lockedAmount,
      isLogin: state.auth.isLogin,
      isShowSpinClaim: state.modal.isShowSpinClaim,
      bonuses: state.wallet.bonuses
    }),
    shallowEqual,
  );

  const handleClaim = async (bonus: BonusType) => {
    if (claimingBonus === null || claimingBonus !== '') return;
    try {
      setClaimingBonus(bonus.id);
      await api_bonusClaim(bonus.id, bonus.type);

      const _resBonus = await api_getClaims();
      const tempLockedAmount = Number(_resBonus.data?.lockedAmount ?? 0);

      dispatch(getBonusList());

      // update balance
      dispatch(getBalance());
      dispatch(setLockedAmount(tempLockedAmount));
      toast.success(t('success:bonusClaimed'), { containerId: TOAST_ENUM.COMMON });
    } catch (error: any) {
      const errType = error.response?.data?.message ?? '';
      const errMessage = getErrorMessage(errType);
      toast.error(t(errMessage), { containerId: TOAST_ENUM.COMMON });
    } finally {
      setClaimingBonus('');
    }
  };

  useEffect(() => {
    if (isLogin) {
      dispatch(getBonusList());
    }
  }, [isLogin, isShowSpinClaim]);

  const getBonusType = (type: string) => {
    switch (type) {
      case 'level_up':
        return t('bonus:levelUpRewards');
      case 'wager_contest':
        return t('bonus:wagerContestRewards');
      case 'weekly_cashback':
        return t('bonus:weeklyCashBackRewards');
      case 'monthly_cashback':
        return t('bonus:monthlyCashBackRewards');
      default:
        return type;
    }
  };

  const getBonusIcon = (type: string) => {
    switch (type) {
      case 'wager_contest':
        return '/img/wager_contest_reward.png';
      case 'weekly_cashback':
        return '/img/weekly_cashback_reward.png';
      case 'monthly_cashback':
        return '/img/monthly_cashback_reward.png';
      case 'level_up':
        return '/img/levelup_reward.png';
      default:
        return '/img/spin_reward.png';
    }
  };

  return (
    <>
      <>
        {bonuses.length > 0 && (
          <Popover className="h-full mr-[10px] relative w-auto rounded-default text-center aspect-square dark:hover:bg-color-hover-primary hover:bg-color-light-bg-primary">
            {({ open, close }) => (
              <>
                <Popover.Button className="h-full">
                  <div
                    className={cn(
                      'flex flex-col h-full justify-center  items-center relative dark:text-white text-color-text-primary',
                    )}
                  >
                    <Gift variant="Bold" className="w-[28px] h-[28px] sm:w-[20px] sm:h-[20px]" />
                    {bonuses.length > 0 && (
                      <div className="absolute text-white bg-color-primary rounded-full top-0 -right-[calc(50%)] px-[6px] text-[10px]">
                        {bonuses.length}
                      </div>
                    )}
                  </div>
                </Popover.Button>
                <Transition
                  show={open}
                  as={Fragment}
                  enter="transition ease-out duration-100"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <Popover.Panel
                    static
                    className="mr-0 right-0 sm:absolute fixed sm:min-w-[400px] z-10 origin-top-right ring-1 ring-black ring-opacity-5 focus:outline-none sm:w-auto w-full top-[64px]"
                  >
                    <div className="px-[20px] flex flex-col gap-[10px] rounded-default relative py-[10px] dark:bg-color-menu-secondary bg-white sm:w-auto w-full shadow-gray-700 dark:shadow">
                      <div className="flex justify-between">
                        <div className="dark:text-white text-left text-color-light-text-primary text-[14px]">
                          {t('bonus:bonusReady')}
                        </div>
                        {/* <div className="text-color-secondary text-left  text-[14px]">
                          <div
                            className="flex items-center justify-end gap-2 px-1 rounded w-fit dark:bg-white/20 bg-black/10"
                            onClick={() => dispatch(changeIsShowRakeBack(true))}
                          >
                            <Lock size={12} variant="Bold" /> {currencyFormat1(lockedAmount, 2, '', false)}
                          </div>
                        </div> */}
                      </div>
                      <div className="max-h-[calc(100vh-300px)] overflow-auto flex flex-col gap-[10px]">
                        {bonuses.map((bonus, index) => (
                          <div
                            className="flex w-full justify-between gap-[40px] rounded-default p-[10px] dark:bg-color-menu-primary bg-color-light-bg-primary"
                            key={index}
                          >
                            <div className="flex gap-[10px]">
                              <div className="flex flex-col items-center justify-center">
                                <Image
                                  width={30}
                                  height={30}
                                  src={getBonusIcon(bonus.type)}
                                  className="w-auth h-fit"
                                  alt="bonus"
                                />
                              </div>

                              <div className="flex flex-col gap-[5px] justify-center">
                                <p className="text-[14px] dark:text-white text-color-light-text-primary text-left">
                                  {getBonusType(bonus.typeName)}
                                </p>
                                <div className="flex text-[14px] text-color-text-primary gap-[5px] items-center">
                                  <Image
                                    width={12}
                                    height={12}
                                    src={bonus.symbolLogo ? bonus.symbolLogo : '/img/fiats/USDT.png'}
                                    className="w-[20px] h-[20px]"
                                    alt="symbol"
                                    onError={(e) => {
                                      e.currentTarget.src = '/img/fiats/USDT.png';
                                    }}
                                  />
                                  {viewInFiat
                                    ? currencyFormat1(bonus.amountUsd * exchangeRate, fiatDecimals, localFiat?.name)
                                    : currencyFormat1(bonus.amount, fiatDecimals, '', false)}
                                </div>
                              </div>
                            </div>
                            <div className="py-[2px] flex items-center">
                              {!bonus.allow && (
                                <div
                                  role="button"
                                  className="bg-[#f36d36] px-[10px] text-white rounded-[8px] min-h-[35px] min-w-[75px] flex justify-center items-center text-default"
                                  onClick={() => dispatch(changeIsShowDepositRule(true))}
                                >
                                  <div>{t('bonus:activate')}</div>
                                </div>
                              )}
                              {bonus.allow && (
                                <button
                                  className="bg-gradient-btn-play shadow-bs-btn px-[10px] text-white rounded-[8px] min-h-[35px] min-w-[75px] flex justify-center items-center text-default"
                                  onClick={() => handleClaim(bonus)}
                                >
                                  {claimingBonus === bonus.id ? (
                                    <ReactLoading type="bubbles" color="#FFF" delay={50} className="!w-6 !h-6" />
                                  ) : (
                                    <div>{t('deposit:claim')}</div>
                                  )}
                                </button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                      <Link href={ROUTER.Bonus} onClick={close}>
                        <div className="flex justify-center items-center text-white text-[14px] text-center bg-gradient-btn-play shadow-bs-btn py-[10px] rounded-[10px]">
                          {t('bonus:bonusDashboard')}
                          <ArrowRight2 size={16} />
                        </div>
                      </Link>
                    </div>
                  </Popover.Panel>
                </Transition>
              </>
            )}
          </Popover>
        )}

        {bonuses.length == 0 && (
          <Link
            className={cn("w-[44px] text-gray-400 dark:hover:text-white hover:text-black",
              "block  p-[10px] max-[400px]:px-0 rounded-md",
              'dark:hover:bg-color-hover-primary hover:bg-color-light-bg-primary')}
            href={ROUTER.Bonus}
          >
            <Gift width={18} height={18} variant="Bold" className="m-auto" />
          </Link>
        )}
      </>
    </>
  );
}
