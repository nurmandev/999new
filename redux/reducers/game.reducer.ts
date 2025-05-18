import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { BetTableDataType, GameListType } from '@/base/types/common';
import { GameState } from '@/base/types/reducer-states';

const initialState: GameState = {
  betHistory: [],
  recommandGames: [],
};

export const gameReducer = createSlice({
  name: 'game',
  initialState,
  reducers: {
    setBetHistory: (state: GameState, action: PayloadAction<BetTableDataType[]>) => {
      state.betHistory = [...action.payload].slice(0, 40);
    },
    addBetHistory: (state: GameState, action: PayloadAction<BetTableDataType>) => {
      state.betHistory = [action.payload, ...state.betHistory].slice(0, 40);
    },
    setRecommandGames: (state: GameState, action: PayloadAction<GameListType[]>) => {
      state.recommandGames = [...action.payload];
    },
  },
});

export const { setBetHistory, addBetHistory, setRecommandGames } = gameReducer.actions;
export default gameReducer.reducer;
