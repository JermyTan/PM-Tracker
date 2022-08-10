import { skipToken } from "@reduxjs/toolkit/query/react";
import { Text, Stack, ScrollArea } from "@mantine/core";
import { useMemo } from "react";
import PlaceholderWrapper from "./placeholder-wrapper";
import { Role, CourseMemberData, ALL_ROLES } from "../types/courses";
import { useGetCourseMembershipsQuery } from "../redux/services/members-api";
import CourseRoleGroupList from "./course-role-group-list";
import { sort } from "../utils/transform-utils";
import { EMAIL, NAME, USER } from "../constants";
import { useGetSingleCourseQuery } from "../redux/services/courses-api";
import UserProfileDisplay from "./user-profile-display";

type Props = {
  courseId: number | string | undefined;
  hasAdminPermission: boolean;
};

const orderedRoles = sort(ALL_ROLES);

function CourseMembershipsList({ courseId, hasAdminPermission }: Props) {
  const { data: coursePersonnel, isLoading } = useGetCourseMembershipsQuery(
    courseId ?? skipToken,
  );

  const { course } = useGetSingleCourseQuery(courseId ?? skipToken, {
    selectFromResult: ({ data: course }) => ({ course }),
  });

  const courseOwner = course?.owner;
  const courseOwnerId = courseOwner?.id;

  const sortedPersonnel = useMemo(() => {
    const sortedPersonnel = new Map<Role, CourseMemberData[]>();

    // group same role personnel together
    orderedRoles.forEach((role) => {
      sortedPersonnel.set(role, []);
    });

    coursePersonnel?.forEach((person) => {
      if (person.user.id === courseOwnerId) {
        return;
      }
      sortedPersonnel.get(person.role)?.push(person);
    });

    // within each role group, sort personnel by name and email
    orderedRoles.forEach((role) => {
      sortedPersonnel.set(
        role,
        sort(sortedPersonnel.get(role) ?? [], {
          props: [`${USER}.${NAME}`, `${USER}.${EMAIL}`],
        }),
      );
    });

    return sortedPersonnel;
  }, [coursePersonnel, courseOwnerId]);

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
        <ScrollArea>
          <Stack spacing="md">
            {courseOwner && (
              <>
                <Text weight={700}>Owner</Text>
                <UserProfileDisplay {...courseOwner} />
              </>
            )}
            {orderedRoles.map((role) => {
              const personnel = sortedPersonnel.get(role);
              return (
                <CourseRoleGroupList
                  role={role}
                  course={course}
                  personnel={personnel ?? []}
                  hasAdminPermission={hasAdminPermission}
                />
              );
            })}
          </Stack>
        </ScrollArea>
      </PlaceholderWrapper>
    </Stack>
  );
}

export default CourseMembershipsList;
