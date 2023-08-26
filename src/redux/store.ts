import { combineReducers, configureStore } from "@reduxjs/toolkit";
import chatSlice from "./chatSlice";

const combinedReducer = combineReducers({
  chat: chatSlice,
});

export default configureStore({
  reducer: combinedReducer,
});