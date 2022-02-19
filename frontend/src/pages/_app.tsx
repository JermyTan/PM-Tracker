import { ChakraProvider, CSSReset } from "@chakra-ui/react";
import Head from "next/head";
import { AppProps } from "next/app";
import { APP_NAME } from "../constants";
import theme from "../theme";

function App({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider theme={theme}>
      <CSSReset />
      <Head>
        <title>{APP_NAME}</title>
        <meta
          name="description"
          content="A project milestone management and reflective learning platform."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Component {...pageProps} />
    </ChakraProvider>
  );
}

export default App;
