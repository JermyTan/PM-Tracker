import { Text, Button, Heading, HStack, VStack, Stack } from "@chakra-ui/react";
import { APP_NAME } from "../../constants";
import LoginCard from "../login-card";

function LoginSection() {
  return (
    <Stack spacing="8">
      <VStack spacing="6">
        <Heading size="3xl">{APP_NAME}</Heading>

        <VStack spacing={{ base: "2", md: "3" }}>
          <Heading size="lg">Log in to your account</Heading>
          <HStack spacing="1" justify="center">
            <Text color="muted">Don&apos;t have an account?</Text>
            <Button variant="link" colorScheme="blue">
              Sign up
            </Button>
          </HStack>
        </VStack>
      </VStack>

      <LoginCard />
    </Stack>
  );
}

export default LoginSection;
