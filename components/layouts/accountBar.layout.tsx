import cn from 'classnames';
import {
  ArrowRight2,
  CardCoin,
  CardReceive,
  Coin1,
  Command,
  DollarCircle,
  Global,
  MoneyChange,
  MoneyRecive,
  Setting,
} from 'iconsax-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useTheme } from 'next-themes';
import React, { useEffect, useMemo, useState } from 'react';
import ReactLoading from 'react-loading';
import { shallowEqual, useSelector } from 'react-redux';

import { api_getSpinAvailableCount } from '@/api/spin';
import { useTranslation } from '@/base/config/i18next';
import { API_AVATAR, LANGUAGE_DATA, ROUTER } from '@/base/constants/common';
import { useExchange } from '@/base/hooks/useExchange';
import { currencyFormat1, handleLocaleSymbol } from '@/base/libs/utils';
import {
  changeAuthenticationType,
  changeIsShowAuthenticationModal,
  changeIsShowInformation,
  changeIsShowLogOutConfirm,
  changeIsShowMultiLanguageModal,
  changeIsShowQuest,
  changeIsShowReferAndEarn,
  changeIsShowSpin,
  changeMultiLanguageTab,
} from '@/base/redux/reducers/modal.reducer';
import { setUserData } from '@/base/redux/reducers/user.reducer';
import { AppState, useAppDispatch } from '@/base/redux/store';
import { AuthenticationModeEnum } from '@/base/types/common';

import IconOption, { IconOptionProps } from '../common/iconOption/iconOption';
import { MultiLanguageTabEnum } from '../modal/multiLanguage/MultiLanguage';

type ListItemProps = {
  title: string;
  icon: JSX.Element;
  extra: JSX.Element;
  isLink: boolean;
  href: string;
  classNames: string;
  activeClassNames: string;
  isArrow?: boolean;
  onClick?: () => void;
};

const ListItem: React.FC<ListItemProps> = (props: ListItemProps) => {
  const { title, icon, extra, isLink, href, onClick, classNames, activeClassNames, isArrow = true } = props;
  const router = useRouter();

  return (
    <>
      {isLink && (
        <Link
          className={cn(
            'capitalize dark:hover:bg-[#292C33] dark:bg-color-bg-primary dark:text-color-text-primary hover:bg-[#eaecf3] hover:text-[#000] dark:hover:text-white sm:text-[14px] text-[13px] flex items-center gap-[16px] flex-1 pl-[15px] px-[5px] py-[10px]',
            classNames,
            router.route.includes(href) && activeClassNames,
          )}
          href={href}
        >
          {icon}
          <div className={cn('flex-1 text-start dark:text-white text-black')}>{title}</div>
          {extra}
          {isArrow && <ArrowRight2 className={`w-[15px] h-[15px]`} />}
        </Link>
      )}
      {!isLink && (
        <div
          className={cn(
            'capitalize dark:hover:bg-[#292C33] dark:bg-color-bg-primary dark:text-color-text-primary hover:bg-[#eaecf3] hover:text-[#000] dark:hover:text-white sm:text-[14px] text-[13px] flex items-center gap-[16px] flex-1 pl-[15px] px-[5px] py-[10px]',
            classNames,
            router.route.includes(href) && activeClassNames,
          )}
          onClick={() => onClick && onClick()}
        >
          {icon}
          <div className={cn('flex-1 text-start dark:text-white text-black')}>{title}</div>
          {extra}
          {isArrow && <ArrowRight2 className={`w-[15px] h-[15px]`} />}
        </div>
      )}
    </>
  );
};

