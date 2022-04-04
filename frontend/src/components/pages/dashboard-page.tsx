import { Title } from "@mantine/core";
import Head from "next/head";
import { APP_NAME } from "../../constants";

function DashboardPage() {
  return (
    <>
      <Head>
        <title>Dashboard | {APP_NAME}</title>
      </Head>

      <Title>Dashboard</Title>
    </>
  );
}

export default DashboardPage;
