import { createSlice } from "@reduxjs/toolkit";
import { fetchBookById } from "./thunkActions";
// import { fetchBook } from "./thunkActions";

export type SliceState = {
	count2: number;
	cards: postType;
	isLoading: boolean;
  };
  
  const initialState: SliceState = {
	count2: 0,
	cards: [],
	isLoading: true,
  };

const bookSlice = createSlice({
	name: 'bookSlice',
	initialState,
	reducers: {
		increment2(state) {
			state.count2 += 1;
		  },
		  decrement2(state) {
			state.count2 -= 1;
		  },
	},
	extraReducers(builder) {
		builder.addCase(fetchBookById.fulfilled, (state, action) => {
			state.cards = [...state.cards, ...action.payload];
		  });
	},

	
	
})

export default bookSlice.reducer;
export const { increment2, decrement2 } = bookSlice.actions;