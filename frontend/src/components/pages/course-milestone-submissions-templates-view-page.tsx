import { Stack, Group, Paper, Button } from "@mantine/core";
import { useDidUpdate } from "@mantine/hooks";
import { skipToken } from "@reduxjs/toolkit/query/react";
import { ElementRef, useMemo, useRef } from "react";
import { FiFileText } from "react-icons/fi";
import { generatePath, useNavigate } from "react-router-dom";
import useGetCourseId from "../../custom-hooks/use-get-course-id";
import useGetMilestoneId from "../../custom-hooks/use-get-milestone-id";
import useGetTemplateId from "../../custom-hooks/use-get-template-id";
import { useCreateSubmissionMutation } from "../../redux/services/submissions-api";
import { useGetTemplatesQueryState } from "../../redux/services/templates-api";
import { COURSE_MILESTONE_SINGLE_SUBMISSION_PATH } from "../../routes/paths";
import {
  transformTemplateToSubmissionView,
  SubmissionPostData,
} from "../../types/submissions";
import { useResolveError } from "../../utils/error-utils";
import MilestoneSubmissionForm from "../milestone-submission-form";
import PlaceholderWrapper from "../placeholder-wrapper";

function CourseMilestoneSubmissionsTemplatesViewPage() {
  const courseId = useGetCourseId();
  const milestoneId = useGetMilestoneId();
  const templateId = useGetTemplateId();
  const { milestoneTemplates } = useGetTemplatesQueryState(
    courseId ?? skipToken,
    {
      selectFromResult: ({ data: milestoneTemplates }) => ({
        milestoneTemplates,
      }),
    },
  );
  const submissionView = useMemo(
    () =>
      transformTemplateToSubmissionView({
        template: milestoneTemplates?.find(({ id }) => `${id}` === templateId),
      }),
    [templateId, milestoneTemplates],
  );
  const [createSubmission, { isLoading }] = useCreateSubmissionMutation({
    selectFromResult: ({ isLoading }) => ({ isLoading }),
  });
  const navigate = useNavigate();
  const formRef = useRef<ElementRef<typeof MilestoneSubmissionForm>>(null);
  const { resolveError } = useResolveError({
    name: "course-milestone-submissions-templates-view-page",
  });

  // creates blank submission
  const onUseTemplate = async () => {
    if (
      isLoading ||
      courseId === undefined ||
      milestoneId === undefined ||
      submissionView === undefined ||
      submissionView.template?.id === undefined
    ) {
      return;
    }

    try {
      const { name, description, submissionType, isDraft, formResponseData } =
        submissionView;
      const submissionPostData: SubmissionPostData = {
        name,
        description,
        submissionType,
        isDraft,
        formResponseData,
        groupId: null, // TODO: update to GroupData | null
        milestoneId,
        templateId: submissionView.template.id,
      };

      const { id } = await createSubmission({
        ...submissionPostData,
        courseId,
      }).unwrap();

      navigate(
        generatePath(COURSE_MILESTONE_SINGLE_SUBMISSION_PATH, {
          courseId,
          milestoneId,
          submissionId: `${id}`,
        }),
      );
    } catch (error) {
      resolveError(error);
    }
  };

  // this is required to tell the form that the submissionView has changed
  // due to useForm ignoring changes to the supplied defaultValues
  useDidUpdate(() => {
    formRef.current?.reset(submissionView);
  }, [submissionView]);

  return (
    <PlaceholderWrapper
      py={150}
      defaultMessage="No template found."
      showDefaultMessage={!submissionView}
    >
      {submissionView && (
        <Stack>
          <Group position="right">
            <Button
              loading={isLoading}
              disabled={isLoading}
              leftIcon={<FiFileText />}
              onClick={onUseTemplate}
            >
              Use template
            </Button>
          </Group>

          <Paper withBorder shadow="sm" p="md" radius="md">
            <MilestoneSubmissionForm
              ref={formRef}
              defaultValues={submissionView}
              readOnly
            />
          </Paper>
        </Stack>
      )}
    </PlaceholderWrapper>
  );
}

export default CourseMilestoneSubmissionsTemplatesViewPage;
