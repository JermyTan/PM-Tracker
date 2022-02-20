import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CURRENT_USER } from "../../constants";
import { AuthenticationData } from "../../types/auth";
import type { RootState } from "../store";

type CurrentUserState = Partial<AuthenticationData> | null;

const initialState: CurrentUserState = null as CurrentUserState;

const currentUserSlice = createSlice({
  name: CURRENT_USER,
  initialState,
  reducers: {
    updateCurrentUser: (
      state,
      { payload }: PayloadAction<CurrentUserState | null>,
    ) => (payload === null ? null : { ...state, ...payload }),
  },
});

// action creators
export const { updateCurrentUser } = currentUserSlice.actions;

// selectors
export const selectCurrentUser = ({ currentUser }: RootState) => currentUser;
export const selectIsLoggedIn = createSelector(
  selectCurrentUser,
  (currentUser) => Boolean(currentUser?.tokens && currentUser?.user),
);
export const selectCurrentUserTokens = createSelector(
  selectCurrentUser,
  (currentUser) => currentUser?.tokens,
);
export const selectCurrentUserDisplayInfo = createSelector(
  selectCurrentUser,
  (currentUser) => {
    return currentUser?.user;
  },
);

export default currentUserSlice;
