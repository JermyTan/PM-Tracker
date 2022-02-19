import { MoonIcon, SunIcon } from "@chakra-ui/icons";
import { Button, useColorMode, type ButtonProps } from "@chakra-ui/react";

function ColorModeToggler({ onClick, ...props }: ButtonProps) {
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <Button
      onClick={(e) => {
        toggleColorMode();
        onClick?.(e);
      }}
      {...props}
    >
      {colorMode == "light" ? <SunIcon /> : <MoonIcon />}
    </Button>
  );
}

export default ColorModeToggler;
