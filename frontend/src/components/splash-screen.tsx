import { useBoolean } from "@chakra-ui/react";
import { ReactNode, useEffect } from "react";
import PlaceholderWrapper from "./placeholder-wrapper";

type Props = {
  duration: number;
  children?: ReactNode;
};

function SplashScreen({ duration, children }: Props) {
  const [showSplashScreen, { off }] = useBoolean(true);

  useEffect(() => {
    setTimeout(off, duration);
  }, [off, duration]);

  return (
    <PlaceholderWrapper
      minH="100vh"
      isLoading={showSplashScreen}
      loadingMessage="Loading..."
    >
      {children}
    </PlaceholderWrapper>
  );
}

export default SplashScreen;
