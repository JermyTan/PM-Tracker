import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Group, Stack } from "@mantine/core";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";
import { CONTENT } from "../constants";
import { useResolveError } from "../utils/error-utils";
import { handleSubmitForm } from "../utils/form-utils";
import TextField from "./text-field";

const schema = z.object({
  [CONTENT]: z
    .string()
    .trim()
    .min(1, "Please ensure that the comment is not blank."),
});

export type CommentCreateOrUpdateData = z.infer<typeof schema>;

type Props = {
  onSuccess?: () => void;
  defaultValue: string;
  onSubmit?: (data: CommentCreateOrUpdateData) => Promise<void>;
  confirmButtonName: string;
  showCancelButton: boolean;
};

function CommentEditForm({
  onSuccess,
  defaultValue,
  onSubmit,
  confirmButtonName,
  showCancelButton,
}: Props) {
  const methods = useForm<CommentCreateOrUpdateData>({
    resolver: zodResolver(schema),
    defaultValues: { [CONTENT]: defaultValue },
  });

  const { resolveError } = useResolveError({ name: "comment-edit-form" });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const processData = async (formData: CommentCreateOrUpdateData) => {
    if (isSubmitting) {
      return;
    }

    const parsedData = schema.parse(formData);

    await onSubmit?.(parsedData);

    onSuccess?.();
  };

  return (
    <FormProvider {...methods}>
      <form
        autoComplete="off"
        onSubmit={handleSubmitForm(handleSubmit(processData), resolveError)}
      >
        <Stack>
          <TextField name={CONTENT} />
          <Group position="right">
            {showCancelButton && (
              <Button color="gray" onClick={onSuccess}>
                Cancel
              </Button>
            )}
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
