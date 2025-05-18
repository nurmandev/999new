'use client';

import '@/styles/main/main.scss';
import 'react-phone-number-input/style.css';
import 'react-tooltip/dist/react-tooltip.css';
import '@rainbow-me/rainbowkit/styles.css';

import { GoogleAnalytics } from "@next/third-parties/google";
import { getDefaultWallets, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { GoogleOAuthProvider } from '@react-oauth/google';
import type { NextPage } from 'next';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Script from 'next/script';
import NextProgress from 'next-progress';
import { ThemeProvider } from 'next-themes';
import { ReactElement, ReactNode, useEffect } from 'react';
import { ToastContainer } from 'react-toastify';
import { configureChains, createConfig, WagmiConfig } from 'wagmi';
import { arbitrum, base, mainnet, optimism, polygon, zora } from 'wagmi/chains';
import { publicProvider } from 'wagmi/providers/public';

import { api_validateAuthToken } from '@/api/auth';
import ErrorProvider from '@/components/context/errorContext';
import { wrapper } from '@/redux/store';

import { useTranslation } from '../config/i18next';
import { CookieKey, GOOGLE_ANALYTICS_ID, LANGUAGE_DATA, PROJECT_ID, PROJECT_NAME, TOAST_ENUM } from '../constants/common';
import { CookiesStorage } from '../libs/storage/cookie';
import resources from '../public/locales';

// eslint-disable-next-line
export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};
declare global {
  interface Window {
    sg: any;
  }
}
function MyApp({ Component, ...rest }: AppPropsWithLayout) {
  const router = useRouter();
  const { props } = wrapper.useWrappedStore(rest);
  const getLayout = Component.getLayout ?? ((page) => page);
  const { i18n } = useTranslation('');

  const { chains, publicClient } = configureChains(
    [mainnet, polygon, optimism, arbitrum, base, zora],
    [publicProvider()],
  );

  const { connectors } = getDefaultWallets({
    appName: String(PROJECT_NAME),
    projectId: String(PROJECT_ID),
    chains,
  });

  const wagmiConfig = createConfig({
    autoConnect: false,
    connectors,
    publicClient,
  });

  const handleLang = () => {
    const _codes = navigator.language || navigator.languages[0];
    const [_langCode, _regionCode] = _codes.split('-');
    if (resources.hasOwnProperty(_langCode)) {
      i18n.changeLanguage(_langCode);
    } else {
      i18n.changeLanguage('en');
    }
  };

  const handleAuthenticationWeb = async () => {
    const auth = CookiesStorage.getCookieData(CookieKey.auth) || '';
    try {
      if (!auth) {
        router.push('/auth');
        return;
      }
      const _res = await api_validateAuthToken(auth);
      if (!_res.data) {
        router.push('/auth');
      }
    } catch (error) {
      router.push('/auth');
    }
  };

  useEffect(() => {
    // handleAuthenticationWeb();
    handleLang();
  }, []);

  return (
    <WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider chains={chains}>
        <ErrorProvider>
          <GoogleOAuthProvider clientId={String(process.env.GOOGLE_CLIENT_ID || '')}>
            <Head>
              <link
                rel="icon"
                href="/favicon/favicon.png"
                type="image/png"
                sizes="128x128"
              />
              <base href="/"></base>
              <meta charSet="utf-8" />
              <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0" />
              <meta name="google-site-verification" content="8Pg6SQ4ANq-BBmT7jN0wRovBqUpW0JNxU5kuiVO4aLc" />

              <meta name="language" content="English" />
              <meta name="url" content="https://www.bonenza.com" />

              <meta property="twitter:image" content="https://bonenza.com/img/logo-mobile.png" />
              <meta name="theme-color" content="#01042C" />
              <meta name="apple-mobile-web-app-capable" content="yes" />
              <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
              <meta property="og:image" content="https://bonenza.com/img/logo-mobile.png" />
              <meta property="og:url" content="https://bonenza.com/casino" />
              <meta property="og:type" content="website" />
              <meta
                name="keywords"
                content="Bonenza, crypto online casino, Bitcoin casino, Ethereum gambling, play online casino with crypto, baccarat tournament, crypto tournaments"
              />
              <noscript>Your browser does not support JavaScript!</noscript>
              <script type="application/ld+json" dangerouslySetInnerHTML={{
                __html: JSON.stringify({
                  "@context": "https://schema.org",
                  "@type": "Organization",
                  "name": "Bonenza",
                  "url": "https://bonenza.com/",
                  "logo": "https://bonenza.com/img/logo-mobile.png"
                })
              }} />

            </Head>
            <Script async src="/game.js"></Script>
            <Script async src="https://telegram.org/js/telegram-widget.js?22"></Script>

            <NextProgress options={{ showSpinner: false }} />
            <ThemeProvider defaultTheme="dark" attribute="class">
              <>
                <ToastContainer
                  autoClose={5000}
                  className="z-index-toast !text-[12px]"
                  position="bottom-left"
                  theme={'dark'}
                  hideProgressBar={false}
                  icon={() => null}
                  closeButton={() => null}
                  toastClassName={'min-h-[40px]'}
                  bodyClassName={'!p-0 text-gray-200'}
                  enableMultiContainer
                  containerId={TOAST_ENUM.COMMON}
                />
                {getLayout(<Component {...props.pageProps} />)}
              </>
            </ThemeProvider>
            <GoogleAnalytics gaId={String(GOOGLE_ANALYTICS_ID)} />
          </GoogleOAuthProvider>
        </ErrorProvider>
      </RainbowKitProvider>
    </WagmiConfig>
  );
}

export default wrapper.withRedux(MyApp);
