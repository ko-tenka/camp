import { createSlice } from "@reduxjs/toolkit";
import { fetchBook   } from "./thunkActions";
// import { fetchAddTodo, fetchDeleteTodo, fetchTodos, fetchUpdateTodo, fetchUserInfo } from "./thunkActions";

export interface IUser {
    id: number,
    login: string,
    password?: string,
}

export type UserSliceState = {
    user: IUser,
    logStatus: boolean
}

const initialUser: IUser = {
    id: 0,
    login: ''
}

const initialState: UserSliceState = {
    user: initialUser,
    logStatus: false
};

const userModalSlice = createSlice({
    name: 'userSlice',
    initialState,
    extraReducers: (builder) => {
        builder.addCase(fetchBook.fulfilled, (state, { payload }) => {
            state.user = payload;
            state.logStatus=true
        })
    },
    reducers: {}
}
)

export default userModalSlice.reducer;
