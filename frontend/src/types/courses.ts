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

// Matches a user's role in a course to the set of roles which the
// user can add/remove to a course group
export const editableRoleMap = new Map<Role | undefined, Set<Role>>([
  [Role.Student, new Set<Role>([Role.Student])],
  [Role.Instructor, new Set<Role>([Role.Student, Role.Instructor])],
  [Role.CoOwner, new Set<Role>([Role.Student, Role.Instructor, Role.CoOwner])],
]);

export type CourseSummaryData = BaseData & {
  [NAME]: string;
  [OWNER]: UserData;
  [DESCRIPTION]: string;
  [IS_PUBLISHED]: boolean;
  [ROLE]: Role;
};

type CourseSettings = {
  [SHOW_GROUP_MEMBERS_NAMES]: boolean;
  [ALLOW_STUDENTS_TO_CREATE_GROUPS]: boolean;
  [ALLOW_STUDENTS_TO_DELETE_GROUPS]: boolean;
  [ALLOW_STUDENTS_TO_JOIN_GROUPS]: boolean;
  [ALLOW_STUDENTS_TO_LEAVE_GROUPS]: boolean;
  [ALLOW_STUDENTS_TO_MODIFY_GROUP_NAME]: boolean;
  [ALLOW_STUDENTS_TO_ADD_OR_REMOVE_GROUP_MEMBERS]: boolean;
  [MILESTONE_ALIAS]: string;
};

export type CourseData = CourseSummaryData & CourseSettings;

export type CoursePostData = Pick<
  CourseSummaryData,
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
