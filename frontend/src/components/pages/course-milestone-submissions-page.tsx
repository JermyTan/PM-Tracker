import { Button, Group, Paper, Stack, Title } from "@mantine/core";
import { skipToken } from "@reduxjs/toolkit/query/react";
import { FaPlus } from "react-icons/fa";
import { Link } from "react-router-dom";
import useGetCourseId from "../../custom-hooks/use-get-course-id";
import useGetMilestoneId from "../../custom-hooks/use-get-milestone-id";
import { useGetSubmissionsQuery } from "../../redux/services/submissions-api";
import { useResolveError } from "../../utils/error-utils";
import CourseSubmissionsTable from "../course-submissions-table";
import PlaceholderWrapper from "../placeholder-wrapper";

function CourseMilestoneSubmissionsPage() {
  const courseId = useGetCourseId();
  const milestoneId = useGetMilestoneId();
  const { submissions, isLoading, error } = useGetSubmissionsQuery(
    courseId === undefined || milestoneId === undefined
      ? skipToken
      : { courseId, milestoneId },
    {
      selectFromResult: ({ data: submissions, isLoading, error }) => ({
        submissions,
        isLoading,
        error,
      }),
    },
  );
  const { errorMessage } = useResolveError({
    error,
    name: "course-milestone-submissions-page",
  });

  return (
    <Stack>
      <Group position="apart">
        <Title order={3}>Submissions</Title>

        <Button<typeof Link>
          component={Link}
          to="templates"
          color="teal"
          leftIcon={<FaPlus />}
        >
          Create new submission
        </Button>
      </Group>

      <PlaceholderWrapper
        isLoading={isLoading}
        py={150}
        loadingMessage="Loading submissions..."
        defaultMessage={errorMessage}
        showDefaultMessage={Boolean(errorMessage)}
      >
        {submissions && (
          <Paper withBorder shadow="sm" p="md" radius="md">
            <CourseSubmissionsTable submissions={submissions} />
          </Paper>
        )}
      </PlaceholderWrapper>
    </Stack>
  );
}

export default CourseMilestoneSubmissionsPage;
