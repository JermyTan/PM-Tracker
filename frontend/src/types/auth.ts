import { ACCESS, EMAIL, REFRESH, TOKENS, USER } from "../constants";
import { PasswordPayloadPostData, SelfData } from "./users";

export type AuthenticationData = {
  [USER]: SelfData;
  [TOKENS]: {
    [ACCESS]: string;
    [REFRESH]: string;
  };
};

export type PasswordLoginPostData = PasswordPayloadPostData & {
  [EMAIL]: string;
};
