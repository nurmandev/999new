import cn from 'classnames';
import { Add, Global, MessageText1, MoneyRecive, Notification, SearchNormal } from 'iconsax-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import ReactLoading from 'react-loading';
import { shallowEqual, useSelector } from 'react-redux';

import { useTranslation } from '@/base/config/i18next';
import { headerMenus } from '@/base/constants/config-menus';
import { handleLocaleSymbol } from '@/base/libs/utils';
import {
  changeAuthenticationType,
  changeIsShowAuthenticationModal,
  changeIsShowCasinoSearch,
  changeIsShowDepositModal,
  changeIsShowMultiLanguageModal,
  changeIsShowNotification,
  changeMultiLanguageTab,
  changeShowChatType,
} from '@/base/redux/reducers/modal.reducer';
import { AppState, useAppDispatch } from '@/base/redux/store';
import { AuthenticationModeEnum } from '@/base/types/common';

import ChatSignOutIcon from '../icons/ChatSignOutIcon';
import { MultiLanguageTabEnum } from '../modal/multiLanguage/MultiLanguage';
import PriceDropdown from '../price/priceDropdown';
import ProfileDropdown from '../profileDropdown/profileDropdown';
import RewardDropdown from '../rewardDropdown/rewardDropdown';
import FiatHeader from './header/fiatHeader';

