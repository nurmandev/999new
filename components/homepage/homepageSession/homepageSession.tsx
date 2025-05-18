import Image from 'next/image';
import React from 'react';
import cn from 'classnames';
import { useTranslation } from '@/base/config/i18next';
import { shallowEqual, useSelector } from 'react-redux';
import { AppState } from '@/base/redux/store';

type HomepageSessionProps = {
  title?: string;
  iconUrl?: string;
  children?: React.ReactNode;
  showIcon: boolean;
  isHome?: boolean;
};

const HomepageSession = ({
  title,
  iconUrl = '/img/icon/live-stream.png',
  children,
  showIcon,
  isHome = false,
}: HomepageSessionProps) => {
  const { t } = useTranslation('');
  const { isLogin } = useSelector(
    (state: AppState) => ({
      isLogin: state.auth.isLogin,
    }),
    shallowEqual,
  );

  return (
    <div
      className={cn('w-full relative sm:block', {
        hidden: isHome && !isLogin,
        block: !isHome || isLogin,
      })}
    >
      <div className="flex items-center gap-[10px]">
        <Image className={`${showIcon ? 'block' : 'hidden'}`} height={24} width={24} src={iconUrl} alt="homepage" />
        <div className="font-[600] dark:text-white text-[#000] text-default sm:text-[16px] md:text-m_title">{title}</div>
      </div>
      <div className={`mt-[15px] lg:max-w-[calc(100vw)]`}>{children}</div>
    </div>
  );
};

export default HomepageSession;
