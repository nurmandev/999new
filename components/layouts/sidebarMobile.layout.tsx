import cn from 'classnames';
import { Command, Diamonds, SearchNormal } from 'iconsax-react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useMemo } from 'react';
import { shallowEqual } from 'react-redux';
import { useSelector } from 'react-redux';

import { useTranslation } from '@/base/config/i18next';
import { ROUTER } from '@/base/constants/common';
import { casinoCategories, casinoGames } from '@/base/constants/config-menus';
import {
  changeAuthenticationType,
  changeIsShowAuthenticationModal,
  changeIsShowCasinoSearch,
  changeIsShowDailyContest,
  changeIsShowMenuPannel,
  changeIsShowVipClubModal,
} from '@/base/redux/reducers/modal.reducer';
import { AppState, useAppDispatch } from '@/base/redux/store';
import { AuthenticationModeEnum } from '@/base/types/common';

import IconOption, { IconOptionProps } from '../common/iconOption/iconOption';
import CsrWrapper from '../CsrWrapper';
import LiveCasinoIcon from '../icons/LiveCasinoIcon';

const SidebarMobileLayout: React.FC = () => {
  const { t, i18n } = useTranslation('');
  const dispatch = useAppDispatch();

  const { isShowSidebar, isLogin } = useSelector(
    (state: AppState) => ({
      isShowSidebar: state.modal.isShowMenuPannel,
      isLogin: state.auth.isLogin,
    }),
    shallowEqual,
  );

  const router = useRouter();

  const initDatas: IconOptionProps[] = useMemo(
    () => [
      {
        title: String(t('sidebar:vipClub')),
        href: '#',
        icon: Diamonds,
        onClick: () => {
          if (!isLogin) {
            dispatch(changeAuthenticationType(AuthenticationModeEnum.SIGN_IN));
            dispatch(changeIsShowAuthenticationModal(true));
          } else {
            dispatch(changeIsShowMenuPannel(false));
            dispatch(changeIsShowVipClubModal(true));
          }
        },
      },
      {
        title: String(t('sidebar:affiliate')),
        href: ROUTER.Affiliate,
        icon: Command,
      },
    ],
    [i18n.language, isLogin],
  );

  return (
    <div
      className={cn(
        'fixed w-screen max-h-[calc(100vh_-_150px)] transition-transform duration-800 origin-bottom overflow-y-auto top-[130px] bottom-[60px] dark:bg-color-bg-primary bg-color-light-bg-primary shadow sm:hidden',
        {
          'translate-y-[120%]': !isShowSidebar,
          'translate-y-0': isShowSidebar,
        },
      )}
    >
      <div className="flex flex-col gap-[10px] px-[12px] pb-[20px]">
        <div className="relative">
          <div
            className="relative h-[40px] dark:bg-color-input-secondary dark:text-color-text-primary bg-white rounded-default flex items-center justify-start px-[10px] gap-[20px]"
            onClick={() => {
              dispatch(changeIsShowMenuPannel(!isShowSidebar));
              dispatch(changeIsShowCasinoSearch(true));
            }}
            role="button"
          >
            <SearchNormal width={24} height={24} className="text-color-text-primary" />
            <div className={cn('w-full text-[14px] text-color-text-primary outline-none')}>
              {t('casino:gameNameAndProvider')}
            </div>
          </div>
        </div>
        <div className="relative grid grid-cols-3 gap-[8px]">
          {casinoCategories.map((item, index) => {
            const IconElement = item.icon;
            return (
              <Link
                key={index}
                href={item.href}
                onClick={() => dispatch(changeIsShowMenuPannel(false))}
                className="flex flex-col gap-[5px] px-[10px] py-[16px] items-center justify-center dark:bg-color-hover-primary bg-white rounded-default dark:text-color-text-primary text-color-light-text-primary"
              >
                {
                  <IconElement
                    size={18}
                    className={cn('', {
                      'font-[700] dark:text-white text-black': router.route.includes(item.href),
                    })}
                  />
                }
                <span className={cn('text-[13px]', { 'dark:text-white text-black': router.route.includes(item.href) })}>
                  {t(item.title)}
                </span>
              </Link>
            );
          })}
        </div>
        <ul className="flex flex-col content-center list-none bg-white md:flex-col md:min-w-full dark:bg-color-hover-primary rounded-default">
          <span className="dark:text-color-text-primary text-color-light-text-primary px-[12px] py-[5px] text-[12px] border-solid border-b-[1px] dark:border-color-border-primary border-color-light-border-primary">
            {t('layout:games')}
          </span>
          <IconOption
            title={String(t('sidebar:dailyContest'))}
            href="#"
            icon={LiveCasinoIcon}
            onClick={() => {
              dispatch(changeIsShowMenuPannel(false));
              dispatch(changeIsShowDailyContest(true));
            }}
            classNames="dark:hover:text-white dark:!text-white text-color-light-text-primary !bg-transparent hover:bg-[#e3ecf3] rounded pl-[10px] !py-[14px]"
          />
          {initDatas.map((item, index) => (
            <CsrWrapper key={index}>
              <IconOption
                title={item.title}
                href={item.href}
                icon={item.icon}
                onClick={item.onClick}
                classNames="dark:hover:text-white dark:!text-white text-color-light-text-primary !bg-transparent hover:bg-[#e3ecf3] rounded pl-[10px] !py-[14px]"
              />
            </CsrWrapper>
          ))}
          {casinoGames.map((game, index) => (
            <CsrWrapper key={index}>
              <IconOption
                title={String(t(game.title))}
                href={game.href}
                icon={game.icon}
                classNames="dark:hover:text-white dark:!text-white text-color-light-text-primary !bg-transparent hover:bg-[#e3ecf3] rounded pl-[10px] !py-[14px]"
                onClick={() => dispatch(changeIsShowMenuPannel(false))}
              />
            </CsrWrapper>
          ))}
        </ul>

      </div>
    </div>
  );
};

export default SidebarMobileLayout;
