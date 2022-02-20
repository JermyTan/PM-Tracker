import { Button, HStack, Stack } from "@chakra-ui/react";
import { FormProvider, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { EMAIL, PASSWORD, REMEMBER_ME } from "../constants";
import { PasswordLoginPostData } from "../types/auth";
import FormField from "./form-field";
import PasswordField from "./password-field";
import useMyToast from "../custom-hooks/use-my-toast";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { selectRememberMe } from "../redux/slices/remember-me-slice";
import CheckboxField from "./checkbox-field";
import loggedIn from "../redux/thunks/logged-in";
import { usePasswordLoginMutation } from "../redux/services/auth-api";

const SCHEMA = yup.object().shape({
  [EMAIL]: yup
    .string()
    .trim()
    .email("Input must be a valid email")
    .required("Please enter an email"),
  [PASSWORD]: yup.string().trim().required("Please enter password"),
  [REMEMBER_ME]: yup.boolean().required("An error has occurred"),
});

type LoginFormProps = PasswordLoginPostData & {
  [REMEMBER_ME]: boolean;
};

const DEFAULT_VALUES: LoginFormProps = {
  email: "",
  password: "",
  rememberMe: true,
};

function LoginForm() {
  const rememberMe = useAppSelector(selectRememberMe);
  const dispatch = useAppDispatch();
  const [passwordLogin] = usePasswordLoginMutation();
  const toast = useMyToast();
  const methods = useForm<LoginFormProps>({
    resolver: yupResolver(SCHEMA),
    defaultValues: { ...DEFAULT_VALUES, rememberMe },
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async (formData: LoginFormProps) => {
    if (isSubmitting) {
      return;
    }

    console.log(formData);
    const { email, password, rememberMe } = formData;

    try {
      const currentUser = await passwordLogin({ email, password }).unwrap();

      dispatch(loggedIn(currentUser, rememberMe));

      toast.success({ title: "Signed in successfully." });
    } catch (error: any) {
      console.log(error);
      toast.error({ title: error?.data?.detail });
    }
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing="5">
          <FormField
            name={EMAIL}
            type="email"
            labelContent="Email"
            isRequired
            showRequiredIndicator={false}
          />

          <PasswordField
            name={PASSWORD}
            labelContent="Password"
            isRequired
            showRequiredIndicator={false}
            autoComplete="current-password"
          />

          <HStack justify="space-between">
            <CheckboxField name={REMEMBER_ME}>Remember me</CheckboxField>
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
