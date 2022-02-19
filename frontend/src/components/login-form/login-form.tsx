import { Button, Checkbox, HStack, Stack } from "@chakra-ui/react";
import { FormProvider, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { EMAIL, PASSWORD } from "../../constants";
import { PasswordLoginPostData } from "../../types/auth";
import FormField from "../form-field";
import PasswordField from "../password-field";
import useMyToast from "../../custom-hooks/use-my-toast";

const SCHEMA = yup.object().shape({
  [EMAIL]: yup
    .string()
    .trim()
    .email("Input must be a valid email")
    .required("Please enter an email"),
  [PASSWORD]: yup.string().trim().required("Please enter password"),
});

type LoginFormProps = PasswordLoginPostData;

const DEFAULT_VALUES: LoginFormProps = {
  email: "",
  password: "",
};

function LoginForm() {
  const toast = useMyToast();
  const methods = useForm<LoginFormProps>({
    resolver: yupResolver(SCHEMA),
    defaultValues: DEFAULT_VALUES,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = (formData: LoginFormProps) => {
    if (isSubmitting) {
      return;
    }

    return new Promise((resolve) => {
      setTimeout(() => {
        toast.success({ title: "Signed in successfully." });
        resolve(null);
      }, 1000);
    });
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

          <Button isLoading={isSubmitting} type="submit" colorScheme="blue">
            Sign in
          </Button>
        </Stack>
      </form>
    </FormProvider>
  );
}

export default LoginForm;
