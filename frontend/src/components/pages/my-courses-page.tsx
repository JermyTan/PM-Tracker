import {
  Button,
  Group,
  Title,
  Space,
  SimpleGrid,
  Drawer,
  ScrollArea,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import Head from "next/head";
import { HiViewGridAdd } from "react-icons/hi";
import { APP_NAME } from "../../constants";
import { useGetCoursesQuery } from "../../redux/services/courses-api";
import PlaceholderWrapper from "../placeholder-wrapper";
import ConditionalRenderer from "../conditional-renderer";
import { useResolveError } from "../../utils/error-utils";
import CourseCard from "../course-card";
import CourseCreationForm from "../course-creation-form";
import useGetCoursePermissions from "../../custom-hooks/use-get-course-permissions";

function MyCoursesPage() {
  const { courses, isLoading, error } = useGetCoursesQuery(undefined, {
    selectFromResult: ({ data: courses, isLoading, error }) => ({
      courses,
      isLoading,
      error,
    }),
  });
  // important! The very first (outermost) api call needs to resolve the error
  // subsequent api calls to the same endpoint do not need to resolve error since it is already handled here
  useResolveError({ error, name: "my-courses-page" });
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
        title={<Title order={3}>Course Creation</Title>}
      >
        <ScrollArea offsetScrollbars pr="xs" scrollbarSize={8}>
          <CourseCreationForm onSuccess={close} />
        </ScrollArea>
      </Drawer>

      <Group position="apart">
        <Title>My Courses</Title>

        <ConditionalRenderer
          permissionGetter={{ fn: useGetCoursePermissions, key: "canCreate" }}
        >
          <Button color="teal" leftIcon={<HiViewGridAdd />} onClick={open}>
            Create new course
          </Button>
        </ConditionalRenderer>
      </Group>

      <Space h="md" />

      <PlaceholderWrapper
        isLoading={isLoading}
        py={150}
        loadingMessage="Loading my courses..."
        defaultMessage="No courses found."
        showDefaultMessage={!courses || courses.length === 0}
      >
        <SimpleGrid cols={3} spacing="xs">
          {courses?.map((course) => (
            <CourseCard key={course.id} {...course} />
          ))}
        </SimpleGrid>
      </PlaceholderWrapper>
    </>
  );
}

export default MyCoursesPage;
