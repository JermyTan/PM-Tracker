import { MouseEvent } from "react";
import {
  Avatar,
  Text,
  Group,
  GroupProps,
  AvatarProps,
  TextProps,
  Anchor,
  AnchorProps,
  Stack,
  StackProps,
} from "@mantine/core";
import { UserData } from "../types/users";

type Props = GroupProps & {
  user: UserData;
  avatarProps?: AvatarProps;
  nameEmailContainerProps?: StackProps;
  nameProps?: TextProps;
  emailProps?: AnchorProps;
};

function UserProfileDisplay({
  user: { name, email, profileImage },
  avatarProps,
  nameEmailContainerProps,
  nameProps,
  emailProps,
  ...props
}: Props) {
  return (
    <Group spacing="sm" {...props}>
      <Avatar
        alt=""
        src={profileImage || undefined}
        size={40}
        radius={40}
        {...avatarProps}
      />
      <Stack spacing={0} {...nameEmailContainerProps}>
        <Text size="sm" weight={500} {...nameProps}>
          {name}
        </Text>
        <Anchor
          size="xs"
          color="dimmed"
          href={`mailto:${email}`}
          onClick={(event: MouseEvent<HTMLAnchorElement>) => {
            event.stopPropagation();
          }}
          {...emailProps}
        >
          {email}
        </Anchor>
      </Stack>
    </Group>
  );
}

export default UserProfileDisplay;
