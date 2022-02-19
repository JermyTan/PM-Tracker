import { EMAIL } from "../constants";
import { PasswordPayloadPostData } from "./users";

export type PasswordLoginPostData = PasswordPayloadPostData & {
  [EMAIL]: string;
};
