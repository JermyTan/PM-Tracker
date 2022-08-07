import { Stack, Group, Paper, Button } from "@mantine/core";
import { useDidUpdate } from "@mantine/hooks";
import { skipToken } from "@reduxjs/toolkit/query/react";
import { ElementRef, useMemo, useRef } from "react";
import { FiFileText } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import useGetCourseId from "../../custom-hooks/use-get-course-id";
import useGetTemplateId from "../../custom-hooks/use-get-template-id";
import { useGetTemplatesQueryState } from "../../redux/services/templates-api";
import { transformTemplateToSubmissionView } from "../../types/submissions";
import MilestoneSubmissionForm from "../milestone-submission-form";
import PlaceholderWrapper from "../placeholder-wrapper";

function CourseMilestoneSubmissionsTemplatesViewPage() {
  const courseId = useGetCourseId();
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
  const navigate = useNavigate();
  const formRef = useRef<ElementRef<typeof MilestoneSubmissionForm>>(null);

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
            <Button leftIcon={<FiFileText />}>Use template</Button>
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
