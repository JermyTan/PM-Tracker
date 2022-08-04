import { createContext, ReactNode, useEffect, useMemo, useState } from "react";
import { useLocation, useNavigationType } from "react-router-dom";

// Reference: https://github.com/remix-run/react-router/discussions/8782
type BrowserHistoryStackContextType = {
  historyStack: string[];
};

export const BrowserHistoryStackContext =
  createContext<BrowserHistoryStackContextType>({
    historyStack: [],
  });

type Props = {
  children: ReactNode;
};

function BrowserHistoryStackProvider({ children }: Props) {
  const [historyStack, setHistoryStack] = useState<string[]>([]);
  const { pathname } = useLocation();
  const type = useNavigationType();

  useEffect(() => {
    switch (type) {
      case "POP":
        setHistoryStack((historyStack) =>
          historyStack.slice(0, historyStack.length - 1),
        );
        break;
      case "PUSH":
        setHistoryStack((historyStack) => [...historyStack, pathname]);
        break;
      case "REPLACE":
        setHistoryStack((historyStack) => [
          ...historyStack.slice(0, historyStack.length - 1),
          pathname,
        ]);
        break;
    }
  }, [pathname, type]);

  const contextValue = useMemo(
    () => ({
      historyStack,
    }),
    [historyStack],
  );

  return (
    <BrowserHistoryStackContext.Provider value={contextValue}>
      {children}
    </BrowserHistoryStackContext.Provider>
  );
}

export default BrowserHistoryStackProvider;
