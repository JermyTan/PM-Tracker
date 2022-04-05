import { CourseSummaryView } from "../../types/courses";
import baseApi from "./base-api";

const coursesApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getCourses: build.query<CourseSummaryView[], void>({
      query: () => ({
        url: "/courses/",
        method: "GET",
      }),
    }),
    createCourse: build.mutation({
      query: () => ({
        url: "/courses/",
        method: "POST",
      }),
    }),
  }),
});

export const { useGetCoursesQuery, useCreateCourseMutation } = coursesApi;
