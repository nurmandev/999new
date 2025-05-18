import { Popover, Transition } from '@headlessui/react';
import { googleLogout } from '@react-oauth/google';
import cn from 'classnames';
import {
  Card,
  CardReceive,
  Chart,
  EmptyWallet,
  LogoutCurve,
  MoneyRecive,
  Repeat,
  Setting2,
  StatusUp,
  User,
  UserAdd,
} from 'iconsax-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Fragment, useEffect, useRef, useState } from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import { useDisconnect } from 'wagmi';

import { useTranslation } from '@/base/config/i18next';
import { API_AVATAR, ROUTER } from '@/base/constants/common';
import { CookiesStorage } from '@/base/libs/storage/cookie';
import { logoutState } from '@/base/redux/reducers/auth.reducer';
import {
  changeIsShowInformation,
  changeIsShowReferAndEarn,
  changeIsShowVipClubModal,
} from '@/base/redux/reducers/modal.reducer';
import { setUserData } from '@/base/redux/reducers/user.reducer';
import { logoutWallet } from '@/base/redux/reducers/wallet.reducer';
import { AppState, useAppDispatch } from '@/base/redux/store';

export default function ProfileDropdown() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { t } = useTranslation('');
  const { disconnect } = useDisconnect();

  const buttonRef = useRef<HTMLButtonElement>(null);
  const [openState, setOpenState] = useState(false);

  const toggleMenu = () => {
    setOpenState((openState) => !openState);
  };

  // Open the menu after a delay of timeoutDuration
  const onHover = (open: boolean, action: string) => {
    if ((!open && !openState && action === 'onMouseEnter') || (open && openState && action === 'onMouseLeave')) {
      toggleMenu();
    }
  };

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

  const { user } = useSelector(
    (state: AppState) => ({
      user: state.auth.user,
    }),
    shallowEqual,
  );

  const handleLogout = () => {
    CookiesStorage.logout();
    googleLogout();
    disconnect();
    dispatch(logoutState());
    dispatch(logoutWallet());
    router.replace(ROUTER.Home);
  };

  useEffect(() => {
    const innerWidth = window.innerWidth;
    if (innerWidth < 640) {
      setOpenState(true);
    }
  }, []);

  return (
    <>
      <Popover className="relative w-auto text-left rounded-[7px] sm:flex hidden">
        {({ open, close }) => (
          <div
            // onMouseEnter={() => onHover(open, 'onMouseEnter')}
            // onMouseLeave={() => onHover(open, 'onMouseLeave')}
            className="flex flex-col"
          >
            <Popover.Button ref={buttonRef}>
              <div className="relative rounded-large overflow-hidden dark:hover:bg-color-hover-primary hover:bg-color-light-bg-primary aspect-square">
                <Image
                  height={40}
                  width={40}
                  src={user.avatar ? `${API_AVATAR}/${user.avatar}` : '/img/avatar-1.png'}
                  alt="avatar"
                  onError={(e) => {
                    e.currentTarget.src = '/img/avatar-1.png';
                  }}
                  className="sm:h-[40px] sm:w-[40px] h-[30px] w-[30px]"
                />
              </div>
            </Popover.Button>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed sm:hidden block inset-0 bg-black/80 transition-opacity z-[-1]" />
            </Transition.Child>
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
                className="sm:absolute sm:mr-0 mr-[10px] fixed left-0 sm:left-auto sm:h-auto h-[100vh] right-0 !z-10 sm:min-w-[250px] min-w-[calc(100vw-20px)] origin-top-right ring-1 ring-black ring-opacity-5 focus:outline-none top-[50px]"
              >
                <>
                  <div className="h-14 sm:w-[40px] flex-1 w-0 absolute right-0 top-[-20px]"></div>
                  <div className="py-1 sm:relative fixed rounded-md dark:bg-color-menu-secondary bg-white sm:w-auto w-[100vw] shadow-gray-700 dark:shadow ">
                    <div>
                      <Link
                        onClick={close}
                        href={ROUTER.Balance}
                        className={cn(
                          'dark:hover:bg-color-menu-primary dark:hover:text-white dark:text-white text-color-light-text-primary hover:text-color-light-text-primary hover:bg-color-light-bg-primary',
                          'px-4 py-2 text-sm cursor-pointer flex items-center gap-[10px] dark:hover:text-white',
                        )}
                      >
                        <EmptyWallet className="w-[20px]" />
                        {t('layout:wallet')}
                      </Link>
                    </div>
                    <div>
                      <Link
                        onClick={close}
                        href={ROUTER.DepositCrypto}
                        className={cn(
                          'dark:hover:bg-color-menu-primary dark:hover:text-white dark:text-white text-color-light-text-primary hover:text-color-light-text-primary hover:bg-color-light-bg-primary',
                          'px-4 py-2 text-sm cursor-pointer flex items-center gap-[10px] dark:hover:text-white',
                        )}
                      >
                        <MoneyRecive className="w-[20px]" />
                        {t('layout:deposit')}
                      </Link>
                    </div>
                    <div>
                      <Link
                        onClick={close}
                        href={ROUTER.WithdrawCrypto}
                        className={cn(
                          'dark:hover:bg-color-menu-primary dark:hover:text-white dark:text-white text-color-light-text-primary hover:text-color-light-text-primary hover:bg-color-light-bg-primary',
                          'px-4 py-2 text-sm cursor-pointer flex items-center gap-[10px] dark:hover:text-white',
                        )}
                      >
                        <CardReceive className="w-[20px]" />
                        {t('layout:withdraw')}
                      </Link>
                    </div>
                    <div>
                      <Link
                        onClick={close}
                        href={ROUTER.Transaction}
                        className={cn(
                          'dark:hover:bg-color-menu-primary dark:hover:text-white dark:text-white text-color-light-text-primary hover:text-color-light-text-primary hover:bg-color-light-bg-primary',
                          'px-4 py-2 text-sm cursor-pointer flex items-center gap-[10px] dark:hover:text-white',
                        )}
                      >
                        <Repeat className="w-[20px]" />
                        {t('layout:transaction')}
                      </Link>
                    </div>
                    <div>
                      <Link
                        onClick={close}
                        href={ROUTER.Rollover}
                        className={cn(
                          'dark:hover:bg-color-menu-primary dark:hover:text-white dark:text-white text-color-light-text-primary hover:text-color-light-text-primary hover:bg-color-light-bg-primary',
                          'px-4 py-2 text-sm cursor-pointer flex items-center gap-[10px] dark:hover:text-white',
                        )}
                      >
                        <Chart className="w-[20px]" />
                        {t('sidebar:rolloverOverview')}
                      </Link>
                    </div>
                    <div>
                      <div
                        onClick={() => {
                          close();
                          dispatch(changeIsShowVipClubModal(true));
                        }}
                        className={cn(
                          'dark:hover:bg-color-menu-primary dark:hover:text-white dark:text-white text-color-light-text-primary hover:text-color-light-text-primary hover:bg-color-light-bg-primary',
                          'px-4 py-2 text-sm cursor-pointer flex items-center gap-[10px] dark:hover:text-white',
                        )}
                      >
                        <StatusUp className="w-[20px]" />
                        {t('sidebar:vipClub')}
                      </div>
                    </div>
                    <div>
                      <Link
                        onClick={close}
                        href={ROUTER.Affiliate}
                        className={cn(
                          'dark:hover:bg-color-menu-primary dark:hover:text-white dark:text-white text-color-light-text-primary hover:text-color-light-text-primary hover:bg-color-light-bg-primary',
                          'px-4 py-2 text-sm cursor-pointer flex items-center gap-[10px] dark:hover:text-white',
                        )}
                      >
                        <Card className="w-[20px]" />
                        {t('sidebar:affiliate')}
                      </Link>
                    </div>
                    <div>
                      <span
                        onClick={() => {
                          close();
                          dispatch(changeIsShowReferAndEarn(true));
                        }}
                        className={cn(
                          'dark:hover:bg-color-menu-primary dark:hover:text-white dark:text-white text-color-light-text-primary hover:text-color-light-text-primary hover:bg-color-light-bg-primary',
                          'px-4 py-2 text-sm cursor-pointer flex items-center gap-[10px] dark:hover:text-white',
                        )}
                      >
                        <UserAdd className="w-[20px]" />
                        {t('layout:referAndEarn')}
                      </span>
                    </div>
                    <div>
                      <span
                        onClick={() => {
                          close();
                          dispatch(setUserData({ userId: user.userId, userName: user.userName, avatar: user.avatar }));
                          dispatch(changeIsShowInformation(true));
                        }}
                        className={cn(
                          'dark:hover:bg-color-menu-primary dark:hover:text-white dark:text-white text-color-light-text-primary hover:text-color-light-text-primary hover:bg-color-light-bg-primary',
                          'px-4 py-2 text-sm cursor-pointer flex items-center gap-[10px] dark:hover:text-white',
                        )}
                      >
                        <User className="w-[20px]" />
                        {t('layout:profile')}
                      </span>
                    </div>
                    <div>
                      <Link
                        onClick={close}
                        href={ROUTER.SettingGeneral}
                        className={cn(
                          'dark:hover:bg-color-menu-primary dark:hover:text-white dark:text-white text-color-light-text-primary hover:text-color-light-text-primary hover:bg-color-light-bg-primary',
                          'px-4 py-2 text-sm cursor-pointer flex items-center gap-[10px] dark:hover:text-white',
                        )}
                      >
                        <Setting2 className="w-[20px]" />
                        {t('sidebar:settings')}
                      </Link>
                    </div>
                    <div className="h-[1px] w-full dark:bg-gray-700 bg-[#67707b4d]"></div>
                    <div>
                      <span
                        onClick={() => {
                          close();
                          handleLogout();
                        }}
                        className={cn(
                          'dark:hover:bg-color-menu-primary dark:hover:text-white dark:text-white text-color-light-text-primary hover:text-color-light-text-primary hover:bg-color-light-bg-primary',
                          'px-4 py-2 text-sm cursor-pointer flex items-center gap-[10px] dark:hover:text-white',
                        )}
                      >
                        <LogoutCurve className="w-[20px]" />
                        {t('layout:logOut')}
                      </span>
                    </div>
                  </div>
                </>
              </Popover.Panel>
            </Transition>
          </div>
        )}
      </Popover>
    </>
  );
}
