import { Menu, Transition } from '@headlessui/react';
import cn from 'classnames';
import { ArrowDown2, MessageText } from 'iconsax-react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { Fragment, useMemo } from 'react';

import { useTranslation } from '@/base/config/i18next';
import { ROUTER } from '@/base/constants/common';

import CommonSession from '../common/baseSession/baseSession';
import IconOption from '../common/iconOption/iconOption';
import MetaHead from '../metaHead/metaHead';
import BaseLayout from './base.layout';
import styles from './deposit.module.scss';

type HelperLayoutProps = {
  children: JSX.Element;
  mainCustomClass?: string;
};

const HelperLayout: React.FC<HelperLayoutProps> = ({ children }) => {
  const fixRouter = (link: string) => {
    return link.split('helper-center/')[1];
  };

  const LIST_SIDEBAR_Helpers = [
    {
      name: 'Privacy Policy',
      href: fixRouter(ROUTER.HelperPrivacy),
    },
    {
      name: 'Terms Of Service',
      href: fixRouter(ROUTER.HelperTermsOfService),
    },
    {
      name: 'Deposit Bonus Terms',
      href: fixRouter(ROUTER.HelperDepositBonusTerms),
    },
    {
      name: 'Coin Accuracy Limit',
      href: fixRouter(ROUTER.HelperCoinAccuracyLimit),
    },
    {
      name: 'Support',
      href: fixRouter(ROUTER.HelperSupport),
    },
    {
      name: 'Fee',
      href: fixRouter(ROUTER.HelperFee),
    },
    {
      name: 'Google Authenticator',
      href: fixRouter(ROUTER.HelperGoogleAuthenticator),
    },
    {
      name: 'FAQ',
      href: fixRouter(ROUTER.HelperFAQ),
    },
    {
      name: 'Currency',
      href: fixRouter(ROUTER.HelperCurrency),
    },
    {
      name: 'Registration and Login',
      href: fixRouter(ROUTER.HelperRegistrationAndLogin),
    },
    {
      name: 'Gamble Aware',
      href: fixRouter(ROUTER.HelperGambleAware),
    },
    {
      name: 'Protecting Minors',
      href: fixRouter(ROUTER.HelperProtectingMinors),
    },
    {
      name: 'AML',
      href: fixRouter(ROUTER.HelperAML),
    },
    {
      name: 'Self-exclusion',
      href: fixRouter(ROUTER.HelperSelfExclusion),
    },
    {
      name: 'Responsible Gambling',
      href: fixRouter(ROUTER.HelperResponsibleGambling),
    },
  ];

  const { t } = useTranslation('');
  const router = useRouter();

  const activeRouter = useMemo(() => {
    const activeSidebar = LIST_SIDEBAR_Helpers.find((item) => router.route.includes(item.href));
    return activeSidebar?.name;
  }, [router]);

  return (
    <>
      <MetaHead />
      <BaseLayout contentClass="sm:mx-auto px-0">
        <>
          <div className="flex flex-wrap gap-7 w-full text-center xl:py-[50px] sm:py-[20px] py-[12px] xl:px-[20px] sm:px-0 px-0 sm:mb-0 mb-14">
            <CommonSession icon={MessageText} iconClass="text-color-primary" title="Help Center">
              <div className="flex flex-row gap-5 w-full text-center mt-0 mb-[50px]">
                <div
                  className={cn(
                    styles.cardMenu,
                    'border-solid border-[1px] border-color-bg-primary border-r-color-card-body-primary drop-shadow-lg shadow-bs-default',
                    'bg-white dark:bg-color-modal-bg-secondary text-black dark:text-white rounded-large xl:min-w-[300px] min-w-[none] md:max-h-[940px] md:!flex !hidden',
                  )}
                >
                  <div className="xl:p-2 p-1 w-full">
                    <ul className="flex flex-col justify-center gap-2 w-full rounded-xl">
                      {LIST_SIDEBAR_Helpers.map((item, index) => (
                        <IconOption
                          title={String(t(item.name))}
                          href={item.href}
                          icon={() => null}
                          key={index}
                          fontWeight={600}
                          classNames="dark:hover:!text-white !text-color-text-primary rounded pr-[15px]"
                          activeClassNames="dark:!bg-color-active-default !bg-color-light-bg-primary dark:!text-white text-black"
                        />
                      ))}
                    </ul>
                  </div>
                </div>
                <div
                  className={cn(
                    'flex-1 bg-white dark:bg-color-modal-bg-secondary rounded-large text-white px-2 sm:px-3 pt-3 pb-5 md:p-5',
                    'border-solid border-[1px] border-color-bg-primary border-r-color-card-body-primary drop-shadow-lg shadow-bs-default'
                  )}
                >
                  <Menu as="div" className="relative w-auto text-left sm:mb-5 rounded-[7px] flex text-white md:hidden">
                    <Menu.Button className="w-full">
                      <div
                        role="button"
                        className={cn("flex items-center gap-2 py-2 px-2 w-full rounded min-w-[200px]",
                          'border-solid border-[1px] border-color-bg-primary border-r-color-card-body-primary drop-shadow-lg shadow-bs-default')}
                      >
                        <div className="flex-1 text-start">{activeRouter}</div>
                        <div className="text-white truncate text-right min-w-[15px]">
                          <ArrowDown2 size={15} />
                        </div>
                      </div>
                    </Menu.Button>
                    <Transition
                      as={Fragment}
                      enter="transition ease-out duration-100"
                      enterFrom="transform opacity-0 scale-95"
                      enterTo="transform opacity-100 scale-100"
                      leave="transition ease-in duration-75"
                      leaveFrom="transform opacity-100 scale-100"
                      leaveTo="transform opacity-0 scale-95"
                    >
                      <Menu.Items className="absolute dark:bg-color-modal-bg-secondary bg-[#fff] w-full origin-top-right right-0 top-[60px] z-[5] cursor-pointer rounded p-2">
                        {LIST_SIDEBAR_Helpers.map((item, index) => (
                          <Menu.Item key={index}>
                            {({ active }) => (
                              <Link
                                href={item.href}
                                className={cn('flex items-center justify-start p-[10px] w-full rounded text-[14px]', {
                                  'border-[0.5px] border-solid border-color-primary font-semibold dark:text-white text-black':
                                    router.route.includes(item.href),
                                  'dark:hover:bg-color-hover-primary dark:hover:text-white hover:text-black hover:bg-white dark:text-gray-500 text-color-light-text-primary':
                                    !router.route.includes(item.href),
                                })}
                                role="button"
                              >
                                <div
                                  className={cn('flex-1 flex items-center justify-start gap-[10px]', {
                                    ' after:w-[8px] after:h-[8px] after:bg-color-primary after:rounded-full after:shadow-[0_0_0_0.3125rem_#3bc11726]':
                                      router.route.includes(item.href),
                                  })}
                                >
                                  <div className="flex-1 text-start dark:text-white text-color-light-text-primary text-[14px]">
                                    {String(t(item.name))}
                                  </div>
                                </div>
                              </Link>
                            )}
                          </Menu.Item>
                        ))}
                      </Menu.Items>
                    </Transition>
                  </Menu>
                  {children}
                </div>
              </div>
            </CommonSession>
          </div>
        </>
      </BaseLayout>
    </>
  );
};

export default HelperLayout;
