import { NAME, MEMBER_COUNT, MEMBERS } from "../constants";
import { BaseData } from "./base";
import { UserData } from "./users";

export type GroupSummaryView = BaseData & {
  [NAME]: string;
  [MEMBER_COUNT]: number;
  [MEMBERS]: UserData[];
};
