import { Stack, Text } from "@mantine/core";
import pluralize from "pluralize";
import { useAppSelector } from "../redux/hooks";
import {
  Role,
  CourseMemberData,
  CourseData,
  roleToPropertiesMap,
} from "../types/courses";
import CourseMemberDisplay from "./course-member-display";

type Props = {
  role: Role;
  course?: CourseData;
  personnel: CourseMemberData[];
  hasAdminPermission: boolean;
};

function CourseRoleGroupList({
  role,
  course,
  personnel,
  hasAdminPermission,
}: Props) {
  const userId = useAppSelector(({ currentUser }) => currentUser?.user?.id);

  const editableMemberRoles =
    roleToPropertiesMap[course?.role ?? Role.Student].modifiableRoles;

  return (
    <>
      <Text size="md" weight={500}>
        {pluralize(roleToPropertiesMap[role].label)}
      </Text>
      <Stack spacing="xs">
        {personnel.map((member) => {
          const canEditMemberRole = editableMemberRoles.includes(member.role);
          const isSelf = member.user.id === userId;
          const makeAdminOptionsAvailable =
            !isSelf && canEditMemberRole && hasAdminPermission;

          return (
            <CourseMemberDisplay
              member={member}
              makeAdminOptionsAvailable={makeAdminOptionsAvailable}
            />
          );
        })}
      </Stack>
    </>
  );
}

export default CourseRoleGroupList;
