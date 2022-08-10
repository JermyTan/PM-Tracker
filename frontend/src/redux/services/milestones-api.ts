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

      getSingleMilestone: build.query<
        MilestoneData,
        { courseId: string | number; milestoneId: string | number }
      >({
        query: ({ courseId, milestoneId }) => ({
          url: `/courses/${courseId}/milestones/${milestoneId}/`,
          method: "GET",
        }),
        providesTags: (_, __, { milestoneId: id }) => [
          { type: "Milestone", id },
        ],
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

export const useGetSingleMilestoneQueryState =
  milestonesApi.endpoints.getSingleMilestone.useQueryState;

export const {
  useGetMilestonesQuery,
  useCreateMilestoneMutation,
  useGetSingleMilestoneQuery,
  useUpdateMilestoneMutation,
  useDeleteMilestoneMutation,
} = milestonesApi;
