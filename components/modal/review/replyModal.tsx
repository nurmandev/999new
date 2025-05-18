import { Popover, Transition } from '@headlessui/react';
import { EllipsisVerticalIcon } from '@heroicons/react/24/outline';
import cn from 'classnames';
import { Like1, Messages } from 'iconsax-react';
import Image from 'next/image';
import { Fragment, useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { shallowEqual, useSelector } from 'react-redux';
import { toast } from 'react-toastify';

import { api_reviewLike, api_reviewList, api_reviewReport } from '@/api/game';
import { API_AVATAR, TOAST_ENUM } from '@/base/constants/common';
import { getDuration } from '@/base/libs/utils';
import { getErrorMessage } from '@/base/libs/utils/notificationToast';
import { AppState } from '@/base/redux/store';
import Loader from '@/components/common/preloader/loader';
import { CommentType } from '@/components/game/gameReview';
import Paging from '@/components/paging/paging';

import ReportModal from '../../modal/review/reportModal';
import CommonModal from '../commonModal/commonModal';
import CommentPostModal from './commentPost';

export default function ReplyModal({
  show,
  onClose,
  gameId,
  comments,
  setComments,
  sourceComment,
  setSourceComment,
}: {
  show: boolean;
  onClose: () => void;
  comments: CommentType[];
  setComments: (comments: CommentType[]) => void;
  gameId: string;
  sourceComment: CommentType;
  setSourceComment: (comment: CommentType) => void;
}) {
  const { avatar, userId } = useSelector(
    (state: AppState) => ({
      avatar: state.auth.user.avatar,
      userId: state.auth.user.userId,
    }),
    shallowEqual,
  );
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState<number>(10);
  const [totalRows, setTotalRows] = useState<number>(0);
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [isShowComment, setIsShowComment] = useState(false);
  const [commentData, setCommentData] = useState<CommentType[]>([]);
  const [isShowReport, setIsShowReport] = useState(false);
  const [commentId, setCommentId] = useState('');

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

  const handleGetList = useCallback(async () => {
    try {
      setIsLoading(true);
      const _res = await api_reviewList(sourceComment.id, gameId, page, limit, 'newest', userId);
      const tempCommentDatas: CommentType[] = _res?.data?.comments.map((item: any) => ({
        id: item?.id ?? '',
        userId: item?.userId ?? '',
        userName: item?.userName ?? '',
        userAvatar: item?.userAvatar ?? '',
        text: item?.text ?? '',
        time: item?.time ?? new Date(),
        likes: Number(item?.likesCount ?? 0),
        comments: Number(item?.commentsCount ?? 0),
      }));
      setCommentData(tempCommentDatas);
      setTotalRows(Number(_res.data?.totalCount || 0));
    } catch (error) {
      setCommentData([]);
    } finally {
      setIsLoading(false);
    }
  }, [page, sourceComment, limit]);

  const handleLikeComment = async (commentId: string) => {
    try {
      setIsLoading(true);
      const _res = await api_reviewLike(commentId);
      if (sourceComment.id === commentId) {
        const likes = !!_res.data?.like ? sourceComment.likes + 1 : sourceComment.likes - 1;
        const tempParentsCommentsData = [...comments].map((item) => {
          if (item.id === commentId) {
            item.likes = likes;
          }
          return item;
        });
        setComments(tempParentsCommentsData);
        setSourceComment({
          ...sourceComment,
          like: !!_res.data?.like,
          likes,
        });
      } else {
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
      }
    } catch (error: any) {
      const errType = error.response?.data?.message ?? '';
      const errMessage = getErrorMessage(errType);
      toast.error(t(errMessage), { containerId: TOAST_ENUM.COMMON });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateComment = () => {
    const updatedComments = sourceComment.comments + 1;
    const tempParentsCommentsData = [...comments].map((item) => {
      if (item.id === sourceComment.id) {
        item.comments = updatedComments;
      }
      return item;
    });
    setComments(tempParentsCommentsData);
    setSourceComment({
      ...sourceComment,
      comments: updatedComments,
    });
  };

  const handleChangePage = (action: string) => {
    let newPage: number;
    newPage = action === 'Next' ? page + 1 : action === 'Prev' ? page - 1 : +action;
    setPage(newPage);
    handleGetList();
  };

  const handleChangeItemPerPage = (itemPerPage: number) => {
    setLimit(itemPerPage);
    setPage(1);
  };

  useEffect(() => {
    handleGetList();
  }, []);

  return (
    <>
      <CommonModal show={show} onClose={onClose} panelClass="sm:!max-w-[530px] sm:my-0 ">
        <div className="flex flex-col p-[20px] mt-[40px] ">
          <div className="flex gap-[10px]">
            <div className="w-full text-xs dark:text-color-text-primary text-color-light-text-primary">
              <div className="flex items-center justify-between">
                <div className="">
                  <div className="flex items-center gap-2">
                    <Image
                      src={sourceComment.userAvatar ? `${API_AVATAR}/${sourceComment.userAvatar}` : '/img/avatar-1.png'}
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
                      // onClick={() => openModalUserProfile(sourceComment.userId, sourceComment.userAvatar, sourceComment.userName)}
                    >
                      {sourceComment.userName}
                    </span>
                    <span className="text-[#53575C]">{getDuration(sourceComment.time)}</span>
                  </div>
                  <p className="mt-[13px] ml-[23px] dark:text-white text-black">{sourceComment.text}</p>
                </div>
                <div className="flex gap-6 mr-3 -mt-8 text-sm">
                  <div
                    className="flex gap-[5px] items-center justify-center cursor-pointer"
                    onClick={() => handleLikeComment(sourceComment.id)}
                  >
                    <Like1 size={18} className={cn('m-auto')} />
                    {sourceComment.likes > 0 && <span className="ml-[10px]">{sourceComment.likes}</span>}
                  </div>
                  <div
                    className="flex gap-[5px] cursor-pointer"
                    onClick={() => {
                      setIsShowComment(true);
                    }}
                  >
                    <Messages size={18} className={cn('m-auto')} />
                    {sourceComment.comments > 0 && <span className="ml-[10px]">{sourceComment.comments}</span>}
                  </div>
                  <div className="cursor-pointer">
                    <Popover className="mr-[10px] items-center flex relative w-auto rounded-[7px] text-center dark:hover:bg-color-hover-primary hover:bg-color-light-bg-primary">
                      {({ open }) => (
                        <>
                          <Popover.Button>
                            <div className="relative flex flex-col items-center justify-center dark:text-white text-color-text-primary ">
                              <EllipsisVerticalIcon width={18} height={18} className="border-none active:border-none" />
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
                                  setCommentId(sourceComment.id);
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
            </div>
          </div>
          <div className="flex flex-col gap-[5px]">
            {isLoading && <Loader />}
            {commentData.map((comment, index) => (
              <div className="text-xs dark:text-color-text-primary text-color-light-text-primary" key={index}>
                <div className="flex justify-between items-center h-[120px] md:h-[93px] mt-4 dark:bg-color-card-bg-secondary bg-white">
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
                        // onClick={() => openModalUserProfile(comment.userId, comment.userAvatar, comment.userName)}
                      >
                        {comment.userName}
                      </span>
                      <span className="text-[#53575C]">{getDuration(comment.time)}</span>
                    </div>
                    <p className="mt-[13px] ml-[23px] dark:text-white text-black">{comment.text}</p>
                    {comment.comments > 0 && (
                      <p className="mt-[10px] text-color-primary hover:underline cursor-pointer">
                        {t('gameDetail:showReplies', { count: comment.comments })}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-6 mr-3 -mt-8 text-sm">
                    <div
                      className="flex gap-[5px] items-center justify-center cursor-pointer"
                      onClick={() => handleLikeComment(comment.id)}
                    >
                      <Like1 size={18} className={cn('m-auto')} />
                      {comment.likes > 0 && <span className="ml-[10px]">{comment.likes}</span>}
                    </div>
                    <div
                      className="flex gap-[5px] cursor-pointer"
                      onClick={() => {
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
                                className="mr-0 right-0 absolute min-w-[150px] p-1  z-10 bg-black origin-top-right ring-1 ring-black ring-opacity-5 focus:outline-none sm:w-auto top-[30px]"
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
              </div>
            ))}
          </div>
          <Paging
            onPageChange={handleChangePage}
            itemPerPage={limit}
            totalItem={totalRows}
            currentPage={page}
            setItemPerPage={handleChangeItemPerPage}
            hiddenPerPage={true}
          />
        </div>
      </CommonModal>

      {isShowComment && (
        <CommentPostModal
          show={isShowComment}
          onClose={() => setIsShowComment(false)}
          gameId={String(gameId)}
          commentId={sourceComment.id}
          comments={commentData}
          subComment={true}
          onSubmit={handleUpdateComment}
          setCommentData={setCommentData}
        />
      )}
      {isShowReport && (
        <ReportModal show={isShowReport} onClose={() => setIsShowReport(false)} onReport={reportComment} />
      )}
    </>
  );
}
