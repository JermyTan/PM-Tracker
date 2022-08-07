import { skipToken } from "@reduxjs/toolkit/query/react";
import useGetCourseId from "../../custom-hooks/use-get-course-id";
import useGetMilestoneId from "../../custom-hooks/use-get-milestone-id";
import useGetSubmissionId from "../../custom-hooks/use-get-submission-id";
import { useGetSingleMilestoneQueryState } from "../../redux/services/milestones-api";
import { useGetSingleSubmissionQuery } from "../../redux/services/submissions-api";
import { useResolveError } from "../../utils/error-utils";
import { checkIsMilestoneOpen } from "../../utils/misc-utils";
import MilestoneSubmissionForm from "../milestone-submission-form";
import PlaceholderWrapper from "../placeholder-wrapper";

function CourseMilestoneSubmissionsViewPage() {
  const courseId = useGetCourseId();
  const milestoneId = useGetMilestoneId();
  const submissionId = useGetSubmissionId();
  const { milestone } = useGetSingleMilestoneQueryState(
    courseId === undefined || milestoneId === undefined
      ? skipToken
      : { courseId, milestoneId },
    { selectFromResult: ({ data: milestone }) => ({ milestone }) },
  );
  const { submission, isFetching, error } = useGetSingleSubmissionQuery(
    courseId === undefined || submissionId === undefined
      ? skipToken
      : { courseId, submissionId },
    {
      selectFromResult: ({ data: submission, isFetching, error }) => ({
        submission,
        isFetching,
        error,
      }),
      // get the most updated template data before editing
      refetchOnMountOrArgChange: true,
    },
  );
  useResolveError({ error, name: "course-milestone-submissions-view-page" });

  const isMilestoneOpen = checkIsMilestoneOpen(milestone);

  return (
    <PlaceholderWrapper
      py={150}
      isLoading={isFetching}
      loadingMessage="Loading submission..."
      showDefaultMessage={!submission}
      defaultMessage="No submission found."
    >
      {submission && (
        <MilestoneSubmissionForm
          defaultValues={submission}
          readOnly={!isMilestoneOpen}
        />
      )}
    </PlaceholderWrapper>
  );
}

export default CourseMilestoneSubmissionsViewPage;
