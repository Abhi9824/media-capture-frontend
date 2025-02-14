import { configureStore } from "@reduxjs/toolkit";
import userSlice from "../features/userSlice";
import mediaSlice from "../features/mediaSlice";

export const store = configureStore({
  reducer: {
    user: userSlice,
    media: mediaSlice,
  },
});
