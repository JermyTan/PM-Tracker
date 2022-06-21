import {
  Box,
  BoxProps,
  ActionIcon,
  Group,
  Text,
  Avatar,
  createStyles,
} from "@mantine/core";
import { HiMenu } from "react-icons/hi";
import ColorModeToggler from "./color-mode-toggler";
import { useShallowEqualAppSelector } from "../redux/hooks";

type Props = Omit<BoxProps<"header">, "children"> & {
  isSiderbarExpanded: boolean;
  onSidebarToggle: () => void;
};

const useStyles = createStyles({
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
});

function Header({
  isSiderbarExpanded,
  onSidebarToggle,
  className,
  ...props
}: Props) {
  const { name, profileImage } = useShallowEqualAppSelector(
    ({ currentUser }) => ({
      name: currentUser?.user?.name,
      profileImage: currentUser?.user?.profileImage,
    }),
  );
  const { classes, cx } = useStyles();

  return (
    <Box<"header">
      component="header"
      className={cx(classes.header, className)}
      px="md"
      py="xs"
      {...props}
    >
      <ActionIcon
        aria-label={isSiderbarExpanded ? "Collapse sidebar" : "Expand sidebar"}
        variant="hover"
        onClick={onSidebarToggle}
        size="lg"
      >
        <HiMenu size="20px" />
      </ActionIcon>

      <Group>
        <Text<"span"> component="span">{name}</Text>
        <Avatar size={36} radius={36} alt="" src={profileImage || undefined} />
        <ColorModeToggler />
      </Group>
    </Box>
  );
}

export default Header;
