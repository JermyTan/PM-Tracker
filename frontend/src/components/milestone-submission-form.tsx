import { forwardRef, Ref, useImperativeHandle } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Stack, Title, Text, Button, Group, Alert } from "@mantine/core";
import { GoDashboard } from "react-icons/go";
import {
  FormProvider,
  useFieldArray,
  useForm,
  UseFormReset,
} from "react-hook-form";
import {
  FORM_RESPONSE_DATA,
  GROUP,
  IS_DRAFT,
  RESPONSE,
  SUBMISSION_TYPE,
} from "../constants";
import {
  formResponseFieldSchema,
  SubmissionViewData,
} from "../types/submissions";
import { FormField, SubmissionType } from "../types/templates";
import { useResolveError } from "../utils/error-utils";
import { handleSubmitForm } from "../utils/form-utils";
import SubmissionTypeIconLabel from "./submission-type-icon-label";
import FormFieldRenderer from "./form-field-renderer";
import TextViewer from "./text-viewer";
import toastUtils from "../utils/toast-utils";

const schema = z.object({
  [IS_DRAFT]: z.boolean(),
  [SUBMISSION_TYPE]: z.nativeEnum(SubmissionType),
  [GROUP]: z.null(), // TODO: update to GroupData
  [FORM_RESPONSE_DATA]: z.array(formResponseFieldSchema),
});

type SubmissionFormProps = z.infer<typeof schema>;

type MilestoneSubmissionFormHandler = {
  reset: UseFormReset<SubmissionFormProps>;
};

type Props = {
  defaultValues: SubmissionViewData;
  readOnly?: boolean;
  testMode?: boolean;
};

function MilestoneSubmissionForm(
  { defaultValues, readOnly, testMode }: Props,
  ref: Ref<MilestoneSubmissionFormHandler>,
) {
  const methods = useForm<SubmissionFormProps>({
    resolver: zodResolver(schema),
    defaultValues,
  });
  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = methods;
  useImperativeHandle(ref, () => ({ reset }), [reset]);

  const { fields } = useFieldArray({
    control,
    name: FORM_RESPONSE_DATA,
  });

  const { resolveError } = useResolveError({
    name: "milestone-submission-form",
  });

  const {
    createdAt,
    updatedAt,
    name,
    description,
    submissionType,
    creator,
    editor,
    milestone,
  } = defaultValues;

  const onSubmit = () => {
    if (testMode) {
      console.log("test");
      toastUtils.info({
        title: "Test Mode",
        message: "Form inputs are successfully validated and can be submitted.",
      });
      return;
    }

    if (isSubmitting) {
      return;
    }

    console.log("attempting to submit");
  };

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={handleSubmitForm(handleSubmit(onSubmit), resolveError)}
        autoComplete="off"
      >
        <Stack spacing={32}>
          <Stack>
            {testMode && (
              <Alert
                p="xs"
                color="orange"
                icon={<GoDashboard />}
                title="Test Mode"
              >
                This form is in test mode. You can test this form by filling in
                the form fields. Validations, such as checking non-empty inputs
                for required fields, will be run. No actual submission will be
                made in test mode.
              </Alert>
            )}

            <Stack spacing={2}>
              <Title order={4}>
                <TextViewer inherit overflowWrap>
                  {name}
                </TextViewer>
              </Title>
              <Text size="sm" color="dimmed">
                <SubmissionTypeIconLabel submissionType={submissionType} />
              </Text>
              <Text size="sm">{description}</Text>
            </Stack>
          </Stack>

          {fields.map(({ id, ...field }, index) => (
            <FormFieldRenderer
              key={id}
              name={`${FORM_RESPONSE_DATA}.${index}.${RESPONSE}`}
              formField={field as FormField}
              readOnly={readOnly}
            />
          ))}

          <Group position="right">
            <Button
              disabled={isSubmitting}
              loading={isSubmitting}
              type="submit"
            >
              Save
            </Button>
          </Group>
        </Stack>
      </form>
    </FormProvider>
  );
}

export default forwardRef(MilestoneSubmissionForm);
