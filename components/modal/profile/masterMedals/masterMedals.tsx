import cn from 'classnames';
import { ArrowLeft2, InfoCircle, Profile2User } from 'iconsax-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';

import { api_medalStatistics } from '@/api/user';
import { useTranslation } from '@/base/config/i18next';
import { groupMedal } from '@/base/constants/common';
import CommonModal from '../../commonModal/commonModal';
import { ChevronLeftIcon } from '@heroicons/react/24/outline';
import { shallowEqual, useSelector } from 'react-redux';
import { AppState } from '@/base/redux/store';

const groupPrize = [
  { img: '/img/flat-white.png', value: 0 },
  { img: '/img/chest.png', value: 5 },
  { img: '/img/chest.png', value: 10 },
  { img: '/img/chest.png', value: 15 },
  { img: '/img/chest.png', value: 'max' },
];

const groupAchieve = [
  { medals: 5, achieve: 20 },
  { medals: 10, achieve: 800 },
  { medals: 15, achieve: 2400 },
  { medals: 20, achieve: 10000 },
];

interface MasterMedalsInterface {
  isShow: boolean;
  onClose: () => void;
  goBackToProfile: () => void;
}

export default function MasterMedals({ isShow, onClose, goBackToProfile }: MasterMedalsInterface) {
  const { t } = useTranslation('');
  const { isLogin } = useSelector(
    (state: AppState) => ({
      isLogin: state.auth.isLogin,
    }),
    shallowEqual,
  );
  const [isLoading, setIsLoading] = useState(false);
  const [medalDatas, setMedalDatas] = useState<any>({
    fearlessOne: 0,
    chickenDinner: 0,
    callMeRichMan: 0,
    ethstop1: 0,
    highestContributor: 0,
    invincibleLuckyDog: 0,
    loyalPlayer: 0,
    theLoadedKing: 0,
    theOldTimer: 0,
    theTopGun: 0,
  });

  const getMedalDatas = async () => {
    try {
      setIsLoading(true);
      const res = await api_medalStatistics();
      setMedalDatas({
        fearlessOne: Number(res.data?.fearlessOne ?? 0),
        callMeRichMan: Number(res.data?.callMeRichMan ?? 0),
        chickenDinner: Number(res.data?.chickenDinner ?? 0),
        ethstop1: Number(res.data?.ethstop1 ?? 0),
        highestContributor: Number(res.data?.highestContributor ?? 0),
        invincibleLuckyDog: Number(res.data?.invincibleLuckyDog ?? 0),
        loyalPlayer: Number(res.data?.loyalPlayer ?? 0),
        theLoadedKing: Number(res.data?.theLoadedKing ?? 0),
        theOldTimer: Number(res.data?.theOldTimer ?? 0),
        theTopGun: Number(res.data?.theTopGun ?? 0),
      });
    } catch (error) {
      setMedalDatas({
        fearlessOne: 0,
        chickenDinner: 0,
        callMeRichMan: 0,
        ethstop1: 0,
        highestContributor: 0,
        invincibleLuckyDog: 0,
        loyalPlayer: 0,
        theLoadedKing: 0,
        theOldTimer: 0,
        theTopGun: 0,
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isLogin && isShow) {
      getMedalDatas();
    }
  }, [isLogin, isShow]);

  return (
    <CommonModal
      show={isShow}
      onClose={onClose}
      panelClass="rounded max-w-full sm:max-w-[540px]"
      header={
        <div className="px-[12px] py-[20px] bg-color-light-bg-primary dark:bg-color-header-primary">
          <div
            className="text-black dark:text-white md:text-[18px] text-[16px] font-bold flex items-center gap-[10px] cursor-pointer"
            onClick={() => goBackToProfile()}
          >
            <ArrowLeft2 className="w-[16px] text-[#67707B] stroke-4" />
            <div className="text-[16px]">{t('profile:masterMedals')}</div>
          </div>
        </div>
      }
    >
      <div className="p-[20px] max-md:pb-[60px] dark:bg-[#1E2024] bg-white !h-[calc(100v%-64px)] overflow-auto">
        <div className="flex flex-nowrap gap-[10px] justify-between">
          {groupPrize.map((item: any, index: number) => (
            <div
              key={index}
              className="px-[10px] sm:px-[20px] grow py-[10px] dark:bg-color-card-body-secondary bg-[#f5f6fa] rounded-[5px] flex flex-col items-center cursor-pointer "
            >
              <Image className="h-[37px] w-[37px]" height={28} width={28} src={item.img} alt="prize" />
              <span className="text-[10px] mt-[8px] dark:text-[#939699] text-[#5f6975cc]">{item.value}</span>
            </div>
          ))}
        </div>
        <div className="h-[35px] dark:bg-color-card-body-secondary bg-[#f5f6fa] rounded-[5px] px-[20px] py-[14px] mt-[10px]">
          <div className="dark:bg-[#1E2024] bg-[#5f69752e] rounded-[10px] h-full">
            <div className="bg-color-primary relative rounded-[10px] w-[35px] h-full">
              <div className="absolute -top-[6px] left-1/2 -translate-x-2/4">
                <Image className="w-[11px] h-[9px]" height={9} width={11} src={`/img/triangle.png`} alt="triangle" />
              </div>
            </div>
          </div>
        </div>
        <div className="p-[10px] dark:bg-color-card-body-secondary bg-[#f5f6fa] flex flex-col gap-[5px] rounded-[5px] dark:text-color-text-primary text-[#5f6975cc] text-[12px] mt-[10px]">
          {groupAchieve.map((item: any, index: number) => (
            <p
              key={index}
              dangerouslySetInnerHTML={{
                __html: String(
                  t('profile:achieve', {
                    medals: item.medals,
                    achieve: item.achieve,
                  }),
                ),
              }}
            ></p>
          ))}
        </div>
        <div className="my-[10px]">
          <p className="dark:text-white text-[#5F6975] text-[12px] font-semibold">{t('profile:unlocked')}</p>
          <div className="bg-[#27292E] h-[1px] my-[10px]" />
          <p className="dark:text-white text-[#5F6975] text-[12px] font-semibold mb-[10px]">
            {t('profile:awaitingUnlocking')}
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-[10px]">
            {groupMedal.map((item: any, index: number) => (
              <div
                key={index}
                className="px-[5px] py-[10px] dark:bg-color-card-body-secondary bg-[#f5f6fa] gap-[10px] rounded-[5px] flex flex-col items-center"
              >
                <Image className="h-[37px] w-[37px]" height={28} width={28} src={item.img} alt="medal" />
                <span className="text-[12px] text-color-text-primary">{item.text}</span>
                <div className="flex items-center justify-center dark:bg-[#1E2024] bg-white gap-[5px] py-[5px] px-[10px]">
                  <Profile2User variant="Bold" className="w-[12px] h-[12px] text-color-primary" />
                  <span className="text-[12px] font-semibold text-color-primary">{medalDatas[item.val]}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="text-color-primary text-[12px] flex flex-col items-center justify-center mt-[25px]">
            <div className="flex items-center">
              <InfoCircle />
              <span>{t('profile:tipContent')}</span>
            </div>
            <span>{t('profile:update')}</span>
          </div>
        </div>
      </div>
    </CommonModal>
  );
}
