import { ReactNode } from "react";
import { skipToken } from "@reduxjs/toolkit/query/react";
import Head from "next/head";
import { Anchor, Badge, Breadcrumbs, Group, Stack, Text } from "@mantine/core";
import { generatePath, Link, matchPath, useLocation } from "react-router-dom";
import { APP_NAME } from "../constants";
import useGetCourseId from "../custom-hooks/use-get-course-id";
import useGetMilestoneAlias from "../custom-hooks/use-get-milestone-alias";
import useGetMilestoneId from "../custom-hooks/use-get-milestone-id";
import { useGetSingleMilestoneQuery } from "../redux/services/milestones-api";
import { useResolveError } from "../utils/error-utils";
import PlaceholderWrapper from "./placeholder-wrapper";
import {
  COURSE_MILESTONE_SINGLE_SUBMISSION_PATH,
  COURSE_MILESTONE_SUBMISSIONS_PATH,
  COURSE_MILESTONE_SUBMISSIONS_TEMPLATES_PATH,
} from "../routes/paths";
import { checkIsMilestoneOpen } from "../utils/misc-utils";
import useGetSubmissionId from "../custom-hooks/use-get-submission-id";
import { useGetSingleSubmissionQueryState } from "../redux/services/submissions-api";
import { useGetSingleCourseQueryState } from "../redux/services/courses-api";

type Props = {
  children: ReactNode;
};

function MilestoneLayout({ children }: Props) {
  const courseId = useGetCourseId();
  const milestoneId = useGetMilestoneId();
  const { milestoneAlias } = useGetMilestoneAlias();
  const { courseName } = useGetSingleCourseQueryState(courseId ?? skipToken, {
    selectFromResult: ({ data: course }) => ({
      courseName: course?.name,
    }),
  });
  const submissionId = useGetSubmissionId();
  const { submission, isFetching } = useGetSingleSubmissionQueryState(
    courseId === undefined || submissionId === undefined
      ? skipToken
      : { courseId, submissionId },
    {
      selectFromResult: ({ data: submission, isFetching }) => ({
        submission,
        isFetching,
      }),
    },
  );
  const { milestone, isLoading, error } = useGetSingleMilestoneQuery(
    courseId === undefined || milestoneId === undefined
      ? skipToken
      : { courseId, milestoneId },
    {
      selectFromResult: ({ data: milestone, isLoading, error }) => ({
        milestone,
        isLoading,
        error,
      }),
    },
  );
  // important! The very first (outermost) api call needs to resolve the error
  // subsequent api calls to the same endpoint do not need to resolve error since it is already handled here
  useResolveError({ error, name: "milestone-layout" });
  const { pathname } = useLocation();
  const isOpen = checkIsMilestoneOpen(milestone);

  const crumbs = (() => {
    if (!milestone?.name) {
      return [];
    }

    const components: { label: ReactNode; path: string }[] = [
      {
        label: (
          <Group spacing={4}>
            <Text<"span"> component="span" inherit>
              {milestone.name}
            </Text>
            <Badge variant="outline" color={isOpen ? "green" : "red"}>
              {isOpen ? "Open" : "Closed"}
            </Badge>
          </Group>
        ),
        path: generatePath(COURSE_MILESTONE_SUBMISSIONS_PATH, {
          courseId,
          milestoneId,
        }),
      },
    ];

    // if (matchPath(COURSE_MILESTONE_SUBMISSIONS_PATH, pathname)) {
    //   components.push({
    //     name: "Submissions",
    //     path: generatePath(COURSE_MILESTONE_SUBMISSIONS_PATH, {
    //       courseId,
    //       milestoneId,
    //     }),
    //   });
    // }

    if (
      matchPath(
        { path: COURSE_MILESTONE_SUBMISSIONS_TEMPLATES_PATH, end: false },
        pathname,
      )
    ) {
      components.push({
        label: "Templates",
        path: generatePath(COURSE_MILESTONE_SUBMISSIONS_TEMPLATES_PATH, {
          courseId,
          milestoneId,
        }),
      });
    } else if (
      submissionId !== undefined &&
      submission &&
      !isFetching &&
      matchPath(
        { path: COURSE_MILESTONE_SINGLE_SUBMISSION_PATH, end: false },
        pathname,
      )
    ) {
      components.push({
        label: submission.name,
        path: generatePath(COURSE_MILESTONE_SINGLE_SUBMISSION_PATH, {
          courseId,
          milestoneId,
          submissionId,
        }),
      });
    }

    return components.map(({ label, path }, index) => (
      <Anchor<typeof Link>
        size="lg"
        key={`${index}.${path}`}
        component={Link}
        to={path}
      >
        {label}
      </Anchor>
    ));
  })();

  return (
    <PlaceholderWrapper
      isLoading={isLoading}
      py={150}
      loadingMessage={`Loading ${milestoneAlias}...`}
      showDefaultMessage={milestone === undefined}
      defaultMessage={`No ${milestoneAlias} found.`}
    >
      <Head>
        <title>
          {milestone?.name} - {courseName} | {APP_NAME}
        </title>
      </Head>

      <Stack>
        <Breadcrumbs>{crumbs}</Breadcrumbs>

        <div>{children}</div>
      </Stack>
    </PlaceholderWrapper>
  );
}

export default MilestoneLayout;
