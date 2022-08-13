import { forwardRef, Ref, useImperativeHandle } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { ActionIcon, createStyles, Group } from "@mantine/core";
import { MdCheck, MdSend } from "react-icons/md";
import { FormProvider, useForm, UseFormReset } from "react-hook-form";
import { z } from "zod";
import { CONTENT } from "../constants";
import { useResolveError } from "../utils/error-utils";
import { handleSubmitForm } from "../utils/form-utils";
import TextareaField from "./textarea-field";

const useStyles = createStyles({
  buttonContainer: {
    paddingTop: "8px",
    paddingBottom: "8px",
    alignItems: "flex-end",
  },
});

const schema = z.object({
  [CONTENT]: z.string().trim().min(1, "Comment cannot be empty"),
});

type CommentFormProps = z.infer<typeof schema>;

export type CommentFormData = CommentFormProps;

type CommentFormHandler = {
  reset: UseFormReset<CommentFormProps>;
};

const DEFAULT_VALUES: CommentFormProps = {
  content: "",
};

type Props = {
  defaultValues?: CommentFormProps;
  onSubmit?: (formData: CommentFormData) => Promise<unknown>;
  type: "new" | "existing";
};

function CommentForm(
  { defaultValues = DEFAULT_VALUES, onSubmit: handleOnSubmit, type }: Props,
  ref: Ref<CommentFormHandler>,
) {
  const { classes } = useStyles();
  const methods = useForm<CommentFormData>({
    resolver: zodResolver(schema),
    defaultValues,
  });
  const {
    handleSubmit,
    formState: { isSubmitting },
    reset,
  } = methods;
  useImperativeHandle(ref, () => ({ reset }), [reset]);
  const { resolveError } = useResolveError({ name: "comment-form" });

  const isNew = type === "new";

  const onSubmit = async (formData: CommentFormProps) => {
    if (isSubmitting) {
      return;
    }

    await handleOnSubmit?.(formData);
  };

  return (
    <FormProvider {...methods}>
      <form
        autoComplete="off"
        onSubmit={handleSubmitForm(handleSubmit(onSubmit), resolveError)}
      >
        <Group grow spacing={8}>
          <TextareaField
            name={CONTENT}
            minRows={1}
            maxRows={15}
            classNames={{ rightSection: classes.buttonContainer }}
            rightSection={
              <ActionIcon
                type="submit"
                loading={isSubmitting}
                aria-label={isNew ? "Create comment" : "Save comment"}
                color="blue"
                radius="xl"
                variant={isSubmitting ? "transparent" : "filled"}
                size="md"
              >
                {isNew ? <MdSend size={14} /> : <MdCheck size={14} />}
              </ActionIcon>
            }
          />
        </Group>
      </form>
    </FormProvider>
  );
}

export default forwardRef(CommentForm);
