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

export type CommentData = z.infer<typeof schema>;

type Props = {
  onSuccess?: () => void;
  defaultValue: string;
  onSubmit?: (data: CommentData) => Promise<void>;
  confirmButtonName: string;
};

function CommentEditForm({
  onSuccess,
  defaultValue,
  onSubmit,
  confirmButtonName,
}: Props) {
  const methods = useForm<CommentData>({
    resolver: zodResolver(schema),
    defaultValues: { [CONTENT]: defaultValue },
  });

  const resolveError = useResolveError();

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const processData = async (formData: CommentData) => {
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
          <TextField name={CONTENT} description="Comment content" />
          <Group position="right">
            <Button color="gray" onClick={onSuccess}>
              Cancel
            </Button>
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
