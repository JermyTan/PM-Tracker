import { Space, Title, Text, Stack } from "@mantine/core";
import Head from "next/head";
import { APP_NAME, SUPPORT_EMAIL } from "../../constants";
import { useAppSelector } from "../../redux/hooks";
import TextViewer from "../text-viewer";

function DashboardPage() {
  const userName = useAppSelector(({ currentUser }) => currentUser?.user?.name);
  return (
    <>
      <Head>
        <title>Dashboard | {APP_NAME}</title>
      </Head>

      <TextViewer withLinkify overflowWrap preserveWhiteSpace>
        <Stack spacing="xl">
          <Title order={2}>Welcome, {userName}!</Title>
          <Title order={3}>
            Head over to the &quot;My Courses&quot; tab to view your registered
            courses.
          </Title>

          <Text size="sm">
            <strong>Note:</strong> {APP_NAME} is currently in development and we
            are working hard towards providing you a pleasure user experience.
            For urgent queries or if you have found any bugs, please contact us
            at {SUPPORT_EMAIL}.
          </Text>
          <iframe
            title="NUSMods"
            width="100%"
            height="600px"
            src="https://nusmods.com"
          />
        </Stack>
      </TextViewer>
    </>
  );
}

export default DashboardPage;
