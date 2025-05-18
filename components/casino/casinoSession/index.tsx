import Image from 'next/image';
import Link from 'next/link';
import React, { ReactNode, useCallback, useMemo, useRef } from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import Slider, { Settings } from 'react-slick';

import { useTranslation } from '@/base/config/i18next';
import { AppState } from '@/base/redux/store';

type CasinoSessionProps<T> = {
  icon?: JSX.Element;
  title?: string;
  data: T[];
  renderItem: (game: T) => ReactNode;
  onClickItem?: (game: T) => void;
  sliderSetting?: Settings;
  viewAllUrl?: string;
  slidesToScroll?: number;
  isShowArrow?: boolean;
};

const CasinoSession = <T,>({
  title,
  icon,
  data,
  renderItem,
  sliderSetting,
  viewAllUrl,
  isShowArrow = true,
  onClickItem,
  slidesToScroll,
}: CasinoSessionProps<T>): JSX.Element => {
  const { t } = useTranslation('');
  const sliderRef = useRef<Slider>(null);

  const nextSlide = () => {
    if (sliderRef.current) {
      sliderRef.current.slickNext();
    }
  };

  const prevSlide = () => {
    if (sliderRef.current) {
      sliderRef.current.slickPrev();
    }
  };

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

  const featureSettings: Settings = useMemo(() => {
    return {
      lazyLoad: 'ondemand',
      speed: 1000,
      autoplay: true,
      slidesToShow: 8,
      infinite: data.length > 8,
      swipeToSlide: true,
      initialSlide: 0,
      arrows: false,
      className: 'slick-container',
      responsive: [
        {
          breakpoint: 1680,
          settings: {
            slidesToShow: handleSlideToShow(8),
            infinite: data.length > handleSlideToShow(8),
          },
        },
        {
          breakpoint: 1540,
          settings: {
            slidesToShow: handleSlideToShow(7),
            infinite: data.length > handleSlideToShow(7),
          },
        },
        {
          breakpoint: 1400,
          settings: {
            slidesToShow: handleSlideToShow(6),
            infinite: data.length > handleSlideToShow(6),
          },
        },
        {
          breakpoint: 1279,
          settings: {
            slidesToShow: 6,
            infinite: data.length > 6,
          },
        },
        {
          breakpoint: 960,
          settings: {
            slidesToShow: 5,
            infinite: data.length > 5,
          },
        },
        {
          breakpoint: 780,
          settings: {
            slidesToShow: 4,
            infinite: data.length > 4,
          },
        },
        {
          breakpoint: 540,
          settings: {
            slidesToShow: 3,
            infinite: data.length > 3,
          },
        },
        {
          breakpoint: 420,
          settings: {
            slidesToShow: 2,
            infinite: data.length > 2,
          },
        },
      ],
      ...sliderSetting,
    };
  }, [data.length, handleSlideToShow, slidesToScroll, sliderSetting]);

  return (
    <>
      {!!data.length && (
        <div className="w-full relative">
          <div className="flex items-center gap-[10px] justify-between">
            <div className="flex items-center gap-[10px]">
              {icon}
              <div className="font-[600] text-white sm:text-[18px] text-[16px]">{title}</div>
            </div>
            {isShowArrow && (
              <div className="flex gap-[5px] justify-end">
                {viewAllUrl && (
                  <Link
                    href={viewAllUrl}
                    role="button"
                    className="bg-[#1D1E22] rounded-[5px] font-bold text-[10px] text-white px-[10px] py-[8px] hover:bg-[#6b7180] hover:text-white"
                  >
                    {t('gameDetail:viewAll')}
                  </Link>
                )}
                <div
                  role="button"
                  className="bg-[#1D1E22] rounded-[5px] p-[10px] hover:bg-[#6b7180]"
                  onClick={() => {
                    prevSlide();
                  }}
                >
                  <Image src={'/img/icon/arrow-prev.png'} width={10} height={10} alt="arrow prev" />
                </div>
                <div
                  role="button"
                  className="bg-[#1D1E22] rounded-[5px] p-[10px] hover:bg-[#6b7180]"
                  onClick={() => {
                    nextSlide();
                  }}
                >
                  <Image src={'/img/icon/arrow-next.png'} width={10} height={10} alt="arrow next" />
                </div>
              </div>
            )}
          </div>
          <div className={`mt-[15px]`}>
            <Slider {...featureSettings} ref={sliderRef}>
              {data?.map((game, key) => {
                return (
                  <div key={key} className="cursor-pointer" onClick={() => onClickItem?.(game)}>
                    {renderItem(game)}
                  </div>
                );
              })}
            </Slider>
          </div>
        </div>
      )}
    </>
  );
};

export default CasinoSession;
