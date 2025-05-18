import { API_NOTIFICATION_LATEST } from 'constants/endpoints';

import api from '../api';

export const api_getNotificationHistory = async (offset: number, limit: number) => {
  return api.get(API_NOTIFICATION_LATEST, { params: { offset, limit } });
};
