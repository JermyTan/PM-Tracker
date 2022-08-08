import {
  Button,
  Group,
  Paper,
  SegmentedControl,
  SegmentedControlItem,
  Stack,
  Title,
} from "@mantine/core";
import { skipToken } from "@reduxjs/toolkit/query/react";
import { capitalCase } from "change-case";
import { useMemo } from "react";
import { FaPlus } from "react-icons/fa";
import { Link, useSearchParams } from "react-router-dom";
import useGetCourseId from "../../custom-hooks/use-get-course-id";
import useGetMilestoneId from "../../custom-hooks/use-get-milestone-id";
import { useGetSubmissionsQuery } from "../../redux/services/submissions-api";
import { useResolveError } from "../../utils/error-utils";
import CourseSubmissionsTable from "../course-submissions-table";
import PlaceholderWrapper from "../placeholder-wrapper";
import SubmissionSummarySection from "../submission-summary-section";

enum SubmissionViewOption {
  All = "all",
  Final = "final",
  Draft = "draft",
}

const SUBMISSION_VIEW_OPTIONS = Object.values(SubmissionViewOption) as string[];

const SUBMISSION_VIEW_OPTION_ITEMS: SegmentedControlItem[] =
  SUBMISSION_VIEW_OPTIONS.map((option) => ({
    label: capitalCase(option),
    value: option,
  }));

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
  const [searchParams, setSearchParams] = useSearchParams();

  const selectedView = (() => {
    const submissionViewOption = searchParams.get("view");
    if (
      submissionViewOption === null ||
      !SUBMISSION_VIEW_OPTIONS.includes(submissionViewOption)
    ) {
      return SubmissionViewOption.All;
    }

    return submissionViewOption;
  })();

  const onSelectedViewChange = (value: string) => {
    if (value === SubmissionViewOption.All) {
      searchParams.delete("view");
    } else {
      searchParams.set("view", value);
    }

    setSearchParams(searchParams);
  };

  const filteredSubmissions = useMemo(() => {
    if (selectedView === SubmissionViewOption.All) {
      return submissions;
    }

    return submissions?.filter(
      ({ isDraft }) =>
        isDraft === (selectedView === SubmissionViewOption.Draft),
    );
  }, [selectedView, submissions]);

  const selectedSubmissionId = searchParams.get("id");
  const selectedSubmission = useMemo(() => {
    if (selectedSubmissionId === null) {
      return undefined;
    }

    return filteredSubmissions?.find(
      ({ id }) => selectedSubmissionId === `${id}`,
    );
  }, [selectedSubmissionId, filteredSubmissions]);

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
        {filteredSubmissions && (
          <>
            <Paper withBorder shadow="sm" p="md" radius="md">
              <Stack>
                <div>
                  <SegmentedControl
                    data={SUBMISSION_VIEW_OPTION_ITEMS}
                    value={selectedView}
                    onChange={onSelectedViewChange}
                  />
                </div>
                <CourseSubmissionsTable submissions={filteredSubmissions} />
              </Stack>
            </Paper>

            {selectedSubmission && (
              <Paper withBorder shadow="sm" p="md" radius="md">
                <SubmissionSummarySection {...selectedSubmission} />
              </Paper>
            )}
          </>
        )}
      </PlaceholderWrapper>
    </Stack>
  );
}

export default CourseMilestoneSubmissionsPage;
