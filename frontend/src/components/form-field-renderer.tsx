import { createStyles, ScrollArea } from "@mantine/core";
import { FormField, FormFieldType } from "../types/templates";
import CheckboxGroupField from "./checkbox-group-field";
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
  // TODO: change to autosize when migrated to mantine ui v5
  textDisplay: {
    height: "150px",
  },
});

type Props = {
  name: string;
  formField: FormField;
  readOnly?: boolean;
};

function FormFieldRenderer({ name, formField, readOnly }: Props) {
  const { classes } = useStyles();

  switch (formField.type) {
    case FormFieldType.Text: {
      const { label, description, placeholder, required } = formField;
      return (
        <TextField
          name={name}
          label={
            <TextViewer<"span">
              component="span"
              preserveWhiteSpace
              overflowWrap
              withLinkify
              inherit
            >
              {label}
            </TextViewer>
          }
          description={
            <TextViewer<"span">
              component="span"
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
      const { label, description, placeholder, required, hasFeedback } =
        formField;
      return (
        <TextareaField
          name={name}
          label={
            <TextViewer<"span">
              component="span"
              preserveWhiteSpace
              overflowWrap
              withLinkify
              inherit
            >
              {label}
            </TextViewer>
          }
          description={
            <TextViewer<"span">
              component="span"
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
            <TextViewer<"span">
              component="span"
              preserveWhiteSpace
              overflowWrap
              withLinkify
              inherit
            >
              {label}
            </TextViewer>
          }
          description={
            <TextViewer<"span">
              component="span"
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
            <TextViewer<"span">
              component="span"
              preserveWhiteSpace
              overflowWrap
              withLinkify
              inherit
            >
              {label}
            </TextViewer>
          }
          description={
            <TextViewer<"span">
              component="span"
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
            <TextViewer<"span">
              component="span"
              preserveWhiteSpace
              overflowWrap
              withLinkify
              inherit
            >
              {label}
            </TextViewer>
          }
          description={
            <TextViewer<"span">
              component="span"
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
        <ScrollArea
          offsetScrollbars
          className={classes.textDisplay}
          type="auto"
        >
          <TextViewer preserveWhiteSpace overflowWrap>
            {content}
          </TextViewer>
        </ScrollArea>
      );
    }
    default:
      return null;
  }
}

export default FormFieldRenderer;
