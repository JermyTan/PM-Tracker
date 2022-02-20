import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { REMEMBER_ME } from "../../constants";
import type { RootState } from "../store";

const initialState: boolean = true;

const rememberMeSlice = createSlice({
  name: REMEMBER_ME,
  initialState,
  reducers: {
    setRememberMe: (_, { payload }: PayloadAction<boolean>) => payload,
  },
});

// action creators
export const { setRememberMe } = rememberMeSlice.actions;

// selectors
export const selectRememberMe = ({ rememberMe }: RootState) => rememberMe;

export default rememberMeSlice;
