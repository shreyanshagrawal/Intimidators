import { configureStore } from "@reduxjs/toolkit";

const dummyReducer = (state = {}) => state;

const store = configureStore({
  reducer: {
    app: dummyReducer
  }
});

export default store;
