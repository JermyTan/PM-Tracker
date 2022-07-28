import {
  Anchor,
  Text,
  Group,
  Paper,
  Space,
  Stack,
  Title,
  useMantineTheme,
} from "@mantine/core";
import { HiOutlineChevronLeft } from "react-icons/hi";
import { generatePath, Link, useNavigate } from "react-router-dom";
import { useGetCourseId } from "../../custom-hooks/use-get-course-id";
import { useGetMilestoneAlias } from "../../custom-hooks/use-get-milestone-alias";
import { useCreateTemplateMutation } from "../../redux/services/templates-api";
import { COURSE_MILESTONE_TEMPLATES_PATH } from "../../routes/paths";
import { colorModeValue } from "../../utils/theme-utils";
import toastUtils from "../../utils/toast-utils";
import MilestoneTemplateFormBuilder, {
  MilestoneTemplateFormBuilderData,
} from "../milestone-template-form-builder";

function CourseMilestoneTemplatesCreationPage() {
  const { capitalizedMilestoneAlias } = useGetMilestoneAlias();
  const { colorScheme } = useMantineTheme();
  const courseId = useGetCourseId();
  const [createTemplate] = useCreateTemplateMutation();
  const navigate = useNavigate();

  const onCreateTemplate = async (
    formData: MilestoneTemplateFormBuilderData,
  ) => {
    if (courseId === undefined) {
      return;
    }

    const newTemplate = await createTemplate({
      ...formData,
      courseId,
    }).unwrap();

    toastUtils.success({
      message: "The new template has been created successfully.",
    });

    navigate(`../${newTemplate.id}`);
  };

  return (
    <Stack>
      <div>
        <Anchor<typeof Link>
          component={Link}
          to={generatePath(COURSE_MILESTONE_TEMPLATES_PATH, {
            courseId,
          })}
          color={colorModeValue(colorScheme, {
            lightModeValue: "dark",
            darkModeValue: "gray",
          })}
        >
          <Group spacing={4}>
            <HiOutlineChevronLeft />
            <Text<"span"> component="span" inherit>
              Back
            </Text>
          </Group>
        </Anchor>
      </div>

      <Paper
        // sx={{ maxWidth: "600px", width: "100%", alignSelf: "center" }}
        withBorder
        shadow="sm"
        p="md"
        radius="md"
      >
        <Title order={3}>{capitalizedMilestoneAlias} Template Creation</Title>

        <Space h="md" />

        <MilestoneTemplateFormBuilder
          onSubmit={onCreateTemplate}
          submitButtonProps={{ children: "Create" }}
        />
      </Paper>
    </Stack>
  );
}

export default CourseMilestoneTemplatesCreationPage;
