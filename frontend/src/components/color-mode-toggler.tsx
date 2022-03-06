import { FaSun, FaMoon } from "react-icons/fa";
import {
  IconButton,
  IconButtonProps,
  useColorMode,
  Icon,
} from "@chakra-ui/react";

type Props = Omit<IconButtonProps, "onClick" | "aria-label">;

function ColorModeToggler(props: Props) {
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <IconButton
      aria-label={
        colorMode === "light" ? "Switch to dark mode" : "Switch to light mode"
      }
      onClick={toggleColorMode}
      {...props}
    >
      {colorMode === "light" ? <Icon as={FaMoon} /> : <Icon as={FaSun} />}
    </IconButton>
  );
}

export default ColorModeToggler;
