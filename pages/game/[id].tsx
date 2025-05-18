import { StarIcon } from '@heroicons/react/24/solid';
import cn from 'classnames';
import { LoginCurve, PlayCricle, Refresh, Send2 } from 'iconsax-react';
import type { GetStaticPaths, InferGetStaticPropsType } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { ReactElement, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { isMobile } from 'react-device-detect';
import { FullScreen, useFullScreenHandle } from 'react-full-screen';
import ReactLoading from 'react-loading';
import { shallowEqual, useSelector } from 'react-redux';
import { toast } from 'react-toastify';

import {
  api_getGameDetail,
  api_getGameFavorite,
  api_setGameFavorite,
  api_startGameDemo,
  api_startGameSession,
  apiSSR_gamesIdentifiers,
} from '@/api/game';
import { useTranslation } from '@/base/config/i18next';
import { API_GAME_IMAGE, ROUTER, TOAST_ENUM } from '@/base/constants/common';
import { formatDate, isEmpty } from '@/base/libs/utils';
import { convertGameIdentifierToUrl, convertUrlToGameIdentifier } from '@/base/libs/utils/convert';
import { getErrorMessage } from '@/base/libs/utils/notificationToast';
import {
  changeAuthenticationType,
  changeIsShowAuthenticationModal,
  changeIsShowDepositModal,
} from '@/base/redux/reducers/modal.reducer';
import { AppState, useAppDispatch } from '@/base/redux/store';
import { AuthenticationModeEnum, GameListType, GameProviderDetail } from '@/base/types/common';
import { GameCreateSessionRequest, GameDemoRequest } from '@/base/types/requestTypes';
import { Breadcrumbs } from '@/components/breadcrumbs/breadcrumbs';
import Loader from '@/components/common/preloader/loader';
import GameDescriptionComponent from '@/components/game/gameDescription';
import GameDetailComponent from '@/components/game/gameDetail';
import GameReviewComponent from '@/components/game/gameReview';
import BaseLayout from '@/components/layouts/base.layout';
import FiatHeader from '@/components/layouts/header/fiatHeader';
import ModalShareGame from '@/components/modal/shareGame/shareGame';

import styles from './index.module.scss';

export const getStaticPaths = (async () => {
  const response = await apiSSR_gamesIdentifiers();
  const games = response.data;
  return {
    paths: games.map((game: any) => ({ params: { id: convertGameIdentifierToUrl(game) } })),
    fallback: false, // false or "blocking"
  };
}) satisfies GetStaticPaths;

export const getStaticProps = async ({ params }: any) => {
  return { props: { params } };
};

type LaunchUrlTye = {
  gameLauncherUrl: string;
  gameUrl: string;
  strategy: string;
  lobbyUrl: string;
  tokenId: string;
};

function GamePage({ params }: InferGetStaticPropsType<typeof getStaticProps>) {
  const router = useRouter();
  const { reload } = router;
  const dispatch = useAppDispatch();

  const { id } = params;

  const [loadings, setLoadings] = useState({
    screenLoad: false,
    gameLoad: false,
    reactLoad: false,
  });

  const playStatusRef = useRef<'Free' | 'Real'>('Free'); // free: free, real: real

  const [gameDetail, setGameDetail] = useState<GameListType>({
    id: '',
    title: '',
    provider: '',
    identifier: '',
    payout: 0,
    multiplier: 0,
    description: '',
    releasedAt: '',
    allowedLocation: false,
    allowedDemo: false,
    providerName: '',
    favorites: 0,
  });
  const [openShareGame, setOpenShareGame] = useState<boolean>(false);
  const [reactionData, setReactionData] = useState({
    isFavorite: false,
    isLike: false,
  });
  const [successfullyLaunched, setSuccessfullyLaunched] = useState<boolean>(false);
  const [providerDetail, setProviderDetail] = useState<GameProviderDetail | any>();

  const [tab, setTab] = useState(1);

  const gameScreen = useFullScreenHandle();
  const { t } = useTranslation('');

  const [isSatisfied, setIsSatisfied] = useState<boolean>(true); // if balance is enough, value is true

  const { isLogin, localFiat, activeCurrency, balances, language, viewInFiat } = useSelector(
    (state: AppState) => ({
      viewInFiat: state.auth.user.generalSetting.settingViewInFiat,
      localFiat: state.wallet.localFiat,
      activeCurrency: state.wallet.activeCurrency,
      balances: state.wallet.balances,
      isLogin: state.auth.isLogin,

      language: state.auth.user.generalSetting.settingLanguage,
    }),
    shallowEqual,
  );

  const _initLoadGame = useCallback(async () => {
    if (isEmpty(id)) return;

    setLoadings({
      ...loadings,
      screenLoad: true,
    });

    try {
      const identifier = convertUrlToGameIdentifier(id);
      const _res = await api_getGameDetail(identifier);

      const tempGameDetailData: GameListType = {
        id: _res.data?.id ?? '',
        title: _res.data?.title ?? '',
        provider: _res.data?.producerIdentifier ?? '',
        providerName: _res.data?.producerName ?? '',
        identifier: _res.data?.identifier ?? '',
        payout: Number(_res.data?.payout ?? 0),
        multiplier: Number(_res.data?.multiplier ?? 0),
        isExpiration: _res.data?.isExpiration ?? false,
        description: _res.data?.description ?? '',
        releasedAt: _res.data?.releasedAt ?? '',
        gameCnt: Number(_res.data?.producerDetails?.gameCount ?? 0),
        allowedLocation: _res.data?.allowLocation,
        allowedDemo: _res.data?.allowDemo,
        favorites: _res.data?.favoriteCount,
      };

      setGameDetail(tempGameDetailData);

      playStatusRef.current = 'Free';
    } catch (error: any) {
      const errType = error.response?.data?.message ?? '';
      const errMessage = getErrorMessage(errType);
      toast.error(t(errMessage), { containerId: TOAST_ENUM.COMMON });
    } finally {
      setLoadings({
        ...loadings,
        screenLoad: false,
      });
    }
  }, [id]);

  const _initFreePlay = useCallback(() => {
    if (!gameDetail.id) {
      return;
    }
    if (!gameDetail.allowedLocation) {
      toast.error(t('errors:game:notAllowedLocation'), {
        containerId: TOAST_ENUM.COMMON,
        toastId: 'toast-notAllowed-notification',
      });
      return;
    }
    if (!gameDetail.allowedDemo) {
      // toast.error(t('errors:game:notAllowedDemo'), { containerId: TOAST_ENUM.COMMON, toastId: 'game-play' });
      return;
    }

    if (isMobile || playStatusRef.current === 'Real') return;

    setLoadings({
      ...loadings,
      gameLoad: true,
    });

    const list = document.getElementById('game_wrapper');
    if (list?.firstElementChild) {
      list?.removeChild(list?.firstElementChild);
    }
    const requestData: GameDemoRequest = {
      gameId: gameDetail.id,
      locale: language,
    };

    api_startGameDemo(requestData)
      .then((res) => {
        const lanuchGameOption: LaunchUrlTye = {
          gameLauncherUrl: res.data.gameLauncherUrl,
          gameUrl: res.data.gameUrl,
          strategy: res.data.strategy,
          lobbyUrl: res.data.lobbyUrl,
          tokenId: res.data.tokenId,
        };

        const success = () => {
          setLoadings({
            ...loadings,
            gameLoad: false,
          });
        };
        const error = () => {
          setLoadings({
            ...loadings,
            gameLoad: false,
          });
        };
        launchGame(
          lanuchGameOption.gameUrl,
          lanuchGameOption.gameLauncherUrl,
          lanuchGameOption.strategy,
          lanuchGameOption.lobbyUrl,
          lanuchGameOption.tokenId,
          success,
          error,
        );
      })
      .catch((error: any) => {
        const errType = error.response?.data?.message ?? '';
        const errMessage = getErrorMessage(errType);
        toast.error(t(errMessage), { containerId: TOAST_ENUM.COMMON });
        setLoadings({
          ...loadings,
          gameLoad: false,
        });
      })
      .finally(() => {
        setLoadings({
          ...loadings,
          gameLoad: false,
        });
      });
  }, [language, isMobile, gameDetail.id]);

  const handleFreeplay = () => {
    try {
      if (!gameDetail.allowedDemo) {
        toast.error(t('errors:game:notAllowedDemo'), { containerId: TOAST_ENUM.COMMON, toastId: 'game-play' });
        return;
      }

      if (!gameDetail.allowedLocation) {
        toast.error(t('errors:game:notAllowedLocation'), {
          containerId: TOAST_ENUM.COMMON,
          toastId: 'toast-notAllowed-notification',
        });
        return;
      }

      playStatusRef.current = 'Free';
      setLoadings({
        ...loadings,
        gameLoad: true,
      });
      setSuccessfullyLaunched(false);

      if (!isMobile) {
        setSuccessfullyLaunched(true);
        setLoadings({
          ...loadings,
          gameLoad: false,
        });
        return;
      }

      const list = document.getElementById('game_wrapper');
      if (list?.firstElementChild) {
        list?.removeChild(list?.firstElementChild);
      }
      const requestData: GameDemoRequest = {
        gameId: gameDetail.id,
        locale: language,
      };
      let newWindow: any;
      if (isMobile) {
        newWindow = window.open('about:blank', '_blank');
      }

      // for desktop, free mode is already rendered, no need to call this api
      api_startGameDemo(requestData)
        .then((res) => {
          const lanuchGameOption: LaunchUrlTye = {
            gameLauncherUrl: res.data.gameLauncherUrl,
            gameUrl: res.data.gameUrl,
            strategy: res.data.strategy,
            lobbyUrl: res.data.lobbyUrl,
            tokenId: res.data.tokenId,
          };
          setLoadings({
            ...loadings,
            gameLoad: false,
          });
          newWindow.location.href = lanuchGameOption.gameUrl;
        })
        .catch((error: any) => {
          const errType = error.response?.data?.message ?? '';
          const errMessage = getErrorMessage(errType);
          toast.error(t(errMessage), { containerId: TOAST_ENUM.COMMON });
          setLoadings({
            ...loadings,
            gameLoad: false,
          });
        })
        .finally(() => {});
    } catch (error: any) {
      const errType = error.response?.data?.message ?? '';
      const errMessage = getErrorMessage(errType);
      toast.error(t(errMessage), { containerId: TOAST_ENUM.COMMON });
    }
  };
  const handleSignUp = async () => {
    dispatch(changeAuthenticationType(AuthenticationModeEnum.SIGN_UP));
    dispatch(changeIsShowAuthenticationModal(true));
  };
  const handleRealPlay = () => {
    try {
      playStatusRef.current = 'Real';
      const tempBalances = [...balances];
      const selectedBalance = tempBalances.find((item) => item.symbolId === activeCurrency.id);
      const balance = selectedBalance?.amount ?? 0;
      const isBalanceSatisfied = balance > 0;
      setSuccessfullyLaunched(false);
      setIsSatisfied(isBalanceSatisfied);

      if (!isBalanceSatisfied) {
        setIsSatisfied(false);
        return;
      }

      if (!gameDetail.allowedLocation) {
        toast.error(t('errors:game:notAllowedLocation'), {
          containerId: TOAST_ENUM.COMMON,
          toastId: 'toast-notAllowed-notification',
        });
        return;
      }

      setLoadings({
        ...loadings,
        gameLoad: true,
      });

      const list = document.getElementById('game_wrapper');
      if (list?.firstElementChild) {
        list?.removeChild(list?.firstElementChild);
      }
      const requestData: GameCreateSessionRequest = {
        gameId: gameDetail.id,
        currencyType: activeCurrency.type,
        currencyId: activeCurrency.id,
      };

      let newWindow: any;
      if (isMobile) {
        newWindow = window.open('about:blank', '_blank');
      }

      api_startGameSession(requestData)
        .then((res) => {
          const lanuchGameOption: LaunchUrlTye = {
            gameLauncherUrl: res.data.gameLauncherUrl,
            gameUrl: res.data.gameUrl,
            strategy: res.data.strategy,
            lobbyUrl: res.data.lobbyUrl,
            tokenId: res.data.tokenId,
          };
          if (isMobile && newWindow) {
            setSuccessfullyLaunched(true);
            setLoadings({
              ...loadings,
              gameLoad: false,
            });
            // const url = _generateMobilePlayUrl(lanuchGameOption);
            // router.push(url);
            newWindow.location.href = lanuchGameOption.gameUrl;
          }
          if (!isMobile) {
            const success = () => {
              setSuccessfullyLaunched(true);
              setLoadings({
                ...loadings,
                gameLoad: false,
              });
            };
            const error = () => {
              setSuccessfullyLaunched(false);
              setLoadings({
                ...loadings,
                gameLoad: false,
              });
            };
            launchGame(
              lanuchGameOption.gameUrl,
              lanuchGameOption.gameLauncherUrl,
              lanuchGameOption.strategy,
              lanuchGameOption.lobbyUrl,
              lanuchGameOption.tokenId,
              success,
              error,
            );
          }
        })
        .catch((error: any) => {
          const errType = error.response?.data?.message ?? '';
          const errMessage = getErrorMessage(errType);
          toast.error(t(errMessage), { containerId: TOAST_ENUM.COMMON });
          setLoadings({
            ...loadings,
            gameLoad: false,
          });
        })
        .finally(() => {});
    } catch (error: any) {
      const errType = error.response?.data?.message ?? '';
      const errMessage = getErrorMessage(errType);
      toast.error(t(errMessage), { containerId: TOAST_ENUM.COMMON });
      setLoadings({
        ...loadings,
        gameLoad: false,
      });
    }
  };

  const getGameReactInfo = useCallback(async () => {
    try {
      if (!gameDetail.id || !isLogin) return;
      const res = await api_getGameFavorite(gameDetail.id);
      const favorite = res.data.state;
      setReactionData({
        ...reactionData,
        isFavorite: favorite,
      });
    } catch (error: any) {
      const errType = error.response?.data?.message ?? '';
      const errMessage = getErrorMessage(errType);
      toast.error(t(errMessage), { containerId: TOAST_ENUM.COMMON });
      setReactionData({
        isFavorite: false,
        isLike: false,
      });
    }
  }, [isLogin, gameDetail.id]);

  const handleReactGame = async () => {
    try {
      if (!isLogin) {
        dispatch(changeIsShowAuthenticationModal(true));
        dispatch(changeAuthenticationType(AuthenticationModeEnum.SIGN_IN));
        return;
      }
      setLoadings({
        ...loadings,
        reactLoad: true,
      });

      const res = await api_setGameFavorite(gameDetail.id);
      const count = res.data?.count;
      const state = res.data?.state;
      setGameDetail({ ...gameDetail, favorites: count });
      setReactionData({ ...reactionData, isFavorite: state });
    } catch (error: any) {
      const errType = error.response?.data?.message ?? '';
      const errMessage = getErrorMessage(errType);
      toast.error(t(errMessage), { containerId: TOAST_ENUM.COMMON });
    } finally {
      setLoadings({
        ...loadings,
        reactLoad: false,
      });
    }
  };

  // for mobile playing, generate redirect url
  const _generateMobilePlayUrl = (data: Record<string, string>) => {
    // ...
    let urls: string[] = [];
    Object.keys(data).map((key: string) => {
      if (!isEmpty(data[key])) {
        urls.push(`${key}=${encodeURIComponent(data[key])}`);
      }
    });

    const protocal = window.location.protocol;
    const host = window.location.host;
    const url = `${protocal}//${host}/enter-game/?${urls.join('&')}`;
    return url;
  };

  const launchGame = (
    gameUrl: string,
    launcherUrl: string,
    strategy: string,
    lobbyUrl: string,
    tokenId: string,
    onSuccess: Function,
    onError: Function,
  ) => {
    try {
      const list = document.getElementById('game_wrapper');
      if (list?.firstElementChild) {
        list?.removeChild(list?.firstElementChild);
      }

      const gameLaunchOptions = {
        target_element: 'game_wrapper',
        launch_options: {
          // IMPORTANT WARNING:
          // You will receive all these parameters as a response by launch demo / session request to the SOFTSWISS Game Aggregator.
          // Pass them directly here without any manual modifications, as this could disrupt the game launching process.

          // Required
          game_launcher_url: launcherUrl, // URL to GameLauncher HTML page

          // Game parameters. Required.
          game_url: gameUrl,
          strategy: strategy,
          lobby_url: lobbyUrl,
          token_id: tokenId,
          // The number of game parameters depends on 'strategy'.
        },
      };
      window.sg.launch(gameLaunchOptions, onSuccess, onError);
    } catch (error) {
      console.log('error', error);
      setSuccessfullyLaunched(false);
      toast(t('notification:errors:gameLaunchedFailed'));
    } finally {
      setLoadings({
        ...loadings,
        gameLoad: false,
      });
    }
  };

  useEffect(() => {
    setSuccessfullyLaunched(false);
    setLoadings({
      screenLoad: false,
      gameLoad: false,
      reactLoad: false,
    });
  }, []);

  useEffect(() => {
    setIsSatisfied(true);
    if (localFiat?.id && activeCurrency.id !== '' && successfullyLaunched) {
      if (playStatusRef.current === 'Real') {
        handleRealPlay();
      }
      if (playStatusRef.current === 'Free') {
        handleFreeplay();
      }
    }
  }, [localFiat?.id, activeCurrency.id, language]);

  useEffect(() => {
    getGameReactInfo();
  }, [getGameReactInfo]);

  useEffect(() => {
    _initFreePlay();
  }, [_initFreePlay]);

  useEffect(() => {
    _initLoadGame();
  }, [_initLoadGame]);

  const GamePlayingMobile = useMemo(() => {
    if (!isMobile) return <></>;

    return (
      <>
        <div
          className={cn(
            'sm:hidden flex flex-col rounded h-full absolute z-[5] top-0 w-full transition-opacity duration-1000 p-[15px] gap-[10px]',
            {
              // hidden: !isPlayRequested,
              // 'opacity-0': successfullyLaunched,
              // 'opacity-100': !successfullyLaunched,
              // 'pointer-events-none': successfullyLaunched,
            },
          )}
        >
          <div className="grid grid-cols-2 w-full h-fit gap-[10px]">
            <div className="relative flex aspect-square">
              <Image
                src={
                  gameDetail.identifier
                    ? `${API_GAME_IMAGE}/icon/${gameDetail?.identifier?.replace(':', '_')}.png`
                    : '/img/game-background.png'
                }
                fill
                alt="game logo"
                className="rounded-default"
                onError={(e) => {
                  e.currentTarget.src = '/img/game-background.png';
                }}
              />
            </div>
            <div className="flex flex-col aspect-square px-[10px] justify-between">
              <div className="flex flex-col gap-[10px]">
                <div className="font-bold text-black dark:text-white text-default">{gameDetail.title}</div>
                <div className="text-black dark:text-white text-des">
                  <span className="text-gray-400">{t('gameDetail:by')}</span>{' '}
                  <Link
                    className="!underline dark:text-white/90 text-black/90 dark:hover:text-white hover:text-black"
                    href={ROUTER.Provider(String(gameDetail.provider))}
                  >
                    {gameDetail.providerName}
                  </Link>
                </div>
                <div className="text-black dark:text-color-text-secondary text-des">
                  {`${formatDate(new Date(gameDetail.releasedAt), 'yyyy.MM.dd')}`}
                </div>
              </div>
              <div className="flex text-color-text-primary">
                {!loadings.reactLoad ? (
                  <div
                    role="button"
                    className={cn(
                      'dark:hover:bg-gray-700 dark:text-color-text-secondary dark:hover:text-white hover:bg-color-light-bg-primary rounded p-2 flex gap-2 items-center',
                      {
                        '!text-amber-400': reactionData.isFavorite,
                      },
                    )}
                    onClick={() => handleReactGame()}
                  >
                    <StarIcon width={20} />
                    <span className="text-des">{gameDetail?.favorites ?? 0}</span>
                  </div>
                ) : (
                  <div className="w-[49px] flex items-center justify-center">
                    <ReactLoading type={'balls'} width={20} height={20} />
                  </div>
                )}
                <div
                  role="button"
                  className="p-2 rounded dark:hover:bg-gray-700 dark:hover:text-white hover:bg-color-light-bg-primary hover:text-black"
                  onClick={() => setOpenShareGame(true)}
                >
                  <Send2 size={20} variant="Bold" />
                </div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 w-full gap-[10px] mt-[15px]">
            {isLogin ? (
              <button
                type="button"
                disabled={!gameDetail.allowedLocation || loadings.gameLoad}
                className="truncate hover:opacity-90 justify-center text-white rounded-default bg-gradient-btn-play shadow-bs-btn py-[15px] text-default flex items-center gap-[10px] font-bold"
                onClick={() => handleRealPlay()}
              >
                {loadings.gameLoad && playStatusRef.current === 'Real' ? (
                  <ReactLoading type={'balls'} color={'white'} width={20} height={20} />
                ) : (
                  <PlayCricle size={20} />
                )}

                <div className="font-bold">{t('gameDetail:realPlayMobile')}</div>
              </button>
            ) : (
              <button
                type="button"
                disabled={!gameDetail.allowedLocation || loadings.gameLoad}
                className="truncate hover:opacity-90 justify-center text-white rounded-default font-semibold bg-gradient-btn-play shadow-bs-btn py-[15px] text-default flex items-center gap-[10px]"
                onClick={() => handleSignUp()}
              >
                {loadings.gameLoad && playStatusRef.current === 'Real' ? (
                  <ReactLoading type={'balls'} color={'white'} width={20} height={20} />
                ) : (
                  <LoginCurve size={20} />
                )}

                <div>{t('layout:signUp')}</div>
              </button>
            )}

            <button
              type="button"
              className={cn(
                'truncate hover:bg-gray-400 text-white rounded-default font-semibold bg-[#6B7180] py-[15px] text-default items-center gap-[10px] justify-center',
                {
                  flex: gameDetail.allowedDemo,
                  hidden: !gameDetail.allowedDemo,
                },
              )}
              disabled={!gameDetail.allowedLocation || loadings.gameLoad}
              onClick={() => {
                handleFreeplay();
              }}
            >
              {loadings.gameLoad && playStatusRef.current === 'Free' ? (
                <ReactLoading type={'balls'} color={'white'} width={20} height={20} />
              ) : (
                <PlayCricle size={20} />
              )}

              <div>{t('gameDetail:freePlayMobile')}</div>
            </button>
          </div>

          <div className={cn('absolute top-[50px] w-full z-[9] flex left-0', { 'p-[15px]': !isSatisfied && isLogin })}>
            {!isSatisfied && isLogin && (
              <div className="lg:p-[20px] p-[10px] sm:gap-[20px] gap-[10px] sm:hidden flex flex-col items-center z-1 rounded-large sm:max-w-[500px] w-full dark:bg-[#202226] bg-color-light-bg-primary">
                {gameDetail?.isExpiration ? (
                  <div className="min-h-[100px] flex items-center dark:text-white text-black text-default">
                    {t('gameDetail:gameExpiration')}
                  </div>
                ) : (
                  <>
                    <div className="flex flex-row items-center md:gap-[30px] gap-[10px]">
                      <div className="text-start md:text-[18px] sm:text-default text-[12px] dark:text-white text-black">
                        {t('gameDetail:insufficientBalanceIn')}
                      </div>
                      <div className="bg-[#17191B] rounded-default">
                        <FiatHeader inGamePage={true} wrapperClass="!right-0" buttonClass="min-w-[150px]" />
                      </div>
                    </div>
                    <div className="sm:text-[12px] text-[10px] text-[#C2C2C2] text-center">
                      <span className="!text-red-500">
                        {t('gameDetail:insufficient')} {activeCurrency?.name ?? 'USD'} {t('gameDetail:balance')},
                      </span>
                      {t('gameDetail:switchToAnotherAsset')}
                    </div>

                    <div className="flex items-center gap-[20px]">
                      <button
                        type="button"
                        className="truncate hover:bg-[red] text-white rounded-default font-semibold bg-[#F61B4F] sm:py-[9px] py-[5px] sm:px-5 px-[8px] sm:text-default text-[12px] flex items-center gap-[10px]"
                        onClick={() => {
                          dispatch(changeIsShowDepositModal(true));
                        }}
                      >
                        <PlayCricle size={20} />
                        <div>{t('gameDetail:depositAndPlay')}</div>
                      </button>
                      <button
                        type="button"
                        className={cn(
                          'truncate hover:bg-gray-400 text-white rounded-default font-semibold bg-[#6B7180] sm:py-[9px] py-[5px] sm:px-5 px-[8px] sm:text-default text-[12px] items-center gap-[10px]',
                          {
                            flex: gameDetail.allowedDemo,
                            hidden: !gameDetail.allowedDemo,
                          },
                        )}
                        disabled={!gameDetail.allowedLocation || loadings.gameLoad}
                        onClick={() => {
                          handleFreeplay();
                        }}
                      >
                        <PlayCricle size={20} />
                        <div>{t('gameDetail:freePlay')}</div>
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>

          {!isSatisfied && <div className="absolute z-[5] bg-[black]/80 w-full h-full left-0 top-0"></div>}
        </div>
      </>
    );
  }, [isLogin, isMobile, gameDetail.id, loadings, isSatisfied, activeCurrency, reactionData]);

  const GamePlayingDesktop = useMemo(() => {
    if (isMobile) return <></>;

    return (
      <>
        <div
          className={cn(
            'hidden sm:flex items-center justify-center rounded h-full absolute z-[5] top-0 w-full transition-opacity duration-1000',
            {
              'opacity-0': successfullyLaunched,
              'opacity-100': !successfullyLaunched,
              'pointer-events-none': successfullyLaunched,
              'bg-black': loadings.gameLoad,
            },
          )}
        >
          {(loadings.gameLoad || !gameDetail.allowedDemo || !gameDetail.allowedLocation) && (
            <Image
              src={
                gameDetail.identifier
                  ? `${API_GAME_IMAGE}/background/${gameDetail?.identifier?.replace(':', '_')}.jpg`
                  : '/img/game-background.png'
              }
              fill
              alt="game background"
              className="hidden sm:block "
              onError={(e) => {
                e.currentTarget.src = '/img/game-background.png';
              }}
            />
          )}

          <div className={cn('h-full bg-black/60 w-full absolute')} />

          {isLogin && (
            <div className="lg:p-[20px] p-[10px] sm:gap-[20px] gap-[10px] hidden sm:flex flex-col items-center z-1 sm:max-w-[500px] sm:w-full w-[90%] dark:bg-[#202226] bg-color-light-bg-primary rounded">
              {gameDetail?.isExpiration ? (
                <div className="min-h-[100px] flex items-center dark:text-white text-black text-default">
                  {t('gameDetail:gameExpiration')}
                </div>
              ) : (
                <>
                  <div className="flex flex-row items-center md:gap-[30px] gap-[10px]">
                    {isSatisfied && (
                      <div className="text-start md:text-[18px] sm:text-default text-[12px] dark:text-white text-black">
                        {t('gameDetail:playWithBalanceIn')}
                      </div>
                    )}
                    {!isSatisfied && (
                      <div className="text-start md:text-[18px] sm:text-default text-[12px] dark:text-white text-black">
                        {t('gameDetail:insufficientBalanceIn')}
                      </div>
                    )}
                    <div className="bg-[#17191B] rounded-default">
                      <FiatHeader inGamePage={true} wrapperClass="!right-0" buttonClass="min-w-[150px]" />
                    </div>
                  </div>

                  {isSatisfied && (
                    <div className="sm:text-[12px] text-[11px] dark:text-[#C2C2C2] text-color-light-text-primary text-center">
                      {t('gameDetail:theSelectedCurrencyWillBeDisplayedIn')}{' '}
                      <span className="!text-color-primary">{viewInFiat ? localFiat?.name ?? 'USD' : 'USD'}</span>,{' '}
                      {t('gameDetail:ifYouChangeCurrency')}
                    </div>
                  )}
                  {!isSatisfied && (
                    <div className="sm:text-[12px] text-[10px] text-[#C2C2C2] text-center">
                      <span className="!text-red-500">
                        {t('gameDetail:insufficient')} {activeCurrency?.name ?? 'USD'} {t('gameDetail:balance')},
                      </span>
                      {t('gameDetail:switchToAnotherAsset')}
                    </div>
                  )}

                  <div className="flex items-center gap-[20px]">
                    {isSatisfied && (
                      <button
                        type="button"
                        disabled={!gameDetail.allowedLocation || loadings.gameLoad}
                        className="truncate hover:bg-[red] text-white rounded-default font-semibold bg-[#F61B4F] sm:py-[9px] sm:px-5 py-[5px] px-[5px] sm:text-default text-[12px] flex items-center gap-[10px]"
                        onClick={() => handleRealPlay()}
                      >
                        {loadings.gameLoad && playStatusRef.current === 'Real' ? (
                          <ReactLoading type={'balls'} color={'white'} width={20} height={20} />
                        ) : (
                          <PlayCricle size={20} />
                        )}

                        <div>{t('gameDetail:realPlay')}</div>
                      </button>
                    )}
                    {!isSatisfied && (
                      <button
                        type="button"
                        className="truncate hover:bg-[red] text-white rounded-default font-semibold bg-[#F61B4F] sm:py-[9px] py-[5px] sm:px-5 px-[5px] sm:text-default text-[12px] flex items-center gap-[10px]"
                        onClick={() => {
                          dispatch(changeIsShowDepositModal(true));
                        }}
                      >
                        <PlayCricle size={20} />
                        <div>{t('gameDetail:depositAndPlay')}</div>
                      </button>
                    )}
                    <button
                      type="button"
                      className={cn(
                        'truncate hover:bg-gray-400 text-white rounded-default font-semibold bg-[#6B7180] sm:py-[9px] py-[5px] px-5 sm:text-default text-[12px] items-center gap-[10px]',
                        {
                          flex: gameDetail.allowedDemo,
                          hidden: !gameDetail.allowedDemo,
                        },
                      )}
                      disabled={!gameDetail.allowedLocation || loadings.gameLoad}
                      onClick={() => {
                        handleFreeplay();
                      }}
                    >
                      {loadings.gameLoad && playStatusRef.current === 'Free' ? (
                        <ReactLoading type={'balls'} color={'white'} width={20} height={20} />
                      ) : (
                        <PlayCricle size={20} />
                      )}

                      <div>{t('gameDetail:freePlay')}</div>
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
          {!isLogin && (
            <div className="lg:p-[20px] p-[10px] sm:gap-[20px] gap-[10px] hidden sm:flex flex-col items-center z-1 sm:max-w-[500px] sm:w-full w-[90%] dark:bg-[#202226] bg-color-light-bg-primary rounded">
              {gameDetail?.isExpiration ? (
                <div className="min-h-[100px] flex items-center dark:text-white text-black text-default">
                  {t('gameDetail:gameExpiration')}
                </div>
              ) : (
                <>
                  <div className="sm:text-[12px] text-[10px] dark:text-[#C2C2C2] text-color-light-text-primary text-center">
                    {t('gameDetail:theSelectedCurrencyWillBeDisplayedIn')}{' '}
                    <span className="!text-color-primary">{localFiat?.name ?? 'USD'}</span>{' '}
                    {t('gameDetail:ifYouChangeCurrency')}
                  </div>

                  <div className="flex items-center gap-[20px]">
                    <button
                      type="button"
                      className="truncate hover:bg-[red] text-white rounded-default font-semibold bg-[#F61B4F] sm:py-[9px] py-[5px] px-5 sm:text-default text-[12px] flex items-center gap-[10px]"
                      onClick={() => {
                        dispatch(changeAuthenticationType(AuthenticationModeEnum.SIGN_UP));
                        dispatch(changeIsShowAuthenticationModal(true));
                      }}
                    >
                      <div>{t('gameDetail:signUp')}</div>
                    </button>
                    <button
                      type="button"
                      className={cn(
                        'truncate hover:bg-gray-400 text-white rounded-default font-semibold bg-[#6B7180] sm:py-[9px] py-[5px] px-5 sm:text-default text-[12px] items-center gap-[10px]',
                        {
                          flex: gameDetail.allowedDemo,
                          hidden: !gameDetail.allowedDemo,
                        },
                      )}
                      disabled={!gameDetail.allowedLocation || loadings.gameLoad}
                      onClick={() => {
                        handleFreeplay();
                      }}
                    >
                      <PlayCricle size={20} />
                      <div>{t('gameDetail:freePlay')}</div>
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </>
    );
  }, [
    isLogin,
    isMobile,
    successfullyLaunched,
    loadings.gameLoad,
    isSatisfied,
    viewInFiat,
    localFiat,
    activeCurrency,
    gameDetail.id,
  ]);

  return (
    <>
      <Head>
        <title>{`Play ${gameDetail.title} Online Casino Game - Bonenza`}</title>
        <meta property="og:title" content={`Play ${gameDetail.title} Online Casino Game - Bonenza`} />

        <meta
          name="description"
          content={`Play this interesting ${gameDetail.title} online casino game and test your skills in strategic gameplay. Win big with thrilling bets`}
        />
        <meta
          property="og:description"
          content={`Play this interesting ${gameDetail.title} online casino game and test your skills in strategic gameplay. Win big with thrilling bets`}
        />
        <link rel="canonical" href={`https://bonenza.com/game/${params.id}`} key="canonical" />
      </Head>
      {loadings.screenLoad && <Loader />}
      {gameDetail.id && (
        <div className="py-[24px]">
          <div className="items-center justify-between hidden w-full sm:flex">
            <Breadcrumbs
              data={[{ title: 'Casino', href: ROUTER.Casino }]}
              endpoint={{ title: String(gameDetail.title), href: ROUTER.GameDetail(params?.id) }}
            />
            <div>
              <span className="text-gray-400">{t('gameDetail:by')}</span>{' '}
              <Link
                className="!underline dark:text-white/90 text-black/90 dark:hover:text-white hover:text-black"
                href={ROUTER.Provider(String(gameDetail.provider))}
              >
                {gameDetail.providerName}
              </Link>
            </div>
          </div>
          <div className="w-full m-auto">
            {/* Game play */}
            <FullScreen handle={gameScreen} className="sm:aspect-[2] aspect-[4/3] w-full mt-[20px] relative">
              {/* for desktop, for load ifram data */}
              <div
                id="game_wrapper"
                className={cn(
                  'h-full sm:dark:bg-black dark:bg-color-modal-bg-primary bg-white rounded-large',
                  styles.gameWrapper,
                )}
              />

              {/* ************************************************ for mobile version ****************************************** */}
              {GamePlayingMobile}

              {/* ************************************************ for desktop version ***************************************** */}
              {GamePlayingDesktop}
            </FullScreen>
            {/* Game actions */}
            <div className="p-[15px] dark:bg-color-card-bg-secondary bg-white items-center justify-between sm:flex hidden">
              <div className="text-color-text-secondary flex gap-[20px] items-center">
                {!loadings.reactLoad ? (
                  <div
                    role="button"
                    className={cn(
                      'dark:hover:bg-gray-700 dark:text-color-text-secondary dark:hover:text-white hover:bg-color-light-bg-primary rounded p-2 flex gap-2 items-center',
                      {
                        '!text-amber-400': reactionData.isFavorite,
                      },
                    )}
                    onClick={() => handleReactGame()}
                  >
                    <StarIcon width={20} />
                    <span className="text-[12px]">{gameDetail?.favorites ?? 0}</span>
                  </div>
                ) : (
                  <div className="w-[49px] flex items-center justify-center">
                    <ReactLoading type={'balls'} width={20} height={20} />
                  </div>
                )}
              </div>
              <div className="text-color-text-secondary flex gap-[20px] items-center">
                <div
                  role="button"
                  className="p-2 rounded dark:hover:bg-gray-700 dark:hover:text-white hover:bg-color-light-bg-primary hover:text-black"
                  onClick={() => {
                    gameScreen.enter();
                  }}
                >
                  <Image alt="expand" src={'/img/expand.png'} width={18} height={18} />
                </div>
              </div>
            </div>
          </div>

          {gameDetail.id && (
            <div>
              <ul className="relative rounded-lg overflow-hidden grid grid-cols-3 dark:bg-color-card-bg-primary bg-white w-full sm:w-fit mt-5 md:text-default text-[13px] font-semibold mb-[20px] md:mb-[25px] max-w-full">
                <div
                  className={cn(
                    'absolute top-0 bottom-0 w-1/3 bg-color-card-bg-secondary border border-solid border-color-card-border-primary rounded-lg',
                    'transition-transform',
                    {
                      'translate-x-0': tab === 1,
                      'translate-x-full': tab === 2,
                      'translate-x-[200%]': tab === 3,
                    },
                  )}
                ></div>
                <div
                  role="button"
                  onClick={() => setTab(1)}
                  className={cn(
                    'rounded-lg inline-block text-center min-w-[100px] p-4 truncate border border-solid border-transparent hover:border-color-card-border-primary',
                  )}
                >
                  {gameDetail.title}
                </div>
                <div
                  role="button"
                  onClick={() => setTab(2)}
                  className={cn(
                    'rounded-lg inline-block text-center min-w-[100px] p-4 truncate border border-solid border-transparent hover:border-color-card-border-primary',
                  )}
                >
                  {t('gameDetail:description')}
                </div>
                <div
                  role="button"
                  onClick={() => setTab(3)}
                  className={cn(
                    'rounded-lg inline-block text-center min-w-[100px] p-4 truncate border border-solid border-transparent hover:border-color-card-border-primary',
                  )}
                >
                  {t('gameDetail:reviews')}
                </div>
              </ul>
              {tab === 1 && <GameDetailComponent gameDetail={gameDetail} gameProvider={providerDetail} />}
              {tab === 2 && <GameDescriptionComponent gameDetail={gameDetail} />}
              {tab === 3 && <GameReviewComponent gameDetail={gameDetail} gameProvider={providerDetail} />}
            </div>
          )}
        </div>
      )}
      {!gameDetail.id && !loadings.screenLoad && (
        <div
          className={cn(
            'aspect-[2] w-full my-[20px] text-default dark:text-white text-black flex flex-col items-center justify-center gap-[20px]',
          )}
        >
          {t('gameDetail:theGameDoesNotExist')}
          <button
            type="button"
            className="truncate hover:bg-[red] text-white rounded-default font-semibold bg-[#F61B4F] sm:py-[9px] py-[5px] px-5 sm:text-default text-[12px] flex items-center gap-[10px]"
            onClick={() => reload()}
          >
            <Refresh size={20} />
            <div>{t('gameDetail:refreshNow')}</div>
          </button>
        </div>
      )}

      <ModalShareGame gameDetail={gameDetail} show={openShareGame} onClose={() => setOpenShareGame(false)} />
    </>
  );
}

GamePage.getLayout = function getLayout(page: ReactElement) {
  return <BaseLayout>{page}</BaseLayout>;
};

export default GamePage;
