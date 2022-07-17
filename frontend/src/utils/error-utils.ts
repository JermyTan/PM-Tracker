import { Dispatch, SetStateAction, useMemo, useState } from "react";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { useNetwork, useShallowEffect } from "@mantine/hooks";
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

function resolveError({
  error,
  dispatch,
  defaultErrorMessage,
  setErrorMessage,
  name,
}: {
  error: unknown;
  dispatch: AppDispatch;
  defaultErrorMessage: string;
  setErrorMessage: Dispatch<SetStateAction<string | undefined>>;
  name?: string;
}) {
  if (!error) {
    setErrorMessage(undefined);
    return undefined;
  }

  console.log(`Resolve error${name ? ` @ ${name}` : ""}:`, error);

  const errorMessage = getErrorMessage(error) ?? defaultErrorMessage;

  setErrorMessage(errorMessage);
  toastUtils.error({ message: errorMessage });

  if (
    isFetchBaseQueryError(error) &&
    error.status === "CUSTOM_ERROR" &&
    error.error === FAILED_TOKEN_REFRESH
  ) {
    // kick user out
    dispatch(resetAppState());
  }
  return errorMessage;
}

export function useResolveError({
  error,
  defaultErrorMessage,
  name,
}: { error?: unknown; defaultErrorMessage?: string; name?: string } = {}) {
  const networkStatus = useNetwork();
  const defaultUseResolveErrorMessage =
    defaultErrorMessage ??
    (networkStatus.online
      ? "An unknown error has occurred."
      : "No internet connection.");
  const dispatch = useAppDispatch();
  const [errorMessage, setErrorMessage] = useState<string | undefined>(
    undefined,
  );

  useShallowEffect(() => {
    if (error) {
      resolveError({
        error,
        dispatch,
        defaultErrorMessage: defaultUseResolveErrorMessage,
        setErrorMessage,
        name,
      });
    }
  }, [error, dispatch, defaultUseResolveErrorMessage, name]);

  return {
    resolveError: useMemo(
      () =>
        (error: unknown, defaultErrorMessage = defaultUseResolveErrorMessage) =>
          resolveError({
            error,
            dispatch,
            defaultErrorMessage,
            setErrorMessage,
            name,
          }),
      [dispatch, defaultUseResolveErrorMessage, name],
    ),
    errorMessage,
  };
}
