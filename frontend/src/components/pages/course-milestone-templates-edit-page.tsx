import { Paper, Title, Space } from "@mantine/core";
import { skipToken } from "@reduxjs/toolkit/query/react";
import { generatePath, useNavigate } from "react-router-dom";
import useGetCourseId from "../../custom-hooks/use-get-course-id";
import useGetMilestoneAlias from "../../custom-hooks/use-get-milestone-alias";
import useGetTemplateId from "../../custom-hooks/use-get-template-id";
import {
  useGetSingleTemplateQuery,
  useUpdateTemplateMutation,
} from "../../redux/services/templates-api";
import { emptySelector } from "../../redux/utils";
import { COURSE_MILESTONE_SINGLE_TEMPLATE_PATH } from "../../routes/paths";
import { useResolveError } from "../../utils/error-utils";
import toastUtils from "../../utils/toast-utils";
import MilestoneTemplateFormBuilder, {
  MilestoneTemplateFormBuilderData,
} from "../milestone-template-form-builder";
import PlaceholderWrapper from "../placeholder-wrapper";

function CourseMilestoneTemplatesEditPage() {
  const { capitalizedMilestoneAlias } = useGetMilestoneAlias();
  const courseId = useGetCourseId();
  const templateId = useGetTemplateId();
  const { milestoneTemplate, isFetching, error } = useGetSingleTemplateQuery(
    courseId === undefined || templateId === undefined
      ? skipToken
      : { courseId, templateId },
    {
      selectFromResult: ({ data: milestoneTemplate, isFetching, error }) => ({
        milestoneTemplate,
        isFetching,
        error,
      }),
      // get the most updated course data before editing
      refetchOnMountOrArgChange: true,
    },
  );
  useResolveError({ error, name: "course-milestone-templates-edit-page" });
  const [updateTemplate] = useUpdateTemplateMutation({
    selectFromResult: emptySelector,
  });
  const navigate = useNavigate();

  const onUpdateTemplate = async (
    formData: MilestoneTemplateFormBuilderData,
  ) => {
    if (courseId === undefined || templateId === undefined) {
      return;
    }

    const newTemplate = await updateTemplate({
      ...formData,
      courseId,
      templateId,
    }).unwrap();

    toastUtils.success({
      message: "The template has been updated successfully.",
    });

    navigate(
      generatePath(COURSE_MILESTONE_SINGLE_TEMPLATE_PATH, {
        courseId,
        templateId: `${newTemplate.id}`,
      }),
    );
  };

  return (
    <Paper withBorder shadow="sm" p="md" radius="md">
      <Title order={3}>{capitalizedMilestoneAlias} Template Update</Title>

      <Space h="md" />

      <PlaceholderWrapper
        py={150}
        isLoading={isFetching}
        loadingMessage="Loading template..."
        showDefaultMessage={!milestoneTemplate}
        defaultMessage="No template found."
      >
        <MilestoneTemplateFormBuilder
          onSubmit={onUpdateTemplate}
          submitButtonProps={{ children: "Save" }}
          defaultValues={milestoneTemplate}
        />
      </PlaceholderWrapper>
    </Paper>
  );
}

export default CourseMilestoneTemplatesEditPage;
