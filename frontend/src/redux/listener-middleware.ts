import { createListenerMiddleware, addListener } from "@reduxjs/toolkit";
import type { TypedStartListening, TypedAddListener } from "@reduxjs/toolkit";

import type { RootState } from "./store";

const listenerMiddleware = createListenerMiddleware();

export const startAppListening =
  listenerMiddleware.startListening as TypedStartListening<RootState>;
export const addAppListener = addListener as TypedAddListener<RootState>;

export default listenerMiddleware;
