import baseApi from "./base-api";
import { cacher } from "./api-cache-utils";
import {
  CourseMemberData,
  CourseMembershipBatchCreateData,
  CourseMembershipPatchData,
} from "../../types/courses";

const membersApi = baseApi
  .enhanceEndpoints({ addTagTypes: ["Member"] })
  .injectEndpoints({
    endpoints: (build) => ({
      getCourseMemberships: build.query<CourseMemberData[], number | string>({
        query: (courseId) => ({
          url: `/courses/${courseId}/memberships/`,
          method: "GET",
        }),
        providesTags: (result, _, courseId) =>
          cacher.providesList(result, "Member", [`${courseId}`]),
      }),

      updateCourseMembership: build.mutation<
        CourseMemberData,
        {
          courseId: number | string;
          membershipId: number;
        } & CourseMembershipPatchData
      >({
        query: ({ courseId, membershipId, ...courseMembershipPatchData }) => ({
          url: `/courses/${courseId}/memberships/${membershipId}/`,
          method: "PATCH",
          body: courseMembershipPatchData,
        }),
        invalidatesTags: (_, error, { membershipId: id, courseId }) =>
          error ? [] : [cacher.getIdTag(id, "Member", [`${courseId}`])],
      }),

      deleteCourseMembership: build.mutation<
        CourseMemberData,
        { courseId: number | string; membershipId: number }
      >({
        query: ({ courseId, membershipId }) => ({
          url: `/courses/${courseId}/memberships/${membershipId}/`,
          method: "DELETE",
        }),
        invalidatesTags: (_, error, { membershipId: id, courseId }) =>
          error ? [] : [cacher.getIdTag(id, "Member", [`${courseId}`])],
      }),

      batchCreateCourseMemberships: build.mutation<
        CourseMemberData[],
        CourseMembershipBatchCreateData & {
          courseId: number | string;
        }
      >({
        query: ({ courseId, ...courseMembershipBatchCreateData }) => ({
          url: `/courses/${courseId}/memberships/new`,
          method: "POST",
          body: courseMembershipBatchCreateData,
        }),
        invalidatesTags: (_, error) =>
          error ? [] : cacher.invalidatesList("Member"),
      }),
    }),
  });

export const {
  useGetCourseMembershipsQuery,
  useUpdateCourseMembershipMutation,
  useDeleteCourseMembershipMutation,
  useBatchCreateCourseMembershipsMutation,
} = membersApi;
