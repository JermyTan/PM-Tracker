import { Action, configureStore, ThunkAction } from "@reduxjs/toolkit";
import { CURRENT_USER, REMEMBER_ME } from "../constants";
import { storage } from "../utils/storage-utils";
import currentUserSlice, {
  updateCurrentUserAction,
} from "./slices/current-user-slice";
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
    [currentUserSlice.name]: currentUserSlice.reducer,
    [rememberMeSlice.name]: rememberMeSlice.reducer,
  },
  preloadedState,
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;

export const resetAppState = () => {
  store.dispatch(updateCurrentUserAction(null));

  //   window.FB?.getLoginStatus(({ status }) => {
  //     status === "connected" && window.FB?.logout();
  //   });
};

export default store;
