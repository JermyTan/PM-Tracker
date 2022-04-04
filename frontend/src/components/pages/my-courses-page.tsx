import { Title } from "@mantine/core";
import Head from "next/head";
import { APP_NAME } from "../../constants";

function MyCoursesPage() {
  return (
    <>
      <Head>
        <title>My Courses | {APP_NAME}</title>
      </Head>

      <Title>My Courses</Title>
    </>
  );
}

export default MyCoursesPage;
