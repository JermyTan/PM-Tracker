import { FetchBaseQueryError } from "@reduxjs/toolkit/dist/query";
import { isRecord } from "./transform-utils";
import toastUtils from "./toast-utils";

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

export function resolveError(
  error?: unknown,
  defaultErrorMessage: string = "An unknown error has occurred." as string,
) {
  if (!error) {
    return;
  }

  console.log("Resolve error:", error);

  if (isFetchBaseQueryError(error)) {
    const message = isErrorWithDetail(error.data)
      ? error.data.detail
      : JSON.stringify(error.data);

    toastUtils.error({ message });

    return;
  }

  if (isErrorWithMessage(error)) {
    toastUtils.error({ message: error.message });

    return;
  }

  toastUtils.error({ message: defaultErrorMessage });
}
