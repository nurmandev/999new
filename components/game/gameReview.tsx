import { Popover, Transition } from '@headlessui/react';
import { ChevronDownIcon, EllipsisVerticalIcon, StarIcon } from '@heroicons/react/24/solid';
import cn from 'classnames';
import { HambergerMenu, Happyemoji, Like1, Messages } from 'iconsax-react';
import Image from 'next/image';
import { Fragment, useCallback, useEffect, useState } from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import StarsRating from 'react-star-rate';
import { toast } from 'react-toastify';

import {
  api_reviewGetRating,
  api_reviewLike,
  api_reviewList,
  api_reviewRatingStatistics,
  api_reviewReport,
  api_reviewSetRating,
  ReviewListSortType,
} from '@/api/game';
import { useTranslation } from '@/base/config/i18next';
import { API_AVATAR, API_GAME_IMAGE, TOAST_ENUM } from '@/base/constants/common';
import { formatDate, getDuration } from '@/base/libs/utils';
import { getErrorMessage } from '@/base/libs/utils/notificationToast';
import {
  changeAuthenticationType,
  changeIsShowAuthenticationModal,
  changeIsShowInformation,
} from '@/base/redux/reducers/modal.reducer';
import { setUserData } from '@/base/redux/reducers/user.reducer';
import { AppState, useAppDispatch } from '@/base/redux/store';
import { AuthenticationModeEnum, GameListType, GameProviderDetail } from '@/base/types/common';

import Loader from '../common/preloader/loader';
import CommentPostModal from '../modal/review/commentPost';
import ReplyModal from '../modal/review/replyModal';
import ReportModal from '../modal/review/reportModal';

const sortByData = [
  { title: 'Newest First', value: 'newest' },
  { title: 'Top Comments', value: 'top_comments' },
  { title: 'Top Likes', value: 'top_likes' },
];

const RateStarComponent = ({
  rate,
  total = 5,
  fillColor = true,
  value = 0,
  onClick = () => {},
}: {
  rate: number;
  total?: number;
  fillColor?: boolean;
  value?: number;
  onClick?: () => void;
}) => {
  return (
    <div className="flex items-center">
      {[...Array(total)].map((e, i) => {
        return (
          <StarIcon
            width={18}
            key={i}
            className={cn({ 'text-color-primary': i < rate && fillColor })}
            onClick={onClick}
          />
        );
      })}
    </div>
  );
};

type ReviewRatingType = {
  totalCount: number;
  averageRating: number;
  avatars: string[];
  counts: number[];
};

export type CommentType = {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  text: string;
  time: string;
  like: boolean;
  likes: number;
  comments: number;
  showReply: boolean;
  child: CommentType[];
};

