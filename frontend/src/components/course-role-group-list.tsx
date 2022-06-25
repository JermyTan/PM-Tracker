import { Stack, Text } from "@mantine/core";
import { capitalize } from "lodash";
import pluralize from "pluralize";
import { useAppSelector } from "../redux/hooks";
import { Role, CourseMemberData } from "../types/courses";
import CourseMemberDisplay from "./course-member-display";

type Props = {
  role: Role;
  personnel: CourseMemberData[];
  hasAdminPermission: boolean;
};

function CourseRoleGroupList({ personnel, role, hasAdminPermission }: Props) {
  const userId = useAppSelector(({ currentUser }) => currentUser?.user?.id);

  return (
    <>
      <Text size="md" weight={500}>
        {/** TODO: check if there is a better way to do this */}
        {capitalize(pluralize(role.toLowerCase()))}
      </Text>
      <Stack spacing="xs">
        {personnel.map((member) => (
          <CourseMemberDisplay
            member={member}
            makeAdminOptionsAvailable={
              hasAdminPermission && member.user.id !== userId
            }
          />
        ))}
      </Stack>
    </>
  );
}

export default CourseRoleGroupList;
