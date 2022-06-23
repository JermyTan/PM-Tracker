import {
  NAME,
  OWNER,
  DESCRIPTION,
  IS_PUBLISHED,
  SHOW_GROUP_MEMBERS_NAMES,
  ALLOW_STUDENTS_TO_CREATE_GROUPS,
  ALLOW_STUDENTS_TO_DELETE_GROUPS,
  ALLOW_STUDENTS_TO_JOIN_GROUPS,
  ALLOW_STUDENTS_TO_LEAVE_GROUPS,
  ALLOW_STUDENTS_TO_MODIFY_GROUP_NAME,
  ALLOW_STUDENTS_TO_ADD_OR_REMOVE_GROUP_MEMBERS,
  MILESTONE_ALIAS,
  ROLE,
  OWNER_ID,
  USER,
} from "../constants";
import { BaseData } from "./base";
import { UserData } from "./users";

export enum Role {
  CoOwner = "CO-OWNER",
  Instructor = "INSTRUCTOR",
  Student = "STUDENT",
}

export const roles = Object.values(Role);

export type CourseSummary = BaseData & {
  [NAME]: string;
  [OWNER]: UserData;
  [DESCRIPTION]: string;
  [IS_PUBLISHED]: boolean;
  [ROLE]: Role;
};

export type CourseSettings = {
  [SHOW_GROUP_MEMBERS_NAMES]: boolean;
  [ALLOW_STUDENTS_TO_CREATE_GROUPS]: boolean;
  [ALLOW_STUDENTS_TO_DELETE_GROUPS]: boolean;
  [ALLOW_STUDENTS_TO_JOIN_GROUPS]: boolean;
  [ALLOW_STUDENTS_TO_LEAVE_GROUPS]: boolean;
  [ALLOW_STUDENTS_TO_MODIFY_GROUP_NAME]: boolean;
  [ALLOW_STUDENTS_TO_ADD_OR_REMOVE_GROUP_MEMBERS]: boolean;
  [MILESTONE_ALIAS]: string;
};

export type Course = CourseSummary & CourseSettings;

export type CoursePostData = Pick<
  CourseSummary,
  typeof NAME | typeof DESCRIPTION | typeof IS_PUBLISHED
> &
  CourseSettings;

export type CoursePutData = CoursePostData & {
  [OWNER_ID]?: number;
};

export type CourseMemberData = BaseData & {
  [ROLE]: Role;
  [USER]: UserData;
};

export type CourseMembershipPatchData = {
  [ROLE]: Role;
};
