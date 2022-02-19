import { Box, useBreakpointValue, useColorModeValue } from "@chakra-ui/react";
import LoginForm from "./login-form";

function LoginCard() {
  return (
    <Box
      py={{ base: "0", sm: "8" }}
      px={{ base: "4", sm: "10" }}
      bg={useBreakpointValue({
        base: "transparent",
        sm: useColorModeValue("white", "gray.800"),
      })}
      boxShadow={{ base: "none", sm: useColorModeValue("md", "md-dark") }}
      borderRadius={{ base: "none", sm: "xl" }}
    >
      <LoginForm />
    </Box>
  );
}

export default LoginCard;
