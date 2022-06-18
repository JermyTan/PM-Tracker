import equal from "fast-deep-equal";
import {
  TypedUseSelectorHook,
  useDispatch,
  useSelector,
  shallowEqual,
} from "react-redux";

import type { AppDispatch, RootState } from "./store";

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
export const useShallowEqualAppSelector: TypedUseSelectorHook<RootState> = (
  selector,
) => useAppSelector(selector, shallowEqual);
export const useDeepEqualAppSelector: TypedUseSelectorHook<RootState> = (
  selector,
) => useAppSelector(selector, equal);
