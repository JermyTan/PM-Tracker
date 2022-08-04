import {
  CONTENT,
  COMMENTER,
  ROLE,
  IS_DELETED,
  FIELD_INDEX,
} from "../constants";
import { BaseData } from "./base";
import { Role } from "./courses";
import { UserData } from "./users";

export type SubmissionFieldComment = BaseData & {
  [CONTENT]: string;
  [COMMENTER]: UserData;
  [ROLE]: Role;
  [IS_DELETED]: boolean;
  [FIELD_INDEX]: number;
};

export type SubmissionCommentsData = SubmissionFieldComment[];

export type SubmissionFieldCommentPostPatchData = {
  [CONTENT]: string;
};
