import { Button, Checkbox, HStack, Stack } from "@chakra-ui/react";
import { FormProvider, useForm } from "react-hook-form";
import FormField from "../form-field";
import PasswordField from "../password-field";

function LoginForm() {
  const methods = useForm();
  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = () => {
    console.log("test");
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing="5">
          <FormField
            name="email"
            type="email"
            labelContent="Email"
            isRequired
            showRequiredIndicator={false}
          />

          <PasswordField
            name="password"
            labelContent="Password"
            isRequired
            showRequiredIndicator={false}
            autoComplete="current-password"
          />

          <HStack justify="space-between">
            <Checkbox defaultIsChecked>Remember me</Checkbox>
            <Button variant="link" colorScheme="blue" size="sm">
              Forgot password?
            </Button>
          </HStack>

          <Button type="submit" colorScheme="blue">
            Submit
          </Button>
        </Stack>
      </form>
    </FormProvider>
  );
}

export default LoginForm;