const GameReviewComponent = ({
  gameDetail,
  gameProvider,
}: {
  gameDetail: GameListType;
  gameProvider?: GameProviderDetail;
}) => {
  const { t } = useTranslation('');
  const dispatch = useAppDispatch();
  const { isLogin, userId, userAvatar } = useSelector(
    (state: AppState) => ({
      isLogin: state.auth.isLogin,
      userId: state.auth.user.userId,
      userAvatar: state.auth.user.avatar,
    }),
    shallowEqual,
  );

  const [page, setPage] = useState(1);

  const [loading, setLoading] = useState({
    ratingLoading: false,
    commentLoading: false,
  });

  const [ratingData, setRatingData] = useState<ReviewRatingType>({
    totalCount: 0,
    averageRating: 0,
    avatars: [],
    counts: [],
  });

  const [commentData, setCommentData] = useState<CommentType[]>([]);

  const [isShowComment, setIsShowComment] = useState(false);
  const [isShowReplyModal, setIsShowReplyModal] = useState(false);
  const [isShowReport, setIsShowReport] = useState(false);
  const [isShowMoreAboutGame, setIsShowMoreAboutGame] = useState<boolean>(false);
  const [commentId, setCommentId] = useState('');
  const [selectedComment, setSelectedComment] = useState<CommentType>({
    id: '',
    userId: '',
    userName: '',
    userAvatar: '',
    text: '',
    time: '',
    like: false,
    likes: 0,
    comments: 0,
    child: [],
    showReply: false,
  });

  const [selectedSort, setSelectedSort] = useState<ReviewListSortType>('newest');
  const [userRating, setUserRating] = useState(0);

  const handleChangeRate = async (value?: number) => {
    if (!isLogin) {
      dispatch(changeAuthenticationType(AuthenticationModeEnum.SIGN_IN));
      dispatch(changeIsShowAuthenticationModal(true));
      return;
    }
    if (!value || !gameDetail?.id) return;
    try {
      setLoading((load) => ({ ...load, ratingLoading: true }));
      const _res = await api_reviewSetRating(String(gameDetail?.id), value);
      const _userRating = Number(_res?.data?.rating || 0);
      const _ratingStatistics = await api_reviewRatingStatistics(gameDetail?.id);
      setRatingData({
        totalCount: Number(_ratingStatistics?.data?.totalCount ?? 0),
        averageRating: Number(_ratingStatistics?.data?.averageRating ?? 0),
        avatars: _ratingStatistics?.data?.avatars ?? [],
        counts: [
          Number(_ratingStatistics?.data?.counts[1]),
          Number(_ratingStatistics?.data?.counts[2]),
          Number(_ratingStatistics?.data?.counts[3]),
          Number(_ratingStatistics?.data?.counts[4]),
          Number(_ratingStatistics?.data?.counts[5]),
        ],
      });
      setUserRating(_userRating);
      toast.success('Rating Successfully', { toastId: 'rate-game-success', containerId: TOAST_ENUM.COMMON });
    } catch (error: any) {
      const errType = error.response?.data?.message ?? '';
      const errMessage = getErrorMessage(errType);
      toast.error(t(errMessage), { toastId: 'rate-game-success', containerId: TOAST_ENUM.COMMON });
    } finally {
      setLoading((load) => ({ ...load, ratingLoading: false }));
    }
  };

  const getCommentList = useCallback(async () => {
    try {
      if (!gameDetail.id) return;
      setLoading({ ratingLoading: false, commentLoading: true });
      const _comments = await api_reviewList('', gameDetail.id, page, 10, selectedSort, userId);
      const tempCommentDatas: CommentType[] = _comments?.data?.comments.map((item: any) => ({
        id: item?.id ?? '',
        userId: item?.userId ?? '',
        userName: item?.userName ?? '',
        userAvatar: item?.userAvatar ?? '',
        text: item?.text ?? '',
        time: item?.time ?? new Date(),
        like: !!item?.like,
        likes: Number(item?.likesCount ?? 0),
        comments: Number(item?.commentsCount ?? 0),
        child: [],
      }));
      setCommentData(tempCommentDatas);
    } catch (error: any) {
      const errType = error.response?.data?.message ?? '';
      const errMessage = getErrorMessage(errType);
      toast.error(t(errMessage), { containerId: TOAST_ENUM.COMMON });
      setCommentData([]);
    } finally {
      setLoading({ ratingLoading: false, commentLoading: false });
    }
  }, [page, selectedSort]);

  const getRateAndComments = useCallback(async () => {
    try {
      if (!gameDetail?.id) return;
      setLoading({ ratingLoading: true, commentLoading: true });
      const [_rates, _comments] = await Promise.all([
        api_reviewRatingStatistics(gameDetail?.id),
        api_reviewList('', gameDetail.id, page, 10, selectedSort, userId),
      ]);

      const tempCommentDatas: CommentType[] = _comments?.data?.comments.map((item: any) => ({
        id: item?.id ?? '',
        userId: item?.userId ?? '',
        userName: item?.userName ?? '',
        userAvatar: item?.userAvatar ?? '',
        text: item?.text ?? '',
        time: item?.time ?? new Date(),
        like: !!item?.like,
        likes: Number(item?.likesCount ?? 0),
        comments: Number(item?.commentsCount ?? 0),
        child: [],
      }));
      setRatingData({
        totalCount: Number(_rates?.data?.totalCount ?? 0),
        averageRating: Number(_rates?.data?.averageRating ?? 0),
        avatars: _rates?.data?.avatars ?? [],
        counts: [
          Number(_rates?.data?.counts[1]),
          Number(_rates?.data?.counts[2]),
          Number(_rates?.data?.counts[3]),
          Number(_rates?.data?.counts[4]),
          Number(_rates?.data?.counts[5]),
        ],
      });

      setCommentData(tempCommentDatas);
    } catch (error: any) {
      const errType = error.response?.data?.message ?? '';
      const errMessage = getErrorMessage(errType);
      toast.error(t(errMessage), { containerId: TOAST_ENUM.COMMON });
      setRatingData({
        totalCount: 0,
        averageRating: 0,
        avatars: [],
        counts: [],
      });
      setCommentData([]);
    } finally {
      setLoading({ ratingLoading: false, commentLoading: false });
    }
  }, [page, gameDetail, selectedSort]);

  const getUserRate = async () => {
    if (!gameDetail?.id) return;
    try {
      setLoading((load) => ({ ...load, ratingLoading: true }));
      const _rating = await api_reviewGetRating(gameDetail.id);
      setUserRating(Number(_rating.data || 0));
    } catch (error: any) {
      const errType = error.response?.data?.message ?? '';
      const errMessage = getErrorMessage(errType);
      toast.error(t(errMessage), { containerId: TOAST_ENUM.COMMON });
      setUserRating(0);
    } finally {
      setLoading((load) => ({ ...load, ratingLoading: false }));
    }
  };

  const handleLikeComment = async (commentId: string) => {
    try {
      setLoading((load) => ({ ...load, commentLoading: true }));
      const _res = await api_reviewLike(commentId);
      const tempCommentDatas = [...commentData].map((item) => {
        if (item.id === commentId) {
          item.like = !!_res.data?.like;
          if (!!_res.data?.like) {
            item.likes += 1;
          } else {
            item.likes -= 1;
          }
        }
        return item;
      });
      setCommentData(tempCommentDatas);
    } catch (error: any) {
      const errType = error.response?.data?.message ?? '';
      const errMessage = getErrorMessage(errType);
      toast.error(t(errMessage), { containerId: TOAST_ENUM.COMMON });
    } finally {
      setLoading((load) => ({ ...load, commentLoading: false }));
    }
  };

  const openModalUserProfile = (userId: string, userAvatar: string, userName: string) => {
    const userData = {
      username: userName,
      userId: userId,
      avatar: userAvatar,
    };
    dispatch(setUserData(userData));
    dispatch(changeIsShowInformation(true));
  };

  const reportComment = async (reason: string) => {
    try {
      const _res = await api_reviewReport(commentId, reason);

      toast.success(t('success:successfulllyReported'), { containerId: TOAST_ENUM.COMMON });
    } catch (error: any) {
      const errType = error.response?.data?.message ?? '';
      const errMessage = getErrorMessage(errType);
      toast.error(t(errMessage), { containerId: TOAST_ENUM.COMMON });
    } finally {
      setIsShowReport(false);
    }
  };

  useEffect(() => {
    getRateAndComments();
  }, [gameDetail]);

  useEffect(() => {
    if (isLogin) {
      getUserRate();
    }
  }, [isLogin]);

  useEffect(() => {
    getCommentList();
  }, [selectedSort]);

  return (
    <div className="relative">
      <div className="dark:bg-color-card-bg-primary border border-solid border-color-card-border-primary bg-white w-full p-6 rounded-md text-[11px] text-color-text-primary font-normal mb-7">
        <div className="flex gap-5">
          <Image
            height={90}
            width={90}
            src={`${API_GAME_IMAGE}/icon/${gameDetail?.identifier.replace(':', '_')}.png`}
            alt="game logo"
            onError={(err) => {
              err.currentTarget.src = '/img/recommended-game-3.png';
            }}
            className="max-w-[90px] object-cover max-h-auto rounded-[5px]"
          />
          <div>
            <h2 className="text-[22px] font-semibold dark:text-white text-black mb-3">{gameDetail?.title}</h2>
            <p className="text-[16px]">
              {t('gameDetail:by')} <span className="text-black dark:text-white capitalize">{gameDetail?.provider}</span>
            </p>
            {gameDetail?.releasedAt && (
              <p className="mt-2 dark:text-color-text-primary text-color-light-text-primary text-[16px]">
                {t('gameDetail:release')}: {formatDate(new Date(gameDetail?.releasedAt), 'MM/dd/yyyy')}
              </p>
            )}
          </div>
        </div>
        <div
          className={cn('mt-4 overflow-hidden transition-all ease-in duration-[300]', {
            'max-h-0': !isShowMoreAboutGame,
            'max-h-[3000px]': isShowMoreAboutGame,
          })}
        >
          <div className="grid sm:grid-cols-1 lg:grid-cols-2 gap-4 border-solid border-b-[1px] border-b-color-card-border-primary pb-8">
            <div className="min-h-[150px]">
              <span className="dark:text-color-text-primary text-color-light-text-primary text-[18px]">
                {t('gameDetail:gamePreview')}
              </span>
            </div>
            <div>
              <span className="dark:text-color-text-primary  text-color-light-text-primary text-[18px]">
                {t('gameDetail:gameInfo')}
              </span>
              <div className="grid gap-1 pt-4 sm:grid-cols-1 md:grid-cols-2">
                <div className="w-full bg-color-card-bg-secondary p-3 text-[14px] flex justify-between rounded">
                  <span>{t('gameDetail:rtp')}</span>
                  <span className="text-color-primary">{gameDetail.payout}</span>
                </div>
                <div className="w-full bg-color-card-bg-secondary p-3 text-[14px] flex justify-between rounded">
                  <span>{t('gameDetail:provider')}</span>
                  <span className="text-white">{gameDetail.providerName}</span>
                </div>
                <div className="w-full bg-color-card-bg-secondary p-3 text-[14px] flex justify-between rounded">
                  <span>{t('gameDetail:multiplier')}</span>
                  <span className="text-color-primary">{gameDetail.multiplier}</span>
                </div>
                <div className="w-full bg-color-card-bg-secondary p-3 text-[14px] flex justify-between rounded">
                  <span>{t('gameDetail:favorites')}</span>
                  <span className="text-white">{gameDetail.favorites}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="grid gap-12 mt-8 mb-4 sm:grid-cols-1 lg:grid-cols-2 lg:gap-4">
            <div className="lg:border-solid lg:border-r-[1px] lg:border-r-color-card-border-primary pr-8">
              <div className="dark:text-color-text-primary  text-color-light-text-primary text-[18px]">
                {t('gameDetail:aboutThisGame')}
              </div>
              <div className="pt-4 text-[14px] text-color-text-secondary">
                {gameDetail?.title}: {t('gameDetail:gameReviewTheme')}
              </div>
              <div className="dark:text-color-text-primary  text-color-light-text-primary text-[18px] mt-12">
                {t('gameDetail:featuresTags')}
              </div>
              <div className="pt-4 text-[14px] text-color-text-primary flex flex-wrap gap-2">
                <div className="p-2 rounded bg-color-card-bg-secondary">
                  {`${gameDetail.provider} ${t('gameDetail:originals')}`}
                </div>
              </div>
            </div>
            {/* Hiding ShareThisGame */}
            {/* <div className="lg:pl-8">
              <span className="dark:text-color-text-primary  text-color-light-text-primary text-[18px] sm:mt-12 md:mt-0">
                Share This Game
              </span>
              <div className="mt-4">
                <div className="flex flex-wrap gap-4">
                  <Image
                    alt=""
                    src="/img/icon/facebook.png"
                    width={45}
                    height={45}
                    className="w-[45px] h-[45px] cursor-pointer"
                  />
                  <Image
                    alt=""
                    src="/img/icon/twitter.png"
                    width={45}
                    height={45}
                    className="w-[45px] h-[45px] cursor-pointer"
                  />
                  <Image
                    alt=""
                    src="/img/icon/telegram.png"
                    width={45}
                    height={45}
                    className="w-[45px] h-[45px] cursor-pointer"
                  />
                </div>
              </div>
            </div> */}
          </div>
        </div>
        <div
          className="mt-4 flex items-center gap-2 cursor-pointer w-[100px] justify-between"
          onClick={() => setIsShowMoreAboutGame(!isShowMoreAboutGame)}
        >
          <span className="font-medium dark:text-color-primary text-[#f59e0b] text-[14px]">
            {isShowMoreAboutGame ? t('gameDetail:showLess') : t('gameDetail:showMore')}
          </span>
          <ChevronDownIcon
            width={14}
            height={14}
            className={cn('dark:text-white text-[#f59e0b] stroke-[3]', 'transition-all ease-in duration-200', {
              'rotate-0': !isShowMoreAboutGame,
              'rotate-180': isShowMoreAboutGame,
            })}
          />
        </div>
      </div>
      <div className="mb-10 dark:text-color-text-primary text-[#000]">
        <h2 className="mb-1 sm:text-[16px] text-[14px] text-black dark:text-white">{t('gameDetail:ratings')} </h2>
        <div className="w-full bg-white dark:bg-color-card-bg-primary border border-solid border-color-card-border-primary rounded-lg">
          <div className="flex sm:p-4 p-2 md:gap-[30px] gap-[30px]">
            <div className="flex md:flex-row flex-col gap-[10px]">
              <span className="text-4xl dark:text-color-primary text-[#f59e0b] font-normal">
                {ratingData.averageRating?.toFixed(1)}{' '}
                <span className="text-[11px] dark:text-color-text-primary text-color-light-text-primary md:hidden -ml-3">
                  /5
                </span>
              </span>
              <div className="w-[max-content]">
                <StarsRating
                  allowHalf={false}
                  classNamePrefix="sm:!text-[14px] !text-[12px] !mr-[2px] sm:!mr-[5px] rate-star"
                  disabled
                  value={ratingData.averageRating}
                />
                <p className="hidden md:block text-[11px]">{t('gameDetail:outOf')} 5</p>
              </div>
            </div>
            <div className="w-full">
              {new Array(5).fill('').map((item, index) => (
                <div className="flex items-center" key={index}>
                  <div className="sm:min-w-[150px] min-w-[100px]">
                    <StarsRating
                      allowHalf={false}
                      classNamePrefix="sm:!text-[16px] !text-[14px] !mr-[2px] sm:!mr-[5px] rate-star"
                      disabled
                      count={5 - index}
                    />
                  </div>
                  <div className="w-full h-[5px] bg-gray-500 rounded">
                    <div
                      className="h-full rounded bg-color-primary"
                      style={{ width: `${(ratingData.counts[4 - index] / (ratingData.totalCount || 1)) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="w-full h-[1px] dark:bg-color-card-border-primary bg-color-light-border-primary"></div>
          <div className="flex justify-between px-4 text-[14px]">
            <div className="flex flex-col items-center justify-center w-full pr-5 md:flex-row md:justify-between">
              <span>{t('gameDetail:rateThisGame')}</span>
              <StarsRating
                allowHalf={false}
                value={userRating}
                classNamePrefix="!text-[20px] !mr-[2px] sm:!mr-[5px] rate-star"
                onChange={handleChangeRate}
              />
            </div>
            <div className="w-[1px] md:h-12 h-[86px] dark:bg-color-border-primary bg-color-light-border-primary"></div>
            <div className="flex flex-col items-center justify-center w-full pl-4 md:flex-row md:justify-start">
              <div className="flex pr-2">
                {ratingData.avatars.map((item, key) => (
                  <div key={key}>
                    {item && (
                      <Image
                        src={item ? `${API_AVATAR}/${item}` : '/img/avatar-1.png'}
                        alt="avatar"
                        width={36}
                        height={36}
                        className="w-4 h-4"
                        onError={(e) => {
                          e.currentTarget.src = '/img/avatar-1.png';
                        }}
                      />
                    )}
                  </div>
                ))}
              </div>
              <span>
                {ratingData.totalCount} {t('gameDetail:ratings')}
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="mb-[50px]">
        {loading.commentLoading ? (
          <Loader isFullMode={false} />
        ) : (
          <>
            <div className="flex items-center justify-between text-lg font-semibold">
              <h2 className="text-black dark:text-white sm:text-[16px] text-[14px]">{t('gameDetail:comments')}</h2>
              <Popover>
                {({ open }) => (
                  <>
                    <Popover.Button>
                      <HambergerMenu size={18} className={cn('m-auto')} />
                    </Popover.Button>
                    <Transition.Child
                      as={Fragment}
                      enter="ease-out duration-300"
                      enterFrom="opacity-0"
                      enterTo="opacity-100"
                      leave="ease-in duration-200"
                      leaveFrom="opacity-100"
                      leaveTo="opacity-0"
                    >
                      <div className="fixed sm:hidden block inset-0 bg-black/80 transition-opacity z-[-1]" />
                    </Transition.Child>
                    <Transition
                      show={open}
                      as={Fragment}
                      enter="transition ease-out duration-100"
                      enterFrom="transform opacity-0 scale-95"
                      enterTo="transform opacity-100 scale-100"
                      leave="transition ease-in duration-75"
                      leaveFrom="transform opacity-100 scale-100"
                      leaveTo="transform opacity-0 scale-95"
                    >
                      <Popover.Panel
                        static
                        className="absolute right-0 left-auto z-10 mr-0 origin-top-right ring-1 ring-black ring-opacity-5 focus:outline-none"
                      >
                        <div className="py-1 gap-[3px] px-[10px] flex flex-col relative rounded-md dark:bg-color-menu-primary bg-white w-auto shadow-gray-700 dark:shadow">
                          {sortByData.map((item, index) => (
                            <div
                              className={cn(
                                'text-[14px] py-[5px] px-[10px] cursor-pointer dark:hover:bg-color-hover-primary hover:bg-color-light-bg-primary rounded-[5px]',
                                {
                                  'dark:bg-color-active-primary bg-white': item.value === selectedSort,
                                },
                              )}
                              key={index}
                              onClick={() => setSelectedSort(item.value as ReviewListSortType)}
                            >
                              {' '}
                              {item.title}
                            </div>
                          ))}
                        </div>
                      </Popover.Panel>
                    </Transition>
                  </>
                )}
              </Popover>
            </div>
            <div className="rounded-lg bg-color-card-bg-primary border border-solid border-color-card-border-primary p-4">
              <div className="flex gap-[13px] h-11 items-center relative mt-[9px]">
                <Image
                  src={userAvatar ? `${API_AVATAR}/${userAvatar}` : '/img/avatar-1.png'}
                  alt="avatar"
                  width={36}
                  height={36}
                  className="rounded-full w-9 h-9"
                  onError={(e) => {
                    e.currentTarget.src = '/img/avatar-1.png';
                  }}
                />

                <div
                  className="flex flex-col items-start justify-center w-full h-full text-sm rounded-lg border-none cursor-pointer dark:bg-color-card-bg-secondary bg-color-light-bg-primary dark:text-color-text-primary text-color-light-bg-primary px-7 focus:outline-none"
                  role="text"
                  onClick={() => {
                    if (!isLogin) {
                      dispatch(changeAuthenticationType(AuthenticationModeEnum.SIGN_IN));
                      dispatch(changeIsShowAuthenticationModal(true));
                      return;
                    }
                    setIsShowComment(true);
                    setCommentId('');
                  }}
                >
                  Leave your comment
                  <div className="absolute right-3">
                    <Happyemoji size={18} className={cn('m-auto')} />
                  </div>
                </div>
              </div>
              {commentData.map((comment, index) => (
                <div
                  className="flex flex-col text-xs dark:text-color-text-primary text-color-light-text-primary"
                  key={index}
                >
                  <div className="flex justify-between items-center h-[120px] md:h-[93px] rounded-lg mt-4 dark:bg-color-card-bg-secondary bg-white">
                    <div className="ml-[17px]">
                      <div className="flex items-center gap-2">
                        <Image
                          src={comment.userAvatar ? `${API_AVATAR}/${comment.userAvatar}` : '/img/avatar-1.png'}
                          alt="avatar"
                          width={36}
                          height={36}
                          className="rounded-full w-7 h-7"
                          onError={(err) => {
                            err.currentTarget.src = '/img/avatar-1.png';
                          }}
                        />

                        <span
                          className="text-[14px] hover:underline cursor-pointer"
                          onClick={() => openModalUserProfile(comment.userId, comment.userAvatar, comment.userName)}
                        >
                          {comment.userName}
                        </span>
                        <span className="text-[#53575C]">{getDuration(comment.time)}</span>
                      </div>
                      <p className="mt-[13px] ml-[23px] dark:text-white text-black">{comment.text}</p>
                      {comment.comments > 0 && (
                        <p
                          className="mt-[10px] text-color-primary hover:underline cursor-pointer"
                          onClick={() => {
                            setCommentId(comment.id);
                            setSelectedComment(comment);
                            // if (comment.comments > 3) {
                            setIsShowReplyModal(true);
                            // }
                          }}
                        >
                          {t('gameDetail:showReplies', { count: comment.comments })}
                        </p>
                      )}
                    </div>
                    <div className="flex gap-6 mr-3 -mt-8 text-sm">
                      <div
                        className={cn('flex gap-[5px] items-center justify-center cursor-pointer', {
                          'text-color-primary': comment.like,
                        })}
                        onClick={() => handleLikeComment(comment.id)}
                      >
                        <Like1 size={18} className={cn('m-auto')} />
                        {comment.likes > 0 && <span className="ml-[10px]">{comment.likes}</span>}
                      </div>
                      <div
                        className="cursor-pointer flex gap-[5px] items-center justify-center "
                        onClick={() => {
                          setCommentId(comment.id);
                          setIsShowComment(true);
                        }}
                      >
                        <Messages size={18} className={cn('m-auto')} />
                        {comment.comments > 0 && <span className="ml-[10px]">{comment.comments}</span>}
                      </div>
                      <div className="cursor-pointer">
                        <Popover className="mr-[10px] items-center flex relative w-auto rounded-[7px] text-center dark:hover:bg-color-hover-primary hover:bg-color-light-bg-primary">
                          {({ open }) => (
                            <>
                              <Popover.Button>
                                <div className="relative flex flex-col items-center justify-center dark:text-white text-color-text-primary ">
                                  <EllipsisVerticalIcon
                                    width={18}
                                    height={18}
                                    className="border-none active:border-none"
                                    data-tooltip-id={`${index}-report-tooltip`}
                                  />
                                </div>
                              </Popover.Button>
                              <Transition
                                show={open}
                                as={Fragment}
                                enter="transition ease-out duration-100"
                                enterFrom="transform opacity-0 scale-95"
                                enterTo="transform opacity-100 scale-100"
                                leave="transition ease-in duration-75"
                                leaveFrom="transform opacity-100 scale-100"
                                leaveTo="transform opacity-0 scale-95"
                              >
                                <Popover.Panel
                                  static
                                  className="mr-0 right-0 absolute min-w-[150px] p-1 z-10 bg-black origin-top-right ring-1 ring-black ring-opacity-5 focus:outline-none sm:w-auto top-[30px]"
                                >
                                  <p
                                    onClick={() => {
                                      setCommentId(comment.id);
                                      setIsShowReport(true);
                                    }}
                                  >
                                    {t('gameReview:report')}
                                  </p>
                                </Popover.Panel>
                              </Transition>
                            </>
                          )}
                        </Popover>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col text-xs dark:text-color-text-primary text-color-light-text-primary">
                    {comment.child.map((item) => (
                      <div className="flex justify-between items-center h-[120px] md:h-[93px] mt-4 dark:bg-color-bg-secondary bg-white">
                        <div className="ml-[17px]">
                          <div className="flex items-center gap-2">
                            <Image
                              src={item.userAvatar ? `${API_AVATAR}/${item.userAvatar}` : '/img/avatar-1.png'}
                              alt="avatar"
                              width={36}
                              height={36}
                              className="rounded-full w-7 h-7"
                              onError={(err) => {
                                err.currentTarget.src = '/img/avatar-1.png';
                              }}
                            />

                            <span
                              className="text-[14px] hover:underline cursor-pointer"
                              onClick={() => openModalUserProfile(item.userId, item.userAvatar, item.userName)}
                            >
                              {item.userName}
                            </span>
                            <span className="text-[#53575C]">{getDuration(item.time)}</span>
                          </div>
                          <p className="mt-[13px] ml-[23px] dark:text-white text-black">{item.text}</p>
                          {item.comments > 0 && (
                            <p
                              className="mt-[10px] text-color-primary hover:underline cursor-pointer"
                              onClick={() => {
                                setCommentId(item.id);
                                setSelectedComment(item);
                                setIsShowReplyModal(true);
                              }}
                            >
                              {t('gameDetail:showReplies', { count: item.comments })}
                            </p>
                          )}
                        </div>
                        <div className="flex gap-6 mr-3 -mt-8 text-sm">
                          <div
                            className={cn('flex gap-[5px] items-center justify-center cursor-pointer', {
                              'text-color-primary': item.like,
                            })}
                            onClick={() => handleLikeComment(item.id)}
                          >
                            <Like1 size={18} className={cn('m-auto')} />
                            {item.likes > 0 && <span className="ml-[10px]">{item.likes}</span>}
                          </div>
                          <div
                            className="cursor-pointer"
                            onClick={() => {
                              setCommentId(item.id);
                              setIsShowComment(true);
                            }}
                          >
                            <Messages size={18} className={cn('m-auto')} />
                            {item.comments > 0 && <span className="ml-[10px]">{item.comments}</span>}
                          </div>
                          <EllipsisVerticalIcon
                            width={18}
                            height={18}
                            className="border-none active:border-none"
                            data-tooltip-id={`${index}-report-tooltip`}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
      {isShowComment && (
        <CommentPostModal
          show={isShowComment}
          onClose={() => setIsShowComment(false)}
          gameId={String(gameDetail?.id)}
          commentId={commentId}
          comments={commentData}
          setCommentData={setCommentData}
        />
      )}
      {isShowReplyModal && (
        <ReplyModal
          show={isShowReplyModal}
          onClose={() => setIsShowReplyModal(false)}
          gameId={String(gameDetail.id)}
          comments={commentData}
          setComments={setCommentData}
          sourceComment={selectedComment}
          setSourceComment={setSelectedComment}
        />
      )}
      {isShowReport && (
        <ReportModal show={isShowReport} onClose={() => setIsShowReport(false)} onReport={reportComment} />
      )}
    </div>
  );
};
export default GameReviewComponent;
