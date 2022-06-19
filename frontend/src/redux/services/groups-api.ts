import { GroupSummaryView, GroupPatchData } from "../../types/groups";
import { UserData } from "../../types/users";
import { providesList, cacher } from "./api-cache-utils";
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
        providesTags: (result) => cacher.providesList(result, "Group"),
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
        GroupPatchData & { courseId: number | string; groupId: number }
      >({
        query: ({ courseId, groupId, ...groupPutData }) => ({
          url: `/courses/${courseId}/groups/${groupId}/`,
          method: "PATCH",
          body: groupPutData,
        }),
        invalidatesTags: (_, error, { groupId: id }) =>
          error ? [] : [{ type: "Group", id }],
      }),

      deleteCourseGroup: build.mutation<
        GroupSummaryView,
        { courseId: number | string; groupId: number }
      >({
        query: ({ courseId, groupId }) => ({
          url: `/courses/${courseId}/groups/${groupId}/`,
          method: "DELETE",
        }),
        invalidatesTags: (_, error) =>
          error ? [] : cacher.invalidatesList("Group"),
      }),
    }),
  });

export const {
  useGetCourseGroupsQuery,
  useGetCourseMembersQuery,
  useUpdateCourseGroupMutation,
  useDeleteCourseGroupMutation,
} = groupsApi;
