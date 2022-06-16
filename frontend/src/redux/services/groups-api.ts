import { GroupSummaryView } from "../../types/groups";
import baseApi from "./base-api";

const groupsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getCourseGroups: build.query<GroupSummaryView[], number>({
      query: (course_id) => ({
        url: `/courses/${course_id}/groups/`,
        method: "GET",
      }),
    }),
  }),
});

export const { useGetCourseGroupsQuery } = groupsApi;
