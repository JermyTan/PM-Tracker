import {
  SubmissionCommentsData,
  SubmissionFieldComment,
  SubmissionFieldCommentPostPatchData,
} from "../../types/comments";
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
          fieldIndex: number;
        }
      >({
        query: ({ courseId, submissionId, fieldIndex }) => ({
          url: `/courses/${courseId}/submissions/${submissionId}/fields/${fieldIndex}/comments/`,
          method: "GET",
        }),
        providesTags: (result) => cacher.providesList(result, "Comment"),
      }),

      createSubmissionComment: build.mutation<
        SubmissionFieldComment,
        SubmissionFieldCommentPostPatchData & {
          courseId: string | number;
          submissionId: string | number;
          fieldIndex: number;
        }
      >({
        query: ({
          courseId,
          submissionId,
          fieldIndex,
          ...commentPostData
        }) => ({
          url: `/courses/${courseId}/submissions/${submissionId}/fields/${fieldIndex}/comments/`,
          method: "POST",
          body: commentPostData,
        }),
        invalidatesTags: (_, error) =>
          error ? [] : cacher.invalidatesList("Comment"),
      }),

      updateSubmissionComment: build.mutation<
        SubmissionFieldComment,
        SubmissionFieldCommentPostPatchData & {
          courseId: string | number;
          submissionId: string | number;
          commentId: string | number;
        }
      >({
        query: ({
          courseId,
          submissionId,
          commentId,
          ...commentPatchData
        }) => ({
          url: `/courses/${courseId}/submissions/${submissionId}/comments/${commentId}`,
          method: "PATCH",
          body: commentPatchData,
        }),
        invalidatesTags: (_, error, { commentId: id }) =>
          error ? [] : [{ type: "Comment", id }],
      }),
    }),
  });

export const {
  useGetSubmissionCommentsQuery,
  useUpdateSubmissionCommentMutation,
  useCreateSubmissionCommentMutation,
} = commentsApi;

export default commentsApi;
