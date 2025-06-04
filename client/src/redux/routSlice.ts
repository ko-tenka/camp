import { createSlice } from '@reduxjs/toolkit';
import { fetchRoutById } from './thunkActions';

export type SliceState = {
  isLoading: boolean;
};

const initialState: SliceState = {
  rout: {},
  isLoading: true,
};

const routSlice = createSlice({
  name: 'routSlice',
  initialState,
  reducers: {
    clearState(state) {
      state.rout = {};
      state.isLoading = true;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchRoutById.pending, (state) => {
      state.isLoading = true;
    }),
      builder.addCase(fetchRoutById.fulfilled, (state, { payload }) => {
        state.rout = payload;
        state.isLoading = false;
      });
  },
});

export default routSlice.reducer;
export const { clearState } = routSlice.actions;
