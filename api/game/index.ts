import {
  API_GAME_ALL_IDENTIFIERS,
  API_GAME_BET_HISTORY,
  API_GAME_BET_HISTORY_FOR_GAME,
  API_GAME_BET_HISTORY_FOR_USER,
  API_GAME_BLACKJACK,
  API_GAME_CASINO_DATA,
  API_GAME_CREATE_SESSION,
  API_GAME_DASHBOARD_DATA,
  API_GAME_DETAIL,
  API_GAME_FAVORITE_GAMES,
  API_GAME_FEATURE_BUY_IN,
  API_GAME_GAMES_BY_NAME_PROVIDER,
  API_GAME_GAMES_BY_PROVIDER,
  API_GAME_GAMES_BY_THEME,
  API_GAME_GET_FAVORITE,
  API_GAME_HIGH_ROLLERs,
  API_GAME_HOT_GAMES,
  API_GAME_LIVE_CASINO,
  API_GAME_NEW_RELEASE,
  API_GAME_PICK_GAMES,
  API_GAME_PROVIDER,
  API_GAME_RACING,
  API_GAME_RECENT_BIG_WINS,
  API_GAME_RECENT_GAMES,
  API_GAME_REVIEW_ADD,
  API_GAME_REVIEW_COMMENT,
  API_GAME_REVIEW_GET_RATING,
  API_GAME_REVIEW_LIKE,
  API_GAME_REVIEW_LIST,
  API_GAME_REVIEW_RATING_STATISTICS,
  API_GAME_REVIEW_REPORT,
  API_GAME_REVIEW_SET_RATING,
  API_GAME_SET_FAVORITE,
  API_GAME_SLOT,
  API_GAME_START_DEMO,
  API_GAME_TABLE_GAMES,
  API_GAME_THEME,
  API_GAME_TOP_RATED_GAMES,
  API_WAGER_CONTEST_HISTORY,
  API_WAGER_CONTEST_LIST,
  API_WAGER_CONTEST_POSITION,
} from 'constants/endpoints';

import { CategoryType } from '@/base/types/common';
import { GameCreateSessionRequest, GameDemoRequest } from '@/base/types/requestTypes';

import api from '../api';
import apiSSR from '../apiSSR';

export type SortType = 'popular' | 'asc' | 'desc' | 'new' | 'a-z' | 'z-a' | 'like';
export type ReviewListSortType = 'newest' | 'top_comments' | 'top_likes';

export type CasinoRequest = {
  page: number;
  pageSize: number;
  providers?: string;
  sort?: SortType;
  query?: string;
};
export const api_getPickGames = async (page: number, pageSize: number) => {
  return api.get(API_GAME_PICK_GAMES, { params: { page, pageSize } });
};

export const apiSSR_getPickGames = async (page: number, pageSize: number) => {
  return apiSSR.get(API_GAME_PICK_GAMES, { params: { page, pageSize } });
};

export const api_getFavoriteGames = async (page: number, pageSize: number) => {
  return api.get(API_GAME_FAVORITE_GAMES, { params: { page, pageSize } });
};

export const api_getRecentGames = async (page: number, pageSize: number) => {
  return api.get(API_GAME_RECENT_GAMES, { params: { page, pageSize } });
};

export const api_getGameDetail = async (identifier: string) => {
  return api.get(API_GAME_DETAIL, { params: { identifier: encodeURIComponent(identifier) } });
};

export const apiSSR_getGameDetail = async (identifier: string) => {
  return apiSSR.get(API_GAME_DETAIL, { params: { identifier: encodeURIComponent(identifier) } });
};

export const api_getCasinoWithKey = async (key: string, params: CasinoRequest) => {
  switch (key) {
    case 'slots':
      return api.get(API_GAME_SLOT, { params });
    case 'live-casino':
      return api.get(API_GAME_LIVE_CASINO, { params });
    case 'hot-games':
      return api.get(API_GAME_HOT_GAMES, { params });
    case 'new-releases':
      return api.get(API_GAME_NEW_RELEASE, { params });
    case 'blackjack':
      return api.get(API_GAME_BLACKJACK, { params });
    case 'feature-buy-in':
      return api.get(API_GAME_FEATURE_BUY_IN, { params });
    case 'table-games':
      return api.get(API_GAME_TABLE_GAMES, { params });
    case 'top-picks':
      return api.get(API_GAME_PICK_GAMES, { params });
    case 'racing':
      return api.get(API_GAME_RACING, { params });
    default:
      return api.get(API_GAME_SLOT, { params });
  }
};

export const api_getSlots = async (params: CasinoRequest) => {
  return api.get(API_GAME_SLOT, { params });
};

export const api_getProviders = async (category: CategoryType = 'all') => {
  return api.get(API_GAME_PROVIDER, { params: { category } });
};

