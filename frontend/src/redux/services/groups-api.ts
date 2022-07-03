import {
  GroupData,
  GroupPostData,
  GroupPatchData,
  JoinOrLeaveGroupData,
  RenameGroupData,
  BatchUpdateGroupData,
} from "../../types/groups";
import { cacher } from "./api-cache-utils";
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
      createCourseGroup: build.mutation<
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

      // joinOrLeaveCourseGroup: build.mutation<
      //   GroupData,
      //   GroupPatchData &
      //     JoinOrLeaveGroupData & { courseId: number | string; groupId: number }
      // >({
      //   query: ({ courseId, groupId, ...groupPatchData }) => ({
      //     url: `/courses/${courseId}/groups/${groupId}/`,
      //     method: "PATCH",
      //     body: groupPatchData,
      //   }),
      //   invalidatesTags: (_, error, { groupId: id }) =>
      //     error ? [] : [{ type: "Group", id }],
      // }),

      // renameCourseGroup: build.mutation<
      //   GroupData,
      //   GroupPatchData &
      //     RenameGroupData & { courseId: number | string; groupId: number }
      // >({
      //   query: ({ courseId, groupId, ...groupPatchData }) => ({
      //     url: `/courses/${courseId}/groups/${groupId}/`,
      //     method: "PATCH",
      //     body: groupPatchData,
      //   }),
      //   invalidatesTags: (_, error, { groupId: id }) =>
      //     error ? [] : [{ type: "Group", id }],
      // }),

      // batchUpdateCourseGroup: build.mutation<
      //   GroupData,
      //   GroupPatchData &
      //     BatchUpdateGroupData & { courseId: number | string; groupId: number }
      // >({
      //   query: ({ courseId, groupId, ...groupPatchData }) => ({
      //     url: `/courses/${courseId}/groups/${groupId}/`,
      //     method: "PATCH",
      //     body: groupPatchData,
      //   }),
      //   invalidatesTags: (_, error, { groupId: id }) =>
      //     error ? [] : [{ type: "Group", id }],
      // }),

      patchCourseGroup: build.mutation<
        GroupData,
        GroupPatchData & { courseId: number | string; groupId: number }
      >({
        query: ({ courseId, groupId, ...groupPatchData }) => ({
          url: `/courses/${courseId}/groups/${groupId}/`,
          method: "PATCH",
          body: groupPatchData,
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
  useCreateCourseGroupMutation,
  usePatchCourseGroupMutation,
  // useJoinOrLeaveCourseGroupMutation,
  // useRenameCourseGroupMutation,
  // useBatchUpdateCourseGroupMutation,
  useDeleteCourseGroupMutation,
} = groupsApi;
