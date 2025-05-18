const URL_REFRESH_TOKEN = '/refresh';

/************************************ Verify **********************************/
const API_AUTH_FE = (key: string) => `/auth/auth-key/${key}`;
const API_AUTH_VALIDATE_AUTH_TOKEN = (token: string) => `/auth/validate-auth-key/${token}`;
const API_AUTH_SEND_MAIL = '/auth/send-mail';
const API_AUTH_SEND_SMS = '/auth/send-sms';
const API_AUTH_VERIFY_CODE = '/auth/verify-code';
const API_AUTH_VERIFY_QR_CODE = '/auth/send-verify-qr-code';

const API_AUTH_SEND_USER_MAIL = '/auth/send-user-mail';
const API_AUTH_SEND_USER_PHONE = '/auth/send-user-phone';
const API_AUTH_VERIFY_USER_CODE = '/auth/verify-user-code';

const API_AUTH_VALIDATE_TOKEN = (token: string) => `/auth/validate/${token}`;

/************************************ Authrization **********************************/
const API_ADMIN_LOGIN = '/admin-auth/login';
const API_AUTH_LOGIN = '/auth/login';
const API_AUTH_LOGIN_WITH_GOOGLE = '/auth/save-info-login-google';
const API_AUTH_LOGIN_WITH_GOOGLE_TOP = '/auth/save-info-login-google-one-tap';
const API_AUTH_LOGIN_WITH_TELEGRAM = '/auth/save-info-login-telegram';
const API_AUTH_LOGIN_WITH_WALLET = '/auth/save-info-login-wallet';
const API_AUTH_SIGNUP_WITH_EMAIL = '/auth/sign-up-with-email';
const API_AUTH_SIGNUP_WITH_PHONE = '/auth/sign-up-with-phone';
const API_AUTH_FORGOT_PASSWORD = '/auth/forgot-password';
const API_AUTH_RESET_PASSWORD = '/auth/reset-password';
const API_AUTH_GENERATE_QR_CODE = '/auth/generate-secret';
const API_AUTH_SET_LOGIN = '/auth/get-set-login';
const API_AUTH_SET_LOGIN_PASSWORD = '/auth/set-login-password';
const API_AUTH_CHANGE_PASSWORD = '/auth/change-password';
const API_AUTH_GET_2FA_STATUS = '/auth/get-two-factor-auth-status';
const API_AUTH_REQUEST_SELF_EXCULSIVE = '/auth/request-self-exclusion';
const API_AUTH_SET_SELF_EXCULSIVE = '/auth/set-self-exclusion';

/************************************ User Profile **********************************/
const API_USER_PROFILE_GET_PROFILE = `/user-profile/get-user-profile`;
const API_USER_PROFILE_CONTEST_HISTORY = `/user-profile/contest/history`;
const API_USER_PROFILE_EDIT_PROFILE = '/user-profile/edit-profile';
const API_USER_PROFILE_UPLOAD_AVATAR = '/user-profile/upload-avatar';

const API_USER_MEDAL_STATISTICS = '/user-profile/medal/statistics';
const API_USER_PROFILE_BET_STATISTICS = '/user-profile/bet-statistics';

/************************************ User Setting **********************************/
const API_USER_SETTING_GENERAL_SETTING = '/user-setting/get-general-setting';
const API_USER_SETTING_PRIVACY_SETTING = '/user-setting/get-privacy-setting';
const API_USER_SETTING_EMAIL_AND_PHONE_VERIFY = '/user-setting/get-email-and-phone-verify';
const API_USER_SETTING_UPDATE = '/user-setting/edit-setting';
const API_USER_SETTING_ENABLE_TFA = '/user-setting/confirm-qr-code';
const API_USER_SETTING_DISABLE_TFA = '/user-setting/disable-two-factor-authentication';
const API_USER_SETTING_UPLOAD_ID_CARD = '/user-setting/upload-id-cards';

