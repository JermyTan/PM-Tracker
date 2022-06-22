import baseApi from "./base-api";
import { cacher } from "./api-cache-utils";
import { CoursePersonnelData } from "../../types/courses";

const membersApi = baseApi
  .enhanceEndpoints({ addTagTypes: ["Member"] })
  .injectEndpoints({
    endpoints: (build) => ({
      getCourseMemberships: build.query<CoursePersonnelData[], number | string>(
        {
          query: (courseId) => ({
            url: `/courses/${courseId}/memberships/`,
            method: "GET",
          }),
          providesTags: (result) => cacher.providesList(result, "Member"),
        },
      ),
    }),
  });

export const { useGetCourseMembershipsQuery } = membersApi;
