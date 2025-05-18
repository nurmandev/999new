import cn from 'classnames';
import {
  ArrowSwapVertical,
  Command,
  Cup,
  Diamonds,
  Gift,
  Global,
  HambergerMenu,
  Notepad2,
  Profile2User
} from 'iconsax-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useMemo, useState } from 'react';
import ReactLoading from 'react-loading';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { Tooltip } from 'react-tooltip';

import { api_getSpinAvailableCount } from '@/api/spin';
import { useTranslation } from '@/base/config/i18next';
import { LANGUAGE_DATA, ROUTER } from '@/base/constants/common';
import { casinoCategories, casinoGames } from '@/base/constants/config-menus';
import { handleLocaleSymbol } from '@/base/libs/utils';
import {
  changeAuthenticationType,
  changeIsShowAuthenticationModal,
  changeIsShowCasinoSearch,
  changeIsShowMultiLanguageModal,
  changeIsShowQuest,
  changeIsShowReferAndEarn,
  changeIsShowSpin,
  changeIsShowVipClubModal,
  changeMultiLanguageTab,
  changeToggleSidebar,
} from '@/base/redux/reducers/modal.reducer';
import { AppState } from '@/base/redux/store';
import { AuthenticationModeEnum } from '@/base/types/common';

import IconOption, { IconOptionProps } from '../common/iconOption/iconOption';
import CsrWrapper from '../CsrWrapper';
import { MultiLanguageTabEnum } from '../modal/multiLanguage/MultiLanguage';

