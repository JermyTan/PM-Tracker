import { Button, Group, Paper, Stack, Text } from "@mantine/core";
import { useModals } from "@mantine/modals";
import { createSelector } from "@reduxjs/toolkit";
import { skipToken } from "@reduxjs/toolkit/query/react";
import { useMemo } from "react";
import { RiFileEditLine } from "react-icons/ri";
import { generatePath, Link, useNavigate } from "react-router-dom";
import useGetCourseId from "../../custom-hooks/use-get-course-id";
import useGetTemplateId from "../../custom-hooks/use-get-template-id";
import {
  useDeleteTemplateMutation,
  useGetTemplatesQueryState,
} from "../../redux/services/templates-api";
import { COURSE_MILESTONE_TEMPLATES_PATH } from "../../routes/paths";
import { transformTemplateToSubmissionView } from "../../types/submissions";
import { TemplateData } from "../../types/templates";
import { useResolveError } from "../../utils/error-utils";
import toastUtils from "../../utils/toast-utils";
import MilestoneSubmissionForm from "../milestone-submission-form";
import PlaceholderWrapper from "../placeholder-wrapper";

function CourseMilestoneTemplatesViewPage() {
  const courseId = useGetCourseId();
  const templateId = useGetTemplateId();
  const selectSubmissionView = useMemo(
    () =>
      createSelector(
        (milestoneTemplates?: TemplateData[]) => milestoneTemplates,
        (_: unknown, templateId?: string) => templateId,
        (milestoneTemplates, templateId) =>
          transformTemplateToSubmissionView({
            template: milestoneTemplates?.find(
              ({ id }) => `${id}` === templateId,
            ),
          }),
      ),
    [],
  );
  const { submissionView } = useGetTemplatesQueryState(courseId ?? skipToken, {
    selectFromResult: ({ data: milestoneTemplates }) => ({
      submissionView: selectSubmissionView(milestoneTemplates, templateId),
    }),
  });
  const [deleteTemplate, { isLoading }] = useDeleteTemplateMutation({
    selectFromResult: ({ isLoading }) => ({ isLoading }),
  });
  const { resolveError } = useResolveError({
    name: "course-milestone-templates-view-page",
  });
  const navigate = useNavigate();
  const modals = useModals();

  const onDeleteTemplate = async () => {
    if (isLoading || courseId === undefined || templateId === undefined) {
      return;
    }

    try {
      await deleteTemplate({ courseId, templateId }).unwrap();

      toastUtils.success({
        message: "The template has been deleted successfully.",
      });

      navigate(
        generatePath(COURSE_MILESTONE_TEMPLATES_PATH, {
          courseId,
        }),
      );
    } catch (error) {
      resolveError(error);
    }
  };

  const openDeleteModal = () =>
    modals.openConfirmModal({
      title: "Delete this template",
      closeButtonLabel: "Cancel template deletion",
      centered: true,
      children: (
        <Text size="sm">
          Are you sure you want to delete this template (
          <strong>{submissionView?.name}</strong>)?
          <br />
          <strong>This action is destructive and irreversible.</strong>
        </Text>
      ),
      labels: { confirm: "Delete template", cancel: "No don't delete" },
      confirmProps: { color: "red", loading: isLoading },
      onConfirm: onDeleteTemplate,
    });

  return (
    <PlaceholderWrapper
      py={150}
      defaultMessage="No template found."
      showDefaultMessage={!submissionView}
    >
      {submissionView && (
        <Stack>
          <Group position="right">
            <Button<typeof Link>
              component={Link}
              to="edit"
              leftIcon={<RiFileEditLine />}
            >
              Edit template
            </Button>
            <Button
              color="red"
              leftIcon={<RiFileEditLine />}
              onClick={openDeleteModal}
              loading={isLoading}
              disabled={isLoading}
            >
              Delete template
            </Button>
          </Group>

          <Paper withBorder shadow="sm" p="md" radius="md">
            <MilestoneSubmissionForm defaultValues={submissionView} readOnly />
          </Paper>
        </Stack>
      )}
    </PlaceholderWrapper>
  );
}

export default CourseMilestoneTemplatesViewPage;
