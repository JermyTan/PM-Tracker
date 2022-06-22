import { skipToken } from "@reduxjs/toolkit/query/react";
import { Text, Stack } from "@mantine/core";
import PlaceholderWrapper from "./placeholder-wrapper";
import { Role, CoursePersonnelData } from "../types/courses";
import { useGetCourseMembershipsQuery } from "../redux/services/members-api";
import CourseMemberCategoryList from "./course-member-category-list";

type Props = {
  courseId: number | string | undefined;
};

const orderedRoles = [Role.CoOwner, Role.Instructor, Role.Student];

function CoursePersonnelList({ courseId }: Props) {
  const { data: coursePersonnel, isLoading } = useGetCourseMembershipsQuery(
    courseId ?? skipToken,
  );

  // TODO: might be possible to refactor this into a selector
  const getPersonnelSortedByCategory = (personnel?: CoursePersonnelData[]) => {
    const sortedPersonnel = new Map<Role, CoursePersonnelData[]>();

    orderedRoles.forEach((role) => {
      sortedPersonnel.set(role, []);
    });

    personnel?.forEach((person) => {
      sortedPersonnel.get(person.role)?.push(person);
    });

    return sortedPersonnel;
  };

  const sortedPersonnel = getPersonnelSortedByCategory(coursePersonnel);

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
        showDefaultMessage={
          !isLoading && (!coursePersonnel || coursePersonnel?.length === 0)
        }
      >
        <Stack spacing="md">
          {orderedRoles.map((role) => {
            const personnel = sortedPersonnel.get(role);
            return (
              <CourseMemberCategoryList
                role={role}
                personnel={personnel ?? []}
              />
            );
          })}
        </Stack>
      </PlaceholderWrapper>
    </Stack>
  );
}

export default CoursePersonnelList;
