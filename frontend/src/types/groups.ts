import {
  NAME,
  MEMBER_COUNT,
  MEMBERS,
  ACTION,
  PAYLOAD,
  USER_ID,
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

export type GroupPatchData = {
  [ACTION]: GroupPatchAction;
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

export enum GroupPatchAction {
  Join = "JOIN",
  Leave = "LEAVE",
  Modify = "MODIFY",
  Add = "ADD",
  Remove = "REMOVE",
}
