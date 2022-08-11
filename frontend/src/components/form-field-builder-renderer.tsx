import { Text, Stack, Group } from "@mantine/core";
import {
  CHOICES,
  CONTENT,
  DESCRIPTION,
  HAS_FEEDBACK,
  LABEL,
  PLACEHOLDER,
  REQUIRED,
} from "../constants";
import {
  fieldToFieldTypeMap,
  FormFieldType,
  superFormFieldSchema,
} from "../types/templates";
import FormFieldBuilderChoicesRenderer from "./form-field-builder-choices-renderer";
import SwitchField from "./switch-field";
import TextField from "./text-field";
import TextareaField from "./textarea-field";

type Props = {
  formFieldType: FormFieldType;
  builderName: string;
};

const FIELD_OPTIONS = superFormFieldSchema.keyof().options;

function FormFieldBuilderRenderer({ formFieldType, builderName }: Props) {
  const getBuilderField = (field: typeof FIELD_OPTIONS[number]) => {
    switch (field) {
      case LABEL: {
        const labelFieldName = `${builderName}.${LABEL}`;

        return (
          <TextareaField
            key={labelFieldName}
            name={labelFieldName}
            label="Question/Label"
            required
          />
        );
      }

      case CONTENT: {
        const contentFieldName = `${builderName}.${CONTENT}`;

        return (
          <TextareaField
            key={contentFieldName}
            name={contentFieldName}
            label="Content"
            required
          />
        );
      }

      case DESCRIPTION: {
        const descriptionFieldName = `${builderName}.${DESCRIPTION}`;

        return (
          <TextareaField
            key={descriptionFieldName}
            name={descriptionFieldName}
            label="Additional description"
          />
        );
      }

      case PLACEHOLDER: {
        const PlaceholderComponent =
          formFieldType === FormFieldType.TextArea ? TextareaField : TextField;
        const placeholderFieldName = `${builderName}.${PLACEHOLDER}`;

        return (
          <PlaceholderComponent
            key={placeholderFieldName}
            name={placeholderFieldName}
            label="Placeholder"
          />
        );
      }

      case CHOICES: {
        const choicesFieldName = `${builderName}.${CHOICES}`;

        return (
          <Group key={choicesFieldName} noWrap grow align="flex-start">
            <TextareaField
              name={choicesFieldName}
              label="Choices"
              required
              description="Start each choice on a new line."
            />

            <FormFieldBuilderChoicesRenderer
              size="sm"
              name={choicesFieldName}
              withPadding
              mt={56}
              spacing={1}
            />
          </Group>
        );
      }

      case REQUIRED: {
        const requiredFieldName = `${builderName}.${REQUIRED}`;

        return (
          <SwitchField
            key={requiredFieldName}
            name={requiredFieldName}
            label={<Text size="sm">Required</Text>}
          />
        );
      }

      case HAS_FEEDBACK: {
        const hasFeedbackFieldName = `${builderName}.${HAS_FEEDBACK}`;

        return (
          <SwitchField
            key={hasFeedbackFieldName}
            name={hasFeedbackFieldName}
            label={<Text size="sm">Enable feedback</Text>}
          />
        );
      }

      default:
        return null;
    }
  };

  return (
    <Stack>
      {FIELD_OPTIONS.flatMap((field) => {
        if (!fieldToFieldTypeMap.get(field)?.has(formFieldType)) {
          return [];
        }

        const builderField = getBuilderField(field);

        return builderField !== null ? [builderField] : [];
      })}
    </Stack>
  );
}

export default FormFieldBuilderRenderer;
