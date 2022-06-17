import { CourseSummaryView, Course, CoursePostData } from "../../types/courses";
import { invalidatesList, providesList } from "./api-cache-utils";
import baseApi from "./base-api";

const coursesApi = baseApi
  .enhanceEndpoints({ addTagTypes: ["Course"] })
  .injectEndpoints({
    endpoints: (build) => ({
      getCourses: build.query<CourseSummaryView[], void>({
        query: () => ({
          url: "/courses/",
          method: "GET",
        }),
        providesTags: (result) => providesList(result, "Course"),
      }),
      createCourse: build.mutation<CourseSummaryView, CoursePostData>({
        query: (coursePostData) => ({
          url: "/courses/",
          method: "POST",
          body: coursePostData,
        }),
        invalidatesTags: invalidatesList("Course"),
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
