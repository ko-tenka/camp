import { ConfigureStoreOptions, configureStore } from '@reduxjs/toolkit';
import camperSlice, { SliceState } from './camperSlice';
import adminSlice from './adminSlice';
import routeSlice from './routeSlice';
import bookSlice from './bookSlice';
import routSlice from './routSlice';
import profileSlice from './profileSlice';
import userModalSlice from './userModalSlice';


type StoreType =
 {
  camperSlice: SliceState;
  routeSlice: SliceState;
};

const storeOptions: ConfigureStoreOptions<StoreType> = {
  reducer: {
    camperSlice,
    routeSlice,
    adminSlice,
    bookSlice,
    routSlice,
    profileSlice,
    userModalSlice,

  },
};

export const store = configureStore(storeOptions);

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
