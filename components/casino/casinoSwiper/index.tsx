import 'swiper/css';

import cn from 'classnames';
import { ArrowLeft2, ArrowRight2 } from 'iconsax-react';
import React, { ReactNode, useCallback, useEffect, useRef, useState } from 'react';
import { isMobile } from 'react-device-detect';
import { shallowEqual, useSelector } from 'react-redux';
import { A11y, Autoplay, Navigation } from 'swiper/modules';
import { Swiper, SwiperSlide, useSwiper } from 'swiper/react';

import { useWidth } from '@/base/hooks/useWidth';
import { AppState } from '@/base/redux/store';

type CasinoSwiperProps<T> = {
  icon?: JSX.Element;
  title?: string;
  data: T[];
  maxCount?: number;
  renderItem: (game: T) => ReactNode;
  onClickItem?: (game: T) => void;
  delay?: number;
  isRecent?: boolean;
  speed?: number;
};

type SwiperButtonArrowProps<T> = {
  arrow: 'left' | 'right';
};

const SwiperButtonArrow = <T,>({ arrow }: SwiperButtonArrowProps<T>) => {
  const swiper = useSwiper();
  return (
    <div
      role="button"
      className={cn(
        'dark:bg-[#1D1E22] bg-white text-gray-400 rounded-[3px] p-[10px] hover:dark:bg-color-hover-primary',
      )}
      onClick={() => {
        if (arrow === 'left') {
          swiper.slidePrev();
        } else {
          swiper.slideNext();
        }
      }}
    >
      {arrow === 'left' && <ArrowLeft2 size={10} />}
      {arrow === 'right' && <ArrowRight2 size={10} />}
    </div>
  );
};

const CasinoSwiper = <T,>({
  title,
  icon,
  data,
  renderItem,
  onClickItem,
  maxCount = 7,
  delay = 1000,
  isRecent = true,
  speed = 500,
}: CasinoSwiperProps<T>): JSX.Element => {
  const width = useWidth();
  const [slide, setSlide] = useState<number>(maxCount);
  const swiperRef = useRef<any>();

  const { showChatType, isToggleSidebar } = useSelector(
    (state: AppState) => ({
      showChatType: state.modal.showChatType,
      isToggleSidebar: state.modal.isToggleSidebar,
    }),
    shallowEqual,
  );

  const handleSlideToShow = useCallback(
    (num: number) => {
      let newNum = num;
      if (showChatType) newNum -= 2;
      if (isToggleSidebar) newNum--;
      return newNum;
    },
    [showChatType, isToggleSidebar],
  );

  useEffect(() => {
    handleNumberSlide(window.innerWidth);
    window.addEventListener('resize', (e: UIEvent) => handleNumberSlide((e.target as Window).innerWidth));
  }, [handleSlideToShow]);

  const handleNumberSlide = (width: number) => {
    if (width > 1890) {
      setSlide(8);
    } else if (width > 1335) {
      setSlide(handleSlideToShow(7));
    } else if (width > 1200) {
      setSlide(handleSlideToShow(6));
    } else if (width > 1163) {
      setSlide(6);
    } else if (width > 991) {
      setSlide(5);
    } else if (width > 860) {
      setSlide(4);
    } else if (width > 693) {
      setSlide(3);
    } else {
      setSlide(3);
    }
  };

  const handleMouseEnter = () => {
    swiperRef?.current?.swiper?.autoplay?.stop();
  };

  const handleMouseLeave = () => {
    swiperRef?.current?.swiper?.autoplay?.start();
  };

  return (
    <>
      {!!data?.length && (
        <div className="w-full relative">
          <div className="w-full" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
            <div className="flex items-center gap-[10px] justify-between mb-[15px]">
              <div className="flex items-center gap-[10px]">
                {icon}
                <div className="font-[600] dark:text-white text-black text-default sm:text-[16px] md:text-m_title">
                  {title}
                </div>
              </div>
            </div>
            <Swiper
              ref={swiperRef}
              slidesPerView={width >= 640 ? (isRecent ? 'auto' : slide) : 3}
              freeMode={true}
              autoplay={{
                delay: delay,
                disableOnInteraction: true,
              }}
              speed={speed}
              spaceBetween={width >= 640 ? 10 : 0}
              className="sm:!h-auto !h-[120px]"
              direction={width >= 640 ? 'horizontal' : 'vertical'}
              modules={[Autoplay, A11y, Navigation]}
            >
              {!isRecent && (
                <div slot="container-start" className="flex justify-end mb-[15px]">
                  <SwiperButtonArrow arrow="left" />
                  <SwiperButtonArrow arrow="right" />
                </div>
              )}

              {data?.map((game: T, key) => {
                return (
                  <SwiperSlide
                    key={key}
                    className={cn(`w-full !mb-0 !p-[0px] sm:!p-0 max-w-full `, {
                      'sm:max-w-[84px]': isRecent,
                      'sm:max-w-game-card': !isRecent,
                    })}
                    onClick={() => onClickItem?.(game)}
                  >
                    {renderItem(game)}
                  </SwiperSlide>
                );
              })}
            </Swiper>
          </div>
        </div>
      )}
    </>
  );
};

export default CasinoSwiper;
