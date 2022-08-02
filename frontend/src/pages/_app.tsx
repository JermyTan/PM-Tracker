import { useCallback } from "react";
import dynamic from "next/dynamic";
import {
  MantineProvider,
  ColorSchemeProvider,
  ColorScheme,
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
import { colorModeValue } from "../utils/theme-utils";

const SafeHydrate = dynamic(() => import("../components/safe-hydrate"), {
  ssr: false,
});

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
              shadows: colorModeValue(colorScheme, {
                darkModeValue: {
                  xs: "0px 1px 3px rgba(11, 12, 17, 0.9)",
                  sm: "0px 2px 4px rgba(11, 12, 17, 0.9)",
                  md: "0px 4px 8px rgba(11, 12, 17, 0.9)",
                  lg: "0px 8px 16px rgba(11, 12, 17, 0.9)",
                  xl: "0px 16px 24px rgba(11, 12, 17, 0.9)",
                },
              }),
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
                  display: "flex",
                },
              },
              Button: {
                root: {
                  minWidth: "150px",
                },
                rightIcon: {
                  marginLeft: "6px",
                },
                leftIcon: {
                  marginRight: "6px",
                },
              },
              Drawer: {
                drawer: {
                  display: "flex",
                  flexDirection: "column",
                },
              },
              Divider: (theme) => ({
                horizontal: {
                  borderTopColor: colorModeValue(colorScheme, {
                    darkModeValue: theme.colors.dark[4],
                  }),
                },
              }),
            }}
          >
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
