import { DialogProps, TransitionRootProps } from '@headlessui/react';
import { WalletButton } from '@rainbow-me/rainbowkit';
import { CodeResponse, useGoogleLogin } from '@react-oauth/google';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { ElementType, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useAccount, useDisconnect, useSignMessage } from 'wagmi';

import { api_loginWithGoogle, api_loginWithTelegram, api_loginWithWallet } from '@/api/auth';
import { useTranslation } from '@/base/config/i18next';
import { TOAST_ENUM } from '@/base/constants/common';
import { CookiesStorage } from '@/base/libs/storage/cookie';
import { convertUserInfo, getMessageMetamask } from '@/base/libs/utils';
import { getErrorMessage } from '@/base/libs/utils/notificationToast';
import { saveUserInfo } from '@/base/redux/reducers/auth.reducer';
import { changeDisabledPeriod } from '@/base/redux/reducers/common.reducer';
import { changeIsShowAuthenticationModal, changeIsShowSelfExclusion } from '@/base/redux/reducers/modal.reducer';
import { initWalletInfo, setLocalFiat } from '@/base/redux/reducers/wallet.reducer';
import { useAppDispatch } from '@/base/redux/store';
import { CurrencyType } from '@/base/types/wallet';

declare let window: any;

type LoginWalletProps = {
  onClose?: () => void;
} & TransitionRootProps<ElementType> &
  DialogProps<ElementType>;

