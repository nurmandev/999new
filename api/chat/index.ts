import { API_CHAT_ADD, API_CHAT_LATEST, API_LEAVE_MESSAGE } from 'constants/endpoints';

import api from '../api';

export const api_getChatHistory = async (offset: number, limit: number) => {
  return api.get(API_CHAT_LATEST, { params: { offset: offset, limit } });
};

export const api_sendChat = async (text: string, replyId?: string) => {
  return api.post(API_CHAT_ADD, { text, replyId });
};

export const api_leaveMessage = async (text: string) => {
  return api.post(API_LEAVE_MESSAGE, { text });
};
