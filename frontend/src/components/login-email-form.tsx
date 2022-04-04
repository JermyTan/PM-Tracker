import { useContext } from "react";
import { Button, Stack } from "@mantine/core";
import { z } from "zod";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginContext } from "../contexts/login-provider";
import TextField from "./text-field";
import { CheckAccountPostData } from "../types/auth";
import { trim } from "../utils/transform-utils";
import { handleSubmitForm } from "../utils/form-utils";
import { resolveError } from "../utils/error-utils";
import { EMAIL } from "../constants";
import { useLazyCheckAccountQuery } from "../redux/services/auth-api";

type LoginEmailFormProps = CheckAccountPostData;

const schema = z.object({
  [EMAIL]: z.preprocess(
    trim,
    z.string().min(1, "Please enter an email").email(),
  ),
});

function LoginEmailForm() {
  const { inputEmail, setAccountDetails, setInputEmail } =
    useContext(LoginContext);
  const [checkAccount] = useLazyCheckAccountQuery();

  const methods = useForm<LoginEmailFormProps>({
    resolver: zodResolver(schema),
    defaultValues: { email: inputEmail },
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async (formData: LoginEmailFormProps) => {
    if (isSubmitting) {
      return;
    }

    const accountDetails = await checkAccount(schema.parse(formData)).unwrap();
    setAccountDetails(accountDetails);
    setInputEmail(accountDetails.email);
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmitForm(handleSubmit(onSubmit), resolveError)}>
        <Stack spacing="xl">
          <TextField
            name={EMAIL}
            label="Email"
            type="email"
            autoComplete="email"
            autoFocus={Boolean(inputEmail)}
          />

          <Button disabled={isSubmitting} loading={isSubmitting} type="submit">
            Next
          </Button>
        </Stack>
      </form>
    </FormProvider>
  );
}

export default LoginEmailForm;
