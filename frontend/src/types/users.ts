import {
  EMAIL,
  FACEBOOK_AUTH,
  GOOGLE_AUTH,
  HAS_PASSWORD_AUTH,
  NAME,
  PASSWORD,
  PROFILE_IMAGE,
} from "../constants";

export type UserData = {
  [EMAIL]: string;
  [NAME]: string;
  [PROFILE_IMAGE]: string | null;
};

export type SelfData = UserData & {
  [HAS_PASSWORD_AUTH]: boolean;
  [GOOGLE_AUTH]: { [EMAIL]: string; [PROFILE_IMAGE]: string } | null;
  [FACEBOOK_AUTH]: { [EMAIL]: string; [PROFILE_IMAGE]: string } | null;
};

export type PasswordPayloadPostData = {
  [PASSWORD]: string;
};
