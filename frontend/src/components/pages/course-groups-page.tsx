import { skipToken } from "@reduxjs/toolkit/query/react";
import { Text, Stack, Space, SimpleGrid } from "@mantine/core";
import { useGetSingleCourseQuery } from "../../redux/services/courses-api";
import { useGetCourseGroupsQuery } from "../../redux/services/groups-api";
import PlaceholderWrapper from "../placeholder-wrapper";
import GroupCard from "../group-card";
import CourseMembershipsList from "../course-members-list";
import { useGetCourseId } from "../../custom-hooks/use-get-course-id";

function CourseGroupPage() {
  const courseId = useGetCourseId();

  const { data: groups, isLoading } = useGetCourseGroupsQuery(
    courseId ?? skipToken,
  );

  const { course } = useGetSingleCourseQuery(courseId ?? skipToken, {
    selectFromResult: ({ data: course }) => ({ course }),
  });

  return (
    <SimpleGrid cols={2}>
      <div>
        <Text weight={700} size="lg">
          My Groups
        </Text>
        <Space h="md" />
        <PlaceholderWrapper
          py={150}
          isLoading={isLoading}
          loadingMessage="Loading groups..."
          defaultMessage="No groups found."
          showDefaultMessage={!groups || groups?.length === 0}
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
