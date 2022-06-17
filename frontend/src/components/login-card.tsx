import { Paper } from "@mantine/core";
import { useContext } from "react";
import { LoginContext } from "../contexts/login-provider";
import LoginEmailForm from "./login-email-form";
import LoginAccountForm from "./login-account-form";

function LoginCard() {
  const { accountDetails } = useContext(LoginContext);

  return (
    <Paper withBorder shadow="md" p="xl" radius="md">
      {accountDetails ? <LoginAccountForm /> : <LoginEmailForm />}
    </Paper>
  );
}

export default LoginCard;
