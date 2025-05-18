import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';

import cn from 'classnames';
import { ArrowRight2, Snapchat } from 'iconsax-react';
import Image from 'next/image';
import { useCallback, useEffect, useRef } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { Tooltip } from 'react-tooltip';
import { A11y, Autoplay, Navigation, Pagination, Scrollbar } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

import { useTranslation } from '@/base/config/i18next';
import { API_GAME_IMAGE } from '@/base/constants/common';
import { useExchange } from '@/base/hooks/useExchange';
import { useWidth } from '@/base/hooks/useWidth';
import { currencyFormat1 } from '@/base/libs/utils';
import { changeIsShowDetailBets, changeIsShowInformation, setDetailBets } from '@/base/redux/reducers/modal.reducer';
import { setUserData } from '@/base/redux/reducers/user.reducer';
import { AppState } from '@/base/redux/store';
import { BetDetailType } from '@/base/types/common';

type CardBigWinProps = {
  price: number;
  currency: string;
  imgCard: string;
  userData?: { userId: string; username: string };
};

const convertImage = (w: number, h: number) => `
  <svg width="${w}" height="${h}" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
    <defs>
      <linearGradient id="g">
        <stop stop-color="#333" offset="20%" />
        <stop stop-color="#222" offset="50%" />
        <stop stop-color="#333" offset="70%" />
      </linearGradient>
    </defs>
    <rect width="${w}" height="${h}" fill="#333" />
    <rect id="r" width="${w}" height="${h}" fill="url(#g)" />
    <animate xlink:href="#r" attributeName="x" from="-${w}" to="${w}" dur="1s" repeatCount="indefinite"  />
  </svg>`;

const toBase64 = (str: string) =>
  typeof window === 'undefined' ? Buffer.from(str).toString('base64') : window.btoa(str);

export function CardBigWin({ price, imgCard, userData, currency }: CardBigWinProps) {
  const exchangeRate = useExchange();
  const dispatch = useDispatch();
  const { t } = useTranslation('');
  const { userId, userName } = useSelector(
    (state: AppState) => ({
      userId: state.auth.user.userId,
      userName: state.auth.user.userName,
    }),
    shallowEqual,
  );

  const openModalProfileUser = (event: any) => {
    event.stopPropagation();
    dispatch(setUserData(userData));
    if (userData?.username) {
      dispatch(changeIsShowInformation(true));
    }
  };

  const { localFiat, viewInFiat } = useSelector(
    (state: AppState) => ({
      localFiat: state.wallet.localFiat,
      viewInFiat: state.auth.user.generalSetting.settingViewInFiat,
    }),
    shallowEqual,
  );
  return (
    <>
      <div className="sm:max-w-[120px] max-w-full cursor-pointer flex sm:flex-col flex-row sm:gap-[5px] items-center justify-between bg-[#31373D77] pb-0 sm:pb-2 sm:rounded-large overflow-hidden px-1 sm:px-0">
        <div className="sm:w-full w-auto flex sm:flex-col items-center gap-[6px]">
          <Image
            height={96}
            width={96}
            src={imgCard}
            alt="recommended game"
            className="sm:w-full w-[36px] h-[auto] object-contain sm:rounded-t-default"
            placeholder="blur"
            onError={(err) => {
              err.currentTarget.src = '/img/recommended-game-3.png';
            }}
            blurDataURL={`data:image/svg+xml;base64,${toBase64(convertImage(96, 96))}`}
          />
          <div
            onClick={openModalProfileUser}
            className={cn('font-light text-[13px] sm:text-[11px] hover:underline min-h-[18px] text-center', {
              'dark:text-color-text-primary text-color-light-text-primary pointer-events-none cursor-text':
                userData?.userId !== userId && !userData?.username,
              'dark:text-white text-black': !(userData?.userId !== userId && !userData?.username),
            })}
          >
            {userData?.userId !== userId && !userData?.username ? (
              <span className="flex items-center">
                <Snapchat width={12} height={12} variant="Bulk" className="w-5 h-5 mr-1" />
                {String(t('homePage:hidden'))}
              </span>
            ) : userData.userId === userId ? (
              <div className="sm:w-[84px] truncate px-2 text-left sm:text-center">{userName}</div>
            ) : (
              <div className="sm:w-[84px] truncate px-2 text-left sm:text-center">{userData?.username}</div>
            )}
          </div>
        </div>
        <div className="flex gap-[5px]">
          <div
            data-tooltip-id={'CardBigWinData' + price}
            className="hidden sm:flex cursor-pointer sm:w-full  justify-center items-center text-center sm:rounded-[5px] mr-1"
          >
            <div className="text-[#FF9E4F] font-light sm:font-semibold text-[12px] sm:text-[10px] truncate">
              {viewInFiat ? currencyFormat1(price * exchangeRate, 2, localFiat?.name || 'USD', true, true) : `${currencyFormat1(price, 2, '', false, true)} ${currency}`}
            </div>
          </div>
          <div className="flex sm:hidden cursor-pointer sm:w-full justify-center text-center sm:rounded-[5px] mr-1 gap-[5px]">
            <div className="text-[#FF9E4F] font-light sm:font-semibold text-[12px] sm:text-[10px] truncate">
              {viewInFiat ? currencyFormat1(price * exchangeRate, 2, localFiat?.name || 'USD', true, false) : `${currencyFormat1(price, 2, '', false, false)} ${currency}`}
            </div>
            <Image
              src={currency ? `/img/fiats/${currency.toUpperCase()}.png` : '/img/fiats/USDT.png'}
              width={12}
              height={12}
              alt="currency"
              className="w-4 h-4"
              onError={(e) => {
                e.currentTarget.src = '/img/fiats/USDT.png';
              }}
            />
          </div>
          <ArrowRight2 width={12} height={12} variant="Bulk" className="w-4 h-4 block sm:hidden" />
        </div>
      </div>
      <Tooltip id={'CardBigWinData' + price} place="bottom" className="dark:bg-gray-700 bg-white z-[30]" opacity={100}>
        <div className="text-white font-normal text-default">{price}</div>
      </Tooltip>
    </>
  );
}

