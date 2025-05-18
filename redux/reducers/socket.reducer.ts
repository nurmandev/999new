import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type socketState = {
  walletSocket: any;
  gameSocket: any;
};

const initialStateSocket: socketState = {
  walletSocket: '',
  gameSocket: '',
};

export const socketSlice = createSlice({
  name: 'socket',
  initialState: initialStateSocket,
  reducers: {
    setSocket: (state: socketState, action: PayloadAction<any>) => {
      state.walletSocket = action.payload;
    },
    setGameSocket: (state: socketState, action: PayloadAction<any>) => {
      state.gameSocket = action.payload;
    },
  },
});

export const { setSocket, setGameSocket } = socketSlice.actions;
export default socketSlice.reducer;
