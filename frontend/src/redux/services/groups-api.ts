import {
  GroupData,
  GroupPostData,
  GroupPatchData,
  JoinOrLeaveGroupData,
  RenameGroupData,
} from "../../types/groups";
import { UserData } from "../../types/users";
import { providesList, cacher } from "./api-cache-utils";
import baseApi from "./base-api";

const groupsApi = baseApi
  .enhanceEndpoints({ addTagTypes: ["Group"] })
  .injectEndpoints({
    endpoints: (build) => ({
      getCourseGroups: build.query<GroupData[], number | string>({
        query: (courseId) => ({
          url: `/courses/${courseId}/groups/`,
          method: "GET",
        }),
        providesTags: (result) => cacher.providesList(result, "Group"),
      }),
      // TODO: remove this and separate out into a separate course-members api
      getCourseMembers: build.query<UserData[], number | string>({
        query: (courseId) => ({
          url: `/courses/${courseId}/memberships/`,
          method: "GET",
        }),
      }),

      createCourse: build.mutation<
        GroupData,
        GroupPostData & { courseId: number | string }
      >({
        query: ({ courseId, ...groupPostData }) => ({
          url: `/courses/${courseId}/groups/`,
          method: "POST",
          body: groupPostData,
        }),
        invalidatesTags: (_, error) =>
          error ? [] : cacher.invalidatesList("Group"),
      }),

      joinOrLeaveCourseGroup: build.mutation<
        GroupData,
        GroupPatchData &
          JoinOrLeaveGroupData & { courseId: number | string; groupId: number }
      >({
        query: ({ courseId, groupId, ...groupPutData }) => ({
          url: `/courses/${courseId}/groups/${groupId}/`,
          method: "PATCH",
          body: groupPutData,
        }),
        invalidatesTags: (_, error, { groupId: id }) =>
          error ? [] : [{ type: "Group", id }],
      }),

      renameCourseGroup: build.mutation<
        GroupData,
        GroupPatchData &
          RenameGroupData & { courseId: number | string; groupId: number }
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
        GroupData,
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
  useJoinOrLeaveCourseGroupMutation,
  useRenameCourseGroupMutation,
  useDeleteCourseGroupMutation,
} = groupsApi;
