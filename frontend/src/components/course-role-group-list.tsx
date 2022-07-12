import { Stack, Text } from "@mantine/core";
import { capitalize } from "lodash";
import pluralize from "pluralize";
import { useAppSelector } from "../redux/hooks";
import {
  Role,
  CourseMemberData,
  CourseData,
  editableRoleMap,
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
    editableRoleMap.get(course?.role) || new Set<Role>();

  return (
    <>
      <Text size="md" weight={500}>
        {/** TODO: check if there is a better way to do this */}
        {capitalize(pluralize(role.toLowerCase()))}
      </Text>
      <Stack spacing="xs">
        {personnel.map((member) => {
          const canEditMemberRole = editableMemberRoles.has(member.role);
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
