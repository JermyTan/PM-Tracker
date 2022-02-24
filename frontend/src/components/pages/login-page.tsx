import { Container, Flex, Spacer } from "@chakra-ui/react";
import Head from "next/head";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import ColorModeToggler from "../color-mode-toggler";
import LoginSection from "../login-section";
import { APP_NAME } from "../../constants";
import resetAppState from "../../redux/thunks/reset-app-state";

function LoginPage() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(resetAppState());
  }, [dispatch]);

  return (
    <>
      <Head>
        <title>Login | {APP_NAME}</title>
      </Head>

      <Flex as="main" flexDirection="column" py="4">
        <Container maxW="full">
          <Flex>
            <Spacer />
            <ColorModeToggler variant="ghost" />
          </Flex>
        </Container>

        <Container
          maxW="lg"
          py={{ base: "4", md: "8" }}
          px={{ base: "0", sm: "8" }}
        >
          <LoginSection />
        </Container>
      </Flex>
    </>
  );
}

export default LoginPage;
