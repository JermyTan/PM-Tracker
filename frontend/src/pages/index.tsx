import { Container, Flex, Spacer } from "@chakra-ui/react";
import type { NextPage } from "next";
import Head from "next/head";
import ColorModeToggler from "../components/color-mode-toggler";
import LoginSection from "../components/login-section";
import { APP_NAME } from "../constants";

const HomePage: NextPage = () => {
  return (
    <>
      <Head>
        <title>Login | {APP_NAME}</title>
      </Head>

      <Flex flexDirection="column" py="4">
        <Container maxW="container.xl">
          <Flex>
            <Spacer />
            <ColorModeToggler p="0" variant="ghost" />
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
};

export default HomePage;
