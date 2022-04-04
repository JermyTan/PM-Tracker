import { createStyles } from "@mantine/core";
import { ReactNode, useEffect, useState } from "react";
import PlaceholderWrapper from "./placeholder-wrapper";

type Props = {
  duration: number;
  children?: ReactNode;
};

const useStyles = createStyles({
  wrapper: {
    minHeight: "100vh",
  },
});

function SplashScreen({ duration, children }: Props) {
  const [showSplashScreen, setShowSplashScreen] = useState(true);
  const { classes } = useStyles();

  useEffect(() => {
    setTimeout(() => setShowSplashScreen(false), duration);
  }, [setShowSplashScreen, duration]);

  return (
    <PlaceholderWrapper
      className={classes.wrapper}
      isLoading={showSplashScreen}
      loadingMessage="Loading..."
      loaderProps={{ variant: "bars" }}
    >
      {children}
    </PlaceholderWrapper>
  );
}

export default SplashScreen;
