import {
  ActionIcon,
  ActionIconProps,
  useMantineColorScheme,
} from "@mantine/core";
import { IconBaseProps } from "react-icons";
import { FaSun, FaMoon } from "react-icons/fa";
import { colorModeValue } from "../utils/theme-utils";

type Props = Omit<ActionIconProps<"button">, "onClick" | "aria-label"> & {
  iconProps?: IconBaseProps;
};

function ColorModeToggler({ iconProps, ...props }: Props) {
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  return (
    <ActionIcon
      aria-label={colorModeValue(colorScheme, {
        lightModeValue: "Switch to dark mode",
        darkModeValue: "Switch to light mode",
      })}
      onClick={() => toggleColorScheme()}
      variant="hover"
      size="lg"
      {...props}
    >
      {colorModeValue(colorScheme, {
        lightModeValue: <FaMoon size={20} {...iconProps} />,
        darkModeValue: <FaSun size={20} {...iconProps} />,
      })}
    </ActionIcon>
  );
}

export default ColorModeToggler;
