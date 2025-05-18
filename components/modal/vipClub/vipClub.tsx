import { DialogProps, TransitionRootProps } from '@headlessui/react';
import cn from 'classnames';
import { InfoCircle } from 'iconsax-react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { ElementType, useEffect, useMemo, useState } from 'react';
import { shallowEqual, useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { Tooltip } from 'react-tooltip';

import { api_getVipProgress, api_vipLevelSystem } from '@/api/vip';
import { useTranslation } from '@/base/config/i18next';
import { CookieKey } from '@/base/constants/common';
import { CookiesStorage } from '@/base/libs/storage/cookie';
import { changeIsShowVipClubModal, changeIsShowVipLevelModal } from '@/base/redux/reducers/modal.reducer';
import { AppState } from '@/base/redux/store';
import Loader from '@/components/common/preloader/loader';

import CommonModal from '../commonModal/commonModal';
import styles from './index.module.scss';

type ModalVipClubProps = {
  onClose: () => void;
  show: boolean;
} & TransitionRootProps<ElementType> &
  DialogProps<ElementType>;

type bonusType = 'level_up' | 'monthly_cashback' | 'weekly_cashback';

type bonusDataType = {
  bonusType: bonusType;
  levelUpTotalPrizeAmountUsd: number;
  weeklyCashbackPercentage: null | number;
  monthlyCashbackPercentage: null | number;
};

type rankDataType = {
  name: string;
  startLevel: number;
  startLevelDes: string;
  endLevel: number;
  endLevelDes: string;
  bonuses: bonusDataType[];
};

export default function ModalVipClub({ show, onClose }: ModalVipClubProps) {
  const { t } = useTranslation('');
  const router = useRouter();
  const dispatch = useDispatch();
  const { isLogin } = useSelector(
    (state: AppState) => ({
      isLogin: state.auth.isLogin,
    }),
    shallowEqual,
  );
  const [vipData, setVipData] = useState({
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
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedRank, setSelectedRank] = useState<rankDataType>({
    name: '',
    startLevel: 0,
    startLevelDes: '',
    endLevel: 0,
    endLevelDes: '',
    bonuses: [],
  });
  const [rankList, setRankList] = useState<rankDataType[]>([]);
  const [currentRank, setCurrentRank] = useState<{ img: string; name: string }>();
  const [currentVipLevel, setCurrentVipLevel] = useState<number>(0);
  const dataMedal = [
    { img: '/img/bronze-medal.png', name: 'Bronze' },
    { img: '/img/silver-medal.png', name: 'Silver' },
    { img: '/img/gold-medal.png', name: 'Gold' },
    { img: '/img/platinum1-medal.png', name: 'Platinum I' },
    { img: '/img/platinum2-medal.png', name: 'Platinum II' },
    { img: '/img/diamond1-medal.png', name: 'Diamond I' },
    { img: '/img/diamond2-medal.png', name: 'Diamond II' },
    { img: '/img/diamond3-medal.png', name: 'Diamond III' },
  ];

  const onOpenModalVipLevel = (level: number) => {
    CookiesStorage.setCookieData(CookieKey.level, String(level));
    dispatch(changeIsShowVipClubModal(false));
    dispatch(changeIsShowVipLevelModal(true));
  };

  const getVipData = async () => {
    try {
      setIsLoading(true);
      const [_resVipProgress, _resVipLevels] = await Promise.all([api_getVipProgress(), api_vipLevelSystem()]);
      const tempRankData: rankDataType[] = _resVipLevels.data?.levelSystem?.map((item: any) => ({
        name: item.medalName ?? '',
        startLevel: Number(item.startLevelNum ?? 0),
        startLevelDes: item.startLevel ?? '',
        endLevel: Number(item.endLevelNum ?? 0),
        endLevelDes: item.endLevel ?? '',
        bonuses: item.bonuses.map((bonus: any) => ({
          bonusType: bonus.bonusType ?? 'level_up',
          levelUpTotalPrizeAmountUsd: Number(bonus.levelUpTotalPrizeAmountUsd ?? 0),
          weeklyCashbackPercentage: Number(bonus.weeklyCashbackPercentage ?? 0),
          monthlyCashbackPercentage: Number(bonus.monthlyCashbackPercentage ?? 0),
        })),
      }));
      const currentLevel = Number(_resVipProgress.data?.currentVipLevel || 0);

      setVipData({
        xp: Number(_resVipProgress.data?.currentXp || 0),
        level: Number(_resVipProgress.data?.currentVipLevel || 0),
        name: _resVipProgress.data?.currentVipName ?? '',
        remainingXp: Number(_resVipProgress.data?.remainingXp || 0),
        nextLevel: Number(_resVipProgress.data?.nextVipLevel || 0),
        nextName: _resVipProgress.data?.nextVipName ?? '',
        nextXp: Number(_resVipProgress.data?.nextVipXp || 0),
        nextLevelBonus: Number(_resVipProgress.data?.nextLevelBonus || 0),
        progress: Number(_resVipProgress.data?.progress || 0),
        currentVipXp: Number(_resVipProgress.data?.currentVipXp || 0),
      });
      if (tempRankData.length > 0) {
        const userRank = tempRankData.find((item) => currentLevel >= item.startLevel && currentLevel <= item.endLevel);
        setCurrentVipLevel(currentLevel);
        if (userRank) {
          setSelectedRank(userRank ?? tempRankData[0]);
          setCurrentRank(dataMedal.find((item) => item.name === userRank?.name));
        } else {
          setSelectedRank({ name: '', startLevel: 0, startLevelDes: '', endLevel: 0, endLevelDes: '', bonuses: [] });
          const currentLevel = Number(_resVipProgress.data?.currentVipLevel || 0);
          if (currentLevel == 0) {
            setCurrentRank({ img: '/img/vip.png', name: '' });
          } else {
            setCurrentRank({ img: '/img/vip-1.png', name: '' });
          }
        }
      }

      setRankList(tempRankData);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };
  const getColorBg = (rank: string) => {
    let className = '';
    switch (!!rank) {
      case rank.includes('Bronze'):
        className = 'bronze';
        break;
      case rank.includes('Silver'):
        className = 'silver';
        break;
      case rank.includes('Gold'):
        className = 'gold';
        break;
      case rank.includes('Platinum'):
        className = 'platinum';
        break;
      default:
        className = 'diamond';
        break;
    }
    return className;
  };


  const navigationVipPage = () => {
    dispatch(changeIsShowVipClubModal(false));
    router.push('/vip');
  };

  const percent = useMemo(() => {
    return Math.ceil((vipData.xp / (vipData.xp + vipData.remainingXp)) * 100);
  }, [vipData]);

  useEffect(() => {
    if (isLogin && show) {
      getVipData();
    }
  }, [isLogin, show]);

  const getVipName = (name: string) => {
    const vipAndLevel = name.split(' ');

    const vip = vipAndLevel[0] ? vipAndLevel[0][0] : 'V';
    const level = vipAndLevel[1] ?? 0;
    return `${vip} ${level}`;
  };

  return (
    <>
      <CommonModal
        show={show}
        onClose={onClose}
        panelClass="rounded sm:rounded-large overflow-hidden h-full sm:h-[720px] sm:!max-h-[90vh]"
      >
        <>
          <div className="flex flex-col gap-[20px] overflow-y-auto px-[10px] sm:px-[20px] pb-[40px] rounded-default dark:bg-gradient-card-modal">
            <div className="relative text-default md:text-m_title pt-[22px] pb-[18px] text-black dark:text-white font-[700] text-center">
              {t('vipClub:vipClub')}
            </div>
            <div className="dark:text-white text-black text-m_default md:text-default text-center py-2 px-4">
              {t('vipClub:levelUpToGetExclusiveAccess')}{' '}
              <span
                role="button"
                onClick={() => onOpenModalVipLevel(vipData.level)}
                className="text-color-text-green hover:opacity-[0.9] hover:underline"
              >
                {t('vipClub:viewLevelUpDetails')}
              </span>
            </div>
            <div className="rounded-large">
              <div className="block lg:flex">
                <div className="w-full lg:w-[50%] pt-[28px] px-5">
                  <div className="text-default md:text-title text-white font-semibold">
                    {t('vipClub:yourVipProgress')}
                  </div>
                  <div className="flex gap-[30px] mt-5">
                    <div className="flex relative min-w-[90px]">
                      <Image
                        src={currentRank?.img || '/img/vip.png'}
                        width={240}
                        height={279}
                        className="w-[90px] h-fit"
                        alt="vip"
                        onError={(e) => {
                          e.currentTarget.src = '/img/vip.png';
                        }}
                      />
                    </div>

                    <div className="w-full flex flex-col gap-[10px] justify-center">
                      <div className="font-bold text-center">{`${currentRank?.name ? currentRank.name + ' -' : ''}${vipData.name
                        }`}</div>
                      <div className="bg-white rounded-[5px] h-[8px] relative">
                        <div
                          className="absolute top-0 h-full left-0 bg-color-text-green rounded-[25px]"
                          style={{ width: `${vipData.progress}%` }}
                        ></div>
                        <div
                          className="absolute -top-[26px] w-[22px] h-[61px] -translate-x-[11px]"
                          style={{ left: `${vipData.progress}%` }}
                        >
                          <Image src="/img/flare.png" className="w-[22px] h-[61px]" width={6} height={16} alt="flare" />
                        </div>
                      </div>
                      <div className="flex justify-center items-center gap-[10px]">
                        <div className="text-[14px] text-white">{`${vipData.xp - vipData.currentVipXp} / ${vipData.nextXp - vipData.currentVipXp} XP`}</div>
                        <InfoCircle size={20} className="text-color-primary" data-tooltip-id={'your-vip-tooltip'} />
                        <Tooltip id={'your-vip-tooltip'} place="bottom" className="z-[10] !bg-white dark:!bg-black">
                          <div className="dark:text-color-text-primary text-color-light-text-primary">
                            <p>{t('vipClub:yourTip1')}</p>
                            <p>{t('vipClub:yourTip2')}</p>
                          </div>
                        </Tooltip>
                      </div>
                      <div className="text-m_default sm:text-default md:text-[16px] text-center">
                        <span className="text-color-text-green">
                          {t('vipClub:gain')}
                          {' +'}
                          {vipData.level < 1 ? vipData.remainingXp.toFixed(2) : Math.ceil(vipData.remainingXp)}
                          {' XP '}
                        </span>
                        {t('vipClub:until')} {vipData.nextName}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="hidden lg:block blur-[1px] w-[1px] h-[120px] mt-[30px] rounded-[481px] bg-gradient-to-b from-black/[5%] via-white to-black/[5%]" />
                <div className="block lg:hidden blur-[1px] h-[1px] w-[84%] ml-[8%] mt-[28px] rounded-[481px] bg-gradient-to-r from-black/[5%] via-white to-black/[5%]" />
                <div className="w-full lg:w-[50%] pl-[28px] pt-[28px] pr-[28px] flex flex-col justify-center gap-[10px]">
                  <div className="text-default md:text-title text-white font-[700]">{t('vipClub:vipHost')}</div>
                  <Image
                    src={'/img/img-vip-host.png'}
                    width={231}
                    height={40}
                    alt="vip host"
                    className="w-[80%] lg:w-full m-auto object-cover"
                  />
                  <div className="text-m_default sm:text-default font-bold text-center">
                    <span className="font-bold">{t('vipClub:unlockYourExclusiveVip')}</span>
                    <span className="uppercase text-[#FF9E4F] font-bold">
                      {t('vipClub:vipHost')}
                      {` `}
                    </span>
                    <span className="font-bold">
                      {t('vipClub:hostAt')}
                      {` `}
                    </span>
                    <span className="uppercase text-[#FF9E4F] font-bold">{t('vipClub:vipClub')}</span>
                  </div>
                </div>
              </div>
              <div className="dark:text-white text-black text-m_default sm:text-[14px] text-center mt-6 px-5">
                {t('vipClub:discoverTheUltimateGamingExperience')}
              </div>
              <div className="mt-[22px] m-auto w-[84%] blur-[1px] h-[1px] rounded-[481px] bg-gradient-to-r from-black/[5%] via-white to-black/[5%]" />
              <div className="p-4">
                <div className={`flex justify-between gap-1 overflow-x-auto scrollbar`}>
                  {rankList.map((item, index) => (
                    <div
                      className={cn(
                        'h-[105px] sm:h-[120px] relative flex flex-col items-center w-[87px] min-w-fit cursor-pointer border-none pt-[18px] pb-[15px] px-[15px] bg-transparent',
                        styles.rank_text,
                      )}
                      key={index}
                      onClick={() => setSelectedRank(item)}
                    >
                      <Image
                        src={dataMedal.find((medal) => medal.name === item.name)?.img || '/img/vip.png'}
                        width={50}
                        height={50}
                        alt="vip"
                        className={cn('mt-auto mb-auto', {
                          'w-[35px] h-[35px] md:w-[50px] md:h-[50px]':
                            !item.name.includes('Platinum') && item.name !== 'Diamond III',
                          'w-[42px] h-[42px] md:w-[60px] md:h-[60px]':
                            !item.name.includes('Platinum') || item.name === 'Diamond III',
                          'opacity-100': selectedRank.startLevel === item.startLevel,
                          // 'opacity-100': selectedRank.startLevel !== item.startLevel,
                        })}
                        onError={(e) => {
                          e.currentTarget.src = '/img/vip.png';
                        }}
                      />
                      {selectedRank.startLevel === item.startLevel && (
                        <Image
                          src="/img/selected-medal.png"
                          width={50}
                          height={50}
                          alt="medal"
                          className="absolute left-0 right-0 -bottom-0 w-full h-full"
                        />
                      )}
                      <div className="text-white text-[12px] font-semibold mt-[8px] z-1">{item.name}</div>
                    </div>
                  ))}
                </div>
                <div className="py-4 px-[10px] min-h-[17.5rem]">
                  {isLoading && <Loader />}
                  {!isLoading && selectedRank.startLevel > 0 && (
                    <>
                      <div className="flex gap-[10px] items-center">
                        <div className="text-[13px] h-[24px] dark:text-black text-white bg-contain bg-no-repeat text-center">
                          <div
                            className={cn(
                              styles[getColorBg(String(selectedRank.name))],
                              styles['rank'],
                              'dark:text-white text-black font-semibold flex items-center !h-[24px] !w-[100px] pr-3 pl-[6px] dark:after:!border-r-color-card-header-primary after:!border-r-color-light-bg-primary',
                            )}
                          >
                            {selectedRank.name}
                          </div>
                        </div>
                        <div className="dark:text-white text-color-light-text-primary text-m_default sm:text-[14px] font-semibold">
                          {`${selectedRank.startLevelDes}-${selectedRank.endLevelDes}`}
                          {selectedRank.startLevel >= 8 && (
                            <span className="font-light">
                              {` * `}
                              {t('vipClub:benefitDetails')}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="mt-[18px] grid sm:grid-cols-2 grid-cols-1 gap-4">
                        {selectedRank.bonuses.map((bonus) => {
                          const type = bonus.bonusType;

                          return (
                            <>
                              {type === 'level_up' && (
                                <div className="border-solid border-2 border-color-primary w-full rounded-[20px] p-3 flex gap-[16px] items-center h-full">
                                  <div className="min-w-[50px] min-h-[62px] flex items-center justify-center">
                                    {currentVipLevel >= selectedRank.startLevel ? (
                                      <Image src={'/img/vip/bonus_levelup.png'} width={50} height={51} alt="bonus level" />
                                    ) : (
                                      <Image src={'/img/vip/lock.png'} width={26} height={30} alt="bonus lock" />
                                    )}
                                  </div>
                                  <div className="flex flex-col gap-[6px]">
                                    <div className="text-[14px] text-black dark:text-white font-bold ">
                                      {t('vipClub:levelUpBonus')}
                                    </div>
                                    <div className="text-color-text-primary text-[11px]">
                                      {t('vipClub:totalPrize')}:{' '}
                                      <span className="text-color-secondary font-semibold">
                                        {bonus.levelUpTotalPrizeAmountUsd} USDT
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              )}
                              {type === 'weekly_cashback' && (
                                <div className="border-solid border-2 border-color-primary w-full rounded-[20px] p-3 flex gap-[16px] items-center h-full">
                                  <div className="min-w-[50px] min-h-[62px] flex items-center justify-center">
                                    {currentVipLevel >= selectedRank.startLevel ? (
                                      <Image
                                        src={'/img/vip/bonus_weekly_cashback.png'}
                                        className="min-w-[55px] min-h-[56px]"
                                        width={55}
                                        height={56}
                                        alt="bonus weekly cashback"
                                      />
                                    ) : (
                                      <Image src={'/img/vip/lock.png'} width={26} height={30} alt="vip lock" />
                                    )}
                                  </div>
                                  <div className="flex flex-col gap-[6px]">
                                    <div className="text-[14px] text-black dark:text-white font-bold ">
                                      {t('vipClub:weeklyCashback')}
                                    </div>
                                    <div
                                      className="text-color-text-primary text-[11px]"
                                      dangerouslySetInnerHTML={{
                                        __html: String(
                                          t('vipClub:weeklyCashbackContent', {
                                            weeklyCashback: `Wager*1%*${bonus.weeklyCashbackPercentage}%`,
                                          }),
                                        ),
                                      }}
                                    ></div>
                                  </div>
                                </div>
                              )}
                              {type === 'monthly_cashback' && (
                                <div className="border-solid border-2 border-color-primary w-full rounded-[20px] p-3 flex gap-[16px] items-center h-full">
                                  <div className="min-w-[50px] min-h-[62px] flex items-center justify-center">
                                    {currentVipLevel >= selectedRank.startLevel ? (
                                      <Image
                                        src={'/img/vip/bonus_monthly_cashback.png'}
                                        width={50}
                                        height={51}
                                        alt="bonus monthly cashback"
                                      />
                                    ) : (
                                      <Image src={'/img/vip/lock.png'} width={26} height={30} alt="vip lock" />
                                    )}
                                  </div>
                                  <div className="flex flex-col gap-[6px]">
                                    <div className="text-[14px] text-black dark:text-white font-bold ">
                                      {t('vipClub:monthlyCashback')}
                                    </div>
                                    <div
                                      className="text-color-text-primary text-[11px]"
                                      dangerouslySetInnerHTML={{
                                        __html: String(
                                          t('vipClub:monthlyCashbackContent', {
                                            monthlyCashback: `Wager*1%*${bonus.monthlyCashbackPercentage}%`,
                                          }),
                                        ),
                                      }}
                                    ></div>
                                  </div>
                                </div>
                              )}
                            </>
                          );
                        })}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
            <div
              onClick={navigationVipPage}
              className="rounded-large flex justify-center w-full items-center cursor-pointer text-[14px] text-white font-semibold bg-gradient-btn-play shadow-bs-btn p-[10px]"
            >
              {t('vipClub:learnMore')}
            </div>
          </div>
        </>
      </CommonModal>
    </>
  );
}
