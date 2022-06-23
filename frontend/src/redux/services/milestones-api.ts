import { MilestoneData } from "../../types/milestones";
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
    }),
  });

export const { useGetMilestonesQuery } = milestonesApi;
