import { skipToken } from "@reduxjs/toolkit/query/react";
import { capitalCase } from "change-case";
import { MILESTONE } from "../constants";
import { useGetSingleCourseQueryState } from "../redux/services/courses-api";
import useGetCourseId from "./use-get-course-id";

export default function useGetMilestoneAlias() {
  const courseId = useGetCourseId();
  const { milestoneAlias } = useGetSingleCourseQueryState(
    courseId ?? skipToken,
    {
      selectFromResult: ({ data: course }) => ({
        milestoneAlias: course?.milestoneAlias,
      }),
    },
  );

  const lowerCaseMilestoneAlias = milestoneAlias || MILESTONE;
  const capitalizedMilestoneAlias = capitalCase(lowerCaseMilestoneAlias);

  return { milestoneAlias: lowerCaseMilestoneAlias, capitalizedMilestoneAlias };
}