const AccountPannel: React.FC = () => {
  const exchange = useExchange();
  const { t, i18n } = useTranslation('');
  const dispatch = useAppDispatch();

  const { setTheme, theme } = useTheme();
  const [spinCount, setSpinCount] = useState<number>(0);

  useEffect(() => {
    const savedtheme = localStorage.getItem('theme') ?? 'dark';
    setTheme(savedtheme);
  }, []);

  const {
    realUsdBalance,
    localFiat,
    isLogin,
    avatar,
    userName,
    userId,
    isShow,
    viewInFiat,
    isLoading,
    user,
    isShowSpin,
  } = useSelector(
    (state: AppState) => ({
      realUsdBalance: state.wallet.realBalance,
      localFiat: state.wallet.localFiat,
      isLogin: state.auth.isLogin,
      avatar: state.auth.user.avatar,
      userName: state.auth.user.userName,
      userId: state.auth.user.userId,
      isShow: state.modal.isShowAccountPannel,
      viewInFiat: state.auth.user.generalSetting.settingViewInFiat,
      isLoading: state.auth.isLoading,
      isShowSpin: state.modal.isShowSpin,
      user: state.auth.user,
    }),
    shallowEqual,
  );

  const getSpinAvailableCount = async () => {
    if (!user.userId) return;

    const res = await api_getSpinAvailableCount();
    const tempAvailableCount = res.data?.availableSpinCount || 0;
    setSpinCount(tempAvailableCount);
  };
  useEffect(() => {
    if (isLogin) {
      getSpinAvailableCount();
    }
  }, [isLogin, isShowSpin]);

  const initDatas: ListItemProps[] = useMemo(
    () => [
      {
        title: String(t('layout:referAndEarn')),
        href: '',
        icon: <Coin1 />,
        extra: <></>,
        isLink: false,
        classNames: '',
        activeClassNames: '',
        onClick: () => dispatch(changeIsShowReferAndEarn(true)),
      },
      {
        title: String(t('sidebar:affiliate')),
        href: ROUTER.Affiliate,
        icon: <Command />,
        extra: <></>,
        isLink: true,
        classNames: '',
        activeClassNames: '',
      },
    ],
    [i18n.language],
  );

  const settingDatas: ListItemProps[] = useMemo(
    () => [
      {
        title: `${String(t('statistic:global'))} ${String(t('sidebar:settings'))}`,
        href: ROUTER.SettingGeneral,
        icon: <Setting />,
        isLink: true,
        extra: <></>,
        classNames: '',
        activeClassNames: '',
      },
      {
        title: String(t('language:language')),
        href: '',
        icon: <Global />,
        isLink: false,
        extra: (
          <>
            {isLoading.isLanguage ? (
              <ReactLoading width={20} height={20} type="spin" color="#00AAE6" />
            ) : (
              LANGUAGE_DATA.find((item) => item.key === i18n.language)?.language
            )}
          </>
        ),
        classNames: '',
        activeClassNames: '',
        onClick: () => {
          dispatch(changeMultiLanguageTab(MultiLanguageTabEnum.LANGUAGE));
          dispatch(changeIsShowMultiLanguageModal(true));
        },
      },
      {
        title: String(t('setting:currencySetting')),
        href: '',
        icon: <DollarCircle />,
        isLink: false,
        extra: (
          <>
            {localFiat && (
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
            )}
          </>
        ),
        classNames: '',
        activeClassNames: '',
        onClick: () => {
          dispatch(changeMultiLanguageTab(MultiLanguageTabEnum.FIAT));
          dispatch(changeIsShowMultiLanguageModal(true));
        },
      },
    ],
    [i18n.language, theme, localFiat, isLoading],
  );

  const walletDatas: IconOptionProps[] = useMemo(
    () => [
      {
        title: String(t('sidebar:deposit')),
        icon: MoneyRecive,
        href: ROUTER.DepositCrypto,
        classNames:
          'flex flex-col items-center !bg-transparent gap-[5px] dark:!text-white !text-color-light-text-primary',
      },
      {
        title: String(t('sidebar:withdraw')),
        icon: CardReceive,
        href: ROUTER.WithdrawCrypto,
        classNames:
          'flex flex-col items-center !bg-transparent gap-[5px] dark:!text-white !text-color-light-text-primary',
      },
      {
        title: String(t('sidebar:swap')),
        icon: MoneyChange,
        href: ROUTER.Swap,
        classNames:
          'flex flex-col items-center !bg-transparent gap-[5px] dark:!text-white !text-color-light-text-primary',
      },
      {
        title: String(t('sidebar:transactions')),
        icon: CardCoin,
        href: ROUTER.Transaction,
        classNames:
          'flex flex-col items-center !bg-transparent gap-[5px] dark:!text-white !text-color-light-text-primary',
      },
    ],
    [i18n.language],
  );

  return (
    <div
      className={cn(
        'fixed w-screen max-h-[calc(100vh_-_70px)] transition-transform duration-800 origin-bottom overflow-y-auto top-[70px] bottom-[60px] dark:bg-color-bg-primary bg-color-light-bg-primary shadow sm:hidden',
        {
          'translate-y-[120%]': !isShow,
          'translate-y-0': isShow,
        },
      )}
    >
      <div className="flex flex-col gap-[10px] px-[12px] pb-[20px]">
        {isLogin && (
          <div className="relative px-[10px] py-[14px] dark:bg-color-card-header-primary bg-white rounded-default">
            <div
              className="flex items-center flex-1 gap-[14px] border-b-[1px] pb-[15px] border-solid dark:border-color-border-primary border-color-light-border-primary mb-[15px]"
              onClick={() => {
                dispatch(setUserData({ userId: userId, userName: userName, avatar: avatar }));
                dispatch(changeIsShowInformation(true));
              }}
            >
              <div className="block w-[55px] h-[55px] rounded-full">
                <Image
                  height={40}
                  width={40}
                  src={avatar ? `${API_AVATAR}/${avatar}` : '/img/avatar-1.png'}
                  alt="avatar"
                  onError={(e) => {
                    e.currentTarget.src = '/img/avatar-1.png';
                  }}
                  className="w-full h-full rounded-full"
                />
              </div>
              <div className="flex flex-col justify-between flex-1 h-full">
                <p className="text-[15px] dark:text-white text-black">{userName}</p>
                <p className="text-[12px] dark:text-color-text-primary text-black">{`User ID: ${userId}`}</p>
              </div>
              <ArrowRight2 className={`w-[15px] h-[15px] dark:text-color-text-primary text-black`} />
            </div>
            {/* Hiding VipProgress */}
            {/* {isShow && <VipProgressComponent />} */}
          </div>
        )}
        {!isLogin && (
          <div className="relative px-[10px] py-[14px] dark:bg-color-card-header-primary bg-white rounded-default">
            <div className="flex items-center flex-1 gap-[14px]">
              <div className="block w-[55px] h-[55px] rounded-full">
                <Image height={40} width={40} src="/img/avatar-1.png" alt="avatar" className="w-full h-full" />
              </div>
              <div className="flex flex-col justify-between flex-1 h-full">
                <p className="text-[15px] dark:text-white text-black font-bold">{`${t(
                  'homePage:welcomeTo',
                )} BONENZA`}</p>
                <p className="text-[13px] dark:text-color-text-primary text-black">{t('homePage:requireSign')}</p>
              </div>
            </div>
            <div className="relative grid grid-cols-2 gap-[10px] mt-[20px]">
              <button
                type="button"
                className="truncate dark:text-white bg-color-light-bg-primary text-color-light-text-primary rounded-[5px] font-semibold py-[9px] dark:bg-[#3c404a] px-5 text-[14px]"
                onClick={() => {
                  dispatch(changeAuthenticationType(AuthenticationModeEnum.SIGN_IN));
                  dispatch(changeIsShowAuthenticationModal(true));
                }}
              >
                {t('layout:signIn')}
              </button>
              <button
                type="button"
                className="truncate text-white rounded-[5px] font-semibold py-[9px] bg-color-primary px-5 text-[14px]"
                onClick={() => {
                  dispatch(changeAuthenticationType(AuthenticationModeEnum.SIGN_UP));
                  dispatch(changeIsShowAuthenticationModal(true));
                }}
              >
                {t('layout:signUp')}
              </button>
            </div>
          </div>
        )}
        {/*  *********************************** Hide quest & spin feld ************************************************  */}
        {isLogin && (
          <div className="flex items-center gap-[10px]">
            <IconOption
              imageURL="/img/sidebar/quest.png"
              imageClass="w-[30px] h-[30px]"
              textClass="!text-white !text-[15px] font-semibold"
              title={String(t('sidebar:quest'))}
              href=""
              onClick={() => {
                if (isLogin) {
                  dispatch(changeIsShowQuest(true));
                } else {
                  dispatch(changeAuthenticationType(AuthenticationModeEnum.SIGN_IN));
                  dispatch(changeIsShowAuthenticationModal(true));
                }
              }}
              icon={() => <Image height={30} width={30} src={'img/quest.png'} alt="quest"></Image>}
              classNames="h-[40px] bg-gradient-to-b from-[#6A5982] to-[#6A00FF] hover:opacity-90 hover:bg-gradient-to-b hover:from-[#6A5982] hover:!to-[#6A00FF] px-[10px] pr-[4px]"

            // classNames="!bg-[#F6841B] gap-[5px] hover:opacity-[0.9] hover:text-white !text-white rounded pl-[10px] font-bold flex-1 !text-[14px]"
            />
            <IconOption
              imageClass="w-[30px] h-[30px]"
              textClass="!text-white !text-[15px] font-semibold"
              title={String(t('sidebar:spin'))}
              count={isLogin ? spinCount : 0}
              href=""
              onClick={() => dispatch(changeIsShowSpin(true))}
              icon={() => <Image height={30} width={30} src={'img/sidebar/spin.png'} alt="spin"></Image>}
              classNames="h-[40px] bg-gradient-to-b from-[#F450A9] to-[#EA001C] hover:opacity-90 hover:bg-gradient-to-b hover:from-[#F450A9] hover:!to-[#EA001C] px-[10px] pr-[4px]"
            />
          </div>
        )}

        {isLogin && (
          <div className="flex flex-col content-center list-none bg-white md:flex-col md:min-w-full dark:bg-color-card-header-primary rounded-default">
            <div className="flex justify-between border-solid border-b-[1px] dark:border-color-border-primary border-color-light-border-primary">
              <span className="dark:text-color-text-primary text-color-light-text-primary px-[12px] py-[5px] text-[12px] ">
                {t('balance:totalBalance')}
              </span>
              <span className="dark:text-color-text-primary text-color-light-text-primary px-[12px] py-[5px] text-[12px] ">
                {viewInFiat && currencyFormat1(realUsdBalance * exchange, 2, localFiat?.name || 'USD')}
                {!viewInFiat && currencyFormat1(realUsdBalance, 2)}
              </span>
            </div>

            <div className="grid grid-cols-4 bg-white dark:bg-color-card-header-primary rounded-default">
              {walletDatas.map((item, index) => (
                <IconOption
                  key={index}
                  title={item.title}
                  icon={item.icon}
                  href={item.href}
                  classNames={item.classNames + ' !px-[8px]'}
                />
              ))}
            </div>
          </div>
        )}

        {isLogin && (
          <ul className="flex flex-col content-center list-none bg-white md:flex-col md:min-w-full dark:bg-color-card-header-primary rounded-default">
            {initDatas.map((data, index) => (
              <ListItem
                key={index}
                title={data.title}
                href={data.href}
                icon={data.icon}
                extra={data.extra}
                isLink={data.isLink}
                activeClassNames={data.activeClassNames}
                onClick={data.onClick}
                classNames="dark:hover:text-white text-color-light-text-primary !bg-transparent hover:bg-[#e3ecf3] rounded pl-[10px]"
              />
            ))}
          </ul>
        )}

        <ul className="flex flex-col content-center list-none bg-white md:flex-col md:min-w-full dark:bg-color-card-header-primary rounded-default">
          {settingDatas.map((item, index) => (
            <ListItem
              key={index}
              title={item.title}
              href={item.href}
              icon={item.icon}
              extra={item.extra}
              isLink={item.isLink}
              isArrow={item.isArrow}
              activeClassNames={item.activeClassNames}
              onClick={item.onClick}
              classNames="dark:hover:text-white text-color-light-text-primary !bg-transparent hover:bg-[#e3ecf3] rounded pl-[10px]"
            />
          ))}
        </ul>
        {isLogin && (
          <div
            className="dark:text-color-text-primary text-color-light-text-primary py-[15px] font-semibold flex items-center justify-center gap-[5px] text-default cursor-pointer"
            onClick={() => dispatch(changeIsShowLogOutConfirm(true))}
          >
            {t('layout:logOut')}
          </div>
        )}
      </div>
    </div>
  );
};

export default AccountPannel;
