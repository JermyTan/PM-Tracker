import { FetchBaseQueryError } from "@reduxjs/toolkit/dist/query";
import toastUtils from "./toast-utils";

export function isFetchBaseQueryError(error: unknown) {
  return (
    !Array.isArray(error) &&
    typeof error === "object" &&
    error !== null &&
    "status" in error
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

  try {
    if (isFetchBaseQueryError(error)) {
      const queryError = error as FetchBaseQueryError & { error?: string };

      const { detail = queryError?.error ?? defaultErrorMessage } =
        (queryError.data as { detail?: string } | undefined) ?? {};

      toastUtils.error({ message: detail });

      return;
    }
    // eslint-disable-next-line no-empty
  } catch {}

  toastUtils.error({ message: defaultErrorMessage });
}
