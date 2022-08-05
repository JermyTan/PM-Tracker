import { Paper, Space, Title } from "@mantine/core";
import { useNavigate } from "react-router-dom";
import useGetCourseId from "../../custom-hooks/use-get-course-id";
import useGetMilestoneAlias from "../../custom-hooks/use-get-milestone-alias";
import { useCreateTemplateMutation } from "../../redux/services/templates-api";
import { emptySelector } from "../../redux/utils";
import { TemplatePostData } from "../../types/templates";
import toastUtils from "../../utils/toast-utils";
import MilestoneTemplateFormBuilder, {
  MilestoneTemplateFormBuilderData,
} from "../milestone-template-form-builder";

function CourseMilestoneTemplatesCreationPage() {
  const { capitalizedMilestoneAlias } = useGetMilestoneAlias();
  const courseId = useGetCourseId();
  const [createTemplate] = useCreateTemplateMutation({
    selectFromResult: emptySelector,
  });
  const navigate = useNavigate();

  const onCreateTemplate = async (
    formData: MilestoneTemplateFormBuilderData,
  ) => {
    if (courseId === undefined) {
      return;
    }

    const newTemplate = await createTemplate({
      ...(formData as TemplatePostData),
      courseId,
    }).unwrap();

    toastUtils.success({
      message: "The new template has been created successfully.",
    });

    navigate(`../${newTemplate.id}`);
  };

  return (
    <Paper withBorder shadow="sm" p="md" radius="md">
      <Title order={3}>{capitalizedMilestoneAlias} Template Creation</Title>

      <Space h="md" />

      <MilestoneTemplateFormBuilder
        onSubmit={onCreateTemplate}
        submitButtonProps={{ children: "Create" }}
      />
    </Paper>
  );
}

export default CourseMilestoneTemplatesCreationPage;
