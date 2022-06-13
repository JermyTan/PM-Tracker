import { useState, ReactNode, useEffect } from "react";

type Props = {
  children: ReactNode;
};

function SafeHydrate({ children }: Props) {
  // TODO: fix this next time
  // previously, it was typeof window === "undefined"
  const [isSSR, setSSR] = useState(true);

  useEffect(() => {
    setSSR(false);
  }, []);

  return <div suppressHydrationWarning>{isSSR ? null : children}</div>;
}

export default SafeHydrate;
