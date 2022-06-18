import { GroupSummaryView } from "../../types/groups";
import { UserData } from "../../types/users";
import { providesList } from "./api-cache-utils";
import baseApi from "./base-api";

const groupsApi = baseApi
  .enhanceEndpoints({ addTagTypes: ["Group"] })
  .injectEndpoints({
    endpoints: (build) => ({
      getCourseGroups: build.query<GroupSummaryView[], number | string>({
        query: (course_id) => ({
          url: `/courses/${course_id}/groups/`,
          method: "GET",
        }),
        providesTags: (result) => providesList(result, "Group"),
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
