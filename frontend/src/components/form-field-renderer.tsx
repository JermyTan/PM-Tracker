import { createStyles, Group, ScrollArea, Stack } from "@mantine/core";
import { FormField, FormFieldType } from "../types/templates";
import CheckboxGroupField from "./checkbox-group-field";
import FormFieldCommentButton from "./form-field-comment-button";
import FormFieldFeedbackRenderer from "./form-field-feedback-renderer";
import NumericField from "./numeric-field";
import RadioGroupField from "./radio-group-field";
import TextField from "./text-field";
import TextViewer from "./text-viewer";
import TextareaField from "./textarea-field";

const useStyles = createStyles({
  // NOTE: currently there is no way to access the container for checkbox and radio options
  // use this hack for now
  optionsContainer: {
    "> .mantine-Group-root": {
      columnGap: "40px",
    },
  },
});

type Props = {
  name: string;
  formField: FormField;
  index: number;
  readOnly?: boolean;
  withComments?: boolean;
};

function FormFieldRenderer({
  name,
  formField,
  index,
  readOnly,
  withComments,
}: Props) {
  const { classes } = useStyles();

  const mainComponent = (() => {
    switch (formField.type) {
      case FormFieldType.Text: {
        const { label, description, placeholder, required } = formField;
        return (
          <TextField
            name={name}
            label={
              <TextViewer
                span
                preserveWhiteSpace
                overflowWrap
                withLinkify
                inherit
              >
                {label}
              </TextViewer>
            }
            description={
              <TextViewer
                span
                preserveWhiteSpace
                overflowWrap
                withLinkify
                inherit
              >
                {description}
              </TextViewer>
            }
            placeholder={placeholder}
            required={required}
            readOnly={readOnly}
          />
        );
      }
      case FormFieldType.TextArea: {
        const { label, description, placeholder, required } = formField;
        return (
          <TextareaField
            name={name}
            label={
              <TextViewer
                span
                preserveWhiteSpace
                overflowWrap
                withLinkify
                inherit
              >
                {label}
              </TextViewer>
            }
            description={
              <TextViewer
                span
                preserveWhiteSpace
                overflowWrap
                withLinkify
                inherit
              >
                {description}
              </TextViewer>
            }
            placeholder={placeholder}
            required={required}
            minRows={5}
            maxRows={20}
            readOnly={readOnly}
          />
        );
      }
      case FormFieldType.Numeric: {
        const { label, description, placeholder, required } = formField;
        return (
          <NumericField
            name={name}
            label={
              <TextViewer
                span
                preserveWhiteSpace
                overflowWrap
                withLinkify
                inherit
              >
                {label}
              </TextViewer>
            }
            description={
              <TextViewer
                span
                preserveWhiteSpace
                overflowWrap
                withLinkify
                inherit
              >
                {description}
              </TextViewer>
            }
            placeholder={placeholder}
            required={required}
            hideControls
            readOnly={readOnly}
          />
        );
      }
      case FormFieldType.Mcq: {
        const { label, description, required, choices } = formField;

        return (
          <RadioGroupField
            name={name}
            label={
              <TextViewer
                span
                preserveWhiteSpace
                overflowWrap
                withLinkify
                inherit
              >
                {label}
              </TextViewer>
            }
            description={
              <TextViewer
                span
                preserveWhiteSpace
                overflowWrap
                withLinkify
                inherit
              >
                {description}
              </TextViewer>
            }
            required={required}
            choices={choices}
            className={classes.optionsContainer}
            readOnly={readOnly}
          />
        );
      }
      case FormFieldType.Mrq: {
        const { label, description, required, choices } = formField;

        return (
          <CheckboxGroupField
            name={name}
            label={
              <TextViewer
                span
                preserveWhiteSpace
                overflowWrap
                withLinkify
                inherit
              >
                {label}
              </TextViewer>
            }
            description={
              <TextViewer
                span
                preserveWhiteSpace
                overflowWrap
                withLinkify
                inherit
              >
                {description}
              </TextViewer>
            }
            required={required}
            choices={choices}
            className={classes.optionsContainer}
            readOnly={readOnly}
          />
        );
      }
      case FormFieldType.TextDisplay: {
        const { content } = formField;

        return (
          <ScrollArea.Autosize
            offsetScrollbars
            maxHeight="200px"
            type="auto"
            scrollbarSize={8}
          >
            <TextViewer size="sm" preserveWhiteSpace overflowWrap withLinkify>
              {content}
            </TextViewer>
          </ScrollArea.Autosize>
        );
      }
      default:
        return null;
    }
  })();

  const metaComponent = (() => {
    if (formField.type !== FormFieldType.TextArea || !formField.hasFeedback) {
      return null;
    }

    return <FormFieldFeedbackRenderer name={name} />;
  })();

  return mainComponent ? (
    <Stack spacing={8}>
      {mainComponent}
      {withComments && (
        <Group position="right">
          <FormFieldCommentButton fieldIndex={index} />
        </Group>
      )}
      {metaComponent}
    </Stack>
  ) : null;
}

export default FormFieldRenderer;
