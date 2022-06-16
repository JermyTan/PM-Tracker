import { useEffect } from "react";
import { Box, Container, createStyles, Group } from "@mantine/core";
import Head from "next/head";
import ColorModeToggler from "../color-mode-toggler";
import LoginSection from "../login-section";
import { APP_NAME } from "../../constants";
import resetAppState from "../../redux/thunks/reset-app-state";
import { colorModeValue } from "../../utils/theme-utils";
import { useAppDispatch } from "../../redux/hooks";

const useStyles = createStyles((theme) => ({
  main: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    backgroundColor: colorModeValue(theme.colorScheme, {
      lightModeValue: theme.colors.gray[0],
      darkModeValue: theme.colors.dark[8],
    }),
  },
  container: {
    width: "100%",
  },
}));

function LoginPage() {
  const dispatch = useAppDispatch();
  const { classes } = useStyles();

  useEffect(() => {
    dispatch(resetAppState());
  }, [dispatch]);

  return (
    <>
      <Head>
        <title>Login | {APP_NAME}</title>
      </Head>

      <Box<"main"> component="main" className={classes.main} pt="xs" pb="md">
        <Group position="right" px="md">
          <ColorModeToggler variant="hover" />
        </Group>

        <Container className={classes.container} size={450} p={32}>
          <LoginSection />
        </Container>
      </Box>
    </>
  );
}

export default LoginPage;
