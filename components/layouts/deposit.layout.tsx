import { Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import cn from 'classnames';
import {
  CardReceive,
  Chart,
  EmptyWallet,
  MoneyChange,
  MoneyRecive,
  Repeat,
} from 'iconsax-react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { Fragment } from 'react';
import { shallowEqual, useSelector } from 'react-redux';

import { useTranslation } from '@/base/config/i18next';
import { ROUTER } from '@/base/constants/common';
import {
  changeIsShowBonusHistory,
  changeIsShowRakeBack,
  changeIsShowRakeBackDetail,
} from '@/base/redux/reducers/modal.reducer';
import { AppState, useAppDispatch } from '@/base/redux/store';

import CommonSession from '../common/baseSession/baseSession';
import IconOption from '../common/iconOption/iconOption';
import MetaHead from '../metaHead/metaHead';
import ModalBonusHistory from '../modal/rakeBack/bonusHistory/bonusHistory';
import ModalRakeBack from '../modal/rakeBack/rakeBack';
import ModalRakeBackDetail from '../modal/rakeBack/rakeBackDetail/rakeBackDetail';
import BaseLayout from './base.layout';
import styles from './deposit.module.scss';

type DepositLayoutProps = {
  children: JSX.Element;
  mainCustomClass?: string;
};

const DepositLayout: React.FC<DepositLayoutProps> = ({ children }) => {
  const dispatch = useAppDispatch();
  const LIST_SIDEBAR_DEPOSIT = [
    {
      icon: EmptyWallet,
      name: 'sidebar:balance',
      href: ROUTER.Balance,
    },
    {
      icon: MoneyRecive,
      name: 'sidebar:deposit',
      href: ROUTER.DepositCrypto,
    },
    {
      icon: CardReceive,
      name: 'sidebar:withdraw',
      href: ROUTER.WithdrawCrypto,
    },
    {
      icon: MoneyChange,
      name: 'sidebar:swap',
      href: ROUTER.Swap,
    },
  ];

  const LIST_SIDEBAR_DEPOSIT_MOBILE = [
    {
      icon: MoneyRecive,
      title: 'sidebar:deposit',
      href: ROUTER.DepositCrypto
    },
    {
      icon: EmptyWallet,
      title: 'sidebar:balance',
      href: ROUTER.Balance,
    },
    {
      icon: CardReceive,
      title: 'sidebar:withdraw',
      href: ROUTER.WithdrawCrypto
    },
    {
      icon: MoneyChange,
      title: 'sidebar:swap',
      href: ROUTER.Swap
    }
  ]

  const { isShowRakeBackModal, isShowModalBonusHistory, isShowRakeBackDetailModal } = useSelector(
    (state: AppState) => ({
      isShowRakeBackModal: state.modal.isShowRakeBackModal,
      isShowModalBonusHistory: state.modal.isShowModalBonusHistory,
      isShowRakeBackDetailModal: state.modal.isShowRakeBackDetailModal,
    }),
    shallowEqual,
  );

  const router = useRouter();
  const { t } = useTranslation('');

  return (
    <>
      <MetaHead />
      <div className="sm:block hidden">
        <BaseLayout isDetailPage>
          <>
            <div className="flex flex-wrap gap-7 w-full text-center py-[20px] sm:mb-0 mb-14">
              <CommonSession title={String(t('sidebar:wallet'))}>
                <div className="flex flex-row gap-5 w-full text-center mt-0 mb-[50px]">
                  <div
                    className={cn(
                      styles.cardMenu,
                      'dark:bg-color-modal-bg-secondary bg-white',
                      'rounded-default xl:min-w-[175px] min-w-[none] h-fit',
                      'dark:text-color-text-primary text-color-light-text-primary',
                      'border-solid border-[1px] border-color-bg-primary border-r-color-card-body-primary shadow-bs-default'
                    )}
                  >
                    <div className="xl:p-2 p-1 w-full">
                      <ul className="lg:flex hidden flex-col justify-center gap-2 w-full rounded-xl">
                        {LIST_SIDEBAR_DEPOSIT.map((item, index) => (
                          <IconOption
                            title={String(t(item.name))}
                            href={item.href}
                            icon={item.icon}
                            key={index}
                            fontWeight={600}
                            classNames="dark:hover:!text-white dark:hover:!bg-color-menu-hover text-color-light-text-primary rounded !bg-transparent pr-[15px]"
                            activeClassNames="dark:!bg-color-menu-primary !bg-[#eaecf3] dark:!text-white !text-black"
                          />
                        ))}
                        <IconOption
                          title={String(t('sidebar:transactions'))}
                          href={ROUTER.Transaction}
                          icon={Repeat}
                          fontWeight={600}
                          classNames="dark:hover:text-white dark:hover:!bg-color-menu-hover text-color-light-text-primary rounded !bg-transparent pr-[15px]"
                          activeClassNames="dark:!bg-color-menu-primary !bg-[#eaecf3] dark:!text-white !text-black"
                        />
                        <IconOption
                          title={String(t('sidebar:rolloverOverview'))}
                          href={ROUTER.Rollover}
                          icon={Chart}
                          fontWeight={600}
                          classNames="dark:hover:text-white dark:hover:!bg-color-menu-hover text-color-light-text-primary rounded !bg-transparent pr-[15px]"
                          activeClassNames="dark:!bg-color-menu-primary !bg-[#eaecf3] dark:!text-white !text-black"
                        />
                      </ul>
                      <ul className="lg:hidden flex flex-col justify-center gap-3 rounded-xl">
                        {LIST_SIDEBAR_DEPOSIT.map((item, index) => {
                          const IconComponent = item.icon;
                          return (
                            <Link
                              key={index}
                              href={item.href}
                              className={cn(
                                'flex flex-col dark:text-color-text-primary dark:hover:text-white dark:hover:bg-color-hover-primary hover-bg[#f5f6fa66] bg-transparent py-2 text-[14px] items-center justify-between px-2 h-full rounded gap-1',
                                {
                                  'dark:!bg-color-active-primary !bg-[#eaecf3] dark:text-white text-black':
                                    router.route.includes(item.href),
                                },
                              )}
                            >
                              <IconComponent size={18} />
                            </Link>
                          );
                        })}
                        <Link
                          href={ROUTER.Transaction}
                          className={cn(
                            'flex flex-col dark:text-color-text-primary text-black dark:hover:text-white dark:hover:bg-color-hover-primary hover:bg-white dark:bg-transparent bg-white py-2 text-[14px] items-center justify-between px-2 h-full rounded gap-1',
                            {
                              'dark:!bg-color-active-primary !bg-[#eaecf3] dark:text-white text-black':
                                router.route.includes(ROUTER.Transaction),
                            },
                          )}
                        >
                          <Repeat size={18} />
                        </Link>
                        <Link
                          href={ROUTER.Rollover}
                          className={cn(
                            'flex flex-col dark:text-color-text-primary text-black dark:hover:text-white dark:hover:bg-color-hover-primary hover:bg-white dark:bg-transparent bg-white py-2 text-[14px] items-center justify-between px-2 h-full rounded gap-1',
                            {
                              'dark:text-white text-black dark:!bg-color-active-primary bg-color-light-bg-primary':
                                router.route.includes(ROUTER.Rollover),
                            },
                          )}
                        >
                          <Chart size={18} />
                        </Link>
                      </ul>
                    </div>
                  </div>
                  <div
                    className={cn(
                      styles.cardMain,
                      'flex-1 text-white dark:bg-color-modal-bg-secondary bg-white rounded-default p-[20px] min-h-fit',
                      'border-solid border-[1px] border-color-bg-primary border-r-color-card-body-primary shadow-bs-default'
                    )}
                  >
                    {children}
                  </div>
                </div>
              </CommonSession>
            </div>
          </>
        </BaseLayout>
      </div>
      <div className="sm:hidden block">
        <Transition show={true}>
          <div className={cn("inset-0 z-10 dark:bg-color-modal-bg-secondary bg-white min-h-screen")}>
            <div className="flex min-h-full sm:items-center items-start justify-center sm:p-4 text-center p-0">
              <Transition.Child
                as={Fragment}
                enter="transition ease-out duration-200"
                enterFrom="opacity-0 translate-x-1"
                enterTo="opacity-100 translate-x-0"
                leave="transition ease-in duration-150"
                leaveFrom="opacity-100 translate-x-0"
                leaveTo="opacity-0 translate-x-1"
              >
                <div className="w-full flex flex-col dark:bg-color-modal-secondary bg-white">
                  <div className="w-full dark:bg-color-card-bg-primary dark:text-color-text-primary bg-white text-color-light-text-primary pl-[15px] pr-[10px] py-[15px] flex items-center fixed max-h-[60px] z-10 gap-2">
                    <div className="flex-1 flex justify-between items-center">
                      <div className="text-[14px] sm:text-[16px] font-bold dark:text-white text-black">
                        {t('sidebar:wallet')}
                      </div>
                      <div className="flex items-center text-[12px] gap-[15px]">
                        <Link
                          href={ROUTER.Transaction}
                          className={cn(
                            'dark:hover:text-white hover:text-black dark:text-gray-400 text-color-light-text-primary flex items-center justify-center gap-2',
                            {
                              'dark:text-white text-black font-bold': router.route.includes(ROUTER.Transaction),
                            },
                          )}
                        >
                          <div>{t('sidebar:transactions')}</div>
                        </Link>
                        <Link
                          href={ROUTER.Rollover}
                          className={cn(
                            'dark:hover:text-white hover:text-black dark:text-gray-400 text-color-light-text-primary flex items-center justify-center gap-2',
                            {
                              'dark:text-white text-black font-bold': router.route.includes(ROUTER.Rollover),
                            },
                          )}
                        >
                          <div>{t('sidebar:rollover')}</div>
                        </Link>
                      </div>
                    </div>
                    <div
                      className="sm:bg-color-primary rounded-md p-1 z-[10]"
                      role="button"
                      onClick={() => router.replace('/')}
                    >
                      <XMarkIcon width={20} className="sm:text-black text-gray-500" />
                    </div>
                  </div>
                  <div className="flex-1 pt-[60px] pb-[80px] dark:bg-color-modal-bg-secondary bg-white">
                    <div
                      className={cn(
                        styles.cardMain,
                        'flex-1 dark:bg-color-modal-bg-secondary bg-white dark:text-white text-black p-[20px]',
                      )}
                    >
                      {children}
                    </div>
                  </div>

                  <div className="text-gray-400 sm:hidden block fixed z-50 w-screen h-[60px] dark:bg-color-card-bg-primary bg-color-light-bg-primary shadow-[17px_9px_17px_0px_#00000040] border border-gray-200 bottom-0">
                    <div className="w-full h-full flex items-center justify-evenly text-[12px] relative">
                      {
                        LIST_SIDEBAR_DEPOSIT_MOBILE.map((item, key) => {
                          const IconEle = item.icon;
                          return <Link
                            key={key}
                            href={item.href}
                            className={cn(
                              'flex flex-col items-center justify-between',
                              'hover:text-white flex-1 min-w-[calc(20%-4px)] h-full rounded',
                              'dark:hover:bg-color-hover-default',
                              {
                                'dark:text-white text-black font-bold dark:bg-color-card-body-secondary bg-[#eaecf3]':
                                  router.route.includes(item.href),
                              },
                            )}
                          >
                            <div className="pt-2">
                              <IconEle size={22} />
                            </div>
                            <div className="pb-2 text-center truncate w-full">
                              {t(item.title)}
                            </div>
                          </Link>
                        })
                      }

                    </div>
                  </div>
                </div>
              </Transition.Child>
            </div>
          </div>
        </Transition>
        <ModalRakeBack
          show={isShowRakeBackModal || false}
          onClose={() => {
            dispatch(changeIsShowRakeBack(false));
          }}
          setShowModalRakeBackDetail={() => dispatch(changeIsShowRakeBackDetail(true))}
          setShowModalBonusHistory={() => dispatch(changeIsShowBonusHistory(true))}
        />

        <ModalRakeBackDetail
          show={isShowRakeBackDetailModal || false}
          onClose={() => {
            dispatch(changeIsShowRakeBackDetail(false));
          }}
          setShowModalRakeBack={() => dispatch(changeIsShowRakeBack(true))}
        />

        <ModalBonusHistory
          show={isShowModalBonusHistory || false}
          onClose={() => {
            dispatch(changeIsShowBonusHistory(false));
          }}
          setShowModalRakeBack={() => dispatch(changeIsShowRakeBack(true))}
        />
      </div>
    </>
  );
};

export default DepositLayout;
