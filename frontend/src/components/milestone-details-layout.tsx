import { ReactNode } from "react";
import { skipToken } from "@reduxjs/toolkit/query/react";
import useGetCourseId from "../custom-hooks/use-get-course-id";
import useGetMilestoneId from "../custom-hooks/use-get-milestone-id";
import { useGetSingleMilestoneQueryState } from "../redux/services/milestones-api";

type Props = {
  children: ReactNode;
};

function MilestoneDetailsLayout({ children }: Props) {
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
  return <div>{children}</div>;
}

export default MilestoneDetailsLayout;
