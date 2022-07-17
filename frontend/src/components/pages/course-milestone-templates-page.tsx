import { Button, Group, Paper, Stack, Title } from "@mantine/core";
import { skipToken } from "@reduxjs/toolkit/query/react";
import { ReactNode } from "react";
import { useGetCourseId } from "../../custom-hooks/use-get-course-id";
import { useGetMilestoneAlias } from "../../custom-hooks/use-get-milestone-alias";
import { useGetTemplatesQuery } from "../../redux/services/templates-api";
import { useResolveError } from "../../utils/error-utils";
import CourseMilestoneTemplatesTable from "../milestone-templates-table";
import PlaceholderWrapper from "../placeholder-wrapper";

type Props = {
  children?: ReactNode;
};

function CourseMilestoneTemplatesPage({ children }: Props) {
  const courseId = useGetCourseId();
  const { milestoneAlias, capitalizedMilestoneAlias } = useGetMilestoneAlias();
  const {
    data: milestoneTemplates,
    isLoading,
    error,
  } = useGetTemplatesQuery(courseId ?? skipToken);
  // important! The very first (outermost) api call needs to resolve the error
  // subsequent api calls to the same endpoint do not need to resolve error since it is already handled here
  const { errorMessage } = useResolveError({
    error,
    name: "course-milestone-templates-page",
  });

  console.log(children);

  return (
    <PlaceholderWrapper
      isLoading={isLoading}
      py={150}
      loadingMessage={`Loading ${milestoneAlias} templates...`}
      defaultMessage={errorMessage}
      showDefaultMessage={Boolean(errorMessage)}
    >
      {/* <Grid align="flex-end">
          <Grid.Col span={8} xl={9}> */}
      {milestoneTemplates && (
        <Group noWrap grow>
          {children}

          <Stack>
            <Group position="apart">
              <Title order={3}>{capitalizedMilestoneAlias} Templates</Title>
              <Button color="teal">Create new template</Button>
            </Group>

            <Paper withBorder shadow="sm" p="md" radius="md">
              <CourseMilestoneTemplatesTable
                milestoneTemplates={milestoneTemplates}
              />
            </Paper>
          </Stack>
        </Group>
      )}

      {/* </Grid.Col> */}

      {/* <Grid.Col span={4} xl={3}>
            <Title order={4}>Existing Templates</Title>
          </Grid.Col>

          <Grid.Col span={8} xl={9}>
            <PlaceholderWrapper
              sx={{
                minHeight: "600px",
                border: "dashed 4px #5c5f66",
                borderRadius: "20px",
              }}
              textProps={{ color: "dimmed" }}
              showDefaultMessage
              defaultMessage="Select an existing template from the right to view/edit or create a new one"
            />
          </Grid.Col>

          <Grid.Col span={4} xl={3}>
            <Box sx={{ height: "600px", background: "red" }} />
          </Grid.Col> */}
      {/* </Grid> */}
    </PlaceholderWrapper>
  );
}

export default CourseMilestoneTemplatesPage;
