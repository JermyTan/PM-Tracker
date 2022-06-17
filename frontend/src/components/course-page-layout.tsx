import { ReactNode } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import Head from "next/head";
import { Text, Title, Tabs, Space, TabsProps } from "@mantine/core";
import { skipToken } from "@reduxjs/toolkit/query/react";
import { capitalCase } from "change-case";
import pluralize from "pluralize";
import { useGetSingleCourseQuery } from "../redux/services/courses-api";
import PlaceholderWrapper from "./placeholder-wrapper";
import { APP_NAME, MILESTONE } from "../constants";

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
  const { courseId } = useParams();
  const { course, isLoading } = useGetSingleCourseQuery(courseId ?? skipToken, {
    selectFromResult: ({ data: course, isLoading }) => ({ course, isLoading }),
  });
  const { pathname } = useLocation();
  const navigate = useNavigate();

  // update label during runtime
  tabDetails[0].label = pluralize(
    capitalCase(course?.milestoneAlias || MILESTONE),
  );

  const activeIndex = (() => {
    // get the course tab component name from pathname
    // e.g. ["", "courses", ":courseId", <component name>]
    const componentName = pathname.split("/")[3];
    const index = tabDetails.findIndex(({ key }) => key === componentName);
    return index >= 0 ? index : 0;
  })();

  const onTabChange: TabsProps["onTabChange"] = (_, tabKey) => {
    if (tabKey === undefined) {
      return;
    }

    navigate(tabKey);
  };

  return (
    <PlaceholderWrapper
      isLoading={isLoading}
      py={150}
      loadingMessage="Loading course..."
      showDefaultMessage={course === undefined}
      defaultMessage="No course found"
    >
      <Head>
        <title>
          {tabDetails[activeIndex].label} - {course?.name} | {APP_NAME}
        </title>
      </Head>

      <Title order={2}>{course?.name}</Title>

      <Space h="md" />

      <Tabs tabPadding="md" active={activeIndex} onTabChange={onTabChange}>
        {tabDetails.map(({ key, label }) => (
          <Tabs.Tab
            key={key}
            tabKey={key}
            label={
              <Text<typeof Link> component={Link} to={key} weight={500}>
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
