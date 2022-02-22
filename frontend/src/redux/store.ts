import { Action, configureStore, ThunkAction } from "@reduxjs/toolkit";
import { CURRENT_USER, REMEMBER_ME } from "../constants";
import { storage } from "../utils/storage-utils";
import baseApi from "./services/base-api";
import currentUserSlice from "./slices/current-user-slice";
import rememberMeSlice from "./slices/remember-me-slice";

const preloadedState = (() => {
  // ignore if this is running in server side
  if (typeof window === "undefined") {
    return undefined;
  }
  // default to true, even for non-existent/corrupted value
  const rememberMe = storage.local.load(REMEMBER_ME) === false ? false : true;

  return {
    currentUser: rememberMe
      ? storage.local.load(CURRENT_USER)
      : storage.session.load(CURRENT_USER),
    rememberMe,
  };
})();

const store = configureStore({
  reducer: {
    [baseApi.reducerPath]: baseApi.reducer,
    [currentUserSlice.name]: currentUserSlice.reducer,
    [rememberMeSlice.name]: rememberMeSlice.reducer,
  },
  preloadedState,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(baseApi.middleware),
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;

// reference: https://github.com/reduxjs/redux/issues/303#issuecomment-125184409
export function subscribeToStore<T>(
  selector: (rootState: RootState) => T,
  onChange: (newState: T, rootState: RootState) => void,
) {
  let currentState: T | undefined;

  const handleChange = () => {
    const rootState = store.getState();
    const newState = selector(rootState);

    if (currentState !== newState) {
      currentState = newState;
      onChange(newState, rootState);
    }
  };

  const unsubscribe = store.subscribe(handleChange);

  handleChange();

  return unsubscribe;
}

export default store;