export default function SidebarToggle() {
  const { t, i18n } = useTranslation('');
  const dispatch = useDispatch();
  const router = useRouter();
  const [showDropDownCasino, setShowDropDownCasino] = useState(false);
  const [spinCount, setSpinCount] = useState<number>(0);

  const { isToggleSidebar, isShowVipClubModal, isLogin, user, isShowSpin, isLoading, settings, localFiat, viewInFiat } = useSelector(
    (state: AppState) => ({
      isToggleSidebar: state.modal.isToggleSidebar,
      isShowVipClubModal: state.modal.isShowVipClubModal,
      isLogin: state.auth.isLogin,
      isShowSpin: state.modal.isShowSpin,
      user: state.auth.user,
      isLoading: state.auth.isLoading,
      settings: state.auth.user.generalSetting,
      localFiat: state.wallet.localFiat,
      viewInFiat: state.auth.user.generalSetting.settingViewInFiat,
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

  const smallSidebarDatas = [
    {
      key: 'bonus',
      title: t('sidebar:bonus'),
      icon: <Gift size={22} />,
      href: ROUTER.Bonus
    },
    {
      key: 'quest',
      title: t('sidebar:quest'),
      icon: <Image className="m-auto" height={30} width={30} src={'img/sidebar/quest.png'} alt="" />,
      onClick: () => dispatch(changeIsShowQuest(true))
    },
    {
      key: 'spin',
      title: t('sidebar:spin'),
      icon: <Image className="m-auto" height={30} width={30} src={'img/sidebar/spin.png'} alt="" />,
      onClick: () => dispatch(changeIsShowSpin(true))
    },
    {
      key: 'master',
      title: t('sidebar:master'),
      icon: <Cup
        size={22}
        variant="Bulk"
      />,
      href: ROUTER.Master
    },
    {
      key: 'refer',
      title: t('layout:referAndEarn'),
      icon: <Profile2User
        size={22}
        variant="Bulk"
      />,
      onClick: () => dispatch(changeIsShowReferAndEarn(true))
    }
  ]

  const panel_1_datas: IconOptionProps[] = useMemo(
    () => [
      {
        title: String(t('sidebar:casino')),
        key: 'casino',
        href: '/casino',
        icon: Notepad2,
        smallIcon: (
          <Notepad2
            size={22}
          />
        ),
        onClick: () => {
          setShowDropDownCasino(!showDropDownCasino);
          if (!(router.pathname === ROUTER.Casino)) router.push(ROUTER.Casino);
        },
        isShowDropDown: false,
        isDropDown: true,
        data: [...casinoCategories, ...casinoGames],
      },

    ],
    [i18n.language, router.route, showDropDownCasino],
  );

  const panel_2_datas: IconOptionProps[] = useMemo(
    () => [
      {
        title: "Up & Down",
        href: 'https://bitup.game/trade',
        icon: ArrowSwapVertical,
        smallIcon: (
          <ArrowSwapVertical
            size={22}
          />
        ),
        isShowDropDown: false,
        isDropDown: false,
      }
    ],
    [isShowVipClubModal, i18n.language, router.route, isLogin],
  );

  const panel_3_datas: IconOptionProps[] = useMemo(
    () => [
      {
        title: String(t('sidebar:vipClub')),
        href: '',
        key: 'vipClub',
        icon: Diamonds,
        smallIcon: (
          <Diamonds
            size={22}
          />
        ),
        onClick: () => {
          if (!isLogin) {
            dispatch(changeAuthenticationType(AuthenticationModeEnum.SIGN_IN));
            dispatch(changeIsShowAuthenticationModal(true));
          } else {
            dispatch(changeIsShowVipClubModal(true));
          }
        },
      },

      {
        title: String(t('sidebar:affiliate')),
        href: ROUTER.Affiliate,
        key: 'affiliate',
        icon: Command,
        smallIcon: (
          <Command
            size={22}
          />
        ),
      },
    ],
    [isShowVipClubModal, i18n.language, router.route, isLogin],
  );


  return (
    <>
      {/* Main Sidebar */}
      <div
        className={cn('transition-transform h-full flex flex-col w-[244px]', {
          'translate-x-0': isToggleSidebar,
          '-translate-x-full absolute': !isToggleSidebar,
        })}
        onClick={() => dispatch(changeIsShowCasinoSearch(false))}
      >
        <div className="flex items-center h-[67px] px-[8px] py-[10px] gap-[10px] dark:bg-color-header-secondary">
          <button
            className={cn(
              'sm:flex hidden rounded-md ',
              'dark:bg-color-header-secondary bg-color-light-bg-primary dark:hover:bg-gray-800',
              'text-gray-400 hover:text-[#000] dark:text-white',
              'items-center justify-center gap-[7px] px-[14px] py-[14px]',
            )}
            onClick={() => {
              dispatch(changeToggleSidebar(!isToggleSidebar));
            }}
          >
            <HambergerMenu size={18} className={cn('m-auto stroke-2')} strokeWidth={3} />
          </button>
          <Link href={'/'} className="items-center hidden sm:flex">
            <Image
              width={158}
              height={31}
              className="w-[158px] md:max-w-[none] md:max-h-[none] h-[31px]"
              src="/img/logo.png"
              alt="logo"
            />
          </Link>
        </div>
        <div className=" flex-1 md:w-full flex flex-col h-full pt-[20px] pb-[80px] px-[12px] overflow-auto">
          <div className="flex-1 w-full gap-[10px] flex flex-col">
            <ul className="md:flex-col md:min-w-full flex flex-col list-none content-center gap-[10px]">
              <CsrWrapper key={'bonus'}>
                <IconOption
                  imageURL="/img/sidebar/bonus.png"
                  imageClass="absolute left-[24px] -top-[12px] w-[67px] h-[66px]"
                  textClass="!text-white ml-[100px] !text-[16px] !font-[500]"
                  title={String(t('sidebar:bonus'))}
                  href={ROUTER.Bonus}
                  icon={Gift}
                  isFontMedium
                  fontWeight={600}
                  classNames="!min-h-[50px] !py-[10px] bg-gradient-to-t from-[#00BAE6] hover:opacity-90 !rounded-[5px] px-[10px] shadow-[inset_0_1px_2px_0_#7CE6FF]"
                />
              </CsrWrapper>

              <div className="flex items-center gap-[5px] mt-[10px]">
                <CsrWrapper key="quest">
                  <IconOption
                    imageURL="/img/sidebar/quest.png"
                    imageClass="absolute left-[8px] top-[2px] w-[38px] h-[36px]"
                    textClass="text-white ml-auto !text-[13px] !text-center font-semibold pl-[8px] dark:!text-white"
                    title={String(t('sidebar:quest'))}
                    href={''}
                    icon={Gift}
                    isFontMedium
                    fontWeight={700}
                    onClick={() => {
                      if (!isLogin) {
                        dispatch(changeAuthenticationType(AuthenticationModeEnum.SIGN_IN));
                        dispatch(changeIsShowAuthenticationModal(true));
                      } else {
                        dispatch(changeIsShowQuest(true));
                      }
                    }}
                    classNames="!rounded-[5px] h-[40px] bg-gradient-to-t from-[#5D00E1] hover:opacity-90 px-[10px] pr-[4px] shadow-[inset_0_1px_2px_0_#7C83FF]"
                  />
                </CsrWrapper>
                <CsrWrapper key="spin">
                  <IconOption
                    imageURL="/img/sidebar/spin.png"
                    count={isLogin ? spinCount : 0}
                    imageClass="absolute left-[8px] top-[4px] w-[34px] h-[34px]"
                    textClass="text-white ml-auto !text-[13px] !text-center font-semibold pl-[15px] dark:!text-white"
                    title={String(t('sidebar:spin'))}
                    href={''}
                    icon={Gift}
                    isFontMedium
                    fontWeight={600}
                    onClick={() => dispatch(changeIsShowSpin(true))}
                    classNames="!rounded-[5px] h-[40px] !text-white bg-gradient-to-t from-[#5D00E1] hover:opacity-90 px-[10px] pr-[4px] shadow-[inset_0_1px_2px_0_#7C83FF]"
                  />
                </CsrWrapper>
              </div>
              <CsrWrapper key="master">
                <Link href={ROUTER.Master}>
                  <Image
                    width={480}
                    height={121}
                    src="/img/tournament/sidebar.png"
                    alt="tournament"
                    className="object-contain rounded-[3px]"
                  />
                </Link>
              </CsrWrapper>
              {isLogin &&
                <CsrWrapper key="refer">
                  <Image
                    width={480}
                    height={121}
                    src="/img/refer.png"
                    alt="refer"
                    priority
                    className="object-contain rounded-md cursor-pointer"
                    onClick={() => dispatch(changeIsShowReferAndEarn(true))}
                  />
                </CsrWrapper>
              }
            </ul>
            <ul className="md:flex-col md:min-w-full flex flex-col list-none content-center gap-[10px] bg-gradient-to-tr from-black to-red-900 rounded-large">
              {panel_1_datas.map((item, index) => (
                <CsrWrapper key={index}>
                  <IconOption
                    title={item.title}
                    href={item.href}
                    icon={item.icon}
                    classNames={
                      'dark:!bg-color-menu-primary/30'
                    }
                    onClick={item.onClick}
                    isShowDropDown={item.isShowDropDown}
                    isDropDown={item.isDropDown}
                    isFontMedium
                    fontWeight={500}
                    data={item.data}
                  />
                </CsrWrapper>
              ))}
              {panel_2_datas.map((item, index) => (
                <CsrWrapper key={index}>
                  <IconOption
                    key={index}
                    title={item.title}
                    href={item.href}
                    icon={item.icon}
                    isFontMedium
                    fontWeight={500}
                  />
                </CsrWrapper>
              ))}
              {panel_3_datas.map((item, index) => (
                <CsrWrapper key={index}>
                  <IconOption
                    key={index}
                    title={item.title}
                    href={item.href}
                    icon={item.icon}
                    isFontMedium
                    fontWeight={500}
                    onClick={item.onClick}
                  />
                </CsrWrapper>
              ))}
              <IconOption
                title={LANGUAGE_DATA.find(item => item.key === settings.settingLanguage)?.language || 'English'}
                href={''}
                icon={Global}
                fontWeight={500}
                onClick={() => {
                  dispatch(changeMultiLanguageTab(MultiLanguageTabEnum.LANGUAGE));
                  dispatch(changeIsShowMultiLanguageModal(true));
                }}
              />
            </ul>

            {/* <ul className="md:flex-col md:min-w-full flex flex-col list-none content-center gap-[10px] dark:bg-color-menu-primary/30 rounded-large">
            </ul> */}

            <div className="md:flex-col md:min-w-full flex flex-col list-none content-center gap-[10px] dark:bg-color-menu-primary/30 rounded-large">
            </div>
            {
              viewInFiat && localFiat && <div className="md:flex-col md:min-w-full flex flex-col list-none content-center gap-[10px] dark:bg-color-menu-primary/30 rounded-large">
                <button
                  type="button"
                  className={cn("flex items-center flex-1 pl-[24px] p-[10px] rounded-large gap-[16px]",
                    "hover:bg-color-menu-hover",
                    "dark:text-color-text-primary text-default dark:hover:text-white font-bold",
                  )}
                  onClick={() => {
                    dispatch(changeMultiLanguageTab(MultiLanguageTabEnum.FIAT));
                    dispatch(changeIsShowMultiLanguageModal(true));
                  }}
                >
                  <Image
                    height={20}
                    width={20}
                    src={`/img/fiats/${localFiat.name}.png`}
                    alt="currency"
                    onError={(e) => {
                      e.currentTarget.src = '/img/fiats/USD.png';
                    }}
                  />
                  <div className="p-1 text-sm w-max font-medium">
                    {isLoading.isCurrency ? (
                      <ReactLoading width={20} height={20} type="spin" color="#00AAE6" />
                    ) : (
                      <>
                        {`${handleLocaleSymbol(String(localFiat.name))} ${localFiat.name}`}
                      </>
                    )}
                  </div>
                </button>
              </div>
            }


          </div>
        </div>
      </div>

      {/* Small Sidebar */}
      <div
        className={cn('transition-transform h-full flex flex-col w-[62px]', {
          'translate-x-0': !isToggleSidebar,
          '-translate-x-full absolute': isToggleSidebar,
        })}
        onClick={() => dispatch(changeIsShowCasinoSearch(false))}
      >
        <div className="flex justify-center items-center min-h-[67px] px-[8px] py-[10px]">
          <button
            className={cn(
              'sm:block flex items-center justify-center',
              'dark:bg-color-menu-primary dark:hover:bg-gray-800',
              'dark:text-gray-400 dark:hover:text-white text-color-text-primary bg-color-light-bg-primary',
              'rounded-md hover:bg-color-menu-hover gap-[7px] px-[10px] py-[10px]',
            )}
            onClick={() => {
              dispatch(changeToggleSidebar(!isToggleSidebar));
            }}
          >
            <HambergerMenu size={18} className={cn('m-auto')} />
          </button>
        </div>
        <div className="flex-1 flex flex-col h-full overflow-y-auto">
          {
            smallSidebarDatas.map(item => <>
              {
                item.href && <>
                  <Link
                    key={`${item.key}-small`}
                    href={item.href}
                    type="button"
                    className={cn(
                      'dark:hover:bg-color-menu-primary dark:bg-color-menu-primary/50 bg-color-light-bg-primary hover:bg-[#eaecf3]',
                      'dark:text-gray-400 dark:hover:text-white text-color-text-primary hover:text-[#000]',
                      'rounded flex items-center justify-center gap-[7px] px-[10px] py-[15px]',
                    )}
                    data-tooltip-id={`${item.key}-tooltip`}
                  >
                    {item.icon}
                  </Link>
                  <Tooltip className='!bg-color-menu-primary' id={`${item.key}-tooltip`} place="right" positionStrategy="fixed" key={`bonus_tooltip-small`}>
                    <div>
                      <p className="text-white">{item.title}</p>
                    </div>
                  </Tooltip>
                </>
              }
              {
                !item.href && <>
                  <div className="w-full" key={`${item.key}-small`}>
                    <div
                      role="button"
                      className={cn(
                        'dark:hover:bg-color-menu-primary dark:bg-color-menu-primary/50 bg-color-light-bg-primary hover:bg-[#eaecf3]',
                        'dark:text-gray-400 dark:hover:text-white text-color-text-primary hover:text-[#000]',
                        'rounded flex items-center justify-center gap-[7px] px-[10px] py-[15px]',
                      )}
                      data-tooltip-id={`${item.key}-tooltip`}
                      onClick={item.onClick}
                    >
                      {item.icon}
                    </div>
                    <Tooltip className='!bg-color-menu-primary' id={`${item.key}-tooltip`} place="right" positionStrategy="absolute">
                      <div>
                        <p className="text-white">{item.title}</p>
                      </div>
                    </Tooltip>
                  </div>
                </>
              }
            </>)
          }

          {panel_1_datas.map((item, index) => (
            <div className="w-full" key={`${index}-${item.title}`}>
              <Link
                href={item.href}
                type="button"
                className={cn(
                  'dark:hover:bg-color-menu-primary dark:bg-color-menu-primary/50 bg-color-light-bg-primary hover:bg-[#eaecf3]',
                  'dark:text-gray-400 dark:hover:text-white text-color-text-primary hover:text-[#000]',
                  'rounded flex items-center justify-center gap-[7px] px-[10px] py-[15px]',
                )}
                onClick={item?.onClick && item?.onClick}
                data-tooltip-id={`${item.title}-tooltip`}
              >
                {item.smallIcon}
              </Link>
              <Tooltip className='!bg-color-menu-primary' id={`${item.title}-tooltip`} place="right" positionStrategy="fixed">
                <div>
                  <p className="text-white">{item.title}</p>
                </div>
              </Tooltip>
            </div>
          ))}
          {[...casinoCategories, ...casinoGames].map((item, index) => {
            const IconElement = item.icon;
            return (
              <div className="w-full" key={`${index}-${item.title}`}>
                <Link
                  href={item.href}
                  type="button"
                  className={cn(
                    'dark:hover:bg-color-menu-primary dark:bg-color-menu-primary/50 bg-color-light-bg-primary hover:bg-[#eaecf3]',
                    'dark:text-gray-400 dark:hover:text-white text-color-text-primary hover:text-[#000]',
                    'rounded flex items-center justify-center gap-[7px] px-[10px] py-[15px]',
                  )}
                  data-tooltip-id={`${item.title}-tooltip`}
                >
                  <IconElement
                    size={22}
                    className={cn('m-auto', {
                      'dark:text-white text-black': router.route.includes(ROUTER.Casino),
                    })}
                  />
                </Link>
                <Tooltip className='!bg-color-menu-primary' id={`${item.title}-tooltip`} place="right" positionStrategy="fixed">
                  <div>
                    <p className="text-white">{String(t(item.title))}</p>
                  </div>
                </Tooltip>
              </div>
            );
          })}
          {[...panel_2_datas, ...panel_3_datas].map((item, index) => (
            <div className="w-full" key={`${index}-${item.title}`}>
              {item.href === '' && (
                <div
                  role="button"
                  className={cn(
                    'dark:hover:bg-color-menu-primary dark:bg-color-menu-primary/50 bg-color-light-bg-primary hover:bg-[#eaecf3]',
                    'dark:text-gray-400 dark:hover:text-white text-color-text-primary hover:text-[#000]',
                    'rounded flex items-center justify-center gap-[7px] px-[10px] py-[15px]',
                  )}
                  onClick={item?.onClick && item?.onClick}
                  data-tooltip-id={`${item.title}-tooltip`}
                >
                  {item.smallIcon}
                </div>
              )}
              {item.href && (
                <Link
                  href={item.href}
                  type="button"
                  className={cn(
                    'dark:hover:bg-color-menu-primary dark:bg-color-menu-primary/50 bg-color-light-bg-primary hover:bg-[#eaecf3]',
                    'dark:text-gray-400 dark:hover:text-white text-color-text-primary hover:text-[#000]',
                    'rounded flex items-center justify-center gap-[7px] px-[10px] py-[15px]',
                  )}
                  onClick={item?.onClick && item?.onClick}
                  data-tooltip-id={`${item.title}-tooltip`}
                >
                  {item.smallIcon}
                </Link>
              )}
              <Tooltip className='!bg-color-menu-primary' id={`${item.title}-tooltip`} place="right" positionStrategy="fixed">
                <div>
                  <p className="text-white">{item.title}</p>
                </div>
              </Tooltip>
            </div>
          ))}

          <div className="w-full" key={`lang-small`}>
            <div
              role="button"
              className={cn(
                'dark:hover:bg-color-menu-primary dark:bg-color-menu-primary/50 bg-color-light-bg-primary hover:bg-[#eaecf3]',
                'dark:text-gray-400 dark:hover:text-white text-color-text-primary hover:text-[#000]',
                'rounded flex items-center justify-center gap-[7px] px-[10px] py-[15px]',
              )}
              data-tooltip-id={`lang-tooltip`}
              onClick={() => {
                dispatch(changeMultiLanguageTab(MultiLanguageTabEnum.LANGUAGE));
                dispatch(changeIsShowMultiLanguageModal(true));
              }}
            >
              <Global size={22} />
            </div>
            <Tooltip className='!bg-color-menu-primary' id={`lang-tooltip`} place="right" positionStrategy="absolute">
              <div>
                <p className="text-white">{LANGUAGE_DATA.find(item => item.key === settings.settingLanguage)?.language || 'English'}</p>
              </div>
            </Tooltip>
          </div>

          {
            viewInFiat && localFiat && <div className="w-full" key={`currency-small`}>
              <div
                role="button"
                className={cn(
                  'dark:hover:bg-color-menu-primary dark:bg-color-menu-primary/50 bg-color-light-bg-primary hover:bg-[#eaecf3]',
                  'dark:text-gray-400 dark:hover:text-white text-color-text-primary hover:text-[#000]',
                  'rounded flex items-center justify-center gap-[7px] px-[10px] py-[15px]',
                )}
                data-tooltip-id={`currency-tooltip`}
                onClick={() => {
                  dispatch(changeMultiLanguageTab(MultiLanguageTabEnum.LANGUAGE));
                  dispatch(changeIsShowMultiLanguageModal(true));
                }}
              >
                <Image
                  height={20}
                  width={20}
                  src={`/img/fiats/${localFiat.name}.png`}
                  alt="currency"
                  onError={(e) => {
                    e.currentTarget.src = '/img/fiats/USD.png';
                  }}
                />
              </div>
              <Tooltip className='!bg-color-menu-primary' id={`currency-tooltip`} place="right" positionStrategy="absolute">
                <div>
                  {`${handleLocaleSymbol(String(localFiat.name))} ${localFiat.name}`}
                </div>
              </Tooltip>
            </div>
          }


        </div>
      </div>
    </>
  );
}
