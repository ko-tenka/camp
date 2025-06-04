import { createSlice } from "@reduxjs/toolkit";
import { fetchDeleteCard, fetchProfileGetBooking, fetchUpdateImg } from "./thunkActions";

const initialState = {
	bookings: [],
	img: ''
}

const profileSlice = createSlice({
	name: 'profileSlice',
	initialState,
	reducers: {},
	extraReducers(builder) {
		builder.addCase(fetchProfileGetBooking.fulfilled, (state, action) => {
			state.bookings = action.payload;
			console.log('booking', state);
		});

		builder.addCase(fetchDeleteCard.fulfilled, (state, action) => {
			state.bookings.booking = state.bookings.booking.filter((book) => book.id !== action.payload);
		});


		},
})

export default profileSlice.reducer;