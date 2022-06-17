import {
  CourseSummaryView,
  Course,
  CoursePostData,
  CoursePutData,
} from "../../types/courses";
import { cacher } from "./api-cache-utils";
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
        providesTags: (result) => cacher.providesList(result, "Course"),
      }),

      createCourse: build.mutation<CourseSummaryView, CoursePostData>({
        query: (coursePostData) => ({
          url: "/courses/",
          method: "POST",
          body: coursePostData,
        }),
        invalidatesTags: (_, error) =>
          error ? [] : cacher.invalidatesList("Course"),
      }),

      getSingleCourse: build.query<Course, string | number>({
        query: (courseId) => ({
          url: `/courses/${courseId}/`,
          method: "GET",
        }),
        providesTags: (_, __, id) => [{ type: "Course", id }],
      }),

      updateCourse: build.mutation<
        Course,
        CoursePutData & { courseId: string | number }
      >({
        query: ({ courseId, ...coursePutData }) => ({
          url: `/courses/${courseId}/`,
          method: "PUT",
          body: coursePutData,
        }),
        invalidatesTags: (_, error, { courseId: id }) =>
          error ? [] : [{ type: "Course", id }],
      }),

      deleteCourse: build.mutation<Course, string | number>({
        query: (courseId) => ({
          url: `/courses/${courseId}/`,
          method: "DELETE",
        }),
        invalidatesTags: (_, error, id) =>
          error ? [] : [{ type: "Course", id }],
      }),
    }),
  });

export const {
  useGetCoursesQuery,
  useCreateCourseMutation,
  useGetSingleCourseQuery,
} = coursesApi;
