import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Stack, Title, Text } from "@mantine/core";
import { FormProvider, useFieldArray, useForm } from "react-hook-form";
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

const schema = z.object({
  [IS_DRAFT]: z.boolean(),
  [SUBMISSION_TYPE]: z.nativeEnum(SubmissionType),
  [GROUP]: z.null(), // TODO: update to GroupData
  [FORM_RESPONSE_DATA]: z.array(formResponseFieldSchema),
});

type SubmissionFormProps = z.infer<typeof schema>;

type Props = {
  defaultValues: SubmissionViewData;
  readOnly?: boolean;
};

function MilestoneSubmissionForm({ defaultValues, readOnly }: Props) {
  const methods = useForm<SubmissionFormProps>({
    resolver: zodResolver(schema),
    defaultValues,
  });
  const { control, handleSubmit } = methods;
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

  const onSubmit = () => {};

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={handleSubmitForm(handleSubmit(onSubmit), resolveError)}
        autoComplete="off"
      >
        <Stack spacing={32}>
          <Stack spacing={2}>
            <Title order={4}>{name}</Title>
            <Text size="sm" color="dimmed">
              <SubmissionTypeIconLabel submissionType={submissionType} />
            </Text>
            <Text size="sm">{description}</Text>
          </Stack>

          {fields.map(({ id, ...field }, index) => (
            <FormFieldRenderer
              key={id}
              name={`${FORM_RESPONSE_DATA}.${index}.${RESPONSE}`}
              formField={field as FormField}
            />
          ))}
        </Stack>
      </form>
    </FormProvider>
  );
}

export default MilestoneSubmissionForm;
