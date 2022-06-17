import { useParams } from "react-router-dom";
import { skipToken } from "@reduxjs/toolkit/query/react";
import { Text, Stack, Space, SimpleGrid } from "@mantine/core";
import { useGetSingleCourseQuery } from "../../redux/services/courses-api";
import { useGetCourseGroupsQuery } from "../../redux/services/groups-api";
import PlaceholderWrapper from "../placeholder-wrapper";
import GroupCard from "../group-card";

function CourseGroupPage() {
  const { courseId } = useParams();

  const {
    data: groups,
    isLoading,
    isFetching,
    refetch,
    error,
  } = useGetCourseGroupsQuery(courseId ?? skipToken);

  const { data: course } = useGetSingleCourseQuery(courseId ?? skipToken);

  return (
    <>
      <Space h="md" />
      <SimpleGrid cols={2}>
        <div>
          <Text weight={700} size="lg">
            My Groups
          </Text>
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
                <GroupCard {...group} key={group.id} />
              ))}
            </Stack>
          </PlaceholderWrapper>
        </div>
      </SimpleGrid>
    </>
  );
}

export default CourseGroupPage;
