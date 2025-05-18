import 'swiper/css';
import 'swiper/css/pagination';

import { Popover, Transition } from '@headlessui/react';
import cn from 'classnames';
import Image from 'next/image';
import { Fragment, useEffect, useRef } from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import { Autoplay } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

import { useExchange } from '@/base/hooks/useExchange';
import { currencyFormat1 } from '@/base/libs/utils';
import { AppState } from '@/base/redux/store';

export default function PriceDropdown() {
  const exchange = useExchange();
  const { cryptoSymbols, localFiat, viewInFiat } = useSelector(
    (state: AppState) => ({
      viewInFiat: state.auth.user.generalSetting.settingViewInFiat,
      localFiat: state.wallet.localFiat,
      cryptoSymbols: state.wallet.symbols,
    }),
    shallowEqual,
  );
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleClickOutside = (event: any) => {
    if (buttonRef.current && !buttonRef.current.contains(event?.target)) {
      event.stopPropagation();
    }
  };
  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  });

  return (
    <>
      <Popover className="relative w-auto text-left rounded-default min-w-[100px] px-[10px] sm:px-0 sm:min-w-[130px]">
        {({ open }) => (
          <div className="flex flex-col w-auto">
            <Popover.Button ref={buttonRef}>
              <div className="relative overflow-hidden">
                <Swiper
                  direction={'vertical'}
                  autoplay={{
                    delay: 1500,
                    disableOnInteraction: false,
                  }}
                  loop={true}
                  modules={[Autoplay]}
                  className="max-h-[48px]"
                >
                  {cryptoSymbols.map((symbol, index) => (
                    <SwiperSlide key={index}>
                      <div className="flex justify-center items-center h-[48px] gap-1 sm:gap-2 w-auto">
                        <Image
                          width={32}
                          height={32}
                          src={symbol.logo}
                          className="hidden sm:inline h-7 w-7"
                          alt="symbol"
                          onError={(e) => {
                            e.currentTarget.src = '/img/fiats/USD.png';
                          }}
                        />
                        <div className="flex flex-col w-full font-bold text-black text-start text-default dark:text-white">
                          <span className="font-semibold text-gray-300 text-[12px]">{symbol.name}</span>
                          <div className="leading-3 text-[11px] text-yellow-300 font-semibold">
                            {viewInFiat ? (
                              <>
                                {currencyFormat1(
                                  symbol.price * exchange,
                                  symbol.price > 0.1 ? 2 : 8,
                                  localFiat?.name || 'USD',
                                )}
                              </>
                            ) : (
                              <>{currencyFormat1(symbol.price, symbol.price > 0.1 ? 2 : 8)}</>
                            )}
                          </div>
                        </div>
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>
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
                className="sm:absolute sm:mr-0 mr-[10px] fixed left-0 sm:left-auto sm:h-auto h-[100vh] right-0 !z-10 sm:min-w-[350px] min-w-[calc(100vw-20px)] origin-top-right ring-1 ring-black ring-opacity-5 focus:outline-none top-[60px]"
              >
                <div className="max-h-[600px] scrollbar overflow-y-scroll border border-solid border-color-card-body-primary px-5 py-1 sm:relative fixed rounded-md dark:bg-color-header-primary bg-white sm:w-auto w-[100vw] shadow-gray-700 drop-shadow-sm ">
                  {cryptoSymbols.map((symbol, index) => (
                    <div
                      key={index}
                      className={cn('flex justify-between items-center py-[10px]', {
                        'border-b border-solid border-b-color-card-body-primary': index < cryptoSymbols.length - 1,
                      })}
                    >
                      <div className="flex items-center justify-start gap-2">
                        <Image
                          width={32}
                          height={32}
                          src={symbol.logo}
                          className="inline"
                          alt="symbol"
                          onError={(e) => {
                            e.currentTarget.src = '/img/fiats/USD.png';
                          }}
                        />
                        <div className="flex-1 font-bold text-black text-start text-default dark:text-white">
                          {symbol.name}
                          <div className="mt-[2px] leading-3 text-[12px] text-gray-400">{symbol.alias}</div>
                        </div>
                      </div>
                      <div className="font-bold text-white text-default">
                        {viewInFiat ? (
                          <>
                            {currencyFormat1(
                              symbol.price * exchange,
                              symbol.price > 0.1 ? 2 : 10,
                              localFiat?.name || 'USD',
                            )}
                          </>
                        ) : (
                          <>{currencyFormat1(symbol.price, symbol.price > 0.1 ? 2 : 10)}</>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </Popover.Panel>
            </Transition>
          </div>
        )}
      </Popover>
    </>
  );
}
