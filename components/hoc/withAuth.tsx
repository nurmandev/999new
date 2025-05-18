import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { shallowEqual, useSelector } from 'react-redux';

import { api_validateToken } from '@/api/auth';
import Loader from '@/base/components/common/preloader/loader';
import { ROUTER, SOCKET_GAME_URL, SOCKET_WALLET_URL } from '@/base/constants/common';
import { CookiesStorage } from '@/base/libs/storage/cookie';
import { convertUserInfo } from '@/base/libs/utils';
import { initialSocketConnection } from '@/base/libs/utils/socket-helpers';
import { logoutState, saveUserInfo } from '@/base/redux/reducers/auth.reducer';
import { changeViewInFiat } from '@/base/redux/reducers/common.reducer';
import { changeIsShowAuthenticationModal } from '@/base/redux/reducers/modal.reducer';
import { setGameSocket, setSocket } from '@/base/redux/reducers/socket.reducer';
import { initWalletInfo, logoutWallet, setLocalFiat } from '@/base/redux/reducers/wallet.reducer';
import { AppState, useAppDispatch } from '@/base/redux/store';
import { CurrencyType } from '@/base/types/wallet';

type WithAuthComponent<P> = React.FunctionComponent<P> & {
  getLayout?: (page: React.ReactElement) => React.ReactElement;
};

function withAuth<P extends Record<string, unknown>>(WrappedComponent: any): WithAuthComponent<P> {
  const Authorization = (props: P) => {
    const { initSocket, user, gameSocket } = useSelector(
      (state: AppState) => ({
        user: state.auth.user,
        initSocket: state.socket.walletSocket,
        gameSocket: state.socket.gameSocket,
      }),
      shallowEqual,
    );
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);

    const dispatch = useAppDispatch();

    const redirectToLogin = () => {
      router.replace(ROUTER.Home);
    };

    const handlerMeError = () => {
      dispatch(logoutState());
      dispatch(logoutWallet());
      CookiesStorage.logout();
      return new Promise((resolve) => {
        if (router.pathname !== ROUTER.Home) {
          redirectToLogin();
        }
        resolve(true);
      });
    };

    const checkIsAuthenticated = async () => {
      try {
        const accessToken = CookiesStorage.getAccessToken();
        if (!accessToken) {
          if (router.pathname !== ROUTER.Home) {
            dispatch(changeIsShowAuthenticationModal(true));
            redirectToLogin();
          }
          return;
        }

        const result = await api_validateToken(accessToken);
        const localFiat: CurrencyType = {
          id: result.data?.settingFiatCurrency?.id ?? '',
          name: result.data?.settingFiatCurrency?.symbol ?? '',
          alias: result.data?.settingFiatCurrency?.name ?? '',
          logo: `/img/fiats/${result.data?.settingFiatCurrency?.symbol}.png`,
          iso_currency: result.data?.settingFiatCurrency?.iso_currency,
          iso_decimals: result.data?.settingFiatCurrency?.iso_decimals,
          availableNetworks: [],
          price: Number(result.data?.settingFiatCurrency?.price),
          type: 'fiat',
          favorite: result.data?.settingFiatCurrency?.favorite,
        };

        dispatch(saveUserInfo({ ...convertUserInfo(result.data) }));
        dispatch(initWalletInfo());
        dispatch(setLocalFiat(localFiat));

        if (!initSocket?.connected) {
          const newSocket = await initialSocketConnection(SOCKET_WALLET_URL ?? '');
          dispatch(setSocket(newSocket));
        }

        if (!gameSocket?.connected) {
          const newGameSocket = await initialSocketConnection(SOCKET_GAME_URL ?? '');
          dispatch(setGameSocket(newGameSocket));
        }

        setIsLoading(false);
        return;
      } catch (err) {
        await handlerMeError();
      } finally {
        setIsLoading(false);
      }
    };

    useEffect(() => {
      checkIsAuthenticated();
    }, []);

    return isLoading ? <Loader /> : <WrappedComponent {...props} />;
  };

  return Authorization;
}

export default withAuth;
