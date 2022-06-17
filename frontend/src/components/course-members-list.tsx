import { skipToken } from "@reduxjs/toolkit/query/react";
import { Text, Stack } from "@mantine/core";
import { useGetCourseGroupsQuery } from "../redux/services/groups-api";
import PlaceholderWrapper from "./placeholder-wrapper";

type Props = {
  courseId: number | string | undefined;
};

function CourseMembersList({ courseId }: Props) {
  const {
    data: members,
    isLoading,
    isFetching,
    refetch,
    error,
  } = useGetCourseGroupsQuery(courseId ?? skipToken);

  return (
    <>
      <Stack>
        <Text weight={700} size="lg">
          Course Members
        </Text>
        <PlaceholderWrapper
          py={10}
          isLoading={isLoading}
          loadingMessage="Loading members..."
          defaultMessage="No members found."
          showDefaultMessage={!isLoading && (!members || members?.length === 0)}
        >
          <Stack spacing="xs"></Stack>
        </PlaceholderWrapper>
      </Stack>
    </>
  );
}

export default CourseMembersList;
