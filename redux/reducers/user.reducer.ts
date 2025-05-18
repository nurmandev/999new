import { createSlice } from '@reduxjs/toolkit';

import { UserDataState } from '@/base/types/reducer-states';

const initialState: UserDataState = {
  userId: '',
  userName: '',
  avatar: '',
};

export const userReducer = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserData: (state, action) => {
      state.userId = action.payload.userId;
      state.userName = action.payload.userName;
      state.avatar = action.payload.avatar;
    },
  },
});

export const { setUserData } = userReducer.actions;
export default userReducer.reducer;
