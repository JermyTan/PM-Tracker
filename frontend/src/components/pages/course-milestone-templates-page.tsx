import { Box, Button, Grid, Group, Stack, Title } from "@mantine/core";
import { skipToken } from "@reduxjs/toolkit/query/react";
import { capitalCase } from "change-case";
import Head from "next/head";
import { APP_NAME } from "../../constants";
import { useGetCourseId } from "../../custom-hooks/use-get-course-id";
import { useGetMilestoneAlias } from "../../custom-hooks/use-get-milestone-alias";
import { useGetSingleCourseQueryState } from "../../redux/services/courses-api";
import PlaceholderWrapper from "../placeholder-wrapper";

function CourseMilestoneTemplatesPage() {
  const courseId = useGetCourseId();
  const milestoneAlias = useGetMilestoneAlias();
  const { courseName } = useGetSingleCourseQueryState(courseId ?? skipToken, {
    selectFromResult: ({ data: course }) => ({
      courseName: course?.name,
    }),
  });
  const title = `${capitalCase(milestoneAlias)} Templates`;

  return (
    <>
      <Head>
        <title>
          {title} - {courseName} | {APP_NAME}
        </title>
      </Head>

      <Grid align="flex-end">
        <Grid.Col span={8} xl={9}>
          <Group position="apart">
            <Title order={3}>{title}</Title>
            <Button color="teal">Create new template</Button>
          </Group>
        </Grid.Col>

        <Grid.Col span={4} xl={3}>
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
        </Grid.Col>
      </Grid>
    </>
  );
}

export default CourseMilestoneTemplatesPage;
