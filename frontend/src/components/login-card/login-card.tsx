import {
  Box,
  Button,
  Checkbox,
  Divider,
  FormControl,
  FormLabel,
  HStack,
  Input,
  Stack,
  useBreakpointValue,
  useColorModeValue,
  Text,
} from "@chakra-ui/react";

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
      <Stack spacing="6">
        <Stack spacing="5">
          <FormControl>
            <FormLabel htmlFor="email">Email</FormLabel>
            <Input id="email" type="email" />
          </FormControl>
        </Stack>
        <HStack justify="space-between">
          <Checkbox defaultIsChecked>Remember me</Checkbox>
          <Button variant="link" colorScheme="blue" size="sm">
            Forgot password?
          </Button>
        </HStack>
        <Stack spacing="6">
          <Button variant="primary">Sign in</Button>
          <HStack>
            <Divider />
            <Text fontSize="sm" whiteSpace="nowrap" color="muted">
              or continue with
            </Text>
            <Divider />
          </HStack>
        </Stack>
      </Stack>
    </Box>
  );
}

export default LoginCard;
