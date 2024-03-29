import { skipToken } from "@reduxjs/toolkit/query/react";
import { Text, Stack } from "@mantine/core";
import { useGetCourseGroupsQuery } from "../redux/services/groups-api";
import PlaceholderWrapper from "./placeholder-wrapper";

type Props = {
  courseId: number | string | undefined;
};

function CourseMembersList({ courseId }: Props) {
  const { data: members, isLoading } = useGetCourseGroupsQuery(
    courseId === undefined ? skipToken : { courseId },
  );

  return (
    <Stack>
      <Text weight={700} size="lg">
        Course Members
      </Text>
      <PlaceholderWrapper
        py={10}
        isLoading={isLoading}
        loadingMessage="Loading members..."
        defaultMessage="No members found."
        showDefaultMessage={!members || members?.length === 0}
      >
        <Stack spacing="xs" />
      </PlaceholderWrapper>
    </Stack>
  );
}

export default CourseMembersList;