export default function LoginWallet({ onClose }: LoginWalletProps) {
  const { t } = useTranslation('');
  const dispatch = useAppDispatch();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isHere, setIsHere] = useState(false);
  const { query } = useRouter();
  const { referral } = query;
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const { signMessageAsync } = useSignMessage();

  const googleLogin = async (codeResponse: Omit<CodeResponse, 'error' | 'error_description' | 'error_uri'>) => {
    try {
      setIsLoading(true);
      const _Res = await api_loginWithGoogle(codeResponse.code, referral ? String(referral) : '');
      await onSuccessfullyLogined(_Res);
      toast.success(t('authentication:loginSuccessfully'), { containerId: TOAST_ENUM.COMMON });
    } catch (error: any) {
      const errType = error.response?.data?.message ?? '';
      const errMessage = getErrorMessage(errType);
      toast.error(t(errMessage), { containerId: TOAST_ENUM.COMMON });

      const status = error.response?.data?.statusCode ?? '';
      if (status === 401 && errType.includes('disabledAccount') === true) {
        const period = errType.split('_')[1];
        dispatch(changeIsShowAuthenticationModal(false));
        dispatch(changeIsShowSelfExclusion(true));
        dispatch(changeDisabledPeriod(Number(period)));
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: googleLogin,
    flow: 'auth-code',
  });

  const handleTelegram = async () => {
    try {
      setIsLoading(true);
      window.Telegram.Login.auth({ bot_id: process.env.TELEGRAM_BOT_ID, request_access: true }, async (data: any) => {
        if (!data) {
          setIsLoading(false);
          return;
        }
        data.referralCode = referral ? String(referral) : '';
        const _Res = await api_loginWithTelegram(data);
        await onSuccessfullyLogined(_Res);
        toast.success(t('authentication:loginSuccessfully'), { containerId: TOAST_ENUM.COMMON });
      });
    } catch (error: any) {
      const errType = error.response?.data?.message ?? '';
      const errMessage = getErrorMessage(errType);
      toast.error(t(errMessage), { containerId: TOAST_ENUM.COMMON });

      const status = error.response?.data?.statusCode ?? '';
      if (status === 401 && errType.includes('disabledAccount') === true) {
        const period = errType.split('_')[1];
        dispatch(changeIsShowAuthenticationModal(false));
        dispatch(changeIsShowSelfExclusion(true));
        dispatch(changeDisabledPeriod(Number(period)));
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleWallet = async () => {
    try {
      setIsLoading(true);

      if (!isConnected) return;
      const message = getMessageMetamask(String(address));
      const signauture = await signMessageAsync({ message });
      const _Res = await api_loginWithWallet(String(address), String(signauture), referral ? String(referral) : '');
      await onSuccessfullyLogined(_Res);
      toast.success(t('authentication:loginSuccessfully'), { containerId: TOAST_ENUM.COMMON });
    } catch (error: any) {
      const errType = error.response?.data?.message ?? '';
      const errMessage = getErrorMessage(errType);
      toast.error(t(errMessage), { containerId: TOAST_ENUM.COMMON });

      const status = error.response?.data?.statusCode ?? '';
      if (status === 401 && errType.includes('disabledAccount') === true) {
        const period = errType.split('_')[1];
        dispatch(changeIsShowAuthenticationModal(false));
        dispatch(changeIsShowSelfExclusion(true));
        dispatch(changeDisabledPeriod(Number(period)));
      }
      disconnect();
    } finally {
      setIsLoading(false);
    }
  };

  const onSuccessfullyLogined = async (_Res: any) => {
    try {
      const { token, user } = _Res.data;
      CookiesStorage.setAccessToken(token);
      const localFiat: CurrencyType = {
        id: user.settingFiatCurrency.id ?? '',
        name: user.settingFiatCurrency.symbol ?? '',
        alias: user.settingFiatCurrency.name ?? '',
        logo: `/img/fiats/${user.settingFiatCurrency.symbol}.png`,
        iso_currency: user.settingFiatCurrency.iso_currency,
        iso_decimals: user.settingFiatCurrency.iso_decimals,
        availableNetworks: [],
        price: Number(user.settingFiatCurrency.price),
        type: 'fiat',
        favorite: user.settingFiatCurrency.favorite,
      };
      dispatch(
        saveUserInfo({
          ...convertUserInfo(user),
        }),
      );
      dispatch(initWalletInfo());
      dispatch(setLocalFiat(localFiat));
    } catch (error) { }
  };

  useEffect(() => {
    if (isConnected && isHere) {
      handleWallet();
    }
  }, [isConnected]);

  useEffect(() => {
    return () => {
      setIsHere(false);
    };
  }, []);
  return (
    <>
      <div className="text-center text-white text-[14px] font-[600]">
        <div className="flex flex-row items-center justify-center sm:gap-[10px] gap-[5px]">
          <div
            className="bg-white dark:bg-color-header-secondary hover:bg-gray-200 dark:hover:bg-gray-700 p-0.5 font-semibold rounded-full"
            onClick={() => handleGoogleLogin()}
          >
            <button className="px-2 py-2 w-full text-white">
              <Image height={30} width={30} src={'/img/google.svg'} alt="google" className="inline w-[30px]" />
            </button>
          </div>
          <div
            className="bg-white dark:bg-color-header-secondary hover:bg-gray-200 dark:hover:bg-gray-700 p-0.5 font-semibold rounded-full"
            onClick={handleTelegram}
          >
            <button className="px-2 py-2 w-full text-white">
              <Image height={30} width={30} src={'/img/telegram.svg'} alt="telegram" className="inline w-[30px]" />
            </button>
          </div>
          <div className="bg-white dark:bg-color-header-secondary hover:bg-gray-200 dark:hover:bg-gray-700 p-0.5 font-semibold rounded-full">
            <WalletButton.Custom wallet="metamask">
              {({ ready, connect }) => {
                return (
                  <button
                    className="px-2 py-2 w-full text-white"
                    disabled={!ready}
                    onClick={() => {
                      setIsHere(true);
                      connect();
                    }}
                  >
                    <Image height={30} width={30} src={'/img/icon/MetaMask.png'} alt="metamask" className="inline w-[30px]" />
                  </button>
                );
              }}
            </WalletButton.Custom>
          </div>
          <div className="bg-white dark:bg-color-header-secondary hover:bg-gray-200 dark:hover:bg-gray-700 p-0.5 font-semibold rounded-full">
            <WalletButton.Custom wallet="walletConnect">
              {({ ready, connect }) => {
                return (
                  <button
                    className="px-2 py-2 w-full text-white"
                    disabled={!ready}
                    onClick={() => {
                      setIsHere(true);
                      connect();
                    }}
                  >
                    <Image
                      height={30}
                      width={30}
                      src={'/img/icon/WalletConnect.png'}
                      alt=""
                      className="inline w-[30px]"
                    />
                  </button>
                );
              }}
            </WalletButton.Custom>
          </div>
        </div>
      </div>
    </>
  );
}
