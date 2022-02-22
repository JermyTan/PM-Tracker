import { Container, Flex, Spacer } from "@chakra-ui/react";
import { NextPage } from "next";
import Head from "next/head";
import ColorModeToggler from "../components/color-mode-toggler";
import LoginSection from "../components/login-section";
import { APP_NAME } from "../constants";

const HomePage: NextPage = () => (
    <>
      <Head>
        <title>Login | {APP_NAME}</title>
      </Head>

      <Flex flexDirection="column" py="4">
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

export default HomePage;
