import { useCallback } from "react";
import dynamic from "next/dynamic";
import {
  MantineProvider,
  ColorSchemeProvider,
  ColorScheme,
  // Global,
  // MantineTheme,
} from "@mantine/core";
import { useLocalStorage } from "@mantine/hooks";
import { NotificationsProvider } from "@mantine/notifications";
import { ModalsProvider } from "@mantine/modals";
import Head from "next/head";
import { AppProps } from "next/app";
import { Provider as ReduxProvider } from "react-redux";
import "../config";
import { APP_NAME } from "../constants";
import store from "../redux/store";
import RememberMeStorageManager from "../managers/remember-me-storage-manager";
import CurrentUserStorageManager from "../managers/current-user-storage-manager";
import ApiCacheManager from "../managers/api-cache-manager";
import SplashScreen from "../components/splash-screen";

const SafeHydrate = dynamic(() => import("../components/safe-hydrate"), {
  ssr: false,
});
// import { colorModeValue } from "../utils/theme-utils";

// const textColor = (theme: MantineTheme) => ({
//   color: colorModeValue(theme.colorScheme, {
//     lightModeValue: theme.black,
//     darkModeValue: theme.colors.gray[3],
//   }),
// });

function App({ Component, pageProps }: AppProps) {
  const [colorScheme, setColorScheme] = useLocalStorage<ColorScheme>({
    key: "color-mode",
    defaultValue: "light",
  });

  const toggleColorScheme = useCallback(
    (colorScheme?: ColorScheme) =>
      setColorScheme(
        (value) => colorScheme ?? (value === "light" ? "dark" : "light"),
      ),
    [setColorScheme],
  );

  return (
    <>
      <Head>
        <title>{APP_NAME}</title>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
        <meta
          name="description"
          content="A project milestone management and reflective learning platform."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <ReduxProvider store={store}>
        <ColorSchemeProvider
          colorScheme={colorScheme}
          toggleColorScheme={toggleColorScheme}
        >
          <MantineProvider
            withNormalizeCSS
            withGlobalStyles
            theme={{
              colorScheme,
              shadows: {
                "xs-dark": "0px 1px 3px rgba(11, 12, 17, 0.9)",
                "sm-dark": "0px 2px 4px rgba(11, 12, 17, 0.9)",
                "md-dark": "0px 4px 8px rgba(11, 12, 17, 0.9)",
                "lg-dark": "0px 8px 16px rgba(11, 12, 17, 0.9)",
                "xl-dark": "0px 16px 24px rgba(11, 12, 17, 0.9)",
              },
              colors: {
                dark: [
                  "#DBDBDB",
                  "#A6A7AB",
                  "#909296",
                  "#5c5f66",
                  "#373A40",
                  "#2C2E33",
                  "#25262b",
                  "#1A1B1E",
                  "#141517",
                  "#101113",
                ],
              },
              headings: {
                sizes: {
                  h1: { fontSize: 32 },
                },
              },
            }}
            styles={{
              Tooltip: {
                root: {
                  display: "block",
                },
              },
              Checkbox: {
                input: {
                  cursor: "pointer",
                },
                label: {
                  cursor: "pointer",
                },
              },
              Button: {
                rightIcon: {
                  marginLeft: 6,
                },
                leftIcon: {
                  marginRight: 6,
                },
              },
            }}
          >
            {/* Global body style override
            <Global
              styles={(theme) => ({
                body: {
                  color: colorModeValue(theme.colorScheme, {
                    lightModeValue: theme.black,
                    darkModeValue: theme.colors.gray[3],
                  }),
                },
              })}
            /> */}

            <NotificationsProvider position="bottom-center" limit={3}>
              <ModalsProvider>
                {/* Order matters here since useEffect will run sequentially */}
                <RememberMeStorageManager />
                <CurrentUserStorageManager />
                <ApiCacheManager />

                <SafeHydrate>
                  <SplashScreen duration={2000}>
                    <Component {...pageProps} />
                  </SplashScreen>
                </SafeHydrate>
              </ModalsProvider>
            </NotificationsProvider>
          </MantineProvider>
        </ColorSchemeProvider>
      </ReduxProvider>
    </>
  );
}

export default App;
