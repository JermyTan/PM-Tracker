import { forwardRef, useMemo } from "react";
import {
  ButtonProps,
  Group,
  SelectItem,
  Stack,
  Title,
  Text,
  ThemeIcon,
  Tooltip,
  createStyles,
  Button,
} from "@mantine/core";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { FaQuestion } from "react-icons/fa";
import {
  NAME,
  DESCRIPTION,
  IS_PUBLISHED,
  SUBMISSION_TYPE,
  FORM_FIELD_DATA,
  CHOICES,
} from "../constants";
import {
  DEFAULT_FORM_FIELD,
  FormField,
  formFieldSchema,
  SubmissionType,
  submissionTypeToPropertiesMap,
  fieldToFieldTypeMap,
  McqFormField,
  MrqFormField,
} from "../types/templates";
import TextField from "./text-field";
import TextareaField from "./textarea-field";
import SelectField from "./select-field";
import SwitchField from "./switch-field";
import FormFieldBuilderSection from "./form-field-builder-section";
import { handleSubmitForm } from "../utils/form-utils";
import { useResolveError } from "../utils/error-utils";
import SubmissionTypeIconLabel from "./submission-type-icon-label";

const useStyles = createStyles({
  submissionTypeSelect: {
    alignSelf: "flex-start",
  },
});

const schema = z.object({
  [NAME]: z.string().trim().min(1, "Please enter a template name"),
  [DESCRIPTION]: z.string().trim(),
  [SUBMISSION_TYPE]: z.nativeEnum(SubmissionType, {
    errorMap: ({ code }) => ({
      message:
        code === "invalid_enum_value"
          ? "Please select a submission type"
          : "An unknown error has occurred",
    }),
  }),
  [IS_PUBLISHED]: z.boolean(),
  [FORM_FIELD_DATA]: z.array(formFieldSchema).nonempty(),
});

export type MilestoneTemplateFormBuilderData = z.infer<typeof schema>;

type MilestoneTemplateFormBuilderProps = Omit<
  MilestoneTemplateFormBuilderData,
  typeof SUBMISSION_TYPE
> & {
  [SUBMISSION_TYPE]: string;
};

const DEFAULT_VALUES: MilestoneTemplateFormBuilderProps = {
  name: "",
  description: "",
  submissionType: "",
  isPublished: false,
  formFieldData: [DEFAULT_FORM_FIELD],
};

const SUBMISSION_TYPE_OPTIONS: SelectItem[] = Object.values(SubmissionType).map(
  (type) => ({ value: type, label: submissionTypeToPropertiesMap[type].label }),
);

const SelectItemComponent = forwardRef<HTMLDivElement, SelectItem>(
  ({ value, ...others }: SelectItem, ref) => (
    <div ref={ref} {...others}>
      <SubmissionTypeIconLabel submissionType={value as SubmissionType} />
    </div>
  ),
);

type Props = {
  defaultValues?: MilestoneTemplateFormBuilderProps;
  onSubmit: (formData: MilestoneTemplateFormBuilderData) => Promise<unknown>;
  submitButtonProps?: ButtonProps<"button">;
};

function MilestoneTemplateFormBuilder({
  defaultValues = DEFAULT_VALUES,
  onSubmit: handleOnSubmit,
  submitButtonProps,
}: Props) {
  const parsedDefaultValues = useMemo(() => {
    const { formFieldData, ...rest } = defaultValues;
    const typedFormFieldData = formFieldData as [FormField, ...FormField[]];

    return {
      ...rest,
      formFieldData: typedFormFieldData.map((formField) => {
        if (!fieldToFieldTypeMap.get(CHOICES)?.has(formField.type)) {
          return formField;
        }
        const { choices, ...rest } = formField as McqFormField | MrqFormField;

        return {
          ...rest,
          choices: choices.join("\n"),
        };
      }),
    };
  }, [defaultValues]);
  const { classes } = useStyles();
  const methods = useForm<MilestoneTemplateFormBuilderProps>({
    resolver: zodResolver(schema),
    defaultValues: parsedDefaultValues,
  });
  const { resolveError } = useResolveError({
    name: "milestone-template-form-builder",
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async (rawFormData: MilestoneTemplateFormBuilderProps) => {
    if (isSubmitting) {
      return;
    }

    // zodResolver already parses MilestoneTemplateFormBuilderProps to MilestoneTemplateFormBuilderData
    // so it is safe to force typecast
    const formData = rawFormData as MilestoneTemplateFormBuilderData;

    await handleOnSubmit(formData);
  };

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={handleSubmitForm(handleSubmit(onSubmit), resolveError)}
        autoComplete="off"
      >
        <Stack spacing={32}>
          <Stack>
            <Title order={4}>Template Details</Title>

            <TextField name={NAME} label="Name" required />

            <TextareaField name={DESCRIPTION} label="Description" />

            <SelectField
              name={SUBMISSION_TYPE}
              label="Submission type"
              data={SUBMISSION_TYPE_OPTIONS}
              required
              className={classes.submissionTypeSelect}
              itemComponent={SelectItemComponent}
            />

            <Group>
              <Group spacing={4}>
                <Text<"label">
                  size="sm"
                  htmlFor={IS_PUBLISHED}
                  component="label"
                >
                  Publish template
                </Text>
                <Tooltip
                  label={
                    <Text size="xs">
                      Students can view and use this template for submission.
                    </Text>
                  }
                  withArrow
                  placement="start"
                  transition="pop-top-left"
                  transitionDuration={300}
                  wrapLines
                  width={200}
                >
                  <ThemeIcon color="gray" size="xs" radius="xl">
                    <FaQuestion size={7} />
                  </ThemeIcon>
                </Tooltip>
              </Group>
              <SwitchField
                name={IS_PUBLISHED}
                id={IS_PUBLISHED}
                onLabel="Yes"
                offLabel="No"
                size="md"
              />
            </Group>
          </Stack>

          <Stack>
            <div>
              <Title order={4}>Custom Template Fields</Title>
              <Text size="sm" color="dimmed">
                Please set up the fields for this template.
              </Text>
            </div>

            <FormFieldBuilderSection name={FORM_FIELD_DATA} />

            <Group position="right">
              <Button
                {...submitButtonProps}
                type="submit"
                loading={isSubmitting}
                disabled={isSubmitting}
              />
            </Group>
          </Stack>
        </Stack>
      </form>
    </FormProvider>
  );
}

export default MilestoneTemplateFormBuilder;
