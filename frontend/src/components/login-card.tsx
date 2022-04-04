import { Paper, useMantineTheme } from "@mantine/core";
import { useContext } from "react";
import { LoginContext } from "../contexts/login-provider";
import { colorModeValue } from "../utils/theme-utils";
import LoginEmailForm from "./login-email-form";
import LoginAccountForm from "./login-account-form";

function LoginCard() {
  const { colorScheme } = useMantineTheme();
  const { accountDetails } = useContext(LoginContext);

  return (
    <Paper
      withBorder
      shadow={colorModeValue(colorScheme, {
        lightModeValue: "md",
        darkModeValue: "md-dark",
      })}
      p="xl"
      radius="md"
    >
      {accountDetails ? <LoginAccountForm /> : <LoginEmailForm />}
    </Paper>
  );
}

export default LoginCard;
