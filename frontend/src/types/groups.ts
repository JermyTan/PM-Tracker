import {
  NAME,
  MEMBER_COUNT,
  MEMBERS,
  ACTION,
  PAYLOAD,
  USER_ID,
  USER_IDS,
} from "../constants";
import { BaseData } from "./base";
import { UserData } from "./users";

export type GroupSummary = BaseData & {
  [NAME]: string;
  [MEMBER_COUNT]: number;
};

export type GroupData = GroupSummary & {
  [MEMBERS]: UserData[];
};

export type GroupPostData = {
  [NAME]: string;
};

export type JoinOrLeaveGroupData = {
  [PAYLOAD]: {
    [USER_ID]: number | null;
  };
};

export type RenameGroupData = {
  [PAYLOAD]: {
    [NAME]: string;
  };
};

export type BatchUpdateGroupData = {
  [PAYLOAD]: {
    [USER_IDS]: number[] | string[];
  };
};

export type GroupPatchData = {
  [ACTION]: GroupPatchAction;
} & (JoinOrLeaveGroupData | RenameGroupData | BatchUpdateGroupData);

export enum GroupPatchAction {
  Join = "JOIN",
  Leave = "LEAVE",
  Modify = "MODIFY",
  Add = "ADD",
  Remove = "REMOVE",
  UpdateMembers = "UPDATE_MEMBERS",
}
