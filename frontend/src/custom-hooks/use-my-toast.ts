import { useCallback, useMemo } from "react";
import { useToast, UseToastOptions } from "@chakra-ui/react";

export default function useMyToast() {
  const toast = useToast();

  const toastGenerator = useCallback(
    (status: Exclude<UseToastOptions["status"], undefined>) =>
      (options?: Omit<UseToastOptions, "status">) =>
        toast({ status, isClosable: true, ...options }),
    [toast],
  );

  return useMemo(
    () => ({
      success: toastGenerator("success"),
      info: toastGenerator("info"),
      warning: toastGenerator("warning"),
      error: toastGenerator("error"),
    }),
    [toastGenerator],
  );
}
