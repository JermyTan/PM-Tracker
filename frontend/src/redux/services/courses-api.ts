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
        providesTags: (result) => providesList(result, "Course"), // [{Course, id: 1},{Course, id: 2}, {Course, id: LIST}]
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
        providesTags: (result, error, arg) => [{ type: "Course", id: arg }],
      }),
      updateCourse: build.mutation<Course, number | string>({
        query: (courseId) => ({
          url: `/courses/${courseId}/`,
          method: "PUT",
        }),
        invalidatesTags: [], // [{Course, id: 2}]
      }),
      deleteCourse: build.mutation<Course, number | string>({
        query: (courseId) => ({
          url: `/courses/${courseId}/`,
          method: "DELETE",
        }),
        invalidatesTags: [], // [{Course, id: 2}]
      }),
    }),
  });

export const {
  useGetCoursesQuery,
  useCreateCourseMutation,
  useGetSingleCourseQuery,
} = coursesApi;
