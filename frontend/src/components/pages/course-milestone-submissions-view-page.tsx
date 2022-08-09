import { createStyles, LoadingOverlay } from "@mantine/core";
import { skipToken } from "@reduxjs/toolkit/query/react";
import { useRef, ElementRef } from "react";
import useGetCourseId from "../../custom-hooks/use-get-course-id";
import useGetMilestoneId from "../../custom-hooks/use-get-milestone-id";
import useGetSubmissionId from "../../custom-hooks/use-get-submission-id";
import { useGetSingleMilestoneQueryState } from "../../redux/services/milestones-api";
import {
  useGetSingleSubmissionQuery,
  useUpdateSubmissionMutation,
} from "../../redux/services/submissions-api";
import { emptySelector } from "../../redux/utils";
import { FormResponseField, SubmissionPutData } from "../../types/submissions";
import { useResolveError } from "../../utils/error-utils";
import { checkIsMilestoneOpen } from "../../utils/misc-utils";
import toastUtils from "../../utils/toast-utils";
import MilestoneSubmissionForm, {
  SubmissionFormData,
} from "../milestone-submission-form";
import PlaceholderWrapper from "../placeholder-wrapper";

const useStyles = createStyles({
  pageContainer: {
    position: "relative",
  },
});

function CourseMilestoneSubmissionsViewPage() {
  const courseId = useGetCourseId();
  const milestoneId = useGetMilestoneId();
  const submissionId = useGetSubmissionId();
  const { classes } = useStyles();
  const { milestone } = useGetSingleMilestoneQueryState(
    courseId === undefined || milestoneId === undefined
      ? skipToken
      : { courseId, milestoneId },
    { selectFromResult: ({ data: milestone }) => ({ milestone }) },
  );
  const { submission, isFetching, isLoading, error } =
    useGetSingleSubmissionQuery(
      courseId === undefined || submissionId === undefined
        ? skipToken
        : { courseId, submissionId },
      {
        selectFromResult: ({
          data: submission,
          isFetching,
          isLoading,
          error,
        }) => ({
          submission,
          isFetching,
          isLoading,
          error,
        }),
        // get the most updated submission data before editing
        refetchOnMountOrArgChange: true,
        // do not want refetch while using is editing the form
        refetchOnReconnect: false,
      },
    );
  useResolveError({ error, name: "course-milestone-submissions-view-page" });
  const formRef = useRef<ElementRef<typeof MilestoneSubmissionForm>>(null);
  const [updateSubmission] = useUpdateSubmissionMutation({
    selectFromResult: emptySelector,
  });

  const isMilestoneOpen = checkIsMilestoneOpen(milestone);

  const onUpdateSubmission = async (formData: SubmissionFormData) => {
    if (
      courseId === undefined ||
      submissionId === undefined ||
      submission === undefined
    ) {
      return;
    }

    const { name, description } = submission;
    const { isDraft, submissionType, formResponseData, group } = formData;
    const typedFormResponseData = formResponseData as FormResponseField[];

    const submissionPutData: SubmissionPutData = {
      name,
      description,
      isDraft,
      submissionType,
      formResponseData: typedFormResponseData,
      groupId: group?.id ?? null,
    };

    const updatedSubmission = await updateSubmission({
      ...submissionPutData,
      courseId,
      submissionId,
    }).unwrap();

    toastUtils.success({
      message: "This submission has been updated successfully.",
    });
    formRef.current?.reset(updatedSubmission);
  };

  return (
    <PlaceholderWrapper
      py={150}
      isLoading={isLoading}
      loadingMessage="Loading submission..."
      showDefaultMessage={!submission}
      defaultMessage="No submission found."
    >
      <div className={classes.pageContainer}>
        <LoadingOverlay visible={isFetching} />
        {submission && (
          <MilestoneSubmissionForm
            ref={formRef}
            defaultValues={submission}
            readOnly={!isMilestoneOpen}
            onSubmit={onUpdateSubmission}
          />
        )}
      </div>
    </PlaceholderWrapper>
  );
}

export default CourseMilestoneSubmissionsViewPage;
