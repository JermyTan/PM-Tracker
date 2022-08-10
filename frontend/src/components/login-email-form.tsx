import { useContext } from "react";
import { Button, Stack } from "@mantine/core";
import { z } from "zod";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginContext } from "../contexts/login-provider";
import TextField from "./text-field";
import { handleSubmitForm } from "../utils/form-utils";
import { useResolveError } from "../utils/error-utils";
import { EMAIL } from "../constants";
import { useLazyCheckAccountQuery } from "../redux/services/auth-api";
import { emptySelector } from "../redux/utils";

const schema = z.object({
  [EMAIL]: z.string().trim().min(1, "Please enter an email").email(),
});

type LoginEmailFormProps = z.infer<typeof schema>;

const DEFAULT_VALUES: LoginEmailFormProps = {
  email: "",
};

function LoginEmailForm() {
  const { inputEmail, setAccountDetails, setInputEmail } =
    useContext(LoginContext);
  const [checkAccount] = useLazyCheckAccountQuery({
    selectFromResult: emptySelector,
  });
  const { resolveError } = useResolveError({ name: "login-email-form" });

  const methods = useForm<LoginEmailFormProps>({
    resolver: zodResolver(schema),
    defaultValues: DEFAULT_VALUES,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async (formData: LoginEmailFormProps) => {
    if (isSubmitting) {
      return;
    }

    const accountDetails = await checkAccount(formData).unwrap();

    setAccountDetails(accountDetails);
    setInputEmail(accountDetails.email);
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmitForm(handleSubmit(onSubmit), resolveError)}>
        <Stack spacing="lg">
          <TextField
            name={EMAIL}
            label="Email"
            type="email"
            autoComplete="email"
            autoFocus={Boolean(inputEmail)}
          />

          <Button loading={isSubmitting} type="submit">
            Next
          </Button>
        </Stack>
      </form>
    </FormProvider>
  );
}

export default LoginEmailForm;
