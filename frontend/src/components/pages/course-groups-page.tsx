import { useParams } from "react-router-dom";
import { skipToken } from "@reduxjs/toolkit/query/react";
import { Text, Stack, Space, SimpleGrid, Button, Group } from "@mantine/core";
import { MdAdd } from "react-icons/md";
import { useGetSingleCourseQuery } from "../../redux/services/courses-api";
import { useGetCourseGroupsQuery } from "../../redux/services/groups-api";
import PlaceholderWrapper from "../placeholder-wrapper";
import GroupCard from "../group-card";
import CourseMembershipsList from "../course-members-list";

function CourseGroupPage() {
  const { courseId } = useParams();

  const { data: groups, isLoading } = useGetCourseGroupsQuery(
    courseId ?? skipToken,
  );

  const { course } = useGetSingleCourseQuery(courseId ?? skipToken, {
    selectFromResult: ({ data: course }) => ({ course }),
  });

  return (
    <SimpleGrid cols={2}>
      <div>
        <Group position="apart">
          <Text weight={700} size="lg">
            My Groups
          </Text>
          <Button
            hidden={!course?.allowStudentsToCreateGroups}
            leftIcon={<MdAdd />}
          >
            Create group
          </Button>
        </Group>
        <Space h="md" />
        <PlaceholderWrapper
          py={150}
          isLoading={isLoading}
          loadingMessage="Loading courses..."
          defaultMessage="No courses found."
          showDefaultMessage={!isLoading && (!groups || groups?.length === 0)}
        >
          <Stack spacing="xs">
            {groups?.map((group) => (
              <GroupCard groupId={group.id} key={group.id} course={course} />
            ))}
          </Stack>
        </PlaceholderWrapper>
      </div>

      <CourseMembershipsList courseId={courseId} />
    </SimpleGrid>
  );
}

export default CourseGroupPage;
