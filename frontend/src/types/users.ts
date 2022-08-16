import { BaseData } from "./base";
import {
  ACCOUNT_TYPE,
  EMAIL,
  FACEBOOK_AUTH,
  GOOGLE_AUTH,
  HAS_PASSWORD_AUTH,
  IS_ACTIVATED,
  NAME,
  PASSWORD,
  PROFILE_IMAGE,
} from "../constants";

export enum AccountType {
  Admin = "ADMIN",
  Educator = "EDUCATOR",
  Standard = "STANDARD",
}

export type UserData = BaseData & {
  [EMAIL]: string;
  [NAME]: string;
  [PROFILE_IMAGE]: string | null;
  [ACCOUNT_TYPE]: AccountType;
  [IS_ACTIVATED]: boolean;
};

export type SelfData = UserData & {
  [HAS_PASSWORD_AUTH]: boolean;
  [GOOGLE_AUTH]: { [EMAIL]: string; [PROFILE_IMAGE]: string } | null;
  [FACEBOOK_AUTH]: { [EMAIL]: string; [PROFILE_IMAGE]: string } | null;
};

export type PasswordPayloadPostData = {
  [PASSWORD]: string;
};
