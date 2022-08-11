import { ComponentPropsWithoutRef, ElementType } from "react";
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

export type SidebarItemProps<T extends ElementType> = Omit<
  UnstyledButtonProps & ComponentPropsWithoutRef<T>,
  "children"
> & {
  component?: ElementType;
  icon?: IconType;
  label: string;
  showIconOnly?: boolean;
  isActive?: boolean;
};

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

function SidebarItem<T extends ElementType = "button">({
  icon = HiCollection,
  showIconOnly,
  label,
  isActive,
  ...props
}: SidebarItemProps<T>) {
  const { classes } = useStyles({ showIconOnly, isActive });
  const Icon = icon;

  return (
    <Tooltip
      label={label}
      disabled={!showIconOnly}
      position="right"
      withinPortal
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
          <Icon size={showIconOnly ? 24 : 20} aria-label={label} />

          {!showIconOnly && label && <Text>{label}</Text>}
        </Group>
      </UnstyledButton>
    </Tooltip>
  );
}

export default SidebarItem;
