import cn from 'classnames';
import { ArrowRight2 } from 'iconsax-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { ElementType, useEffect, useState } from 'react';

import { useTranslation } from '@/base/config/i18next';
import { ROUTER, Tags } from '@/base/constants/common';
import { setCasinoTab } from '@/base/redux/reducers/common.reducer';
import { useAppDispatch } from '@/base/redux/store';

export type OptionSidebarDataType = {
  title: string;
  href: string;
  icon: ElementType;
  isMobile?: boolean;
  image?: string;
};

export type IconOptionProps = {
  title?: string;
  smallIcon?: JSX.Element;
  icon: ElementType;
  imageURL?: string;
  imageClass?: string;
  textClass?: string;
  count?: number;
  href: string;
  classNames?: string;
  activeClassNames?: string;
  activeTextClassNames?: string;
  onClick?: () => void;
  isDropDown?: boolean;
  isShowDropDown?: boolean;
  fontWeight?: number;
  isFontMedium?: boolean;
  isDisabled?: boolean;
  data?: OptionSidebarDataType[];
};

const casinoPaths = [
  '/casino',
  ...Tags
]

const IconOption = ({
  title,
  href,
  classNames,
  activeClassNames,
  activeTextClassNames,
  icon,
  isDropDown,
  fontWeight = 400,
  isFontMedium = false,
  data,
  imageURL,
  count = 0,
  imageClass,
  textClass,
  isDisabled = false,
  onClick,
}: IconOptionProps) => {
  const { t } = useTranslation('');
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { pathname } = router;
  const IconElement = icon;
  const [showDropDown, setShowDropDown] = useState(
    casinoPaths.some((path) => pathname !== '/' && pathname.includes(path)),
  );

  useEffect(() => {
    if (!showDropDown) {
      setShowDropDown(casinoPaths.some((path) => pathname !== '/' && pathname.includes(path)));
    }
  }, [pathname]);
  return (
    <>
      {!isDropDown &&
        (href.length > 0 ? (
          <Link
            className={cn(
              'relative capitalize sm:text-default text-m_default ',
              'hover:bg-color-menu-hover',
              'bg-transparent',
              'dark:text-color-text-primary hover:text-[#000] dark:hover:text-white',
              'flex items-center gap-[16px] flex-1 pl-[24px] pr-[10px] py-[10px]',
              'rounded-large hover:rounded-large',
              classNames,
              router.route.includes(href) && activeClassNames,
              {
                'font-[700] dark:text-white text-color-light-text-primary': router.route.includes(href),
              }
            )}
            href={href}
            onClick={() => {
              // disable hide menus
              setShowDropDown(!showDropDown);
              onClick?.();
            }}
          >
            {imageURL ? (
              <Image src={imageURL} width={20} height={20} className={imageClass} alt="image" />
            ) : (
              <IconElement
                size={18}
              />
            )}
            <div
              className={cn(
                `flex-1 text-start font-[${fontWeight}]`,
                textClass,
                router.route.includes(href) ? activeTextClassNames : '',
                {
                  'text-[15px]': isFontMedium,
                },
              )}
            >
              {title}
            </div>
          </Link>
        ) : (
          <div
            className={cn(
              'relative capitalize sm:text-default text-m_default cursor-pointer',
              'hover:bg-color-menu-hover',
              'bg-transparent',
              'dark:text-color-text-primary hover:text-[#000] dark:hover:!text-white',
              'flex items-center gap-[16px] flex-1 pl-[24px] pr-[10px] py-[10px]',
              'rounded-large hover:rounded-large',
              classNames,
            )}
            onClick={() => {
              // disable hide menus
              // setShowDropDown(!showDropDown);
              onClick?.();
            }}
          >
            {imageURL ? (
              <Image src={imageURL} width={20} height={20} className={imageClass} alt="image" />
            ) : (
              <IconElement
                size={18}
              />
            )}
            {count > 0 && (
              <div className="absolute flex items-center justify-center w-6 h-6 p-1 font-extrabold text-center text-white rounded-full bg-color-primary text-m_default -right-2 -top-2">
                {count}
              </div>
            )}
            <div
              className={cn(`flex-1 text-start font-[${fontWeight}] dark:hover:text-white`, textClass, {
                'text-[15px]': isFontMedium,
              })}
            >
              {title}
            </div>
          </div>
        ))}
      {isDropDown && (
        <div
          className={cn(
            'capitalize block rounded-large cursor-pointer',
            'dark:bg-transparent',
            'dark:text-color-text-primary text-default',
            'transition-[height] ease-in-out duration-300',
            classNames,
            `font-[${fontWeight}]`
          )}
        >
          <div
            className={cn(
              'flex items-center gap-[16px] flex-1 pl-[24px] p-[10px]',
              'dark:hover:!text-white hover:!text-gray-800 dark:text-gray-400 text-gray-800 rounded-large',
              'hover:bg-color-menu-hover',
              {
                'dark:bg-color-menu-hover !text-white font-[700]': router.asPath.includes(href),
              },
            )}
            onClick={() => {
              // disable hide menus
              onClick?.();
            }}
          >
            <IconElement
              size={18}
            />
            <div
              className={cn('flex-1 text-start dark:hover:text-white', `font-[${fontWeight}]`, {
                'text-[15px]': isFontMedium,
              })}
            >
              {title}
            </div>
            <ArrowRight2
              className={`w-3 h-3 mr-1 transition-all font-bold duration-150 ${showDropDown ? 'rotate-90' : 'rotate-0'}`}
              onClick={(e) => { e.stopPropagation(); setShowDropDown(!showDropDown); }}
            />
          </div>
          <div
            className={cn('transition-all overflow-hidden duration-[200] flex flex-col', {
              'max-h-0': !showDropDown,
              'max-h-[800px]': showDropDown,
            })}
            onClick={() => {
              dispatch(setCasinoTab(false));
              localStorage.removeItem('tab');
            }}
          >
            {data?.map((item, index) => {
              const SubIconElement = item.icon;
              if (item.href)
                return (
                  <Link
                    href={item.href}
                    className={cn(
                      'flex items-center gap-[16px] py-[10px]',
                      'pl-[24px] dark:hover:!text-white dark:text-color-text-primary text-gray-800 hover:!text-gray-800 rounded-large',
                      'hover:bg-color-menu-hover',
                      {
                        'dark:bg-color-menu-hover !text-white': router.asPath.replaceAll('/', '') === item.href.replaceAll('/', ''),
                        'text-[15px]': isFontMedium,
                      },
                    )}
                    key={index}
                  >
                    <SubIconElement size={18} />
                    <div className={cn('flex-1 text-start font-normal')}>{t(item.title)}</div>
                  </Link>
                );
              else
                return (
                  <div
                    className="flex items-center gap-[16px] py-[10px] dark:hover:bg-color-hover-primary focus:bg-color-light-bg-primary pl-5 hover:bg-gray-200 dark:hover:!text-white dark:text-gray-400 text-gray-800 hover:!text-gray-800"
                    key={index}
                  >
                    <SubIconElement size={18} />
                    <div className={cn('flex-1 text-start font-bold', { 'text-base': isFontMedium })}>
                      {item.title}
                    </div>
                  </div>
                );
            })}
          </div>
        </div>
      )}
    </>
  );
};

export default IconOption;
