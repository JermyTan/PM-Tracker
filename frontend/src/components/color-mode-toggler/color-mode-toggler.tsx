import { MoonIcon, SunIcon } from "@chakra-ui/icons";
import { IconButton, IconButtonProps, useColorMode } from "@chakra-ui/react";

type Props = Omit<IconButtonProps, "onClick" | "aria-label">;

function ColorModeToggler(props: Props) {
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <IconButton
      aria-label={
        colorMode == "light" ? "Switch to dark mode" : "Switch to light mode"
      }
      onClick={toggleColorMode}
      {...props}
    >
      {colorMode == "light" ? <MoonIcon /> : <SunIcon />}
    </IconButton>
  );
}

export default ColorModeToggler;