export default function Navbar() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { t } = useTranslation('');

  const {
    isLogin,
    isToggleSidebar,
    showChatType,
    viewInFiat,
    isShowCasinoSearch,
    localFiat,
    isAccountPannel,
    isLoading,
    isNewMessage,
    isNewNotification,
    isShowNotification,
    settings
  } = useSelector(
    (state: AppState) => ({
      isLogin: state.auth.isLogin,
      isToggleSidebar: state.modal.isToggleSidebar,
      isShowCasinoSearch: state.modal.isShowCasinoSearch,
      showChatType: state.modal.showChatType,
      viewInFiat: state.auth.user.generalSetting.settingViewInFiat,
      localFiat: state.wallet.localFiat,
      settings: state.auth.user.generalSetting,
      isAccountPannel: state.modal.isShowAccountPannel,
      isLoading: state.auth.isLoading,
      isNewMessage: state.common.isNewMessage,
      isNewNotification: state.common.isNewNotification,
      isShowNotification: state.modal.isShowNotification,
    }),
    shallowEqual,
  );

  return (
    <>
      {/* Navbar */}
      <div
        className={cn(
          'w-full my-auto dark:bg-color-header-secondary bg-white top-0 left-0 fixed z-9 sm:!z-10 h-[70px]',
          'sm:border-solid sm:border-[1px] sm:border-color-bg-primary sm:border-b-color-card-body-primary sm:drop-shadow-lg sm:shadow-bs-default',
          {
            'sm:ml-[62px] sm:max-w-[calc(100%_-_62px)]': !isToggleSidebar && !showChatType,
            'md:ml-[244px] md:max-w-[calc(100%_-_244px)]': isToggleSidebar && !showChatType,
            '2xl:ml-[244px] 2xl:max-w-[calc(100%_-_244px)]': showChatType && isToggleSidebar,
            'sm:ml-[62px] sm:max-w-[calc(100%_-_62px)] 2xl:max-w-full': showChatType && !isToggleSidebar,
          },
        )}
        onClick={() => {
          if (isShowCasinoSearch) dispatch(changeIsShowCasinoSearch(false));
        }}
      >
        <div
          className={cn(
            'flex py-[10px] flex-1 h-full lg:justify-end 2xl:justify-between sm:max-md:justify-center md:justify-end justify-between m-auto w-full sm:px-[40px] px-[12px] sm:max-w-[1430px]',
            // {
            //   'sm:pl-[62px]': !isToggleSidebar && !showChatType,
            //   'md:pl-[205px]': isToggleSidebar && !showChatType,
            // },
          )}
        >
          <Link href={'/'} className="flex items-center sm:hidden">
            <Image
              width={165}
              height={57}
              className="max-w-[26px] sm:max-w-[26px] md:max-w-[none] md:max-h-[none] max-h-[40px]"
              src="/img/logo-mobile.png"
              alt="logo"
            />
          </Link>
          <div className={cn('gap-[8px] 2xl:flex hidden')}>
            {headerMenus
              .filter((item) => !item.isMobile)
              .map((menu, index) => {
                const IconElement = menu.icon;
                return (
                  <Link
                    key={index}
                    href={menu.href}
                    className={cn(
                      'rounded-default px-[8px] py-[8px] group flex items-center gap-2 dark:text-color-text-primary text-color-light-text-primary hover:text-color-primary hover:bg-color-light-bg-primary dark:hover:bg-color-hover-primary',
                      `${router.asPath.replaceAll('/', '') === menu.href.replaceAll('/', '')
                        ? 'dark:text-white !bg-color-light-bg-primary dark:!bg-color-hover-primary'
                        : ''
                      }`,
                    )}
                  >
                    <img
                      width={20}
                      height={20}
                      src={`/img/header/${menu?.image || ''}`}
                      className="object-contain w-[28px]"
                    />
                    <p className='text-[15px] font-semibold text-[#00BAE6]'>{t(menu.title)}</p>
                  </Link>
                );
              })}
          </div>

          <div className="flex items-center justify-between sm:gap-x-[8px] gap-x-2 w-auto">
            <PriceDropdown />

            {/* Button */}
            <button
              type="button"
              className="truncate sm:flex hidden text-white items-center justify-center gap-[7px] sm:p-[10px] p-[3px] text-default font-semibold"
              onClick={() => dispatch(changeIsShowCasinoSearch(!isShowCasinoSearch))}
            >
              <div className="">
                <SearchNormal className="w-[20px] h-[20px] stroke-[2px]" />
              </div>
            </button>
            {!isLogin && (
              <div
                className={cn('sm:flex items-center text-white font-bold w-full gap-[15px]', {
                  hidden: isAccountPannel,
                  flex: !isAccountPannel,
                })}
              >
                <button
                  type="button"
                  className="truncate dark:text-color-text-primary rounded-large py-[9px] px-5 text-default font-medium text-color-light-text-primary  dark:hover:bg-color-hover-primary"
                  onClick={() => {
                    dispatch(changeAuthenticationType(AuthenticationModeEnum.SIGN_IN));
                    dispatch(changeIsShowAuthenticationModal(true));
                  }}
                >
                  {t('layout:signIn')}
                </button>

                {/* Button */}
                <button
                  type="button"
                  className="truncate text-white rounded-large py-[9px] bg-graident-btn-sign sm:bg-gradient-btn-play shadow-bs-btn px-5 text-default font-medium"
                  onClick={() => {
                    dispatch(changeAuthenticationType(AuthenticationModeEnum.SIGN_UP));
                    dispatch(changeIsShowAuthenticationModal(true));
                  }}
                >
                  {t('layout:signUp')}
                </button>
              </div>
            )}
            {isLogin && <FiatHeader />}
            {isLogin && (
              <button
                type="button"
                className="truncate text-white rounded-md bg-gradient-btn-play shadow-bs-btn flex items-center justify-center gap-[7px] sm:p-[10px] p-[3px] text-default font-semibold hover:opacity-90"
                onClick={() => dispatch(changeIsShowDepositModal(true))}
              >
                <div className="hidden sm:block">
                  <MoneyRecive />
                </div>
                <div className="block sm:hidden">
                  <Add />
                </div>
                <span className="hidden sm:block">{t('layout:deposit')}</span>
              </button>
            )}
            {/* {isLogin && (
              <button
                type="button"
                className="sm:block hidden rounded-default relative dark:hover:bg-color-hover-primary hover:bg-color-light-bg-primary text-gray-400 dark:hover:text-white hover:text-black items-center justify-center gap-[7px] h-full px-[12px]"
              >
                <Notification className="w-[20px] h-[20px]" variant="Bold" />
              </button>
            )} */}
            {/* Message */}
            {isLogin && (
              <button
                type="button"
                className={`sm:block hidden relative rounded-default  dark:hover:bg-color-hover-primary hover:bg-color-light-bg-primary text-gray-400 dark:hover:text-white hover:text-black items-center justify-center gap-[7px] h-full px-[12px]`}
                onClick={() => {
                  dispatch(changeShowChatType(false));
                  dispatch(changeIsShowNotification(!isShowNotification));
                }}
              >
                <Notification className="w-[24px] h-[24px] text-white" variant="Bold" />
                {isNewNotification && (
                  <span className="absolute top-[5px] right-[5px] p-[5px] rounded-full bg-color-primary text-white text-[10px]" />
                )}
              </button>
            )}
            {!isLogin && (
              <button
                type="button"
                className={`sm:block hidden relative rounded-default dark:hover:bg-color-hover-primary hover:bg-color-light-bg-primary text-gray-400 dark:hover:text-white hover:text-black items-center justify-center gap-[7px] h-full px-[12px]`}
                onClick={() => {
                  dispatch(changeIsShowNotification(false));
                  dispatch(changeShowChatType(!showChatType));
                }}
              >
                <ChatSignOutIcon className="w-[20px] h-[20px] text-color-text-primary" />
              </button>
            )}
            {isLogin && (
              <button
                type="button"
                className={`sm:block hidden relative rounded-default  dark:hover:bg-color-hover-primary hover:bg-color-light-bg-primary text-gray-400 dark:hover:text-white hover:text-black items-center justify-center gap-[7px] h-full px-[12px]`}
                onClick={() => {
                  dispatch(changeIsShowNotification(false));
                  dispatch(changeShowChatType(!showChatType));
                }}
              >
                <MessageText1 className="w-[20px] h-[20px] text-white" variant="Bold" />
                {isNewMessage && (
                  <span className="absolute top-[5px] right-[5px] p-[5px] rounded-full bg-color-primary text-white text-[10px]" />
                )}
              </button>
            )}

            {/* Bonus  */}
            {isLogin && <RewardDropdown />}
            {/* Avatar */}
            {isLogin && <ProfileDropdown />}
            {/* Multi Language */}
            <button
              type="button"
              className={`${isLogin ? 'hidden md:flex' : 'flex'
                } text-default font-semibold uppercase rounded-default  dark:hover:bg-color-hover-primary hover:bg-color-light-bg-primary text-color-text-primary dark:hover:text-white hover:text-black items-center justify-center gap-[7px] p-[10px]`}
              onClick={() => {
                dispatch(changeMultiLanguageTab(MultiLanguageTabEnum.LANGUAGE));
                dispatch(changeIsShowMultiLanguageModal(true));
              }}
            >
              {isLoading.isLanguage ? (
                <ReactLoading width={20} height={20} type="spin" color="#00AAE6" />
              ) : (
                settings.settingLanguage === 'en' ?
                  <Global className="w-[20px] h-[20px]" /> : settings.settingLanguage
              )}
            </button>
            {viewInFiat && localFiat && <div className="hidden w-px h-5 bg-slate-400 md:block"></div>}
            {viewInFiat && localFiat && (
              <button
                type="button"
                className="md:block hidden rounded-default dark:hover:bg-color-hover-primary hover:bg-color-light-bg-primary dark:hover:text-white hover:text-black dark:text-color-text-primary text-color-light-text-primary p-[10px]"
                onClick={() => {
                  dispatch(changeMultiLanguageTab(MultiLanguageTabEnum.FIAT));
                  dispatch(changeIsShowMultiLanguageModal(true));
                }}
              >
                <div className="p-1 text-sm w-max">
                  {isLoading.isCurrency ? (
                    <ReactLoading width={20} height={20} type="spin" color="#00AAE6" />
                  ) : (
                    <>
                      <span>
                        {handleLocaleSymbol(String(localFiat.name))}
                        {localFiat.name}
                      </span>
                    </>
                  )}
                </div>
              </button>
            )}
          </div>
        </div>
      </div>
      {/* End Navbar */}
    </>
  );
}
