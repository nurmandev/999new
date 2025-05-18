import { DialogProps, TransitionRootProps } from '@headlessui/react';
import cn from 'classnames';
import { ArrowRight2, Headphone, ShieldTick, Simcard2, Snapchat } from 'iconsax-react';
import Image from 'next/image';
import Link from 'next/link';
import { ElementType, useState } from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import { toast } from 'react-toastify';

import { useTranslation } from '@/base/config/i18next';
import { API_AVATAR, API_GAME_IMAGE, ROUTER, TIME_SUBMIT_FORMAT_WITH_MARKER, TOAST_ENUM } from '@/base/constants/common';
import { useExchange } from '@/base/hooks/useExchange';
import { useHeight } from '@/base/hooks/useHeight';
import { currencyFormat1, formatDate, formatLengthNumber, handleLocaleSymbol } from '@/base/libs/utils';
import { convertGameIdentifierToUrl, convertToUrlCase } from '@/base/libs/utils/convert';
import { changeIsShowInformation } from '@/base/redux/reducers/modal.reducer';
import { setUserData } from '@/base/redux/reducers/user.reducer';
import { AppState, useAppDispatch } from '@/base/redux/store';
import { BetTableDataType } from '@/base/types/common';
import Loader from '@/components/common/preloader/loader';

import CommonModal from '../commonModal/commonModal';

type ModalDetailBetsProps = {
  onClose: () => void;
  show: boolean;
} & TransitionRootProps<ElementType> &
  DialogProps<ElementType>;

