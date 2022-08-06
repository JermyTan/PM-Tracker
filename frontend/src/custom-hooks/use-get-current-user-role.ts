import { skipToken } from "@reduxjs/toolkit/dist/query";
import { useGetSingleCourseQueryState } from "../redux/services/courses-api";
import useGetCourseId from "./use-get-course-id";

export default function useGetCurrentUserRole() {
  const courseId = useGetCourseId();
  const { role } = useGetSingleCourseQueryState(courseId ?? skipToken, {
    selectFromResult: ({ data: course }) => ({ role: course?.role }),
  });

  return role;
}
