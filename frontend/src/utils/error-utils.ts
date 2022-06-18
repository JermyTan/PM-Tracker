import { useEffect, useMemo } from "react";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { useNetwork } from "@mantine/hooks";
import { isRecord } from "./transform-utils";
import toastUtils from "./toast-utils";
import type { AppDispatch } from "../redux/store";
import { useAppDispatch } from "../redux/hooks";
import resetAppState from "../redux/thunks/reset-app-state";
import { FAILED_TOKEN_REFRESH } from "../constants";

export function isFetchBaseQueryError(
  error: unknown,
): error is FetchBaseQueryError {
  return isRecord(error) && "status" in error;
}

export function isErrorWithMessage(
  error: unknown,
): error is { message: string } {
  return (
    isRecord(error) && "message" in error && typeof error.message === "string"
  );
}

export function isErrorWithDetail(error: unknown): error is { detail: string } {
  return (
    isRecord(error) && "detail" in error && typeof error.detail === "string"
  );
}

export function getErrorMessage(error: unknown) {
  if (isFetchBaseQueryError(error)) {
    return isErrorWithDetail(error.data)
      ? error.data.detail
      : JSON.stringify(error.data);
  }

  if (isErrorWithMessage(error)) {
    return error.message;
  }

  return undefined;
}

function resolveError(
  error: unknown,
  dispatch: AppDispatch,
  defaultErrorMessage: string,
) {
  if (!error) {
    return;
  }

  console.log("Resolve error:", error);

  const message = getErrorMessage(error) ?? defaultErrorMessage;

  toastUtils.error({ message });

  if (
    !isFetchBaseQueryError(error) ||
    error.status !== "CUSTOM_ERROR" ||
    error.error !== FAILED_TOKEN_REFRESH
  ) {
    return;
  }

  // kick user out
  dispatch(resetAppState());
}

export function useResolveError(error?: unknown, defaultErrorMessage?: string) {
  const networkStatus = useNetwork();
  const defaultUseResolveErrorMessage =
    defaultErrorMessage ??
    (networkStatus.online
      ? "An unknown error has occurred."
      : "No internet connection.");
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (error) {
      resolveError(error, dispatch, defaultUseResolveErrorMessage);
    }
  }, [error, dispatch, defaultUseResolveErrorMessage]);

  return useMemo(
    () =>
      (error: unknown, defaultErrorMessage = defaultUseResolveErrorMessage) =>
        resolveError(error, dispatch, defaultErrorMessage),
    [dispatch, defaultUseResolveErrorMessage],
  );
}
