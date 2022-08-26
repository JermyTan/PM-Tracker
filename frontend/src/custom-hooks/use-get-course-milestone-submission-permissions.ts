import { skipToken } from "@reduxjs/toolkit/query/react";
import { useGetSingleMilestoneQueryState } from "../redux/services/milestones-api";
import { checkIsMilestoneOpen } from "../utils/misc-utils";
import useGetCourseId from "./use-get-course-id";
import useGetMilestoneId from "./use-get-milestone-id";

export default function useGetCourseMilestoneSubmissionPermissions() {
  const courseId = useGetCourseId();
  const milestoneId = useGetMilestoneId();

  const { milestone } = useGetSingleMilestoneQueryState(
    courseId === undefined || milestoneId === undefined
      ? skipToken
      : { courseId, milestoneId },
    {
      selectFromResult: ({ data: milestone }) => ({
        milestone,
      }),
    },
  );

  if (!milestone) {
    return {
      canCreate: false,
      canModify: false,
      canDelete: false,
    };
  }

  const canCreate = checkIsMilestoneOpen(milestone);

  const canModify = canCreate;
  const canDelete = canModify;

  return {
    canCreate,
    canModify,
    canDelete,
  };
}
