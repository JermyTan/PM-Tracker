import { skipToken } from "@reduxjs/toolkit/query/react";
import { MILESTONE } from "../constants";
import { useGetSingleCourseQueryState } from "../redux/services/courses-api";
import { useGetCourseId } from "./use-get-course-id";

export function useGetMilestoneAlias() {
  const courseId = useGetCourseId();
  const { milestoneAlias } = useGetSingleCourseQueryState(
    courseId ?? skipToken,
    {
      selectFromResult: ({ data: course }) => ({
        milestoneAlias: course?.milestoneAlias,
      }),
    },
  );

  return milestoneAlias || MILESTONE;
}