function RecentBigWinComponent({ listBigWinGame }: { listBigWinGame: BetDetailType[] }) {
  const { t } = useTranslation('');

  const dispatch = useDispatch();

  const { localFiat, viewInFiat } = useSelector(
    (state: AppState) => ({
      localFiat: state.wallet.localFiat,
      viewInFiat: state.auth.user.generalSetting.settingViewInFiat,
      isLogin: state.auth.isLogin,
    }),
    shallowEqual,
  );

  const renderData = useCallback(
    (item: BetDetailType) => {
      const userData = {
        userId: item.userId,
        username: item.userName,
      };
      return (
        <CardBigWin
          userData={userData}
          currency={item.currency}
          price={viewInFiat ? item.profitUsd : item.profit}
          imgCard={`${API_GAME_IMAGE}/icon/${item.identifier.replace(':', '_')}.png`}
        />
      );
    },
    [localFiat, viewInFiat],
  );

  const width = useWidth();
  const swiperRef = useRef<any>();

  const handleMouseEnter = () => {
    swiperRef?.current?.swiper?.autoplay?.stop();
  };

  const handleMouseLeave = () => {
    swiperRef?.current?.swiper?.autoplay?.start();
  };

  useEffect(() => {
    setTimeout(() => { swiperRef?.current?.swiper?.autoplay?.start() }, 500);
  }, []);
  return (
    <div className={cn('w-full relative')} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      <div className="flex gap-2 items-center mb-4 font-[600] dark:text-white text-black text-default sm:text-[16px] md:text-m_title">
        <div className="relative flex h-3 w-3 sm:hidden">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[limegreen] opacity-75"></span>
          <span className="relative inline-flex h-3 w-3 rounded-full bg-[limegreen]"></span>
        </div>
        {t('homePage:recentBigWins')}
      </div>
      <Swiper
        ref={swiperRef}
        className="sm:!h-auto !h-[120px] banner-slider"
        spaceBetween={width >= 640 ? 10 : 0}
        autoplay={{
          delay: 600,
          disableOnInteraction: false,
        }}
        speed={500}
        loop={true}
        direction={width >= 640 ? 'horizontal' : 'vertical'}
        modules={[Autoplay, Navigation, Pagination, Scrollbar, A11y]}
        breakpoints={{
          350: {
            slidesPerView: 3,
            slidesPerGroup: 1,
          },
          640: {
            slidesPerView: 6,
            slidesPerGroup: 1,
          },
          900: {
            slidesPerView: 8,
            slidesPerGroup: 1,
          },
          1200: {
            slidesPerView: 10,
            slidesPerGroup: 1,
          },
          1600: {
            slidesPerView: 12,
            slidesPerGroup: 1,
          },
          1920: {
            slidesPerView: 14,
            slidesPerGroup: 1,
          },
        }}
      >
        {listBigWinGame.map((item, id) => {
          return (
            <SwiperSlide key={id}
              className="w-full !mb-0 !p-[0px] sm:!p-0 max-w-full sm:max-w-auto"
              onClick={() => {
                dispatch(
                  setDetailBets({
                    betDetail: {
                      game: item.game,
                      gameIdenfiter: item.identifier,
                      player: item.userName,
                      playerId: item.userId,
                      playerAvatar: item.userAvatar,
                      betAmount: item.amount,
                      betAmountUsd: item.amountUsd,
                      multiplier: item.multiplier,
                      profitAmount: item.profit,
                      profitAmountUsd: item.profitUsd,
                      currency: item.currency,
                      betId: item.id,
                      time: new Date(),
                      providerName: item.providerName,
                    },
                    isPublicProfile: !!item?.userName,
                  }));
                dispatch(changeIsShowDetailBets(true));
              }}>
              {renderData(item)}
            </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  );
}

export default RecentBigWinComponent;
