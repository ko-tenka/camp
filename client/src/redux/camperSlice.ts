import { createSlice } from '@reduxjs/toolkit';
import { fetchCamper, fetchCamperById } from './thunkActions';

export type SliceState = {
  count: number;
  todoList: postType;
  isLoading: boolean;
};

const initialState: SliceState = {
  count: 0,
  todoList: [],
  oneCamp: {},
  isLoading: true,
  oneLoading: true,
};

const camperSlice = createSlice({
  name: 'camperSlice',
  initialState,
  reducers: {
    increment(state) {
      state.count += 1;
    },
    decrement(state) {
      state.count -= 1;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchCamperById.pending, (state) => {
      state.oneLoading = true;
    }),
      builder.addCase(fetchCamperById.fulfilled, (state, { payload }) => {
        state.oneCamp = payload;
        state.oneLoading = false;
      }),
      builder.addCase(fetchCamper.pending, (state) => {
        state.isLoading = true;
        state.oneLoading = false;
      }),
      builder.addCase(fetchCamper.fulfilled, (state, { payload }) => {
        state.todoList = payload; 
        state.isLoading = false;
        state.oneLoading = false;
      });
    
      
  },
});

export default camperSlice.reducer;
export const { increment, decrement } = camperSlice.actions;

  