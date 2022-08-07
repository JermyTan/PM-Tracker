import { ReactNode } from "react";
import { skipToken } from "@reduxjs/toolkit/query/react";
import Head from "next/head";
import { Anchor, Breadcrumbs, Stack, Text } from "@mantine/core";
import { generatePath, Link, matchPath, useLocation } from "react-router-dom";
import { APP_NAME } from "../constants";
import useGetCourseId from "../custom-hooks/use-get-course-id";
import useGetMilestoneAlias from "../custom-hooks/use-get-milestone-alias";
import useGetMilestoneId from "../custom-hooks/use-get-milestone-id";
import { useGetSingleMilestoneQuery } from "../redux/services/milestones-api";
import { useResolveError } from "../utils/error-utils";
import PlaceholderWrapper from "./placeholder-wrapper";
import {
  COURSE_MILESTONE_SUBMISSIONS_PATH,
  COURSE_MILESTONE_SUBMISSIONS_TEMPLATES_PATH,
  COURSE_SINGLE_MILESTONE_PATH,
} from "../routes/paths";

type Props = {
  children: ReactNode;
};

function MilestoneLayout({ children }: Props) {
  const courseId = useGetCourseId();
  const milestoneId = useGetMilestoneId();
  const { milestoneAlias } = useGetMilestoneAlias();
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

  const crumbs = (() => {
    if (!milestone?.name) {
      return [];
    }

    const components: { name: string; path: string }[] = [
      {
        name: milestone.name,
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
        name: "Templates",
        path: generatePath(COURSE_MILESTONE_SUBMISSIONS_TEMPLATES_PATH, {
          courseId,
          milestoneId,
        }),
      });
    }

    return components.map(({ name, path }, index) => (
      <Anchor<typeof Link>
        size="lg"
        key={`${index}.${name}`}
        component={Link}
        to={path}
      >
        {name}
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
          {milestone?.name} | {APP_NAME}
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
