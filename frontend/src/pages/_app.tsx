import { ChakraProvider } from "@chakra-ui/react";
import Head from "next/head";
import { AppProps } from "next/app";
import { Provider as ReduxProvider } from "react-redux";
import "../config";
import { APP_NAME } from "../constants";
import theme from "../theme";
import store from "../redux/store";
import RememberMeStorageManager from "../managers/remember-me-storage-manager";
import CurrentUserStorageManager from "../managers/current-user-storage-manager";

function App({ Component, pageProps }: AppProps) {
  return (
    <ReduxProvider store={store}>
      <ChakraProvider theme={theme}>
        <Head>
          <title>{APP_NAME}</title>
          <meta
            name="description"
            content="A project milestone management and reflective learning platform."
          />
          <link rel="icon" href="/favicon.ico" />
        </Head>

        {/* Order matters here since useEffect will run sequentially */}
        <RememberMeStorageManager />
        <CurrentUserStorageManager />

        <Component {...pageProps} />
      </ChakraProvider>
    </ReduxProvider>
  );
}

export default App;
