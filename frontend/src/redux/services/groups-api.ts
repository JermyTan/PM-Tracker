import { GroupSummaryView, GroupPutData } from "../../types/groups";
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
      // TODO: remove this and separate out into a separate course-members api
      getCourseMembers: build.query<UserData[], number | string>({
        query: (course_id) => ({
          url: `/courses/${course_id}/memberships/`,
          method: "GET",
        }),
      }),

      updateCourseGroup: build.mutation<
        GroupSummaryView,
        GroupPutData & { courseId: number | string; groupId: number }
      >({
        query: ({ courseId, groupId, ...groupPutData }) => ({
          url: `/courses/${courseId}/groups/${groupId}/`,
          method: "PATCH",
          body: groupPutData,
        }),
        invalidatesTags: (_, error, { groupId: id }) =>
          error ? [] : [{ type: "Group", id }],
      }),
    }),
  });

export const {
  useGetCourseGroupsQuery,
  useGetCourseMembersQuery,
  useUpdateCourseGroupMutation,
} = groupsApi;
