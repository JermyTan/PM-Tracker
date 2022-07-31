import { SubmissionCommentsData } from "../../types/comments";
import { cacher } from "./api-cache-utils";
import baseApi from "./base-api";

const commentsApi = baseApi
  .enhanceEndpoints({ addTagTypes: ["Comment"] })
  .injectEndpoints({
    endpoints: (build) => ({
      getSubmissionComments: build.query<
        SubmissionCommentsData,
        {
          courseId: string | number;
          submissionId: string | number;
          fieldIndex?: number;
        }
      >({
        query: ({ courseId, submissionId, fieldIndex }) => ({
          url: `/courses/${courseId}/submissions/${submissionId}/comments`,
          method: "GET",
          params: fieldIndex
            ? {
                field_index: fieldIndex,
              }
            : undefined,
        }),
        // TODO: cache by key?
        // providesTags: (result) => cacher.providesList(result, "Comment"),
      }),
    }),
  });

export const { useGetSubmissionCommentsQuery } = commentsApi;

export default commentsApi;
