import { Space, Stack, Text } from "@mantine/core";
import { Role } from "../types/courses";

import { CoursePersonnelData } from "../types/courses";
import UserProfileDisplay from "./user-profile-display";

type Props = {
  role: Role;
  personnel: CoursePersonnelData[];
};

const CourseMemberCategoryList = ({ personnel, role }: Props) => (
  <div>
    <Text size="md" weight={500}>
      {role}
    </Text>
    <Space h="sm" />
    <Stack spacing="xs">
      {personnel.map((person) => (
        <UserProfileDisplay {...person.user} />
      ))}
    </Stack>
  </div>
);

export default CourseMemberCategoryList;
