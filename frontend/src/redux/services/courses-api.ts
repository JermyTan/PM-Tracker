import { CourseSummaryView, Course } from "../../types/courses";
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
    getSingleCourse: build.query<Course, number | string>({
      query: (courseId) => ({
        url: `/courses/${courseId}/`,
        method: "GET",
      }),
    }),
  }),
});

export const {
  useGetCoursesQuery,
  useCreateCourseMutation,
  useGetSingleCourseQuery,
} = coursesApi;
