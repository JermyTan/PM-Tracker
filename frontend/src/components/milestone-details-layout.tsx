import { ReactNode } from "react";
import { Stack } from "@mantine/core";
import { skipToken } from "@reduxjs/toolkit/query/react";
import useGetCourseId from "../custom-hooks/use-get-course-id";
import useGetMilestoneId from "../custom-hooks/use-get-milestone-id";
import { useGetSingleMilestoneQueryState } from "../redux/services/milestones-api";
import MilestoneActivePeriodDisplay from "./milestone-active-period-display";
import TextViewer from "./text-viewer";

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
  return milestone ? (
    <Stack>
      <MilestoneActivePeriodDisplay
        startDateTime={milestone.startDateTime}
        endDateTime={milestone.endDateTime}
        size="sm"
        weight={500}
      />

      {milestone.description && (
        <TextViewer size="sm" preserveWhiteSpace overflowWrap withLinkify>
          {milestone.description}
        </TextViewer>
      )}

      <div>{children}</div>
    </Stack>
  ) : (
    <>{children}</>
  );
}

export default MilestoneDetailsLayout;
