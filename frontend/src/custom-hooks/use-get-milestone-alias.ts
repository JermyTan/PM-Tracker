import { skipToken } from "@reduxjs/toolkit/query/react";
import { useParams } from "react-router-dom";
import { MILESTONE } from "../constants";
import { useGetSingleCourseQueryState } from "../redux/services/courses-api";

export function useGetMilestoneAlias() {
  const { courseId } = useParams();
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
