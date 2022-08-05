import { z, ZodDiscriminatedUnionOption } from "zod";
import { MdPerson, MdPeopleAlt, MdOutlinePeopleAlt } from "react-icons/md";
import {
  CHOICES,
  CONTENT,
  DESCRIPTION,
  FORM_FIELD_DATA,
  HAS_FEEDBACK,
  IS_PUBLISHED,
  LABEL,
  NAME,
  PLACEHOLDER,
  REQUIRED,
  SUBMISSION_TYPE,
  TYPE,
} from "../constants";
import { isStringOrArray, sanitizeArray } from "../utils/transform-utils";
import { BaseData } from "./base";

export enum SubmissionType {
  Individual = "INDIVIDUAL",
  Group = "GROUP",
  IndividualGroup = "INDIVIDUAL/GROUP",
}

export const submissionTypeToPropertiesMap = {
  [SubmissionType.Individual]: { label: "Individual", Icon: MdPerson },
  [SubmissionType.Group]: { label: "Group", Icon: MdPeopleAlt },
  [SubmissionType.IndividualGroup]: {
    label: "Individual/Group",
    Icon: MdOutlinePeopleAlt,
  },
};

export enum FormFieldType {
  Text = "TEXT",
  TextArea = "TEXT_AREA",
  Numeric = "NUMERIC",
  Mcq = "MCQ",
  Mrq = "MRQ",
  TextDisplay = "TEXT_DISPLAY",
}

export const superFormFieldSchema = z.object({
  [LABEL]: z.string().trim().min(1, "Please enter a question/label"),
  [DESCRIPTION]: z.string().trim(),
  [PLACEHOLDER]: z.string().trim(),
  [REQUIRED]: z.boolean(),
  [HAS_FEEDBACK]: z.boolean(),
  [CHOICES]: z.preprocess(
    (input) =>
      isStringOrArray(input)
        ? sanitizeArray(
            typeof input === "string"
              ? input.split("\n")
              : input.map((v) => `${v}`),
            { unique: false },
          )
        : [],
    z
      .array(z.string().trim().min(1, "Please enter a value"))
      .nonempty("Please enter at least 1 choice"),
  ),
  [CONTENT]: z.string().trim().min(1, "Content cannot be empty"),
});

export const textFormFieldSchema = superFormFieldSchema
  .pick({
    label: true,
    description: true,
    placeholder: true,
    required: true,
  })
  .extend({
    [TYPE]: z.literal(FormFieldType.Text),
  });

export const textAreaFormFieldSchema = superFormFieldSchema
  .pick({
    label: true,
    description: true,
    placeholder: true,
    required: true,
    hasFeedback: true,
  })
  .extend({
    [TYPE]: z.literal(FormFieldType.TextArea),
  });

export const numericFormFieldSchema = superFormFieldSchema
  .pick({
    label: true,
    description: true,
    placeholder: true,
    required: true,
  })
  .extend({
    [TYPE]: z.literal(FormFieldType.Numeric),
  });

export const mcqFormFieldSchema = superFormFieldSchema
  .pick({
    label: true,
    description: true,
    required: true,
    choices: true,
  })
  .extend({
    [TYPE]: z.literal(FormFieldType.Mcq),
  });

export const mrqFormFieldSchema = superFormFieldSchema
  .pick({
    label: true,
    description: true,
    required: true,
    choices: true,
  })
  .extend({
    [TYPE]: z.literal(FormFieldType.Mrq),
  });

export const textDisplayFormFieldSchema = superFormFieldSchema
  .pick({
    content: true,
  })
  .extend({
    [TYPE]: z.literal(FormFieldType.TextDisplay),
  });

// NOTE: this list should contain all available form field schemas
type UnionSchemaType = ZodDiscriminatedUnionOption<typeof TYPE, FormFieldType>;
const allFormFieldSchemas: [
  UnionSchemaType,
  UnionSchemaType,
  ...UnionSchemaType[],
] = [
  textFormFieldSchema,
  textAreaFormFieldSchema,
  numericFormFieldSchema,
  mcqFormFieldSchema,
  mrqFormFieldSchema,
  textDisplayFormFieldSchema,
];

export const formFieldSchema = z.discriminatedUnion(TYPE, allFormFieldSchemas);

export const fieldToFieldTypeMap = allFormFieldSchemas.reduce((map, schema) => {
  const formFieldType = schema.shape.type.value;

  (schema.keyof().options as string[]).forEach((key) => {
    if (key === TYPE) {
      return;
    }

    if (!map.has(key)) {
      map.set(key, new Set());
    }

    map.get(key)?.add(formFieldType);
  });

  return map;
}, new Map<string, Set<FormFieldType>>());

export type TextFormField = z.infer<typeof textFormFieldSchema>;

export type TextAreaFormField = z.infer<typeof textAreaFormFieldSchema>;

export type NumericFormField = z.infer<typeof numericFormFieldSchema>;

export type McqFormField = z.infer<typeof mcqFormFieldSchema>;

export type MrqFormField = z.infer<typeof mrqFormFieldSchema>;

export type TextDisplayFormField = z.infer<typeof textDisplayFormFieldSchema>;

// NOTE: need to add the new type to discriminated union type below if there is any new type
export type FormField =
  | TextFormField
  | TextAreaFormField
  | NumericFormField
  | McqFormField
  | MrqFormField
  | TextDisplayFormField;

export type TemplatePostData = {
  [NAME]: string;
  [DESCRIPTION]: string;
  [SUBMISSION_TYPE]: SubmissionType;
  [IS_PUBLISHED]: boolean;
  [FORM_FIELD_DATA]: [FormField, ...FormField[]];
};

export type TemplatePutData = TemplatePostData;

export type TemplateData = BaseData & TemplatePostData;

export const DEFAULT_FORM_FIELD: FormField = {
  type: FormFieldType.Text,
  label: "",
  description: "",
  placeholder: "",
  required: false,
};
