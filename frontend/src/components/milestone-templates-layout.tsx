import { ReactNode } from "react";
import Head from "next/head";
import { skipToken } from "@reduxjs/toolkit/query/react";
import { useGetCourseId } from "../custom-hooks/use-get-course-id";
import { useGetMilestoneAlias } from "../custom-hooks/use-get-milestone-alias";
import { useGetSingleCourseQueryState } from "../redux/services/courses-api";
import { APP_NAME } from "../constants";

type Props = {
  children: ReactNode;
};

function MilestoneTemplatesLayout({ children }: Props) {
  const courseId = useGetCourseId();
  const { capitalizedMilestoneAlias } = useGetMilestoneAlias();
  const { courseName } = useGetSingleCourseQueryState(courseId ?? skipToken, {
    selectFromResult: ({ data: course }) => ({
      courseName: course?.name,
    }),
  });

  return (
    <>
      <Head>
        <title>
          {capitalizedMilestoneAlias} Templates - {courseName} | {APP_NAME}
        </title>
      </Head>

      {children}
    </>
  );
}

export default MilestoneTemplatesLayout;
