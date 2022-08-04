import { ScrollArea } from "@mantine/core";
import { FormField, FormFieldType } from "../types/templates";
import CheckboxGroupField from "./checkbox-group-field";
import NumericField from "./numeric-field";
import RadioGroupField from "./radio-group-field";
import TextField from "./text-field";
import TextViewer from "./text-viewer";
import TextareaField from "./textarea-field";

type Props = {
  name: string;
  formField: FormField;
};

function FormFieldRenderer({ name, formField }: Props) {
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
          spacing={40}
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
          spacing={40}
        />
      );
    }
    case FormFieldType.TextDisplay: {
      const { content } = formField;

      return (
        <ScrollArea offsetScrollbars style={{ height: "150px" }}>
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
