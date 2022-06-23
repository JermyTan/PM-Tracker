import {
  DESCRIPTION,
  END_DATE_TIME,
  IS_PUBLISHED,
  NAME,
  START_DATE_TIME,
} from "../constants";
import { BaseData } from "./base";

export type MilestoneData = BaseData & {
  [NAME]: string;
  [DESCRIPTION]: string;
  [START_DATE_TIME]: number;
  [END_DATE_TIME]: number | null;
  [IS_PUBLISHED]: boolean;
};
