import { DialogProps, TransitionRootProps } from '@headlessui/react';
import { ChartBarIcon, ChevronRightIcon, ClipboardDocumentIcon } from '@heroicons/react/24/outline';
import cn from 'classnames';
import { Edit2 } from 'iconsax-react';
import Image from 'next/image';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import { ElementType, useCallback, useEffect, useState } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';

import { api_getProfile } from '@/api/user';
import { useTranslation } from '@/base/config/i18next';
import { API_AVATAR, API_GAME_IMAGE, dataRibbon, ROUTER } from '@/base/constants/common';
import { useExchange } from '@/base/hooks/useExchange';
import { convertUserInfo, copyClipBoard, currencyFormat1, formatDate } from '@/base/libs/utils';
import { convertGameIdentifierToUrl, convertToUrlCase } from '@/base/libs/utils/convert';
import { changeIsShowInformation, changeIsShowUpdateInformation } from '@/base/redux/reducers/modal.reducer';
import { AppState } from '@/base/redux/store';
import { UserDetail } from '@/base/types/common';
import Loader from '@/components/common/preloader/loader';
import CsrWrapper from '@/components/CsrWrapper';

import CommonModal from '../commonModal/commonModal';
import MasterMedals from './masterMedals/masterMedals';
import Statistic from './statistic/statistic';
import WagerContest from './wager/wager';

type ModalProfileProps = {
  onClose: () => void;
  show: boolean;
} & TransitionRootProps<ElementType> &
  DialogProps<ElementType>;

type FavoriteGameType = {
  id: string;
  title: string;
  identifier: string;
  totalWageredAmountUsd: number;
};

