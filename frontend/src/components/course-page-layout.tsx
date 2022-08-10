import { ReactNode } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Head from "next/head";
import { Text, Title, Tabs, Space } from "@mantine/core";
import { skipToken } from "@reduxjs/toolkit/query/react";
import pluralize from "pluralize";
import { useGetSingleCourseQuery } from "../redux/services/courses-api";
import PlaceholderWrapper from "./placeholder-wrapper";
import { APP_NAME } from "../constants";
import { useResolveError } from "../utils/error-utils";
import useGetMilestoneAlias from "../custom-hooks/use-get-milestone-alias";
import useGetCourseId from "../custom-hooks/use-get-course-id";

type Props = {
  children: ReactNode;
};

const tabDetails = [
  {
    key: "milestones",
    label: undefined,
  },
  {
    key: "groups",
    label: "Course Members and Groups",
  },
  {
    key: "details",
    label: "Course Details",
  },
];

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
  const navigate = useNavigate();

  // update label during runtime
  tabDetails[0].label = pluralize(capitalizedMilestoneAlias);

  const activeIndex = (() => {
    // get the course tab component name from pathname
    // e.g. ["", "courses", ":courseId", <component name>]
    const componentName = pathname.split("/")[3];
    const index = tabDetails.findIndex(({ key }) => key === componentName);
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

      <Space h="md" />

      <Tabs
        tabPadding="md"
        active={activeIndex}
        onTabChange={(_, key) => key !== undefined && navigate(key)}
      >
        {tabDetails.map(({ key, label }) => (
          <Tabs.Tab
            key={key}
            tabKey={key}
            label={
              <Text<typeof Link>
                component={Link}
                to={key}
                weight={500}
                onClick={(event) => {
                  event.stopPropagation();
                }}
              >
                {label}
              </Text>
            }
          >
            {children}
          </Tabs.Tab>
        ))}
      </Tabs>
    </PlaceholderWrapper>
  );
}

export default CoursePageLayout;