/************************************ User Session **********************************/
const API_USER_SESSION_LIST_SESSIONS = '/user-session/get-list-user-session';
const API_USER_SESSION_DELETE_SESSION = `/user-session/delete-user-session`;

/************************************ Wallet **********************************/
const API_WALLET_USER_BALANCE = '/wallet/get-balance';
const API_WALLET_INFO = '/wallet/get-wallet-info';
const API_WALLET_WITHDRAW = '/wallet/withdraw';
const API_WALLET_SWAP_RATE = '/wallet/swap/prices';
const API_WALLET_SWAP_FEE = '/setting/swap-fee';
const API_WALLET_SWAP = '/wallet/swap';
const API_WALLET_TRANSACTIONS = '/wallet/transaction';
const API_WALLET_ROLLOVER = '/wallet/rollover';
const API_WALLET_DEPOSIT_TIME = '/wallet/get-deposit-time-for-this-week';
const API_WALLET_INIT_DATA = '/wallet/init-currency';
const API_WALLET_SET_FAVORITE = '/wallet/set-currency-favorite-status';

const API_WALLET_GET_CLAIM = '/wallet/claim';
const API_WALLET_POST_CLAIM = '/wallet/claim';
const API_WALLET_WITHDRAW_INFO = '/wallet/withdraw-info';
const API_WALLET_CHAT_TIP = '/wallet/tip';

/************************************ Game **********************************/
const API_GAME_PICK_GAMES = '/game/get-pick-games-for-you';
const API_GAME_FAVORITE_GAMES = '/game/get-favorite-games';
const API_GAME_RECENT_GAMES = '/game/get-recent-games';
const API_GAME_PROVIDER = '/game/get-providers';

const API_GAME_SLOT = '/game/get-slots';
const API_GAME_RACING = '/game/get-racing';
const API_GAME_LIVE_CASINO = '/game/get-live-casino';
const API_GAME_HOT_GAMES = '/game/get-hot-games';
const API_GAME_NEW_RELEASE = '/game/get-new-releases';
const API_GAME_FEATURE_BUY_IN = '/game/get-feature-buy-in';
const API_GAME_BLACKJACK = '/game/get-blackjack';
const API_GAME_TABLE_GAMES = '/game/get-table-games';
const API_GAME_DETAIL = '/game/get-game';

const API_GAME_START_DEMO = '/game/start-demo';
const API_GAME_CREATE_SESSION = '/game/create-session';
const API_GAME_PLAY = '/game/play';
const API_GAME_ROLLBACK = '/game/rollback';

const API_GAME_BET_HISTORY = '/game/get-latest-bets';
const API_GAME_HIGH_ROLLERs = '/game/high-rollers';
const API_GAME_BET_HISTORY_FOR_GAME = '/game/get-latest-bets-for-game';
const API_GAME_BET_HISTORY_FOR_USER = '/game/get-latest-bets-for-user-game';
const API_GAME_RECENT_BIG_WINS = '/game/get-recent-big-wins';
const API_GAME_TOP_RATED_GAMES = '/game/get-top-rated-games';
const API_GAME_DASHBOARD_DATA = '/game/dashboard/landing';
const API_GAME_CASINO_DATA = '/game/dashboard/casino';

const API_GAME_THEME = '/game/get-themes';
const API_GAME_GAMES_BY_PROVIDER = '/game/get-games-by-provider';
const API_GAME_GAMES_BY_THEME = '/game/get-games-by-theme';
const API_GAME_GAMES_BY_NAME_PROVIDER = '/game/get-game-by-name-and-provider';

const API_GAME_SET_FAVORITE = '/game/set-game-favorite-status';
const API_GAME_GET_FAVORITE = '/game/get-game-favorite-status';

