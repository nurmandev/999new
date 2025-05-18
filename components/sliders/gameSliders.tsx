import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';

import cn from 'classnames';
import Image from 'next/image';
import Link from 'next/link';
import React, { useRef } from 'react';
import { A11y, Autoplay, Navigation, Pagination, Scrollbar } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

import { BANNER_DATA } from '@/base/constants/common';
import { useWidth } from '@/base/hooks/useWidth';

const GameBannerSlider = ({ className }: { className?: string }) => {
  const width = useWidth();
  const swiperRef = useRef<any>();

  const handleMouseEnter = () => {
    swiperRef?.current?.swiper?.autoplay?.stop();
  };

  const handleMouseLeave = () => {
    swiperRef?.current?.swiper?.autoplay?.start();
  };

  return (
    <div className={cn('block', className)} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      <Swiper
        ref={swiperRef}
        spaceBetween={10}
        slidesPerView={1}
        slidesPerGroup={1}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        speed={width > 600 ? 1500 : 500}
        loop={true}
        direction={'horizontal'}
        modules={[Autoplay, Navigation, Pagination, Scrollbar, A11y]}
        className="sm:!pb-[30px] !pb-0 banner-slider"
        breakpoints={{
          350: {
            slidesPerView: 2,
            slidesPerGroup: 2,
          },
          870: {
            slidesPerView: 3,
            slidesPerGroup: 3,
          },
          1400: {
            slidesPerView: 4,
            slidesPerGroup: 4,
          },
          1600: {
            slidesPerView: 5,
            slidesPerGroup: 5,
          },
        }}
      >
        {BANNER_DATA.map((banner, id) => {
          return (
            <SwiperSlide key={id}>
              <Link href={banner.url}>
                <Image width={443} height={196} className="object-cover w-full rounded-large" src={banner.img} alt="banner" />
              </Link>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  );
};

export default GameBannerSlider;
