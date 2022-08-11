import { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import Head from "next/head";
import { Text, Title, Tabs, Space, createStyles } from "@mantine/core";
import { skipToken } from "@reduxjs/toolkit/query/react";
import pluralize from "pluralize";
import { useGetSingleCourseQuery } from "../redux/services/courses-api";
import PlaceholderWrapper from "./placeholder-wrapper";
import { APP_NAME } from "../constants";
import { useResolveError } from "../utils/error-utils";
import useGetMilestoneAlias from "../custom-hooks/use-get-milestone-alias";
import useGetCourseId from "../custom-hooks/use-get-course-id";

const useStyles = createStyles({
  tab: {
    "&:hover": {
      backgroundColor: "initial",
    },
  },
});

const tabDetails: { value: string; label?: string }[] = [
  {
    value: "milestones",
    label: undefined,
  },
  {
    value: "groups",
    label: "Course Members and Groups",
  },
  {
    value: "details",
    label: "Course Details",
  },
];

type Props = {
  children: ReactNode;
};

function CoursePageLayout({ children }: Props) {
  const courseId = useGetCourseId();
  const { course, isLoading, error } = useGetSingleCourseQuery(
    courseId ?? skipToken,
    {
      selectFromResult: ({ data: course, isLoading, error }) => ({
        course,
        isLoading,
        error,
      }),
    },
  );
  // important! The very first (outermost) api call needs to resolve the error
  // subsequent api calls to the same endpoint do not need to resolve error since it is already handled here
  useResolveError({ error, name: "course-page-layout" });
  const { pathname } = useLocation();
  const { capitalizedMilestoneAlias } = useGetMilestoneAlias();
  const { classes } = useStyles();

  // update label during runtime
  tabDetails[0].label = pluralize(capitalizedMilestoneAlias);

  const activeIndex = (() => {
    // get the course tab component name from pathname
    // e.g. ["", "courses", ":courseId", <component name>]
    const componentName = pathname.split("/")[3];
    const index = tabDetails.findIndex(({ value }) => value === componentName);
    return index >= 0 ? index : 0;
  })();

  return (
    <PlaceholderWrapper
      isLoading={isLoading}
      py={150}
      loadingMessage="Loading course..."
      showDefaultMessage={course === undefined}
      defaultMessage="No course found."
    >
      <Head>
        <title>
          {tabDetails[activeIndex].label} - {course?.name} | {APP_NAME}
        </title>
      </Head>

      <Title order={2}>{course?.name}</Title>

      <Space h={8} />

      <Tabs value={tabDetails[activeIndex].value} loop>
        <Tabs.List>
          {tabDetails.map(({ value, label }) => (
            <Text<typeof Link> key={value} component={Link} to={value}>
              <Tabs.Tab className={classes.tab} value={value}>
                <Text span weight={500} size="md">
                  {label}
                </Text>
              </Tabs.Tab>
            </Text>
          ))}
        </Tabs.List>

        {tabDetails.map(({ value }) => (
          <Tabs.Panel pt="md" key={value} value={value}>
            {children}
          </Tabs.Panel>
        ))}
      </Tabs>
    </PlaceholderWrapper>
  );
}

export default CoursePageLayout;
