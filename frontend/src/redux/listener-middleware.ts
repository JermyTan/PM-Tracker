import { createListenerMiddleware, addListener } from "@reduxjs/toolkit";
import type { TypedStartListening, TypedAddListener } from "@reduxjs/toolkit";

import type { AppDispatch, RootState } from "./store";

const listenerMiddleware = createListenerMiddleware();

export const startAppListening =
  listenerMiddleware.startListening as TypedStartListening<
    RootState,
    AppDispatch
  >;
export const addAppListener = addListener as TypedAddListener<
  RootState,
  AppDispatch
>;

export default listenerMiddleware;
