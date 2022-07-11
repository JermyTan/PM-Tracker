import {
  MilestoneData,
  MilestonePostData,
  MilestonePutData,
} from "../../types/milestones";
import { cacher } from "./api-cache-utils";
import baseApi from "./base-api";

const milestonesApi = baseApi
  .enhanceEndpoints({ addTagTypes: ["Milestone"] })
  .injectEndpoints({
    endpoints: (build) => ({
      getMilestones: build.query<MilestoneData[], string | number>({
        query: (courseId) => ({
          url: `/courses/${courseId}/milestones/`,
          method: "GET",
        }),
        providesTags: (result) => cacher.providesList(result, "Milestone"),
      }),
      createMilestone: build.mutation<
        MilestoneData,
        MilestonePostData & {
          courseId: string | number;
        }
      >({
        query: ({ courseId, ...milestonePostData }) => ({
          url: `/courses/${courseId}/milestones/`,
          method: "POST",
          body: milestonePostData,
        }),
        invalidatesTags: (_, error) =>
          error ? [] : cacher.invalidatesList("Milestone"),
      }),
      updateMilestone: build.mutation<
        MilestoneData,
        MilestonePutData & {
          courseId: string | number;
          milestoneId: string | number;
        }
      >({
        query: ({ courseId, milestoneId, ...milestonePutData }) => ({
          url: `/courses/${courseId}/milestones/${milestoneId}/`,
          method: "PUT",
          body: milestonePutData,
        }),
        invalidatesTags: (_, error, { milestoneId: id }) =>
          error ? [] : [{ type: "Milestone", id }],
      }),
      deleteMilestone: build.mutation<
        MilestoneData,
        {
          courseId: string | number;
          milestoneId: string | number;
        }
      >({
        query: ({ courseId, milestoneId }) => ({
          url: `/courses/${courseId}/milestones/${milestoneId}/`,
          method: "DELETE",
        }),
        invalidatesTags: (_, error, { milestoneId: id }) =>
          error ? [] : [{ type: "Milestone", id }],
      }),
    }),
  });

export const {
  useGetMilestonesQuery,
  useCreateMilestoneMutation,
  useUpdateMilestoneMutation,
  useDeleteMilestoneMutation,
} = milestonesApi;