export default function ModalProfile({ show, onClose }: ModalProfileProps) {
  const { t } = useTranslation('');
  const { theme } = useTheme();
  const exchangeRate = useExchange();
  const { userId, viewInFiat, userData, localFiat, isLogin } = useSelector(
    (state: AppState) => ({
      viewInFiat: state.auth.user.generalSetting.settingViewInFiat,
      userId: state.auth.user.userId,
      userData: state.user,
      localFiat: state.wallet.localFiat,
      isLogin: state.auth.isLogin,
    }),
    shallowEqual,
  );

  const dispatch = useDispatch();

  const [user, setUser] = useState<UserDetail>();
  const [medals, setMedals] = useState<string[]>([]);
  const [listGame, setListGame] = useState<FavoriteGameType[]>([]);

  const [isStatistic, setIsStatistic] = useState<boolean>(false);
  const [isMedalsDetail, setIsMedalDetail] = useState<boolean>(false);

  const [vipData, setVipData] = useState<any>({
    medal: `/img/vip/vip-0-ribbon.png`,
    level: 'VIP 0',
    type: 'VIP',
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const getUserProfile = async (selectedUserId: string) => {
    try {
      setIsLoading(true);
      const res = await api_getProfile(selectedUserId || userId);
      const medals = res.data?.medals ?? [];
      const totalWins = res.data?.totalWins ?? 0;
      const totalBets = res.data?.totalBets ?? 0;
      const totalWagered = res.data?.totalWageredAmountUsd ?? 0;

      const tempFavoriteGame =
        res.data?.topThreeFavoriteGames?.map((item: any) => ({
          id: item?.id || '',
          title: item?.title || '',
          identifier: item?.identifier || '',
          totalWageredAmountUsd: Number(item.totalWageredAmountUsd || ''),
        })) ?? [];

      let medalData = dataRibbon.find((item) => item.name === res.data?.currentVipMedal);
      let medal = medalData?.img;
      const currentVipLevel = Number(res.data?.currentVipLevel || 0);
      if (currentVipLevel === 0) {
        medal = '/img/vip/vip-0-ribbon.png';
      }
      if (currentVipLevel === 1) {
        medal = '/img/vip/vip-1-ribbon.png';
      }
      setMedals(medals);
      setListGame(tempFavoriteGame);
      setVipData({
        medal: medal,
        level: res.data?.currentVipName ?? 'VIP 1',
        type: 'VIP',
      });
      setUser({ ...convertUserInfo(res.data), betCount: totalBets, winCount: totalWins, totalWager: totalWagered });
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const selectedUserId = userData.userId;
    setIsStatistic(false);
    if (show && selectedUserId) {
      getUserProfile(selectedUserId);
    }
  }, [userData, show]);

  const returnHeader = useCallback(() => {
    return (
      <>
        <div className="relative px-[12px] py-[20px] bg-color-light-bg-primary dark:bg-color-header-primary">
          <div>
            <div className="text-black dark:text-white md:text-[18px] text-[16px] px-[20px] font-bold">
              {t('profile:userInformation')}
            </div>
            <div className="absolute top-0 right-[70px] md:right-[90px]">
              <div className="w-full h-full">
                <div className="relative">
                  <Image
                    onError={(e) => {
                      e.currentTarget.src = `/img/vip/vip-0-ribbon.png`;
                    }}
                    src={vipData.medal ? vipData.medal : `/img/vip/vip-0-ribbon.png`}
                    width={70}
                    height={69}
                    alt="vip"
                    className="!h-[80px] sm:!h-[130px] w-auto object-cover"
                  />
                  <div
                    className="flex flex-col justify-center absolute top-0 bottom-0 left-0 right-0 text-center capitalize"
                  >
                    <p className="-mt-2 text-[8px] sm:text-[10px] leading-3 font-bold">{String(vipData.level).split(' ')?.at(0) || ''}</p>
                    <p className="text-[11px] sm:text-[12px] font-extrabold">{String(vipData.level).split(' ')?.at(1) || ''}</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative flex-1 flex gap-[10px] justify-between mt-[35px]">
              {/* <div
                role="button"
                className="py-[6px] px-[10px] rounded-default bg-white dark:bg-[#12181F] dark:hover:bg-gray-600 hover:bg-gray-200 h-fit flex items-center gap-[5px]"
              >
                <div className="flex w-[14px] h-[14px]">
                  <Image width={14} height={14} src="/img/heart.png" alt="" />
                </div>
                <div className="flex text-black dark:text-white">0</div>
              </div> */}
              <div className="flex flex-col items-center gap-[10px] w-full">
                <div className="h-[80px] w-[80px] rounded-full overflow-hidden">
                  <Image
                    height={80}
                    width={80}
                    src={user?.avatar ? `${API_AVATAR}/${user?.avatar}` : '/img/avatar-1.png'}
                    alt="avatar"
                    onError={(e) => {
                      e.currentTarget.src = '/img/avatar-1.png';
                    }}
                  />
                </div>
                <div className="text-black dark:text-white text-[24px] font-[700]">{user?.userName}</div>
                <div className="text-[14px] text-color-text-primary w-full flex justify-evenly items-center">
                  <div className="text-center">
                    {t('profile:userID')}: {user?.userId}
                  </div>
                  <button
                    className="dark:hover:text-white hover:text-gray-500"
                    onClick={() => copyClipBoard(user?.userId || '')}
                  >
                    <ClipboardDocumentIcon width={20} height={20} />
                  </button>
                </div>
              </div>
              {user?.userId === userId && (
                <div
                  className="absolute top-2 right-3 sm:p-[10px] text-black dark:text-white dark:hover:text-white p-2 rounded-default bg-white dark:bg-color-card-bg-primary dark:hover:bg-gray-600 hover:bg-gray-200 h-fit text-[14px] "
                  onClick={() => {
                    dispatch(changeIsShowUpdateInformation(true));
                    dispatch(changeIsShowInformation(false));
                  }}
                  role="button"
                >
                  <Edit2 size={16} />
                </div>
              )}
            </div>
          </div>
        </div>
      </>
    );
  }, [isStatistic, isMedalsDetail, vipData, user]);

  const returnBody = useCallback(() => {
    if (!user) return <Loader />;
    // if selected User is not signIn user and selected user sets hideGamingData
    if (user?.userId !== userId && user?.privacySetting.settingHideGamingData) {
      return (
        <>
          <div className="flex flex-col gap-[6px] overflow-y-auto px-[12px] pt-[4px] pb-[17px] scrollbar">
            <div className="rounded-[10px] px-5 py-5 h-[300px]">
              <div className="text-[16px] text-color-light-text-primary dark:text-white">{t('profile:statistics')}</div>
              <div className="flex justify-center mt-4">
                <Image width={200} height={200} src="/img/noStatistic.png" alt="hidden statistic" />
              </div>
              <div className="text-[14px] text-color-text-primary flex justify-center">
                {t('profile:statisticsHidden')}
              </div>
            </div>
            <div className="text-color-text-primary text-[14px] w-full text-center mt-[10px]">
              {t('profile:joinedOn')} {formatDate(new Date(user?.createdAt ?? ''), 'dd/MM/yyyy')}
            </div>
          </div>
        </>
      );
    }
    return (
      <div className="relative h-full bg-color-header-primary">
        <div
          className={cn('absolute top-0 left-0 right-0 px-4 transition-all duration-300 bg-color-header-primary', {
            'translate-x-0': isStatistic,
            'translate-x-full': !isStatistic,
          })}
        >
          <Statistic userData={user} isShow={isStatistic} onBack={() => setIsStatistic(false)} />
        </div>
        <div
          className={cn(
            'w-full flex flex-col gap-[6px] overflow-y-auto px-4 pt-[4px] pb-[17px] h-full dark:bg-color-header-primary bg-color-light-bg-primary scrollbar overflow-hidden',
            'absolute top-0 left-0 right-0 transition-all duration-300',
            {
              'translate-x-0': !isStatistic,
              'translate-x-full': isStatistic,
            },
          )}
        >
          <div className="w-full flex flex-col gap-2 pb-16 sm:pb-4">
            {/* Hiding medal on user profile */}
            {/* <div className="rounded-[5px] dark:bg-color-modal-bg-primary bg-white px-[14px] pt-[16px] pb-[12px]">
            <div className="flex items-center justify-between" onClick={() => setIsMedalDetail(true)}>
              <div className="flex gap-2 text-black dark:text-white text-[16px] items-center align-middle">
                <TrophyIcon width={18} height={18} className="stroke-[2]" />
                <div>{t('profile:medal')}</div>
                <div>{medals.length}</div>
              </div>
              <div className="flex items-center gap-[5px] cursor-pointer">
                <div className="text-color-primary text-[14px]">{t('profile:details')}</div>
                <ChevronRightIcon width={14} className="text-color-primary" />
              </div>
            </div>
            <div className="mt-[12px] flex gap-[14px] items-center flex-nowrap overflow-auto scrollbar cursor-pointer pb-[5px]">
              {groupMedal.map((item, index) => (
                <Image
                  src={item.img}
                  alt=""
                  width={44}
                  onClick={() => setIsMedalDetail(true)}
                  height={662}
                  key={index}
                  className={cn({
                    'opacity-[0.5]': medals.findIndex((medal) => medal === item.key) === -1,
                    'opacity-100': medals.findIndex((medal) => medal === item.key) !== -1,
                  })}
                />
              ))}
            </div>
          </div> */}
            <div className="bg-white dark:bg-color-panel-bg py-[12px] px-[14px] rounded-[5px]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 align-middle">
                  <ChartBarIcon width={18} height={18} className="stroke-[2]" />
                  <div className="text-black dark:text-white text-default sm:text-[16px]">
                    {t('profile:statistics')}
                  </div>
                </div>
                <div
                  className="flex items-center gap-[5px] cursor-pointer"
                  onClick={() => {
                    setIsStatistic(true);
                  }}
                >
                  <div className="text-color-primary text-[14px]">{t('profile:details')}</div>
                  <ChevronRightIcon width={14} className="text-color-primary" />
                </div>
              </div>
              <div className="flex items-center flex-row gap-2 sm:gap-[15px] sm:justify-between mt-5">
                <div className="bg-[#f5f6fa] dark:bg-color-card-body-secondary rounded-default flex flex-col justify-center items-center gap-[8px] pt-[16px] pb-[12px] h-[80px] w-full sm:w-[30%]">
                  <div className="flex gap-[5px] items-center">
                    <Image src="/img/icon/total-win.png" width={12} height={12} className="w-[12px] h-[12px]" alt="total win" />
                    <div className="text-[10px] sm:text-[14px] text-color-text-primary">{t('profile:totalWins')}</div>
                  </div>
                  <div className="text-[14px] sm:text-[1rem] dark:text-white text-black">{user.winCount}</div>
                </div>
                <div className="bg-[#f5f6fa] dark:bg-color-card-body-secondary rounded-default flex flex-col justify-center items-center gap-[8px] pt-[16px] pb-[12px] h-[80px] w-full sm:w-[30%]">
                  <div className="flex gap-[5px] items-center">
                    <Image src="/img/icon/total-bets.png" width={12} height={12} className="w-[12px] h-[12px]" alt="total bets" />
                    <div className="text-[10px] sm:text-[14px] text-color-text-primary">{t('profile:totalBets')}</div>
                  </div>
                  <div className="text-[14px] sm:text-[1rem] dark:text-white text-black">{user.betCount}</div>
                </div>
                <div className="bg-[#f5f6fa] dark:bg-color-card-body-secondary rounded-default flex flex-col justify-center items-center gap-[8px] pt-[16px] pb-[12px] h-[80px] w-full sm:w-[30%]">
                  <div className="flex gap-[5px] items-center">
                    <Image
                      src="/img/icon/total-wagered.png"
                      width={12}
                      height={12}
                      className="w-[12px] h-[12px]"
                      alt="total wagered"
                    />
                    <div className="text-[10px] sm:text-[14px] text-color-text-primary">
                      {t('profile:totalWagered')}
                    </div>
                  </div>
                  <div className="text-[14px] sm:text-[1rem] dark:text-white text-black truncate max-w-full px-1">
                    {viewInFiat ? (
                      <>{currencyFormat1(user.totalWager * exchangeRate, 2, localFiat?.name || 'USD')}</>
                    ) : (
                      <>{currencyFormat1(user.totalWager, 2)}</>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="px-5 py-5 bg-white dark:bg-color-panel-bg rounded-default">
              <div className="text-default sm:text-[16px] text-color-light-text-primary dark:text-white mb-[10px]">
                {t('profile:top3FavoriteGames')}
              </div>
              {!!listGame.length && (
                <div className="flex flex-col gap-[5px] mt-[15px]">
                  {listGame.map((item, index) => (
                    <div className="flex items-center justify-between" key={index}>
                      <Link href={ROUTER.GameDetail(convertGameIdentifierToUrl(item.identifier || ''))}>
                        <div className="flex items-center gap-[10px]" onClick={onClose}>
                          <Image
                            height={60}
                            width={60}
                            src={`${API_GAME_IMAGE}/icon/${(item.identifier || '').replace(':', '_')}.png`}
                            alt="game logo"
                            onError={(err) => {
                              err.currentTarget.src = '/img/recommended-game-3.png';
                            }}
                            className="object-cover max-h-auto rounded-[5px]"
                          />
                          <div className="text-[14px] text-color-text-primary">{item.title}</div>
                        </div>
                      </Link>
                      <div className="text-[14px] text-color-text-primary text-right">
                        <div>{t('profile:wagered')}</div>
                        <div className="text-white">
                          {viewInFiat
                            ? currencyFormat1(item.totalWageredAmountUsd * exchangeRate, 2, localFiat?.name || 'USD')
                            : currencyFormat1(item.totalWageredAmountUsd, 2)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {!listGame.length && (
                <div className="flex flex-col items-center gap-[15px] text-[#53575C] md:!text-[14px] !text-[12px]">
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
            </div>
            <div className="dark:bg-color-panel-bg bg-white rounded-[10px] py-5">
              <div className="text-default sm:text-[16px] text-color-light-text-primary dark:text-white px-5">
                {t('profile:wagerContest')}
              </div>
              <WagerContest userData={user} />
            </div>
            <div className="text-color-text-primary text-[14px] w-full text-center mt-[10px]">
              {t('profile:joinedOn')} {formatDate(new Date(user?.createdAt ?? ''), 'dd/MM/yyyy')}
            </div>
          </div>
        </div>
      </div>
    );
  }, [user, userId, isStatistic, isMedalsDetail, viewInFiat, listGame, isLoading, medals, exchangeRate]);

  return (
    <>
      <CommonModal
        show={show}
        onClose={onClose}
        panelClass="rounded max-w-full sm:max-w-[540px] h-full max-h-full sm:!h-[720px] sm:max-h-[90vh] !m-0"
        header={returnHeader()}
      >
        <>
          {isLoading && <Loader />}
          <MasterMedals
            isShow={isMedalsDetail}
            onClose={() => {
              setIsMedalDetail(false);
              dispatch(changeIsShowInformation(false));
            }}
            goBackToProfile={() => {
              setIsMedalDetail(false);
              dispatch(changeIsShowInformation(true));
            }}
          />

          {returnBody()}
        </>
      </CommonModal>
    </>
  );
}
