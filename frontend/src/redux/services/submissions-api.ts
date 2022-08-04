import {
  SubmissionData,
  SubmissionPostData,
  SubmissionPutData,
  SubmissionSummaryData,
} from "../../types/submissions";
import { sanitizeObject } from "../../utils/transform-utils";
import { cacher } from "./api-cache-utils";
import baseApi from "./base-api";

const submissionsApi = baseApi
  .enhanceEndpoints({ addTagTypes: ["Submission"] })
  .injectEndpoints({
    endpoints: (build) => ({
      getSubmissions: build.query<
        SubmissionSummaryData[],
        {
          courseId: string | number;
          milestoneId?: string | number;
          groupId?: string | number;
          creatorId?: string | number;
          editorId?: string | number;
          templateId?: string | number;
        }
      >({
        query: ({
          courseId,
          milestoneId,
          groupId,
          creatorId,
          editorId,
          templateId,
        }) => ({
          url: `/courses/${courseId}/submissions/`,
          method: "GET",
          params: sanitizeObject({
            milestoneId,
            groupId,
            creatorId,
            editorId,
            templateId,
          }),
        }),
        providesTags: (result) => cacher.providesList(result, "Submission"),
      }),

      createSubmission: build.mutation<
        SubmissionData,
        SubmissionPostData & {
          courseId: string | number;
        }
      >({
        query: ({ courseId, ...submissionPostData }) => ({
          url: `/courses/${courseId}/submissions/`,
          method: "POST",
          body: submissionPostData,
        }),
        invalidatesTags: (_, error) =>
          error ? [] : cacher.invalidatesList("Submission"),
      }),

      getSingleSubmission: build.query<
        SubmissionData,
        { courseId: string | number; submissionId: string | number }
      >({
        query: ({ courseId, submissionId }) => ({
          url: `/courses/${courseId}/submissions/${submissionId}/`,
          method: "GET",
        }),
        providesTags: (_, __, { submissionId: id }) => [
          { type: "Submission", id },
        ],
      }),

      updateSubmission: build.mutation<
        SubmissionData,
        SubmissionPutData & {
          courseId: string | number;
          submissionId: string | number;
        }
      >({
        query: ({ courseId, submissionId, ...submissionPutData }) => ({
          url: `/courses/${courseId}/submissions/${submissionId}/`,
          method: "PUT",
          body: submissionPutData,
        }),
        invalidatesTags: (_, error, { submissionId: id }) =>
          error ? [] : [{ type: "Submission", id }],
      }),

      deleteSubmission: build.mutation<
        SubmissionData,
        {
          courseId: string | number;
          submissionId: string | number;
        }
      >({
        query: ({ courseId, submissionId }) => ({
          url: `/courses/${courseId}/submissions/${submissionId}/`,
          method: "DELETE",
        }),
        invalidatesTags: (_, error, { submissionId: id }) =>
          error ? [] : [{ type: "Submission", id }],
      }),
    }),
  });

export const {
  useGetSubmissionsQuery,
  useCreateSubmissionMutation,
  useGetSingleSubmissionQuery,
  useUpdateSubmissionMutation,
  useDeleteSubmissionMutation,
} = submissionsApi;