export const apiSSR_getProviders = async (category: CategoryType = 'all') => {
  return apiSSR.get(API_GAME_PROVIDER, { params: { category } });
};

export const api_getLiveCasinos = async (params: CasinoRequest) => {
  return api.get(API_GAME_LIVE_CASINO, { params });
};

export const api_getHotGames = async (params: CasinoRequest) => {
  return api.get(API_GAME_HOT_GAMES, { params });
};

export const api_startGameDemo = async (data: GameDemoRequest) => {
  return api.post(API_GAME_START_DEMO, data);
};

export const api_startGameSession = async (data: GameCreateSessionRequest) => {
  return api.post(API_GAME_CREATE_SESSION, data);
};

export const api_getLatestBets = async () => {
  return api.get(API_GAME_BET_HISTORY);
};

export const api_getLatestBetsForGame = async (gameId: string) => {
  return api.get(API_GAME_BET_HISTORY_FOR_GAME, { params: { gameId } });
};

export const api_getLatestBetForUser = async (gameId: string) => {
  return api.get(API_GAME_BET_HISTORY_FOR_USER, { params: { gameId } });
};

export const api_getRecentBigWins = async (count: number) => {
  return api.get(API_GAME_RECENT_BIG_WINS, { params: { count: count } });
};

export const api_getTopRelatedGames = async () => {
  return api.get(API_GAME_TOP_RATED_GAMES);
};

export const api_getDashboardData = async () => {
  return api.get(API_GAME_DASHBOARD_DATA);
};

export const api_getCasinoGameData = async () => {
  return api.get(API_GAME_CASINO_DATA);
};

export const api_getGamesByProvider = async (
  providerIdentifier: string,
  sort: SortType,
  page: number,
  pageSize: number,
) => {
  return api.get(API_GAME_GAMES_BY_PROVIDER, { params: { providerIdentifier, sort, page, pageSize } });
};

export const api_getThemes = async () => {
  return api.get(API_GAME_THEME);
};

export const apiSSR_getThemes = async () => {
  return apiSSR.get(API_GAME_THEME);
};

export const api_getGamesByTheme = async (providers: string, page: number, pageSize: number, theme: string) => {
  return api.get(API_GAME_GAMES_BY_THEME, { params: { providers, page, pageSize, theme } });
};

export const api_getGamesByNameAndProvider = async (search: string) => {
  return api.get(API_GAME_GAMES_BY_NAME_PROVIDER, { params: { search } });
};

export const api_setGameFavorite = async (gameId: string) => {
  return api.post(API_GAME_SET_FAVORITE, { gameId });
};

export const api_getGameFavorite = async (gameId: string) => {
  return api.get(API_GAME_GET_FAVORITE, { params: { gameId } });
};

export const api_wagerContestList = async () => {
  return api.get(API_WAGER_CONTEST_LIST);
};

export const api_wagerContestHistory = async () => {
  return api.get(API_WAGER_CONTEST_HISTORY);
};

export const api_wagerContestPosition = async () => {
  return api.get(API_WAGER_CONTEST_POSITION);
};

export const api_reviewRatingStatistics = async (gameId: string) => {
  return api.get(API_GAME_REVIEW_RATING_STATISTICS, { params: { gameId } });
};

export const api_reviewGetRating = async (gameId: string) => {
  return api.get(API_GAME_REVIEW_GET_RATING, { params: { gameId } });
};

export const api_reviewSetRating = async (gameId: string, rating: number) => {
  return api.post(API_GAME_REVIEW_SET_RATING, { gameId, rating });
};

export const api_reviewComment = async (gameId: string) => {
  return api.get(API_GAME_REVIEW_COMMENT, { params: { id: gameId } });
};

export const api_reviewAdd = async (gameId: string, commentId: string = '', text: string) => {
  if (!commentId) return api.post(API_GAME_REVIEW_ADD, { gameId, text });
  return api.post(API_GAME_REVIEW_ADD, { gameId, commentId, text });
};

export const api_reviewList = async (
  commentId: string = '',
  gameId: string,
  page: number,
  pageSize: number,
  sort: ReviewListSortType,
  userId: string,
) => {
  const data: any = {
    commentId,
    gameId,
    page,
    pageSize,
    sort,
    userId,
  };
  if (!commentId) delete data.commentId;
  if (!userId) delete data.userId;
  return api.get(API_GAME_REVIEW_LIST, { params: data });
};

export const api_reviewLike = async (commentId: string) => {
  return api.post(API_GAME_REVIEW_LIKE, { commentId });
};

export const api_reviewReport = async (commentId: string, reason: string) => {
  return api.post(API_GAME_REVIEW_REPORT, { commentId, reason });
};

export const api_highRollers = async () => {
  return api.get(API_GAME_HIGH_ROLLERs);
};

export const apiSSR_gamesIdentifiers = async () => {
  return apiSSR.get(API_GAME_ALL_IDENTIFIERS);
};
