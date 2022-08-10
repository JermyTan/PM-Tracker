import {
  CourseSummaryData,
  CourseData,
  CoursePostData,
  CoursePutData,
} from "../../types/courses";
import { cacher } from "./api-cache-utils";
import baseApi from "./base-api";

const coursesApi = baseApi
  .enhanceEndpoints({ addTagTypes: ["Course"] })
  .injectEndpoints({
    endpoints: (build) => ({
      getCourses: build.query<CourseSummaryData[], void>({
        query: () => ({
          url: "/courses/",
          method: "GET",
        }),
        providesTags: (result) => cacher.providesList(result, "Course"),
      }),

      createCourse: build.mutation<CourseSummaryData, CoursePostData>({
        query: (coursePostData) => ({
          url: "/courses/",
          method: "POST",
          body: coursePostData,
        }),
        invalidatesTags: (_, error) =>
          error ? [] : cacher.invalidatesList("Course"),
      }),

      getSingleCourse: build.query<CourseData, string | number>({
        query: (courseId) => ({
          url: `/courses/${courseId}/`,
          method: "GET",
        }),
        providesTags: (_, __, id) => [cacher.getIdTag(id, "Course")],
      }),

      updateCourse: build.mutation<
        CourseData,
        CoursePutData & { courseId: string | number }
      >({
        query: ({ courseId, ...coursePutData }) => ({
          url: `/courses/${courseId}/`,
          method: "PUT",
          body: coursePutData,
        }),
        invalidatesTags: (_, error, { courseId: id }) =>
          error ? [] : [cacher.getIdTag(id, "Course")],
      }),

      deleteCourse: build.mutation<CourseData, string | number>({
        query: (courseId) => ({
          url: `/courses/${courseId}/`,
          method: "DELETE",
        }),
        invalidatesTags: (_, error, id) =>
          error ? [] : [cacher.getIdTag(id, "Course")],
      }),
    }),
  });

export const useGetSingleCourseQueryState =
  coursesApi.endpoints.getSingleCourse.useQueryState;

export const {
  useGetCoursesQuery,
  useCreateCourseMutation,
  useGetSingleCourseQuery,
  useUpdateCourseMutation,
  useDeleteCourseMutation,
} = coursesApi;

export default coursesApi;
