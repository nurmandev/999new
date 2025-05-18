import cn from 'classnames';
import { ArrowRight } from 'iconsax-react';
import Image from 'next/image';
import { useEffect, useMemo, useState } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';

import { api_getVipProgress } from '@/api/vip';
import { useTranslation } from '@/base/config/i18next';
import { changeIsShowVipClubModal } from '@/base/redux/reducers/modal.reducer';
import { AppState } from '@/base/redux/store';
import Loader from '@/components/common/preloader/loader';

import styles from './index.module.scss';

const VipProgressComponent = () => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [checkDeposit, setCheckDeposit] = useState<boolean>(false);
  const [currentLevel, setCurrentLevel] = useState({
    xp: 0,
    level: 0,
    name: '',
    remainingXp: 0,
    nextLevel: 0,
    nextName: '',
    nextXp: 0,
    nextLevelBonus: 0,
    progress: 0,
    currentVipXp: 0,
  });
  const { t } = useTranslation('');

  const { isLogin } = useSelector(
    (state: AppState) => ({
      isLogin: state.auth.isLogin,
    }),
    shallowEqual,
  );

  const handleGetVipProgress = async () => {
    try {
      setIsLoading(true);
      const _res = await api_getVipProgress();
      setCheckDeposit(_res.data.totalDepositAmountUsd > 0);
      setCurrentLevel({
        xp: Number(_res.data?.currentXp || 0),
        level: Number(_res.data?.currentVipLevel || 0),
        name: _res.data?.currentVipName ?? '',
        remainingXp: Number(_res.data?.remainingXp || 0),
        nextLevel: Number(_res.data?.nextVipLevel || 0),
        nextName: _res.data?.nextVipName ?? '',
        nextXp: Number(_res.data?.nextVipXp || 0),
        nextLevelBonus: Number(_res.data?.nextLevelBonus || 0),
        progress: Number(_res.data?.progress || 0),
        currentVipXp: Number(_res.data?.currentVipXp || 0),
      });
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!isLogin) return;
    handleGetVipProgress();
  }, [isLogin]);

  return (
    <>
      <div
        className={cn(
          'flex flex-col relative py-[8px] px-[10px] sm:py-[16px] sm:px-[25px] sm:min-w-[400px] rounded-large overflow-hidden sm:gap-[10px] gap-[5px]',
          'bg-gradient-to-b from-[#008499] to-[#002D79]',
        )}
      >
        <div className="dark:text-white text-black font-[600] sm:text-[20px] text-default">
          {t('homePage:yourVipProgress')}
        </div>
        <div className="sm:top-[15px] top-[8px] absolute sm:right-[25px] right-[10px] dark:text-white text-black">
          <ArrowRight className="cursor-pointer" onClick={() => dispatch(changeIsShowVipClubModal(true))} />
        </div>
        <div className="text-[12px] dark:text-gray-400 text-color-light-text-primary sm:pb-[10px] pb-[5px] border-solid border-b-[1px] dark:border-color-border-primary border-color-light-border-primary">
          <div>{currentLevel.progress}%</div>
          <div className="w-full rounded-[5px] h-[10px] sm:h-[13px] dark:bg-color-progress-primary bg-color-light-bg-primary my-[5px]">
            <div className="h-full relative" style={{ width: `${currentLevel.progress}%` }}>
              <div className={cn(`h-full rounded-[5px] w-full`, styles['slideProgress'])} />
            </div>
          </div>
          <div className="flex justify-between sm:text-default text-[12px]">
            <div className="dark:text-color-text-primary text-color-light-text-primary">{currentLevel.name}</div>
            <div className="text-amber-400">{currentLevel.nextName}</div>
          </div>
        </div>
        <div className="flex gap-[4px] ">
          <div className="sm:p-[4px] p-[2px] border border-solid rounded-full dark:border-color-border-primary border-color-light-border-primary">
            <Image width={30} height={30} src="/img/reward.png" className="w-[20px] h-[20px]" alt="reward" />
          </div>
          <div className="dark:text-white text-color-light-text-primary text-default flex items-center">
            {t('bonus:nextLevelBonus')}
          </div>
          <div className="dark:text-color-secondary text-color-light-text-primary text-default flex items-center font-bold">
            {`${currentLevel.nextLevelBonus?.toFixed(2)} USDT`}
          </div>
        </div>
      </div>
    </>
  );
};

export default VipProgressComponent;