const API_GAME_REVIEW_RATING_STATISTICS = '/game/review/rating-statistics';
const API_GAME_REVIEW_GET_RATING = '/game/review/rating';
const API_GAME_REVIEW_SET_RATING = '/game/review/rating';
const API_GAME_REVIEW_LIST = '/game/review/list';
const API_GAME_REVIEW_COMMENT = '/game/review/comment';
const API_GAME_REVIEW_ADD = '/game/review/add';
const API_GAME_REVIEW_LIKE = '/game/review/like';
const API_GAME_REVIEW_REPORT = '/game/review/report';
const API_GAME_ALL_IDENTIFIERS = '/game/get-all-games';

/************************************ Affiliate **********************************/

const API_AFFILIATE = '/affiliate/affiliate';

const API_AFFILIATE_FRIENDS = '/affiliate/friends';
const API_AFFILIATE_REWARDS = '/affiliate/rewards';
const API_AFFILIATE_WITHDRAW = '/affiliate/withdraw';

const API_AFFILIATE_COMMISSION_HISTORY = '/affiliate/commission/history';

const API_AFFILIATE_REFERRAL_HISTORY = '/affiliate/referral/history';
const API_AFFILIATE_REFERRAL_RULE = '/affiliate/referral/rule';

/************************************ VIP **********************************/

const API_VIP_VIP_PROGRESS = '/vip/vip-progress';
const API_VIP_CHECK_DEPOSIT = '/vip/vip-check-deposit';
const API_VIP_LEVEL_SYSTEM = '/vip/vip-level-system';

/************************************ Bonus **********************************/

const API_BONUS_BONUS_STATISTIC = '/bonus/statistics';
const API_BONUS_DETAILS = '/bonus/details';
const API_BONUS_DETAILS_CATEGORIES = '/bonus/details/categories';
const API_BONUS_DETAILS_TRANSACTIONS = '/bonus/details/transactions';
const API_BONUS_USDT_BONUS_HISTORY = '/bonus/usdt-history';
const API_BONUS_CLAIM_LIST = '/bonus/claim/list';
const API_BONUS_CLAIM = '/bonus/claim';
const API_BONUS_REDEEM = '/bonus/redeem';

/************************************ Wager Contest **********************************/
const API_WAGER_CONTEST_LIST = '/contest/list';
const API_WAGER_CONTEST_HISTORY = '/contest/history';
const API_WAGER_CONTEST_POSITION = '/contest/position';

/************************************ Spin **********************************/
const API_SPIN_LATEST = '/spin/latest';
const API_SPIN_DATA = '/spin/data';
const APIN_SPIN_TRY = '/spin/try';
const APIN_SPIN_AVAILABLE = '/spin/available-count';
const API_QUEST_LIST = '/quest/list';
const API_QUEST_HISTORY = '/quest/history';

/************************************ Chat **********************************/
const API_CHAT_LATEST = '/chat/latest';
const API_CHAT_ADD = '/chat/add';
const API_LEAVE_MESSAGE = '/chat/leave-message';

/************************************ Notification **********************************/
const API_NOTIFICATION_LATEST = '/notification/latest';

