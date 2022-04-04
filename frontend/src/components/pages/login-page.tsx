import { useEffect } from "react";
import { Box, Container, createStyles } from "@mantine/core";
import Head from "next/head";
import { useDispatch } from "react-redux";
import ColorModeToggler from "../color-mode-toggler";
import LoginSection from "../login-section";
import { APP_NAME } from "../../constants";
import resetAppState from "../../redux/thunks/reset-app-state";
import FlexSpacer from "../flex-spacer";
import { colorModeValue } from "../../utils/theme-utils";

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
  header: {
    display: "flex",
  },
  container: {
    width: "100%",
  },
}));

function LoginPage() {
  const dispatch = useDispatch();
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
        <Box className={classes.header} px="md">
          <FlexSpacer />
          <ColorModeToggler variant="hover" />
        </Box>

        <Container className={classes.container} size={450} p={32}>
          <LoginSection />
        </Container>
      </Box>

      {/* <Flex as="main" flexDirection="column" py="4">
        <Container maxW="full">
          <Flex>
            <Spacer />
            <ColorModeToggler variant="hover" />
          </Flex>
        </Container>

        <Container
          maxW="lg"
          py={{ base: "4", md: "8" }}
          px={{ base: "0", sm: "8" }}
        >
          <LoginSection />
        </Container>
      </Flex> */}
    </>
  );
}

export default LoginPage;
