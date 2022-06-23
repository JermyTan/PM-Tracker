import baseApi from "./base-api";
import { cacher } from "./api-cache-utils";
import {
  CourseMemberData,
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
        providesTags: (result) => cacher.providesList(result, "Member"),
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
        invalidatesTags: (_, error, { membershipId: id }) =>
          error ? [] : [{ type: "Member", id }],
      }),

      deleteCourseMembership: build.mutation<
        CourseMemberData,
        { courseId: number | string; membershipId: number }
      >({
        query: ({ courseId, membershipId }) => ({
          url: `/courses/${courseId}/memberships/${membershipId}/`,
          method: "DELETE",
        }),
        invalidatesTags: (_, error, { membershipId: id }) =>
          error ? [] : [{ type: "Member", id }],
      }),
    }),
  });

export const {
  useGetCourseMembershipsQuery,
  useUpdateCourseMembershipMutation,
  useDeleteCourseMembershipMutation,
} = membersApi;