export {
  API_ADMIN_LOGIN,
  API_AFFILIATE,
  API_AFFILIATE_COMMISSION_HISTORY,
  API_AFFILIATE_FRIENDS,
  API_AFFILIATE_REFERRAL_HISTORY,
  API_AFFILIATE_REFERRAL_RULE,
  API_AFFILIATE_REWARDS,
  API_AFFILIATE_WITHDRAW,
  API_AUTH_CHANGE_PASSWORD,
  API_AUTH_FE,
  API_AUTH_FORGOT_PASSWORD,
  API_AUTH_GENERATE_QR_CODE,
  API_AUTH_GET_2FA_STATUS,
  API_AUTH_LOGIN,
  API_AUTH_LOGIN_WITH_GOOGLE,
  API_AUTH_LOGIN_WITH_GOOGLE_TOP,
  API_AUTH_LOGIN_WITH_TELEGRAM,
  API_AUTH_LOGIN_WITH_WALLET,
  API_AUTH_REQUEST_SELF_EXCULSIVE,
  API_AUTH_RESET_PASSWORD,
  API_AUTH_SEND_MAIL,
  API_AUTH_SEND_SMS,
  API_AUTH_SEND_USER_MAIL,
  API_AUTH_SEND_USER_PHONE,
  API_AUTH_SET_LOGIN,
  API_AUTH_SET_LOGIN_PASSWORD,
  API_AUTH_SET_SELF_EXCULSIVE,
  API_AUTH_SIGNUP_WITH_EMAIL,
  API_AUTH_SIGNUP_WITH_PHONE,
  API_AUTH_VALIDATE_AUTH_TOKEN,
  API_AUTH_VALIDATE_TOKEN,
  API_AUTH_VERIFY_CODE,
  API_AUTH_VERIFY_QR_CODE,
  API_AUTH_VERIFY_USER_CODE,
  API_BONUS_BONUS_STATISTIC,
  API_BONUS_CLAIM,
  API_BONUS_CLAIM_LIST,
  API_BONUS_DETAILS,
  API_BONUS_DETAILS_CATEGORIES,
  API_BONUS_DETAILS_TRANSACTIONS,
  API_BONUS_REDEEM,
  API_BONUS_USDT_BONUS_HISTORY,
  API_CHAT_ADD,
  API_CHAT_LATEST,
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
  API_GAME_PLAY,
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
  API_GAME_ROLLBACK,
  API_GAME_SET_FAVORITE,
  API_GAME_SLOT,
  API_GAME_START_DEMO,
  API_GAME_TABLE_GAMES,
  API_GAME_THEME,
  API_GAME_TOP_RATED_GAMES,
  API_LEAVE_MESSAGE,
  API_NOTIFICATION_LATEST,
  API_QUEST_HISTORY,
  API_QUEST_LIST,
  API_SPIN_DATA,
  API_SPIN_LATEST,
  API_USER_MEDAL_STATISTICS,
  API_USER_PROFILE_BET_STATISTICS,
  API_USER_PROFILE_CONTEST_HISTORY,
  API_USER_PROFILE_EDIT_PROFILE,
  API_USER_PROFILE_GET_PROFILE,
  API_USER_PROFILE_UPLOAD_AVATAR,
  API_USER_SESSION_DELETE_SESSION,
  API_USER_SESSION_LIST_SESSIONS,
  API_USER_SETTING_DISABLE_TFA,
  API_USER_SETTING_EMAIL_AND_PHONE_VERIFY,
  API_USER_SETTING_ENABLE_TFA,
  API_USER_SETTING_GENERAL_SETTING,
  API_USER_SETTING_PRIVACY_SETTING,
  API_USER_SETTING_UPDATE,
  API_USER_SETTING_UPLOAD_ID_CARD,
  API_VIP_CHECK_DEPOSIT,
  API_VIP_LEVEL_SYSTEM,
  API_VIP_VIP_PROGRESS,
  API_WAGER_CONTEST_HISTORY,
  API_WAGER_CONTEST_LIST,
  API_WAGER_CONTEST_POSITION,
  API_WALLET_CHAT_TIP,
  API_WALLET_DEPOSIT_TIME,
  API_WALLET_GET_CLAIM,
  API_WALLET_INFO,
  API_WALLET_INIT_DATA,
  API_WALLET_POST_CLAIM,
  API_WALLET_ROLLOVER,
  API_WALLET_SET_FAVORITE,
  API_WALLET_SWAP,
  API_WALLET_SWAP_FEE,
  API_WALLET_SWAP_RATE,
  API_WALLET_TRANSACTIONS,
  API_WALLET_USER_BALANCE,
  API_WALLET_WITHDRAW,
  API_WALLET_WITHDRAW_INFO,
  APIN_SPIN_AVAILABLE,
  APIN_SPIN_TRY,
  URL_REFRESH_TOKEN,
};
