import { GroupSummaryView } from "../../types/groups";
import { UserData } from "../../types/users";
import baseApi from "./base-api";

const groupsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getCourseGroups: build.query<GroupSummaryView[], number | string>({
      query: (course_id) => ({
        url: `/courses/${course_id}/groups/`,
        method: "GET",
      }),
    }),
    getCourseMembers: build.query<UserData[], number | string>({
      query: (course_id) => ({
        url: `/courses/${course_id}/memberships/`,
        method: "GET",
      }),
    }),
  }),
});

export const { useGetCourseGroupsQuery, useGetCourseMembersQuery } = groupsApi;
