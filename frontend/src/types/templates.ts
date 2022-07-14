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
import { BaseData } from "./base";

export enum SubmissionType {
  Individual = "INDIVIDUAL",
  Group = "GROUP",
  IndividualGroup = "INDIVIDUAL/GROUP",
}

export enum FormFieldType {
  Text = "TEXT",
  TextArea = "TEXT_AREA",
  Numeric = "NUMERIC",
  Mcq = "MCQ",
  Mrq = "MRQ",
  TextDisplay = "TEXT_DISPLAY",
}

export type TextFormField = {
  [TYPE]: FormFieldType.Text;
  [LABEL]: string;
  [DESCRIPTION]: string;
  [PLACEHOLDER]: string;
  [REQUIRED]: boolean;
};

export type TextAreaFormField = {
  [TYPE]: FormFieldType.TextArea;
  [LABEL]: string;
  [DESCRIPTION]: string;
  [PLACEHOLDER]: string;
  [REQUIRED]: boolean;
  [HAS_FEEDBACK]: boolean;
};

export type NumericFormField = {
  [TYPE]: FormFieldType.Numeric;
  [LABEL]: string;
  [DESCRIPTION]: string;
  [PLACEHOLDER]: string;
  [REQUIRED]: boolean;
};

export type McqFormField = {
  [TYPE]: FormFieldType.Mcq;
  [LABEL]: string;
  [DESCRIPTION]: string;
  [REQUIRED]: boolean;
  [CHOICES]: string[];
};

export type MrqFormField = {
  [TYPE]: FormFieldType.Mrq;
  [LABEL]: string;
  [DESCRIPTION]: string;
  [REQUIRED]: boolean;
  [CHOICES]: string[];
};

export type TextDisplayFormField = {
  [TYPE]: FormFieldType.TextDisplay;
  [CONTENT]: string;
};

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
  [FORM_FIELD_DATA]: FormField[];
};

export type TemplatePutData = TemplatePostData;

export type TemplateData = BaseData & TemplatePostData;
