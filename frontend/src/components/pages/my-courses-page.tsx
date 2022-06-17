import {
  Button,
  Group,
  Title,
  Text,
  createStyles,
  Space,
  Drawer,
  ScrollArea,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import Head from "next/head";
import { HiViewGridAdd, HiRefresh } from "react-icons/hi";
import { APP_NAME } from "../../constants";
import { useGetCoursesQuery } from "../../redux/services/courses-api";
import { AccountType } from "../../types/users";
import PlaceholderWrapper from "../placeholder-wrapper";
import AccountTypeRestrictedWrapper from "../account-type-restricted-wrapper";
import { useResolveError } from "../../utils/error-utils";
import CourseCreationForm from "../course-creation-form";

const useStyles = createStyles({
  content: {
    whiteSpace: "break-spaces",
  },
});

function MyCoursesPage() {
  const { data, isLoading, isFetching, refetch, error } = useGetCoursesQuery();
  const { classes } = useStyles();
  useResolveError(error);
  const [isDrawerOpened, { open, close }] = useDisclosure(false);

  return (
    <>
      <Head>
        <title>My Courses | {APP_NAME}</title>
      </Head>

      <Drawer
        opened={isDrawerOpened}
        onClose={close}
        position="right"
        size="xl"
        padding="lg"
        closeButtonLabel="Cancel course creation"
        title={<Title order={2}>Course Creation</Title>}
      >
        <ScrollArea offsetScrollbars pr="xs" scrollbarSize={8}>
          <CourseCreationForm onSuccess={close} />
        </ScrollArea>
      </Drawer>

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
            <Button color="green" leftIcon={<HiViewGridAdd />} onClick={open}>
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
