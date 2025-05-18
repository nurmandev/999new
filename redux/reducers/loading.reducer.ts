import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { LoadingState } from '@/base/types/reducer-states';

const initialCommonState: LoadingState = {
  isShowDetailLoading: false,
};

export const queryDataSlice = createSlice({
  name: 'loading',
  initialState: initialCommonState,
  reducers: {
    changeIsShowDetailLoading: (state: LoadingState, action: PayloadAction<boolean>) => {
      state.isShowDetailLoading = action.payload;
    },
  },
});

export const { changeIsShowDetailLoading } = queryDataSlice.actions;
export default queryDataSlice.reducer;
