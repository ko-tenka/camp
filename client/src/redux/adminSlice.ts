import { createSlice } from "@reduxjs/toolkit";
import { fetchAdminCamper, fetchAdminPlace, fetchAdminRoute } from "./thunkActions";

const initialState = {
  cards: [],
};


const adminSlice = createSlice({
	name: 'adminSlice',
	initialState,
	reducers: {},
	extraReducers(builder) {
		builder.addCase(fetchAdminPlace.fulfilled, (state, action) => {
			state.cards.push(action.payload);
		
			
		});
		builder.addCase(fetchAdminRoute.fulfilled, (state, action) => {
			state.cards.push(action.payload);
		
			
		});
			builder.addCase(fetchAdminCamper.fulfilled, (state, action) => {
			state.cards.push(action.payload);
	
			
		});
	},

	
	
})

export default adminSlice.reducer;