export default function ModalDetailBets({ show, onClose }: ModalDetailBetsProps) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const height = useHeight();
  const { detailsBet } = useSelector(
    (state: AppState) => ({
      detailsBet: state.modal.detailBets,
    }),
    shallowEqual,
  );

  const exchangeRate = useExchange();
  const { t } = useTranslation('');
  const dispatch = useAppDispatch();

  const { userId, localFiat, userName, viewInFiat } = useSelector(
    (state: AppState) => ({
      localFiat: state.wallet.localFiat,
      userId: state.auth.user.userId,
      userName: state.auth.user.userName,
      viewInFiat: state.auth.user.generalSetting.settingViewInFiat,
    }),
    shallowEqual,
  );

  const copy = (text: string) => {
    toast.success(t('success:copied'), { containerId: TOAST_ENUM.COMMON, toastId: 'bet-detail-modal-copy' });
    navigator.clipboard.writeText(text);
  };

  const openModalProfileUser = (data: BetTableDataType) => {
    const userData = {
      username: data.player,
      avatar: data.playerAvatar,
      userId: data.playerId,
    };
    dispatch(setUserData(userData));
    dispatch(changeIsShowInformation(true));
  };

  return (
    <>
      <CommonModal show={show} onClose={onClose} panelClass={`max-w-full sm:max-w-[450px] sm:!h-[70vh]`}>
        <div className="bg-gradient-card-modal h-full pt-[16px] px-[16px]">
          <div className="text-[16px] dark:text-white text-black font-[600] p-4">
            {detailsBet?.titleModal || String(t('gameDetail:betDetail'))}
          </div>
          {isLoading && <Loader />}
          <div className="flex flex-col justify-between h-[calc(100%-80px)]">
            <div>
              <div className="px-[16px]">
                <div className="h-[1px] bg-white dark:bg-color-primary/40 mb-[10px]" />
                <div className="flex items-center justify-center">
                  <div className="text-center">
                    <div className="font-bold dark:text-white text-black text-[12px] sm:text-[14px]">
                      {t('gameTable:profit')}
                    </div>
                    <div className="flex items-center gap-[6px] font-bold">
                      <Image height={20} width={20} src={`/img/fiats/${detailsBet.betDetail.currency}.png`} alt="currency" />
                      <div
                        className={`text-[22px] font-bold ${Number(detailsBet.betDetail.profitAmount) >= 0 ? 'text-color-text-green' : 'text-color-red-primary'
                          }`}
                      >
                        {detailsBet.betDetail.profitAmount > 0 ? '+' : '-'}
                        {viewInFiat
                          ? `${currencyFormat1(
                            Math.abs(detailsBet.betDetail.profitAmountUsd * exchangeRate),
                            8,
                            localFiat?.name || 'USD',
                          )}`
                          : `${currencyFormat1(Math.abs(detailsBet.betDetail.profitAmount), 8, '', false)} `}
                      </div>
                      <div className="text-[22px] text-black dark:text-white">
                        {viewInFiat
                          ? handleLocaleSymbol(String(detailsBet.betDetail.currency))
                          : detailsBet.betDetail.currency}
                      </div>
                    </div>
                  </div>
                  {/* <Image src={'/img/icon/icon-share.png'} width={15} height={15} alt="" /> */}
                </div>
                <div className="h-[1px] bg-white dark:bg-color-primary/40 mt-[10px]" />
              </div>
              <div className="mt-[8px] flex items-center justify-evenly">
                <div className="flex flex-col w-full">
                  <div className="text-center text-[10px] text-[#31373d] dark:text-color-text-primary">
                    {t('gameTable:betAmount')}
                  </div>
                  <div className="flex justify-center items-center gap-[3px]">
                    <Image height={15} width={15} src={`/img/fiats/${detailsBet.betDetail?.currency}.png`} alt="currency" />

                    <div className="font-bold text-[14px] dark:text-white text-black">
                      {viewInFiat
                        ? `${currencyFormat1(
                          detailsBet.betDetail.betAmountUsd * exchangeRate,
                          8,
                          localFiat?.name || 'USD',
                        )}`
                        : `${currencyFormat1(detailsBet.betDetail.betAmount, 8, '', false)} `}
                    </div>
                  </div>
                </div>
                <div className="w-[1px] h-[41px] dark:bg-color-primary/40 bg-white" />
                <div className="w-full text-center">
                  <div className="text-[10px] dark:text-color-text-primary text-[#f5f6fa]">{t('gameTable:payout')}</div>
                  <div className="font-bold text-[14px] dark:text-white text-black">
                    {`${formatLengthNumber(detailsBet.betDetail.multiplier, 2)} X`}
                  </div>
                </div>
              </div>
              <div className="h-[1px] bg-white dark:bg-color-primary/40 mx-4 mt-[10px] mb-10" />
              <div className="flex items-center gap-[8px] px-[16px]">
                {detailsBet.betDetail.playerId?.toString() !== userId && !detailsBet.isPublicProfile ? (
                  <Image
                    height={44}
                    width={44}
                    className="rounded-full grayscale brightness-50"
                    src="/img/avatar-hidden.png"
                    alt="avatar hidden"
                  />
                ) : (
                  <Image
                    height={44}
                    className="rounded-full"
                    width={44}
                    src={
                      detailsBet.betDetail.playerAvatar
                        ? `${API_AVATAR}/${detailsBet.betDetail.playerAvatar}`
                        : '/img/avatar-1.png'
                    }
                    alt="avatar"
                    onError={(e) => {
                      e.currentTarget.src = '/img/avatar-1.png';
                    }}
                  />
                )}
                <div className="flex flex-col w-full">
                  <div className="flex items-center gap-[5px] mb-[5px] justify-between">
                    <div
                      className={cn('text-[12px]', {
                        'hover:underline cursor-pointer dark:text-white text-black': !(
                          detailsBet.betDetail.playerId !== userId && !detailsBet.isPublicProfile
                        ),
                        'point-event-none text-color-text-primary':
                          detailsBet.betDetail.playerId !== userId && !detailsBet.isPublicProfile,
                      })}
                      onClick={() => {
                        if (detailsBet.betDetail.playerId !== userId && !detailsBet.isPublicProfile) return;
                        openModalProfileUser(detailsBet.betDetail);
                      }}
                    >
                      {detailsBet.betDetail.playerId !== userId && !detailsBet.isPublicProfile ? (
                        <div className="flex gap-[5px] items-center">
                          <Snapchat width={12} height={12} variant="Bulk" className="w-5 h-5" />
                          {t('homePage:hidden')}
                        </div>
                      ) : detailsBet.betDetail.playerId === userId ? (
                        userName
                      ) : (
                        detailsBet.betDetail.player
                      )}
                    </div>
                    <div className="text-[12px] dark:text-color-text-primary text-[#31373d]">
                      On {formatDate(new Date(detailsBet.betDetail.time ?? new Date()), TIME_SUBMIT_FORMAT_WITH_MARKER)}
                    </div>
                  </div>
                  <div className="flex items-center gap-[3px] justify-between">
                    <div className="text-[12px] min-w-[40px]">{t('gameTable:betId')}:</div>
                    <div className="flex gap-[5px] items-center">
                      <ShieldTick variant="Bold" className="w-[16px] h-[16px] text-color-primary" />
                      <div className="text-[11px] dark:text-white text-black text-right">
                        {detailsBet.betDetail.betId}
                      </div>
                      <Simcard2
                        role="button"
                        variant="Bold"
                        onClick={() => copy(String(detailsBet.betDetail.betId))}
                        className="w-[16px] h-[16px] text-color-text-primary"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-5 rounded-[5px] py-[9px] px-[10px] flex items-center justify-between mx-[6px]">
                <div className="flex items-center gap-[7px]">
                  <Image
                    width={38}
                    height={38}
                    src={`${API_GAME_IMAGE}/icon/${detailsBet.betDetail.gameIdenfiter.replace(':', '_')}.png`}
                    alt="game logo"
                    className="object-cover max-h-auto rounded-[5px]"
                    onError={(e) => {
                      e.currentTarget.src = '/img/recommended-game-3.png';
                    }}
                  />
                  <div>
                    <div className="text-[12px] dark:text-white text-black">{detailsBet.betDetail.game}</div>
                    <div className="text-[12px] dark:text-color-text-primary text-[#31373d] mt-[7px]">
                      {detailsBet.betDetail.providerName}
                    </div>
                  </div>
                </div>
                <Link
                  className="flex items-center gap-1 group dark:text-color-primary text-[#31373d] dark:hover:text-white hover:text-black"
                  role="button"
                  href={ROUTER.GameDetail(convertGameIdentifierToUrl(detailsBet.betDetail.gameIdenfiter))}
                  onClick={() => {
                    onClose();
                  }}
                >
                  <div className="text-[12px] font-bold">{t('gameTable:playNow')}</div>
                  <ArrowRight2 className="w-[12px] h-[12px] text-color-primary font-bold" />
                </Link>
              </div>
            </div>
            {detailsBet.titleModal ? (
              <div className="dark:bg-[#282A30] bg-[#f5f6fa] cursor-pointer rounded-[5px] group py-[9px] px-[10px] flex items-center justify-between mx-[6px] dark:text-color-text-primary text-[#31373d] dark:hover:text-white hover:text-black">
                <p className="text-[12px] dark:text-color-text-primary text-[#31373d]">{t('gameTable:gameDetails')}</p>
                <ArrowRight2 className="w-[12px] h-[12px]" />
              </div>
            ) : (
              <div className="flex items-center mx-[6px] justify-between px-4">
                <div className="text-[11px] dark:text-color-text-primary text-[#31373d] max-w-[230px]">
                  {t('gameTable:anyIssues')}
                </div>
                <div
                  className="flex items-center gap-[5px] cursor-pointer"
                  onClick={() => window.open('mailto:info@bonenza.com')}
                >
                  <Headphone className="w-[16px] h-[16px] text-color-primary" />
                  <div className="font-bold text-[11px] dark:text-color-primary text-[#31373d]">
                    {t('gameTable:liveSupport')}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </CommonModal>
    </>
  );
}
