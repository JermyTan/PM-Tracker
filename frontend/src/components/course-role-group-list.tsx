import { Stack, Text } from "@mantine/core";
import { Role, CourseMemberData } from "../types/courses";
import CourseMemberDisplay from "./course-member-display";

type Props = {
  role: Role;
  personnel: CourseMemberData[];
  makeAdminOptionsAvailable: boolean;
};

function CourseRoleGroupList({
  personnel,
  role,
  makeAdminOptionsAvailable,
}: Props) {
  return (
    <>
      <Text size="md" weight={500}>
        {/** TODO: change the font */}
        {role}
      </Text>
      <Stack spacing="xs">
        {personnel.map((member) => (
          <CourseMemberDisplay
            member={member}
            makeAdminOptionsAvailable={makeAdminOptionsAvailable}
          />
        ))}
      </Stack>
    </>
  );
}

export default CourseRoleGroupList;
