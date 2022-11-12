import {
  SubmissionData,
  SubmissionDataWithComments,
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
        SubmissionSummaryData[] | SubmissionDataWithComments[],
        {
          courseId: string | number;
          milestoneId?: string | number;
          groupId?: string | number;
          creatorId?: string | number;
          editorId?: string | number;
          templateId?: string | number;
          full?: boolean;
        }
      >({
        query: ({
          courseId,
          milestoneId,
          groupId,
          creatorId,
          editorId,
          templateId,
          full,
        }) => ({
          url: `/courses/${courseId}/submissions/`,
          method: "GET",
          params: sanitizeObject({
            milestoneId,
            groupId,
            creatorId,
            editorId,
            templateId,
            full,
          }),
        }),
        providesTags: (
          result,
          _,
          {
            courseId,
            milestoneId,
            groupId,
            creatorId,
            editorId,
            templateId,
            full,
          },
        ) =>
          cacher.providesList(result, "Submission", [
            courseId,
            milestoneId,
            groupId,
            creatorId,
            editorId,
            templateId,
            full,
          ]),
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
        invalidatesTags: (_, error, { courseId }) =>
          error ? [] : cacher.invalidatesList("Submission", [courseId]),
      }),

      getSingleSubmission: build.query<
        SubmissionData,
        { courseId: string | number; submissionId: string | number }
      >({
        query: ({ courseId, submissionId }) => ({
          url: `/courses/${courseId}/submissions/${submissionId}/`,
          method: "GET",
        }),
        providesTags: (_, __, { submissionId: id, courseId }) => [
          cacher.getIdTag(id, "Submission", [courseId]),
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
        invalidatesTags: (_, error, { submissionId: id, courseId }) =>
          error ? [] : [cacher.getIdTag(id, "Submission", [courseId])],
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
        invalidatesTags: (_, error, { submissionId: id, courseId }) =>
          error ? [] : [cacher.getIdTag(id, "Submission", [courseId])],
      }),
    }),
  });

export const useGetSingleSubmissionQueryState =
  submissionsApi.endpoints.getSingleSubmission.useQueryState;

export const {
  useGetSubmissionsQuery,
  useLazyGetSubmissionsQuery,
  useCreateSubmissionMutation,
  useGetSingleSubmissionQuery,
  useUpdateSubmissionMutation,
  useDeleteSubmissionMutation,
} = submissionsApi;
