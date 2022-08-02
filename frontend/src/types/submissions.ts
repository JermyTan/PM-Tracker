import { z, ZodDiscriminatedUnionOption } from "zod";
import {
  CREATOR,
  DESCRIPTION,
  EDITOR,
  FORM_RESPONSE_DATA,
  GROUP,
  GROUP_ID,
  ID,
  IS_DRAFT,
  MILESTONE,
  MILESTONE_ID,
  NAME,
  RESPONSE,
  SUBMISSION_TYPE,
  TEMPLATE,
  TEMPLATE_ID,
  TYPE,
} from "../constants";
import { BaseData } from "./base";
import { MilestoneData } from "./milestones";
import {
  SubmissionType,
  textFormFieldSchema,
  textAreaFormFieldSchema,
  numericFormFieldSchema,
  mcqFormFieldSchema,
  mrqFormFieldSchema,
  FormFieldType,
  textDisplayFormFieldSchema,
  TextDisplayFormField,
  TemplateData,
} from "./templates";
import { UserData } from "./users";

export const textFormResponseFieldSchema = textFormFieldSchema.extend({
  [RESPONSE]: z.string().trim(),
});

export const textAreaFormResponseFieldSchema = textAreaFormFieldSchema.extend({
  [RESPONSE]: z.string().trim(),
});

export const numericFormResponseFieldSchema = numericFormFieldSchema.extend({
  [RESPONSE]: z.string().trim(),
});

export const mcqFormResponseFieldSchema = mcqFormFieldSchema.extend({
  [RESPONSE]: z.string(),
});

export const mrqFormResponseFieldSchema = mrqFormFieldSchema.extend({
  [RESPONSE]: z.array(z.string()),
});

// NOTE: this list should contain all available form response field schemas
type UnionSchemaType = ZodDiscriminatedUnionOption<typeof TYPE, FormFieldType>;
const allFormResponseFieldSchemas: [
  UnionSchemaType,
  UnionSchemaType,
  ...UnionSchemaType[],
] = [
  textFormResponseFieldSchema,
  textAreaFormResponseFieldSchema,
  numericFormResponseFieldSchema,
  mcqFormResponseFieldSchema,
  mrqFormResponseFieldSchema,
  textDisplayFormFieldSchema,
];

export const formResponseFieldSchema = z.discriminatedUnion(
  TYPE,
  allFormResponseFieldSchemas,
);

export type TextFormResponseField = z.infer<typeof textFormResponseFieldSchema>;

export type TextAreaFormResponseField = z.infer<
  typeof textAreaFormResponseFieldSchema
>;

export type NumericFormResponseField = z.infer<
  typeof numericFormResponseFieldSchema
>;

export type McqFormResponseField = z.infer<typeof mcqFormResponseFieldSchema>;

export type MrqFormResponseField = z.infer<typeof mrqFormResponseFieldSchema>;

// NOTE: need to add the new type to discriminated union type below if there is any new type
export type FormResponseField =
  | TextFormResponseField
  | TextAreaFormResponseField
  | NumericFormResponseField
  | McqFormResponseField
  | MrqFormResponseField
  | TextDisplayFormField;

export type SubmissionViewData = Partial<BaseData> & {
  [NAME]: string;
  [DESCRIPTION]: string;
  [IS_DRAFT]: boolean;
  [SUBMISSION_TYPE]: SubmissionType;
  [CREATOR]: UserData | null;
  [EDITOR]: UserData | null;
  [MILESTONE]: Pick<MilestoneData, typeof ID | typeof NAME> | null;
  [GROUP]: null; // TODO: update to GroupData | null
  [TEMPLATE]: TemplateData | null;
  [FORM_RESPONSE_DATA]: FormResponseField[];
};

export type SubmissionPutData = Pick<
  SubmissionViewData,
  | typeof NAME
  | typeof DESCRIPTION
  | typeof SUBMISSION_TYPE
  | typeof IS_DRAFT
  | typeof FORM_RESPONSE_DATA
> & {
  [GROUP_ID]: string | number | null;
};

export type SubmissionPostData = SubmissionPutData & {
  [MILESTONE_ID]: string | number;
  [TEMPLATE_ID]: string | number;
};

export type SubmissionSummaryData = BaseData &
  Pick<
    SubmissionViewData,
    | typeof NAME
    | typeof DESCRIPTION
    | typeof IS_DRAFT
    | typeof SUBMISSION_TYPE
    | typeof CREATOR
    | typeof EDITOR
    | typeof MILESTONE
    | typeof GROUP
  >;

export type SubmissionData = SubmissionSummaryData &
  Pick<SubmissionViewData, typeof TEMPLATE | typeof FORM_RESPONSE_DATA>;

export function transformTemplateToSubmissionView({
  template,
  overrides,
}: {
  template?: TemplateData;
  overrides?: Partial<SubmissionViewData>;
}) {
  if (!template) {
    return undefined;
  }

  const { name, description, submissionType, formFieldData } = template;
  const submissionView: SubmissionViewData = {
    name,
    description,
    isDraft: false,
    submissionType,
    creator: null,
    editor: null,
    milestone: null,
    group: null,
    template,
    formResponseData: formFieldData.map((formField) => {
      switch (formField.type) {
        case FormFieldType.TextDisplay:
          return formField;
        case FormFieldType.Mrq:
          return { ...formField, response: [] };
        default:
          return { ...formField, response: "" };
      }
    }),
    ...overrides,
  };

  return submissionView;
}
