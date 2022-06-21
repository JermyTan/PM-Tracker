import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Group, Stack } from "@mantine/core";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";
import { NAME } from "../constants";
import { useResolveError } from "../utils/error-utils";
import { handleSubmitForm } from "../utils/form-utils";
import TextField from "./text-field";

type Props = {
  onSuccess?: () => void;
  defaultValue: string;
  onSubmit?: (data: GroupNameData) => Promise<void>;
  confirmButtonName: string;
};

const schema = z.object({
  [NAME]: z.string().trim().min(1, "Please enter a group name"),
});

export type GroupNameData = z.infer<typeof schema>;

function GroupNameForm({
  onSuccess,
  defaultValue,
  onSubmit,
  confirmButtonName,
}: Props) {
  const methods = useForm<GroupNameData>({
    resolver: zodResolver(schema),
    defaultValues: { [NAME]: defaultValue },
  });
  const resolveError = useResolveError();

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const processData = async (formData: GroupNameData) => {
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
          <TextField name={NAME} description="Group name" />
          <Group>
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

export default GroupNameForm;
