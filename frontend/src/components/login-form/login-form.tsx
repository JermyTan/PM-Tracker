import {
  Button,
  Checkbox,
  FormControl,
  FormLabel,
  HStack,
  Input,
  Stack,
} from "@chakra-ui/react";

function LoginForm() {
  return (
    <Stack>
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
    </Stack>
  );
}

export default LoginForm;
