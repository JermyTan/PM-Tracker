import { skipToken } from "@reduxjs/toolkit/query/react";
import { Text, Stack } from "@mantine/core";
import PlaceholderWrapper from "./placeholder-wrapper";
import { Role, CoursePersonnelData, roles } from "../types/courses";
import { useGetCourseMembershipsQuery } from "../redux/services/members-api";
import CourseRoleGroupList from "./course-member-category-list";
import { useMemo } from "react";
import { sort } from "../utils/transform-utils";
import { EMAIL, NAME, USER } from "../constants";

type Props = {
  courseId: number | string | undefined;
};

const orderedRoles = sort(roles);

function CoursePersonnelList({ courseId }: Props) {
  const { data: coursePersonnel, isLoading } = useGetCourseMembershipsQuery(
    courseId ?? skipToken,
  );

  const sortedPersonnel = useMemo(() => {
    const sortedPersonnel = new Map<Role, CoursePersonnelData[]>();

    // group same role personnel together
    orderedRoles.forEach((role) => {
      sortedPersonnel.set(role, []);
    });

    coursePersonnel?.forEach((person) => {
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
  }, [coursePersonnel]);

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
              <CourseRoleGroupList role={role} personnel={personnel ?? []} />
            );
          })}
        </Stack>
      </PlaceholderWrapper>
    </Stack>
  );
}

export default CoursePersonnelList;
