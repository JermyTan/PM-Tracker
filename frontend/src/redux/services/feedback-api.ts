import { FeedbackData, FeedbackPostData } from "../../types/feedback";
import baseApi from "./base-api";

const feedbackApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getFeedback: build.query<FeedbackData, FeedbackPostData>({
      query: (data) => ({
        url: "/feedback/",
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const { useLazyGetFeedbackQuery } = feedbackApi;
