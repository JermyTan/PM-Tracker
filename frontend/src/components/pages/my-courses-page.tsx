import { Button, Group, Title, Text, createStyles, Space } from "@mantine/core";
import Head from "next/head";
import { HiViewGridAdd, HiRefresh } from "react-icons/hi";
import { APP_NAME } from "../../constants";
import { useGetCoursesQuery } from "../../redux/services/courses-api";
import { AccountType } from "../../types/users";
import PlaceholderWrapper from "../placeholder-wrapper";
import AccountTypeRestrictedWrapper from "../account-type-restricted-wrapper";
import { useResolveError } from "../../utils/error-utils";

const useStyles = createStyles({
  content: {
    whiteSpace: "break-spaces",
  },
});

function MyCoursesPage() {
  const { data, isLoading, isFetching, refetch, error } = useGetCoursesQuery();
  const { classes } = useStyles();
  useResolveError(error);

  return (
    <>
      <Head>
        <title>My Courses | {APP_NAME}</title>
      </Head>

      <Group position="apart">
        <Title>My Courses</Title>

        <Group>
          <Button
            leftIcon={<HiRefresh />}
            onClick={refetch}
            loading={isFetching}
          >
            Refresh
          </Button>

          <AccountTypeRestrictedWrapper
            allowedAccountTypes={[AccountType.Educator, AccountType.Admin]}
          >
            <Button color="green" leftIcon={<HiViewGridAdd />}>
              Create new course
            </Button>
          </AccountTypeRestrictedWrapper>
        </Group>
      </Group>

      <Space h="md" />

      <PlaceholderWrapper
        isLoading={isLoading}
        py={150}
        loadingMessage="Loading my courses..."
      >
        <Text className={classes.content}>{JSON.stringify(data, null, 4)}</Text>
      </PlaceholderWrapper>
    </>
  );
}

export default MyCoursesPage;
