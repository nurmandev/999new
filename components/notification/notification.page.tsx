import cn from 'classnames';
import Image from 'next/image';
import Link from 'next/link';
import { CloseCircle } from 'iconsax-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import ReactLoading from 'react-loading';
import { shallowEqual, useSelector } from 'react-redux';
import { useTranslation } from '@/base/config/i18next';
import { CookiesStorage } from '@/base/libs/storage/cookie';
import { setIsNewMessage, setIsNewNotification } from '@/base/redux/reducers/common.reducer';
import { changeIsShowNotification } from '@/base/redux/reducers/modal.reducer';
import { AppState, useAppDispatch } from '@/base/redux/store';
import { NotificationType } from '@/base/types/common';
import { api_getNotificationHistory } from '@/api/notification';
import { API_NOTIFICATION_LOGO, TIME_SUBMIT_FORMAT_WITH_SLASH_MARKER } from '@/base/constants/common';
import { formatDate } from '@/base/libs/utils';

const NotificationComponent = () => {
  const dispatch = useAppDispatch();
  const scrollRef = useRef<HTMLDivElement>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [isFirstLoading, setIsFirstLoading] = useState(false);

  const { isShowNotification, lastNotification } = useSelector(
    (state: AppState) => ({
      isShowNotification: state.modal.isShowNotification,
      lastNotification: state.common.lastNotification,
    }),
    shallowEqual,
  );

  const [notifications, setNotifications] = useState<NotificationType[]>([]);
  const [incomingNotifications, setIncomingNotifications] = useState<NotificationType[]>([]);

  const getMessages = useCallback(async () => {
    try {
      setIsLoading(true);
      const _res = await api_getNotificationHistory(notifications.length, 10);
      const _notifications: NotificationType[] =
        _res.data?.map((item: any) => ({
          id: item?.id || '',
          title: item?.title || '',
          description: item?.description || '',
          link: item?.link || '',
          image: item?.image || '',
          createdAt: item?.createdAt || new Date().toString(),
        })) || [];

      if (_notifications.length > 0) {
        const _lastNotification = _notifications[0];
        if (notifications.length === 0) CookiesStorage.setCookieData('last_notification', _lastNotification.id);
        dispatch(setIsNewNotification(false));
      }
      setNotifications([...notifications, ..._notifications]);
    } catch (error) {
      console.log(error);
      // setMessages([]);
    } finally {
      setIsLoading(false);
    }
  }, [notifications]);

  const scrollDown = () => {
    const $chatContainer = scrollRef.current;
    if (!$chatContainer) {
      return;
    }
    $chatContainer.scrollTop = $chatContainer.scrollHeight;
  };

  const loadNewMessage = async () => {
    const $chatContainer = scrollRef.current;
    if (!$chatContainer) return;
    if ($chatContainer.scrollTop === $chatContainer?.scrollHeight - $chatContainer?.clientHeight) {
      setIsFirstLoading(false);
      await getMessages();
    }
  };
  const { t } = useTranslation('');

  useEffect(() => {
    if (isShowNotification) {
      setIsFirstLoading(true);
      getMessages();
    }
  }, [isShowNotification]);

  useEffect(() => {
    if (lastNotification?.id) {
      setIncomingNotifications([{ ...lastNotification }]);
    }
  }, [lastNotification]);

  useEffect(() => {
    if (incomingNotifications.length > 0) {
      setNotifications([...incomingNotifications, ...notifications]);
    }
  }, [incomingNotifications]);

  useEffect(() => {
    if (isFirstLoading && notifications.length > 0) {
      scrollDown();
    }
  }, [notifications, isFirstLoading]);

  return (
    <>
      <div className="flex flex-col justify-between h-full w-full bg-white dark:bg-color-header-primary min-w-[100vw] sm:min-w-[330px]  border-solid border-[1px] border-color-bg-primary border-l-color-card-body-primary drop-shadow-lg shadow-bs-default">
        <div className="flex justify-between items-center !min-h-[60px] px-5 py-3 border-b-[1px] border-solid dark:border-b-color-card-body-primary border-color-light-border-primary">
          <div className="text-[18px] text-black dark:text-[#ffffff] font-semibold">{t('sidebar:notification')}</div>
          <div className="flex gap-[13px]">
            <button
              className="text-black dark:text-gray-400 hover:text-white rounded-[14px] p-1 flex items-center justify-center hover:opacity-80"
              onClick={() => {
                dispatch(changeIsShowNotification(false));
              }}
            >
              <CloseCircle className="" width={20} height={20} />
            </button>
          </div>
        </div>
        <div
          className="flex flex-col bg-transparent overflow-y-auto h-full pb-[20px]"
          ref={scrollRef}
          onScroll={() => loadNewMessage()}
        >
          <div className="flex w-full my-[10px] justify-start items-center gap-3 flex-col relative">
            {notifications.map((notification, index) => (
              <div
                className="flex flex-col gap-2 w-full max-w-full sm:max-w-[310px] text-default text-gray-200 bg-color-card-body-primary p-3 pt-5 rounded-sm"
                key={index}
              >
                <div className={cn('text-[12px] text-start text-[#999] font-semibold')}>
                  {formatDate(new Date(notification.createdAt), TIME_SUBMIT_FORMAT_WITH_SLASH_MARKER)}
                </div>
                {notification.title}
                <Image
                  height={80}
                  width={80}
                  src={notification?.image ? `${API_NOTIFICATION_LOGO}/${notification?.image}` : '/img/back-card.png'}
                  alt="back card"
                  className="w-full rounded-md"
                  onError={(e) => {
                    e.currentTarget.src = '/img/back-card.png';
                  }}
                />
                <div className="text-gray-400 text-default font-light">{notification.description}</div>
                {notification.link && (
                  <>
                    <div className="mt-1 border-t border-solid border-t-slate-700" />
                    <div className="text-green-500 py-2 px-5 bg-color-card-bg-default max-w-[120px] text-center rounded-sm">
                      <Link href={notification.link}>{t('bonus:details')}</Link>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
          {isLoading && (
            <div
              className={cn(
                'flex justify-center items-center w-full h-[calc(100vh_-_70px)] dark:bg-color-bg-primary/50 bg-color-light-bg-primary absolute top-[70px]',
              )}
            >
              <ReactLoading type="bubbles" color="#00AAE6" delay={50} />
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default NotificationComponent;
