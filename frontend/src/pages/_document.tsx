import { ColorModeScript } from "@chakra-ui/react";
import { Html, Head, Main, NextScript } from "next/document";
import theme from "../theme";

export default function Document() {
  return (
    <Html>
      <Head>
        <ColorModeScript initialColorMode={theme.config.initialColorMode} />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
