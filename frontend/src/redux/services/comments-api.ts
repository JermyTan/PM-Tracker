import {
  SubmissionCommentData,
  SubmissionCommentPostData,
  SubmissionCommentPatchData,
} from "../../types/comments";
import { cacher } from "./api-cache-utils";
import baseApi from "./base-api";

const commentsApi = baseApi
  .enhanceEndpoints({ addTagTypes: ["Comment"] })
  .injectEndpoints({
    endpoints: (build) => ({
      getSubmissionCommentCount: build.query<
        [number, ...number[]],
        { courseId: string | number; submissionId: string | number }
      >({
        query: ({ courseId, submissionId }) => ({
          url: `/courses/${courseId}/submissions/${submissionId}/fields/comments/`,
          method: "GET",
        }),
        providesTags: (_, __, { courseId, submissionId }) => [
          cacher.getCustomTag("COUNT", "Comment", [
            `${courseId}`,
            `${submissionId}`,
          ]),
        ],
      }),

      getSubmissionComments: build.query<
        SubmissionCommentData[],
        {
          courseId: string | number;
          submissionId: string | number;
          fieldIndex: string | number;
        }
      >({
        query: ({ courseId, submissionId, fieldIndex }) => ({
          url: `/courses/${courseId}/submissions/${submissionId}/fields/${fieldIndex}/comments/`,
          method: "GET",
        }),
        providesTags: (result, _, { courseId, submissionId, fieldIndex }) =>
          cacher.providesList(result, "Comment", [
            `${courseId}`,
            `${submissionId}`,
            `${fieldIndex}`,
          ]),
      }),

      createSubmissionComment: build.mutation<
        SubmissionCommentData,
        SubmissionCommentPostData & {
          courseId: string | number;
          submissionId: string | number;
          fieldIndex: string | number;
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
        invalidatesTags: (_, error, { courseId, submissionId, fieldIndex }) =>
          error
            ? []
            : [
                ...cacher.invalidatesList("Comment", [
                  `${courseId}`,
                  `${submissionId}`,
                  `${fieldIndex}`,
                ]),
                cacher.getCustomTag("COUNT", "Comment", [
                  `${courseId}`,
                  `${submissionId}`,
                ]),
              ],
      }),

      updateSubmissionComment: build.mutation<
        SubmissionCommentData,
        SubmissionCommentPatchData & {
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
        invalidatesTags: (
          result,
          error,
          { commentId: id, courseId, submissionId },
        ) =>
          error || !result
            ? []
            : [
                cacher.getIdTag(id, "Comment", [
                  `${courseId}`,
                  `${submissionId}`,
                  `${result.fieldIndex}`,
                ]),
                cacher.getCustomTag("COUNT", "Comment", [
                  `${courseId}`,
                  `${submissionId}`,
                ]),
              ],
      }),

      deleteSubmissionComment: build.mutation<
        SubmissionCommentData,
        {
          courseId: string | number;
          submissionId: string | number;
          commentId: string | number;
        }
      >({
        query: ({ courseId, submissionId, commentId }) => ({
          url: `/courses/${courseId}/submissions/${submissionId}/comments/${commentId}`,
          method: "DELETE",
        }),
        invalidatesTags: (
          result,
          error,
          { commentId: id, courseId, submissionId },
        ) =>
          error || !result
            ? []
            : [
                cacher.getIdTag(id, "Comment", [
                  `${courseId}`,
                  `${submissionId}`,
                  `${result.fieldIndex}`,
                ]),
                cacher.getCustomTag("COUNT", "Comment", [
                  `${courseId}`,
                  `${submissionId}`,
                ]),
              ],
      }),
    }),
  });

export const useGetSubmissionCommentCountQueryState =
  commentsApi.endpoints.getSubmissionCommentCount.useQueryState;

export const {
  useGetSubmissionCommentCountQuery,
  useGetSubmissionCommentsQuery,
  useUpdateSubmissionCommentMutation,
  useCreateSubmissionCommentMutation,
  useDeleteSubmissionCommentMutation,
} = commentsApi;

export default commentsApi;
