import { UserData } from "../types/users";
import { Avatar, Text, Group } from "@mantine/core";

type Props = UserData;

function UserProfileDisplay({ name, email, profileImage }: Props) {
  return (
    <>
      <Group spacing="sm">
        <Avatar size={40} src={profileImage} radius={40} />
        <div>
          <Text size="sm" weight={500} lineClamp={1}>
            {name}
          </Text>
          {/** TODO: mouse over to view/copy full email */}
          <Text color="dimmed" size="xs" lineClamp={1}>
            {email}
          </Text>
        </div>
      </Group>
    </>
  );
}

export default UserProfileDisplay;
