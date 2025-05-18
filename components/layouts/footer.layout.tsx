import cn from 'classnames';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { Tooltip } from 'react-tooltip';

import { useTranslation } from '@/base/config/i18next';
import { ROUTER } from '@/base/constants/common';
import {
  changeAuthenticationType,
  changeIsShowAuthenticationModal,
  changeIsShowDepositModal,
  changeIsShowReferAndEarn,
  changeIsShowVipClubModal,
} from '@/base/redux/reducers/modal.reducer';
import { AppState } from '@/base/redux/store';
import { AuthenticationModeEnum } from '@/base/types/common';

import ModalBusinessContacts from '../modal/businessContacts/businessContacts';
import ModalVerifyRepresentative from '../modal/verifyRepresentative/verifyRepresentative';

export default function Footer({ isDetailPage }: { isDetailPage?: boolean }) {
  const { t } = useTranslation('');
  const router = useRouter();
  const [showModalContacts, setShowModalContacts] = useState<boolean>(false);
  const [showModalVerify, setShowModalVerify] = useState<boolean>(false);
  const dispatch = useDispatch();
  const { showChatType, isLogin } = useSelector(
    (state: AppState) => ({
      showChatType: state.modal.showChatType,
      isLogin: state.auth.isLogin,
    }),
    shallowEqual,
  );

  const openModalLogin = () => {
    dispatch(changeAuthenticationType(AuthenticationModeEnum.SIGN_IN));
    dispatch(changeIsShowAuthenticationModal(true));
  };
  const acceptedNetworks = [
    {
      icon: '/img/icon/eth-icon.png',
      network: 'Ethereum',
      token: 'ETH',
    },
    // {
    //   icon: '/img/icon/trx-icon.png',
    //   network: 'TRON',
    //   token: 'TRX',
    // },
    {
      icon: '/img/icon/binance-icon.png',
      network: 'BSC',
      token: 'BNB',
    },
    {
      icon: '/img/icon/polygon-icon.png',
      network: 'Polygon',
      token: 'POL',
    },
    {
      icon: '/img/icon/LTC.png',
      networkIcon: 'img/fiats/BNB.png',
      network: 'BSC',
      token: 'LTC',
    },
    {
      icon: '/img/icon/WBTC.png',
      networkIcon: 'img/fiats/BNB.png',
      network: 'BSC',
      token: 'WBTC',
    },
    {
      icon: '/img/icon/USDT-logo.svg',
      networkIcon: 'img/fiats/black_eth.png',
      network: 'Ethereum',
      token: 'USDT',
    },
    {
      icon: '/img/icon/USDC.png',
      networkIcon: 'img/fiats/BNB.png',
      network: 'BSC',
      token: 'USDC',
    },
    {
      icon: '/img/icon/DOGE.png',
      networkIcon: 'img/fiats/BNB.png',
      network: 'BSC',
      token: 'DOGE',
    },
    {
      icon: '/img/icon/SHIB.png',
      networkIcon: 'img/fiats/BNB.png',
      network: 'BSC',
      token: 'SHIB',
    },
    {
      icon: '/img/icon/XRP.png',
      networkIcon: 'img/fiats/BNB.png',
      network: 'BSC',
      token: 'XRP',
    },
    {
      icon: '/img/icon/DAI.png',
      networkIcon: 'img/fiats/BNB.png',
      network: 'BSC',
      token: 'DAI',
    },
    {
      icon: '/img/icon/SLC.png',
      networkIcon: 'img/fiats/BNB.png',
      network: 'BSC',
      token: 'SLC',
    },
  ];
  return (
    <>
      <footer
        className={cn('pt-10 h-fit bg-transparent', {
          block: !isDetailPage,
          'sm:block hidden': isDetailPage,
        })}
      >
        <div className="container px-4 mx-auto">
          <div
            className={cn('grid lg:grid-cols-5 md:grid-cols-3 grid-cols-2 gap-10 lg:gap-4', {
              'xl:grid-cols-3': showChatType,
              'xl:grid-cols-5': !showChatType,
            })}
          >
            <div className="flex flex-col items-center">
              <div className="w-[150px]">
                <div className="flex gap-[10px] items-center mb-[10px]">
                  <div className="w-[2px] h-[12px] bg-[#0DFDE4]"></div>
                  <div className="text-sm font-semibold text-black dark:text-white ">{String(t('footer:casino'))}</div>
                </div>
                <div className="flex flex-col gap-[15px] items-start justify-center">
                  <Link
                    href={ROUTER.Casino}
                    className="text-default text-color-light-text-primary dark:text-color-text-primary hover:text-black dark:hover:text-white"
                  >
                    {String(t('footer:casinoHome'))}
                  </Link>
                  <Link
                    href={ROUTER.Tagname('slots')}
                    className="text-default text-color-light-text-primary dark:text-color-text-primary hover:text-black dark:hover:text-white"
                  >
                    {String(t('footer:slots'))}
                  </Link>
                  <Link
                    href={ROUTER.Tagname('racing')}
                    className="text-default text-color-light-text-primary dark:text-color-text-primary hover:text-black dark:hover:text-white"
                  >
                    {String(t('layout:racing'))}
                  </Link>
                  <Link
                    href={ROUTER.Tagname('live-casino')}
                    className="text-default text-color-light-text-primary dark:text-color-text-primary hover:text-black dark:hover:text-white"
                  >
                    {String(t('footer:liveCasino'))}
                  </Link>
                  <Link
                    href={ROUTER.Tagname('new-releases')}
                    className="text-default text-color-light-text-primary dark:text-color-text-primary hover:text-black dark:hover:text-white"
                  >
                    {String(t('footer:newReleases'))}
                  </Link>
                  <Link
                    href={ROUTER.HomeRecommend}
                    className="text-default text-color-light-text-primary dark:text-color-text-primary hover:text-black dark:hover:text-white"
                  >
                    {String(t('footer:recommended'))}
                  </Link>
                  <Link
                    href={ROUTER.Tagname('table-games')}
                    className="text-default text-color-light-text-primary dark:text-color-text-primary hover:text-black dark:hover:text-white"
                  >
                    {String(t('footer:tableGame'))}
                  </Link>
                  <Link
                    href={ROUTER.Tagname('blackjack')}
                    className="text-default text-color-light-text-primary dark:text-color-text-primary hover:text-black dark:hover:text-white"
                  >
                    {String(t('footer:blackJack'))}
                  </Link>
                </div>
              </div>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-[150px]">
                <div className="flex gap-[10px] items-center mb-[10px]">
                  <div className="w-[2px] h-[12px] bg-[#F39717]"></div>
                  <div className="text-sm font-semibold text-black dark:text-white">{String(t('footer:promo'))}</div>
                </div>
                <div className="flex flex-col gap-[15px] items-start justify-center">
                  <div
                    onClick={() => {
                      isLogin ? dispatch(changeIsShowVipClubModal(true)) : openModalLogin();
                    }}
                    className="cursor-pointer text-default text-color-light-text-primary dark:text-color-text-primary hover:text-black dark:hover:text-white"
                  >
                    {String(t('footer:vipClub'))}
                  </div>
                  <Link
                    href={ROUTER.Affiliate}
                    className="text-default text-color-light-text-primary dark:text-color-text-primary hover:text-black dark:hover:text-white"
                  >
                    {String(t('footer:affiliate'))}
                  </Link>
                  <div
                    onClick={() => {
                      isLogin ? dispatch(changeIsShowReferAndEarn(true)) : openModalLogin();
                    }}
                    className="cursor-pointer text-default text-color-light-text-primary dark:text-color-text-primary hover:text-black dark:hover:text-white"
                  >
                    {String(t('footer:referAFriend'))}
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-[150px]">
                <div className="flex gap-[10px] items-center mb-[10px]">
                  <div className="w-[2px] h-[12px] bg-[#FD6E0B]"></div>
                  <div className="text-sm font-semibold text-black dark:text-white">
                    {String(t('footer:supportLegal'))}
                  </div>
                </div>
                <div className="flex flex-col gap-[15px] items-start justify-center">
                  <Link
                    href={ROUTER.HelperGambleAware}
                    className="text-default text-color-light-text-primary dark:text-color-text-primary hover:text-black dark:hover:text-white"
                  >
                    {String(t('footer:gambleAware'))}
                  </Link>
                  <Link
                    href={ROUTER.HelperPrivacy}
                    className="text-default text-color-light-text-primary dark:text-color-text-primary hover:text-black dark:hover:text-white"
                  >
                    {String(t('footer:privacyPolicy'))}
                  </Link>
                  <Link
                    href={ROUTER.HelperTermsOfService}
                    className="text-default text-color-light-text-primary dark:text-color-text-primary hover:text-black dark:hover:text-white"
                  >
                    {String(t('footer:termsOfService'))}
                  </Link>
                  <Link
                    href={ROUTER.HelperSelfExclusion}
                    className="text-default text-color-light-text-primary dark:text-color-text-primary hover:text-black dark:hover:text-white"
                  >
                    {String(t('footer:selfExclusion'))}
                  </Link>
                  <Link
                    href={ROUTER.HelperAML}
                    className="text-default text-color-light-text-primary dark:text-color-text-primary hover:text-black dark:hover:text-white"
                  >
                    {String(t('footer:aml'))}
                  </Link>
                </div>
              </div>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-[150px]">
                <div className="flex gap-[10px] items-center mb-[10px]">
                  <div className="w-[2px] h-[12px] bg-[#20D4EB]"></div>
                  <div className="text-sm font-semibold text-black dark:text-white">{String(t('footer:aboutUs'))}</div>
                </div>
                <div className="flex flex-col gap-[15px] items-start justify-center">
                  <div
                    onClick={() => setShowModalContacts(true)}
                    className="cursor-pointer text-default text-color-light-text-primary dark:text-color-text-primary hover:text-black dark:hover:text-white"
                  >
                    {String(t('footer:businessContacts'))}
                  </div>
                  <div
                    onClick={() => setShowModalVerify(true)}
                    className="cursor-pointer text-default text-color-light-text-primary dark:text-color-text-primary hover:text-black dark:hover:text-white"
                  >
                    {String(t('footer:verifyRepresentative'))}
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-[150px]">
                <div className="flex gap-[10px] items-center mb-[10px]">
                  <div className="w-[2px] h-[12px] bg-white"></div>
                  <div className="text-sm font-semibold text-black dark:text-white">
                    {String(t('footer:joinOurCommunity'))}
                  </div>
                </div>
                <div className="flex flex-col gap-[15px] items-start justify-center">
                  <Link
                    className="flex items-center gap-3 text-default text-color-light-text-primary dark:text-color-text-primary hover:text-black dark:hover:text-white"
                    href="https://discord.gg/REMNdmvh9N"
                    target="_blank"
                  >
                    <Image
                      alt="discord"
                      src="/img/social/Discord.png"
                      width={30}
                      height={30}
                      className="w-[32px] h-[32px] cursor-pointer"
                    />
                    <p>Discord</p>
                  </Link>
                  <Link
                    className="flex items-center gap-3 text-default text-color-light-text-primary dark:text-color-text-primary hover:text-black dark:hover:text-white"
                    href="https://x.com/Bonenzacom?s=09"
                    target="_blank"
                  >
                    <Image
                      alt="x"
                      src="/img/social/X.png"
                      width={30}
                      height={30}
                      className="w-[32px] h-[32px] cursor-pointer"
                    />
                    <p>X / Twitter</p>
                  </Link>
                  <Link
                    className="flex items-center gap-3 text-default text-color-light-text-primary dark:text-color-text-primary hover:text-black dark:hover:text-white"
                    href="https://t.me/Bonenzacom"
                    target="_blank"
                  >
                    <Image
                      alt="telegram_official"
                      src="/img/social/Telegram_Official.png"
                      width={30}
                      height={30}
                      className="w-[32px] h-[32px] cursor-pointer"
                    />
                    <p>Telegram Offical</p>
                  </Link>
                  <Link
                    className="flex items-center gap-3 text-default text-color-light-text-primary dark:text-color-text-primary hover:text-black dark:hover:text-white"
                    href="https://t.me/Bonenzachannel"
                    target="_blank"
                  >
                    <Image
                      alt="telegram_announcement"
                      src="/img/social/Telegram_Announcement.png"
                      width={30}
                      height={30}
                      className="w-[32px] h-[32px] cursor-pointer"
                    />
                    <p>Telegram Announcement</p>
                  </Link>
                </div>
              </div>
            </div>
          </div>
          {/* footer 2 */}
          {!isDetailPage && (
            <div className="mt-[30px] pt-[30px] flex flex-col items-center border-t border-solid dark:border-color-border-primary border-color-light-border-primary">
              <div className="">
                <div className="font-semibold text-black dark:text-white sm:text-lg max-md:text-left text-[14px]">
                  {String(t('footer:acceptedNetworks'))}
                </div>
              </div>
              <div className="w-full flex-wrap flex justify-center items-center max-md:gap-[16px] gap-[20px] mt-5">
                {acceptedNetworks.map((item, index) => (
                  <div className="max-w-[50px] max-h-[50px]" key={index}>
                    <div className="relative">
                      <Image
                        alt="network icon"
                        src={item.icon}
                        width={50}
                        height={50}
                        className="max-w-[50px] max-h-[50px] cursor-pointer"
                        data-tooltip-id={`accepted-currency-${index}-tooltip`}
                      />
                      {item.networkIcon && (
                        <Image
                          alt="network icon"
                          src={item.networkIcon}
                          width={50}
                          height={50}
                          className="bg-white rounded-full border-solid border-2 border-white absolute right-[0px] bottom-[0px] max-w-[20px] max-h-[20px]"
                        />
                      )}
                    </div>
                    <Tooltip
                      id={`accepted-currency-${index}-tooltip`}
                      place="bottom"
                      className="dark:bg-color-card-header-primary bg-white !rounded-large z-[10]"
                      opacity={100}
                      delayHide={0}
                      clickable
                    >
                      <div className="flex justify-center items-center w-[200px] gap-8 pt-3">
                        <Image
                          alt="currency network icon"
                          src={item.icon}
                          width={50}
                          height={50}
                          className="max-w-[50px] max-h-[50px] cursor-pointer"
                        />
                        <div>
                          <div>{item.network}</div>
                          <div>{item.token}</div>
                        </div>
                      </div>
                      <Link
                        href={`?coin=${item.token}`}
                        className="mb-3 w-full mt-6 truncate text-white rounded-large bg-gradient-btn-play shadow-bs-btn flex items-center justify-center gap-[7px] py-2 sm:p-[10px] p-[3px] text-default font-semibold"
                        onClick={() => {
                          if (isLogin) {
                            dispatch(changeIsShowDepositModal(true));
                          } else {
                            dispatch(changeAuthenticationType(AuthenticationModeEnum.SIGN_IN));
                            dispatch(changeIsShowAuthenticationModal(true));
                          }
                        }}
                      >
                        {t('layout:deposit')}
                      </Link>
                    </Tooltip>
                  </div>
                ))}
              </div>
            </div>
          )}
          {/* footer 3 */}
          <div
            className={cn(
              'mt-[30px] py-12 grid grid-cols-1 lg:grid-cols-3 gap-y-10 lg:gap-x-20',
              'border-t border-solid dark:border-color-border-primary border-color-light-border-primary',
            )}
          >
            <div className={cn('col-span-2 flex flex-col gap-5 sm:pb-4', { 'mt-[40px]': isDetailPage })}>
              <Image
                alt="logo"
                src="/img/logo-light.png"
                width={220}
                height={27}
                className="w-[220px] h-[44px] cursor-pointer"
              />
              <div className="text-default">{String(t('footer:bonenzaDescription1'))}</div>
              <div className="flex flex-col gap-[10px] text-default font-light">
                <div className="flex gap-[5px]">
                  {String(t('footer:business'))}
                  <Link className="text-color-text-mailto" href={`mailto:${t('footer:businessMail')}`}>
                    {String(t('footer:businessMail'))}
                  </Link>
                </div>
                <div className="flex gap-[5px]">
                  {String(t('footer:help'))}
                  <Link className="text-color-text-mailto" href={`mailto:${t('footer:helpMail')}`}>
                    {String(t('footer:helpMail'))}
                  </Link>
                </div>
              </div>
            </div>
            {!isDetailPage && (
              <div className="col-span-1 flex flex-col items-center justify-center gap-[30px] w-full">
                <div className="font-semibold text-black dark:text-white max-md:text-center text-[16px] md:text-[18px]">
                  {String(t('footer:sponsorshipAndGamingResponsibilities'))}
                </div>
                <div className="flex justify-center lg:justify-between items-center gap-5 sm:gap-10 w-full">
                  <Link href="https://sigmaawards.org/" target="_blank">
                    <Image
                      alt="sigma logo"
                      src="/img/sigma-logo.png"
                      width={50}
                      height={50}
                      className="object-contain w-auto h-[4rem] lg:h-[4.5rem]"
                    />
                  </Link>

                  <Link href="https://www.responsiblegambling.org/" target="_blank">
                    <Image
                      alt="responsible gambling logo"
                      src="/img/responsible-gambling-logo.png"
                      width={120}
                      height={60}
                      className="object-contain w-[120px] h-[60px]"
                    />
                  </Link>
                </div>
              </div>
            )}
          </div>

          <div className="text-center text-default font-light flex flex-col gap-2 pb-24 sm:pb-0">
            <p>{t('footer:copyright1')}</p>
            <p>{t('footer:copyright2')}</p>
          </div>
        </div>
      </footer>
      {showModalContacts && (
        <ModalBusinessContacts
          show={showModalContacts}
          onClose={() => {
            setShowModalContacts(false);
          }}
        />
      )}
      {showModalVerify && (
        <ModalVerifyRepresentative
          show={showModalVerify}
          onClose={() => {
            setShowModalVerify(false);
          }}
        />
      )}
    </>
  );
}
