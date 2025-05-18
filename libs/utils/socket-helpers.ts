import { io } from 'socket.io-client';

import { socketWalletConfig } from '@/base/constants/common';

export const initialSocketConnection = async (socketUrl: string) => {
  const socket = io(socketUrl, socketWalletConfig);
  return socket;
};
