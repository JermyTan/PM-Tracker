import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Group, Stack } from "@mantine/core";
import { FormProvider, useForm, UseFormReset } from "react-hook-form";
import { z } from "zod";
import { CONTENT } from "../constants";
import { useResolveError } from "../utils/error-utils";
import { handleSubmitForm } from "../utils/form-utils";
import TextareaField from "./textarea-field";

const schema = z.object({
  [CONTENT]: z
    .string()
    .trim()
    .min(1, "Please ensure that the comment is not blank."),
});

export type CommentFormData = z.infer<typeof schema>;

type Props = {
  onSuccess?: () => void;
  defaultValue: string;
  onSubmit?: (
    data: CommentFormData,
    reset: UseFormReset<CommentFormData>,
  ) => Promise<void>;
  confirmButtonName: string;
};

function CommentEditForm({ defaultValue, onSubmit, confirmButtonName }: Props) {
  const methods = useForm<CommentFormData>({
    resolver: zodResolver(schema),
    defaultValues: { [CONTENT]: defaultValue },
  });

  const { resolveError } = useResolveError({ name: "comment-edit-form" });

  const {
    handleSubmit,
    formState: { isSubmitting },
    reset,
  } = methods;

  const processData = async (formData: CommentFormData) => {
    if (isSubmitting) {
      return;
    }

    const parsedData = schema.parse(formData);

    await onSubmit?.(parsedData, reset);
  };

  return (
    <FormProvider {...methods}>
      <form
        autoComplete="off"
        onSubmit={handleSubmitForm(handleSubmit(processData), resolveError)}
      >
        <Stack>
          <TextareaField name={CONTENT} />
          <Group position="right">
            <Button
              type="submit"
              disabled={isSubmitting}
              loading={isSubmitting}
            >
              {confirmButtonName}
            </Button>
          </Group>
        </Stack>
      </form>
    </FormProvider>
  );
}

export default CommentEditForm;
