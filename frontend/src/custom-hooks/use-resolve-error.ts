import { FetchBaseQueryError } from "@reduxjs/toolkit/dist/query";
import { useCallback } from "react";
import useMyToast from "./use-my-toast";

export function isFetchBaseQueryError(error: unknown) {
  return (
    !Array.isArray(error) &&
    typeof error === "object" &&
    error !== null &&
    "status" in error
  );
}

export default function useResolveError() {
  const toast = useMyToast();

  const resolveError = useCallback(
    (
      error?: unknown,
      defaultErrorMessage: string = "An unknown error has occurred.",
    ) => {
      if (!error) {
        return;
      }

      console.log("Resolve error:", error);

      try {
        if (isFetchBaseQueryError(error)) {
          const queryError = error as FetchBaseQueryError & { error?: string };

          const { detail = queryError?.error ?? defaultErrorMessage } =
            (queryError.data as { detail?: string } | undefined) ?? {};

          toast.error({ title: detail });

          return;
        }
      } catch {}

      toast.error({ title: defaultErrorMessage });
    },
    [toast],
  );

  return resolveError;
}
