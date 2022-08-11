import { createStyles, Group, Stack, Title, Text, Anchor } from "@mantine/core";
import { Link } from "react-router-dom";
import { APP_NAME } from "../constants";
import LoginProvider from "../contexts/login-provider";
import { colorModeValue } from "../utils/theme-utils";
import LoginCard from "./login-card";

const useStyles = createStyles((theme) => ({
  title: {
    fontSize: "60px",
  },
  subtitle: {
    fontSize: "30px",
  },
  meta: {
    color: colorModeValue(theme.colorScheme, {
      lightModeValue: theme.colors.gray[7],
      darkModeValue: theme.colors.dark[1],
    }),
  },
}));

function LoginSection() {
  const { classes } = useStyles();

  return (
    <Stack spacing="xl">
      <Stack spacing="sm" align="center">
        <Title className={classes.title}>{APP_NAME}</Title>

        <Stack spacing="xs">
          <Title order={2} className={classes.subtitle}>
            Log in to your account
          </Title>

          <Group spacing={4} position="center">
            <Text span className={classes.meta}>
              Don&apos;t have an account?
            </Text>

            <Anchor<typeof Link> component={Link} weight={600} to="/">
              Sign up
            </Anchor>
          </Group>
        </Stack>
      </Stack>

      <LoginProvider>
        <LoginCard />
      </LoginProvider>
    </Stack>
  );
}

export default LoginSection;
