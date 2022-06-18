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

export type GroupSummaryView = BaseData & {
  [NAME]: string;
  [MEMBER_COUNT]: number;
  [MEMBERS]: UserData[];
};

export type GroupPutData = {
  [ACTION]: string;
  [PAYLOAD]: {
    [USER_ID]?: number;
  };
};
