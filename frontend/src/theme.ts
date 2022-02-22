import { extendTheme, ThemeConfig } from "@chakra-ui/react";
// eslint-disable-next-line import/no-extraneous-dependencies
import { mode, GlobalStyleProps } from "@chakra-ui/theme-tools";

const config: ThemeConfig = {
  initialColorMode: "light",
  useSystemColorMode: false,
};

const theme = extendTheme({
  shadows: {
    "xs-dark": "0px 1px 3px rgba(11, 12, 17, 0.9)",
    "sm-dark": "0px 2px 4px rgba(11, 12, 17, 0.9)",
    "md-dark": "0px 4px 8px rgba(11, 12, 17, 0.9)",
    "lg-dark": "0px 8px 16px rgba(11, 12, 17, 0.9)",
    "xl-dark": "0px 16px 24px rgba(11, 12, 17, 0.9)",
  },
  semanticTokens: {
    colors: {
      muted: {
        default: "gray.600",
        _dark: "gray.200",
      },
    },
  },
  styles: {
    global: (props: GlobalStyleProps) => ({
      body: {
        bg: mode("gray.50", "gray.900")(props),
      },
    }),
  },
  // components: {
  //   Input: {
  //     variants: {
  //       outline: (props: StyleFunctionProps) => ({
  //         field: {
  //           bg: mode("white", "gray.700")(props),
  //         },
  //       }),
  //     },
  //   },
  // },
  config,
});

export default theme;
