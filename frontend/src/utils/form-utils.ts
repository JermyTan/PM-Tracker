import { FormEvent, FormEventHandler } from "react";

export function handleSubmitForm(
  onSubmit: (e: FormEvent<HTMLFormElement>) => unknown | Promise<unknown>,
  onError?: (error: unknown) => void,
): FormEventHandler<HTMLFormElement> {
  return async (e) => {
    console.log(e);
    try {
      await onSubmit(e);
    } catch (error) {
      onError?.(error);
    }
  };
}
