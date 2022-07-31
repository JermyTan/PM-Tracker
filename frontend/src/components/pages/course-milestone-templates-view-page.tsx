import { Button, Group, Paper, Stack } from "@mantine/core";
import { skipToken } from "@reduxjs/toolkit/query/react";
import { RiFileEditLine } from "react-icons/ri";
import { Link } from "react-router-dom";
import useGetCourseId from "../../custom-hooks/use-get-course-id";
import useGetTemplateId from "../../custom-hooks/use-get-template-id";
import { useGetTemplatesQueryState } from "../../redux/services/templates-api";
import PlaceholderWrapper from "../placeholder-wrapper";

function CourseMilestoneTemplatesViewPage() {
  const courseId = useGetCourseId();
  const templateId = useGetTemplateId();
  const { milestoneTemplate } = useGetTemplatesQueryState(
    courseId ?? skipToken,
    {
      selectFromResult: ({ data: milestoneTemplates }) => ({
        milestoneTemplate: milestoneTemplates?.find(
          ({ id }) => `${id}` === templateId,
        ),
      }),
    },
  );

  return (
    <PlaceholderWrapper
      py={150}
      defaultMessage="No template found."
      showDefaultMessage={!milestoneTemplate}
    >
      <Stack>
        <Group position="right">
          <Button<typeof Link>
            component={Link}
            to="edit"
            leftIcon={<RiFileEditLine />}
          >
            Edit template
          </Button>
        </Group>

        <Paper withBorder shadow="sm" p="md" radius="md">
          Hello world
        </Paper>
      </Stack>
    </PlaceholderWrapper>
  );
}

export default CourseMilestoneTemplatesViewPage;
