import { IconType } from "react-icons";
import {
  createStyles,
  CSSObject,
  Group,
  Text,
  Tooltip,
  UnstyledButton,
  UnstyledButtonProps,
} from "@mantine/core";
import { HiCollection } from "react-icons/hi";
import { colorModeValue } from "../utils/theme-utils";

export type SidebarItemProps<C> = Omit<
  UnstyledButtonProps<C> & {
    icon?: IconType;
    label: string;
    showIconOnly?: boolean;
    isActive?: boolean;
  },
  "children"
>;

const useStyles = createStyles(
  (
    theme,
    { showIconOnly, isActive }: { showIconOnly?: boolean; isActive?: boolean },
  ) => {
    const activeProps: CSSObject = {
      backgroundColor: colorModeValue(theme.colorScheme, {
        lightModeValue: theme.colors.gray[1],
        darkModeValue: theme.colors.dark[5],
      }),
      color: colorModeValue(theme.colorScheme, {
        lightModeValue: theme.black,
        darkModeValue: theme.colors.gray[2],
      }),
    };

    const inactiveProps: CSSObject = {
      color: colorModeValue(theme.colorScheme, {
        lightModeValue: theme.colors.gray[7],
        darkModeValue: theme.colors.gray[5],
      }),
    };

    return {
      button: {
        width: "100%",
        display: "flex",
        justifyContent: showIconOnly ? "center" : "flex-start",
        fontWeight: 600,
        "&:hover": activeProps,
        ...(isActive ? activeProps : inactiveProps),
      },
      content: {
        whiteSpace: "nowrap",
      },
    };
  },
);

function SidebarItem<C = "button">({
  icon = HiCollection,
  showIconOnly,
  label,
  isActive,
  ...props
}: SidebarItemProps<C>) {
  const { classes } = useStyles({ showIconOnly, isActive });
  const Icon = icon;

  return (
    <Tooltip
      label={label}
      disabled={!showIconOnly}
      position="right"
      transition="scale-x"
      transitionDuration={300}
    >
      <UnstyledButton
        className={classes.button}
        px={showIconOnly ? "md" : "xl"}
        py="sm"
        {...props}
      >
        <Group className={classes.content} spacing="xs" noWrap>
          <Icon size={showIconOnly ? "24px" : "20px"} aria-label={label} />

          {!showIconOnly && label && <Text<"span">>{label}</Text>}
        </Group>
      </UnstyledButton>
    </Tooltip>
  );
}

export default SidebarItem;
