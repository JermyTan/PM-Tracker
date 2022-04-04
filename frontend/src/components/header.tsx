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
import { useDeepEqualAppSelector } from "../redux/hooks";
import { selectCurrentUserDisplayInfo } from "../redux/slices/current-user-slice";

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
  const { name, profileImage } =
    useDeepEqualAppSelector(selectCurrentUserDisplayInfo) ?? {};
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
        <Avatar
          size={32}
          radius="xl"
          alt={name}
          src={profileImage || undefined}
        />
        <ColorModeToggler />
      </Group>
    </Box>
  );
}

export default Header;
