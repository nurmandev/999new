import { PaperAirplaneIcon } from '@heroicons/react/24/outline';
import cn from 'classnames';
import { CloseCircle, InfoCircle } from 'iconsax-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import ReactLoading from 'react-loading';
import { shallowEqual, useSelector } from 'react-redux';

import { api_getChatHistory, api_sendChat } from '@/api/chat';
import { useTranslation } from '@/base/config/i18next';
import { DATE_TIME_CHAT_DATE } from '@/base/constants/common';
import { CookiesStorage } from '@/base/libs/storage/cookie';
import { formatDate } from '@/base/libs/utils';
import { setIsNewMessage } from '@/base/redux/reducers/common.reducer';
import {
  changeAuthenticationType,
  changeIsShowAuthenticationModal,
  changeIsShowChatRule,
  changeIsShowInformation,
  changeShowChatType,
  changeShowFullChat,
} from '@/base/redux/reducers/modal.reducer';
import { AppState, useAppDispatch } from '@/base/redux/store';
import { AuthenticationModeEnum, MessageType } from '@/base/types/common';

import { MessageBox } from './messageBox';
import { setUserData } from '@/base/redux/reducers/user.reducer';
import styles from './text.module.scss';

type UserType = {
  userId: string;
  userName: string;
};

const ChattingComponent = () => {
  const dispatch = useAppDispatch();
  const chatRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [isShowChatRules, setIsShowChatRules] = useState(false);
  const [isFirstLoading, setIsFirstLoading] = useState(false);
  const [availableUsers, setAvailableUsers] = useState<UserType[]>([]);
  const [isShowTagMenu, setIsShowTagMenu] = useState<boolean>(false);
  const [replyMsg, setReplyMsg] = useState<{ id: string; userName: string; text: string }>();
  const [days, setDays] = useState<Number[]>([]);
  const [tagFilter, setTagFilter] = useState<string>('');

  const { showChatType, showFullChat, isLogin, lastMessage } = useSelector(
    (state: AppState) => ({
      showChatType: state.modal.showChatType,
      showFullChat: state.modal.showFullChat,
      isLogin: state.auth.isLogin,
      userInfo: state.auth.user,
      lastMessage: state.common.lastMessage,
    }),
    shallowEqual,
  );

  const [messages, setMessages] = useState<MessageType[]>([]);
  const [isSending, setIsSending] = useState<boolean>(false);
  const [inComingMessage, setInComingMessage] = useState<MessageType[]>([]);

  const getMessages = useCallback(async () => {
    try {
      setIsLoading(true);
      const _res = await api_getChatHistory(messages.length, 20);
      const tempMessages: MessageType[] =
        _res.data?.map((item: any) => ({
          id: item.id ?? '',
          userId: item.userId ?? '',
          userName: item.userName ?? '',
          userAvatar: item.userAvatar ?? '',
          level: item.userVipLevel ?? '',
          time: item.time ?? '',
          text: item.text ?? '',
          replyId: item.replyId ?? '',
          replyText: item.replyText ?? '',
          replyTime: item.replyTime ?? '',
          replyUserId: item.replyUserId ?? '',
          replyUserName: item.replyUserName ?? '',
          replyUserLevel: item.replyUserVipLevel ?? '',
        })) || [];

      const tempUsers: UserType[] =
        _res.data?.map((item: any) => ({
          userId: item.userId ?? '',
          userName: item.userName ?? '',
        })) || [];
      let uniqueUsers: UserType[] = [];
      tempUsers.map((user) => {
        if (!uniqueUsers.find((value) => value.userId === user.userId)) uniqueUsers.push(user);
      });
      availableUsers.map((user) => {
        if (!uniqueUsers.find((value) => value.userId === user.userId)) uniqueUsers.push(user);
      });
      if (tempMessages.length > 0) {
        const lastMessage = tempMessages[0];
        if (messages.length === 0) CookiesStorage.setCookieData('last_message', lastMessage.id);
        dispatch(setIsNewMessage(false));
      }
      setMessages([...messages, ...tempMessages]);
      setAvailableUsers([...uniqueUsers]);
    } catch (error) {
      console.log(error);
      // setMessages([]);
    } finally {
      setIsLoading(false);
    }
  }, [messages]);

  const scrollDown = () => {
    const $chatContainer = scrollRef.current;
    if (!$chatContainer) {
      return;
    }
    $chatContainer.scrollTop = $chatContainer.scrollHeight;
  };

  const onTagUser = (user: UserType | undefined) => {
    if (!user) return;
    let $spanEl;
    $spanEl = chatRef.current;
    if (!$spanEl) return;
    const lastTagIndex = $spanEl.innerText.lastIndexOf('@');
    setIsShowTagMenu(false);
    $spanEl.innerText =
      $spanEl.innerText.substring(0, lastTagIndex + 1) +
      user.userName +
      $spanEl.innerText.substring(lastTagIndex + tagFilter.length + 1, $spanEl.innerText.length);
    $spanEl.innerText = $spanEl.innerText + '\u00A0';

    var setpos = document.createRange();
    var set = window.getSelection();
    setpos.setStart($spanEl.childNodes[$spanEl.childNodes.length - 1], user.userName.length + 2);
    setpos.collapse(true);
    set?.removeAllRanges();
    set?.addRange(setpos);
    $spanEl.focus();
  };

  const tagUsers: UserType[] = useMemo(() => {
    const users = availableUsers.filter((user) => user.userName.toLowerCase().indexOf(tagFilter.toLowerCase()) >= 0);
    if (users.length === 0) {
      setIsShowTagMenu(false);
      setTagFilter('');
    }
    return users || [];
  }, [isShowTagMenu, availableUsers, tagFilter]);

  const onKeyUp = async (e: any) => {
    let $spanEl;
    let innerText;
    $spanEl = chatRef.current;
    if (!$spanEl) return;
    innerText = $spanEl.innerText;
    innerText = innerText.trim();
    if (e.keyCode !== 13) {
      const lastLetter = innerText?.at(innerText.length - 1);
      if (lastLetter === '@') setIsShowTagMenu(true);
      if (e.keyCode === 32 || innerText.indexOf('@') < 0) setIsShowTagMenu(false);
      if (isShowTagMenu) {
        const index = innerText.lastIndexOf('@');
        if (index >= 0) setTagFilter(innerText.substring(index + 1, innerText.length));
      }
    }
  };
  const onKeyDown = async (e: any) => {
    let $spanEl;
    let innerText;
    $spanEl = chatRef.current;
    if (!$spanEl) return;
    innerText = $spanEl.innerText;
    innerText = innerText.trim();
    if (e.keyCode == 13 && isShowTagMenu && tagUsers.length > 0) {
      onTagUser(tagUsers.at(0));
      e.preventDefault();
      return;
    }
    if (e.keyCode == 13 && !isShowTagMenu && !e.shiftKey && innerText) {
      e.preventDefault();
      await sendMessage();
    }
  };

  const loadNewMessage = async () => {
    const $chatContainer = scrollRef.current;
    if (!$chatContainer) return;
    if ($chatContainer.scrollTop === 0) {
      setIsFirstLoading(false);
      await getMessages();
    }
  };

  const convertUserNameToTag = (message: string) => {
    const filteredMessage = message.replaceAll(' ', '\u00A0');
    let newMessage = '';
    let startIndex = 0;
    while (true) {
      const altIndex = filteredMessage.indexOf('@', startIndex);
      if (altIndex < 0) {
        newMessage = newMessage + filteredMessage.substring(startIndex);
        break;
      }
      newMessage = newMessage + filteredMessage.substring(startIndex, altIndex);
      const spaceIndex = filteredMessage.indexOf('\u00A0', altIndex);
      const userName = filteredMessage.substring(altIndex + 1, spaceIndex);
      const user = availableUsers.find((user) => user.userName === userName);
      if (!user) newMessage = newMessage + filteredMessage.substring(altIndex, spaceIndex);
      else
        newMessage =
          newMessage +
          `<span style="cursor: pointer; font-weight:400; color: #44DDFF;" id="message-${user?.userId}">@${user?.userName}</span>`;
      startIndex = spaceIndex;
    }
    return newMessage;
  };

  const sendMessage = async () => {
    if (!isLogin) {
      dispatch(changeAuthenticationType(AuthenticationModeEnum.SIGN_IN));
      dispatch(changeIsShowAuthenticationModal(true));
      return;
    }
    if (isSending) return;
    try {
      setIsSending(true);
      const $spanEl = chatRef.current;
      if (!$spanEl) return;
      let msg = $spanEl.innerText;
      await api_sendChat(convertUserNameToTag(msg));
      setReplyMsg({ id: '', userName: '', text: '' });
      $spanEl.innerHTML = '';
      $spanEl.blur();
      scrollDown();
    } catch (e) {
      console.error(e);
    } finally {
      setIsSending(false);
    }
  };

  const { t } = useTranslation('');

  const handleUserNameClick = (event: any) => {
    const messageId = (event.target.id as string) || '';
    if (messageId.indexOf('message-') >= 0) {
      const userData = {
        username: 'name',
        userId: messageId.substring(8),
      };

      dispatch(setUserData(userData));
      dispatch(changeIsShowInformation(true));
    }
  };

  useEffect(() => {
    document.addEventListener('click', handleUserNameClick);

    return () => {
      document.removeEventListener('click', handleUserNameClick);
    };
  }, []);

  useEffect(() => {
    if (showChatType) {
      setIsFirstLoading(true);
      getMessages();
    }
  }, [showChatType]);

  useEffect(() => {
    if (lastMessage?.id) {
      setInComingMessage([{ ...lastMessage }]);
    }
  }, [lastMessage]);

  useEffect(() => {
    if (inComingMessage.length > 0) {
      setMessages([...inComingMessage, ...messages]);
    }
  }, [inComingMessage]);

  useEffect(() => {
    if (isFirstLoading && messages.length > 0) {
      scrollDown();
    }
  }, [messages, isFirstLoading]);

  useEffect(() => {
    let previousDay = new Date(Number(messages[0]?.time || 0) * 1000).getDate();
    const tempDays: Number[] = [];
    messages.map((message, index) => {
      const currentDay = new Date(Number(message.time) * 1000).getDate();
      if (previousDay != currentDay) tempDays.push(index - 1);
      previousDay = currentDay;
    });
    setDays(tempDays);
  }, [messages]);

  const onReply = (messageId: string, messageContent: string, receiverId: string, receiverName: string) => {
    const $spanEl = chatRef.current;
    if (!$spanEl) return;
    $spanEl.innerHTML = '@';
    $spanEl.focus();
    onTagUser({ userId: receiverId, userName: receiverName });
    // setReplyMsg({ id: messageId, userName: receiverName, text: messageContent });
  };

  return (
    <>
      <div className="flex flex-col justify-between h-full w-full bg-white dark:bg-color-header-primary min-w-[100vw] sm:min-w-[330px]  border-solid border-[1px] border-color-bg-primary border-l-color-card-body-primary drop-shadow-lg shadow-bs-default">
        <div className="flex justify-between items-center !min-h-[60px] px-5 py-3 border-b-[1px] border-solid dark:border-b-color-card-body-primary border-color-light-border-primary">
          <div className="text-[18px] text-black dark:text-[#ffffff] font-semibold">{t('chatting:chat')}</div>
          <div className="flex gap-[13px]">
            <button
              className="text-black dark:text-gray-400 hover:text-white rounded-[14px] p-1 flex items-center justify-center hover:opacity-80"
              onClick={() => {
                dispatch(changeIsShowChatRule(true));
              }}
            >
              <InfoCircle className="" width={20} height={20} />
            </button>
            <button
              className="text-black dark:text-gray-400 hover:text-white rounded-[14px] p-1 flex items-center justify-center hover:opacity-80"
              onClick={() => {
                dispatch(changeShowChatType(false));
                dispatch(changeShowFullChat(false));
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
          <div className="flex w-full my-[10px] justify-end gap-2 flex-col-reverse relative">
            {messages.map((message, index) => (
              <div className="w-full" key={index}>
                {days.indexOf(index) > -1 && (
                  <div className="flex justify-center my-[2px]">
                    <span className="border border-solid border-color-primary rounded-default text-gray-200 text-[11px] sm:text-[12px] px-5 py-[2px]">
                      {formatDate(new Date(Number(message.time) * 1000), DATE_TIME_CHAT_DATE)}
                    </span>
                  </div>
                )}
                <MessageBox
                  messageId={message.id}
                  userId={message.userId}
                  userName={message.userName}
                  time={message.time}
                  text={message.text}
                  level={message.level}
                  userAvatar={message.userAvatar}
                  onReply={onReply}
                  replyId={message.replyId}
                  replyText={message.replyText}
                  replyUserName={message.replyUserName}
                  replyUserId={message.replyUserId}
                />
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
        <div className="sticky bottom-0 w-full">
          <div
            className={cn(
              'relative flex py-[10px] w-full bg-color-header-primary px-[7px]',
              'border-[1px] border-solid border-color-bg-primary dark:border-t-color-card-body-primary',
              styles['messageBox'],
            )}
          >
            <div className={cn('flex flex-col w-full dark:bg-color-input-primary rounded-default px-[10px] py-[12px]')}>
              {replyMsg?.id && (
                <div className="flex w-full bg-black/20 rounded-[8px] pt-2 pb-1 px-2 mb-2">
                  <div className="flex flex-col w-full">
                    <div className="font-semibold text-left text-gray-400 text-[13px]">{replyMsg.userName}</div>
                    <div
                      className="font-semibold inline-block !text-left text-[13px] h-fit max-w-[200px] max-h-[40px] truncate break-all text-gray-500 rounded-[8px]"
                      dangerouslySetInnerHTML={{ __html: replyMsg.text }}
                    />
                  </div>
                  <CloseCircle
                    className="w-4 h-4 text-white cursor-pointer hover:opacity-80"
                    variant="Bulk"
                    onClick={() => setReplyMsg({ id: '', userName: '', text: '' })}
                  />
                </div>
              )}
              <div
                contentEditable={true}
                style={{ overflowWrap: 'anywhere', userSelect: 'none' }}
                onKeyDown={(e) => onKeyDown(e)}
                onKeyUp={(e) => onKeyUp(e)}
                className={cn(
                  'w-full max-w-full sm:max-w-[236px] max-h-[200px] leading-[20px] overflow-y-auto border-none outline-none lign-baseline editBox',
                  'cursor-text text-[13px] dark:text-white',

                  styles['messageContent'],
                )}
                ref={chatRef}
              />
            </div>
            <div
              className={cn(
                'flex flex-col h-11 justify-center items-center flex-1 rounded-default bg-gradient-btn-play shadow-bs-btn cursor-pointer',
                styles['messageBtn'],
              )}
              onClick={sendMessage}
            >
              <PaperAirplaneIcon className="w-[25px] h-[25px] text-white" />
            </div>
            <div
              className={cn(
                'fixed bottom-[70px] w-[75%] rounded-[8px] overflow-y-auto overflow-hidden transition-all duration-300 bg-color-input-primary/80 backdrop-blur',
                {
                  'max-h-0 p-0': !isShowTagMenu,
                  'max-h-[155px] p-2': isShowTagMenu,
                },
              )}
            >
              {tagUsers.map((user) => (
                <div
                  key={`chat-user-tag-${user.userId}`}
                  className="text-white px-2 py-[6px] cursor-pointer border-solid border border-transparent hover:border-color-primary text-m_default sm:text-default rounded-[8px]"
                  onClick={() => onTagUser(user)}
                >
                  {user.userName}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ChattingComponent;
