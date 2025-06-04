import { createSlice } from '@reduxjs/toolkit';
import { fetchRoute, fetchRouteById } from './thunkActions';

export type SliceState = {
  count: number;
  todoList: postType;
  isLoading: boolean;
};

const initialState: SliceState = {
  count: 0,
  todoList: [],
  isLoading: false,
};

const routeSlice = createSlice({
  name: 'routeSlice',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
      builder.addCase(fetchRoute.pending, (state) => {
        state.isLoading = false;
      }),
      builder.addCase(fetchRoute.fulfilled, (state, { payload }) => {
        const freeSpaceFilter = payload.filter((arr) => {
          if (arr.length > 1) {
            for (let i = 0; i < arr.length; i++) {
              if (arr[i].shelter === 'мест нет') {
                return false;
              }
            }
          }
          return true;
        });
        state.todoList = freeSpaceFilter;
        state.isLoading = true;
      });
      
  },
});

export default routeSlice.reducer;
