import { ANNOTATED_CONTENT, CONTENT, FEEDBACK } from "../constants";

export type FeedbackData = {
  [ANNOTATED_CONTENT]: string;
  [FEEDBACK]: string;
};

export type FeedbackPostData = {
  [CONTENT]: string;
};
